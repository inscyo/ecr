import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../helpers/api';
import { delay, getRandomNumber } from '../helpers/all';
import { GlobalLoadingContext } from "../context/loading";
import { GlobalErrorContext } from '../context/global-alert';
import { ShadcnFastFrog4Loader } from '../layout/loaders';

const useAxiosAPI = () => {
  const { setgloballoadingprogress } = useContext(GlobalLoadingContext);
  const { setglobalalert } = useContext(GlobalErrorContext);

  const fetchData = async (spname, fnparameter, body) => {
    setglobalalert({error: true, body: <ShadcnFastFrog4Loader />});
    try {
      const source = axios.CancelToken.source();
      setgloballoadingprogress(1);
      
      await delay(getRandomNumber(500, 1500));
      const { data: esignedData } = await api.post('/Free/SignedHash', body, { cancelToken: source.token });
      setgloballoadingprogress(50);
      await delay(getRandomNumber(1000, 2000));

      if (!esignedData) {
        setgloballoadingprogress(100);
        throw new Error('Error retrieving E-signed data.');
      }

      const { errorCode: esignedErrorCode, errorDescription: esigned } = esignedData;
      if (esignedErrorCode > 0) {
        setgloballoadingprogress(100);
        throw new Error(`Error in E-signed data: ${esigned}`);
      }

      setgloballoadingprogress(70);
      await delay(getRandomNumber(300, 800))

      const response = await api.post(
        '/Free/QueryResult',
        body,
        {
          headers: {
            FnName: spname,
            FnParam: fnparameter,
            'E-Signed': esigned,
          },
          cancelToken: source.token,
        }
      );

      await delay(getRandomNumber(500, 1500));
      setgloballoadingprogress(100);
      setglobalalert({error: false});
      const responseData_i = response.data["objectData"] ?? response.data["ObjectData"];

      if (responseData_i.includes('"response":')) {
        const { ErrorCode, ErrorDesc, ObjectData } = JSON.parse(JSON.parse(responseData_i)[0].response)[0];

        if (Number(ErrorCode) > 0) {
          throw new Error(`Error while processing data: ${ErrorDesc}`);
        }
        const responseData_j = JSON.parse(ObjectData);
        return typeof responseData_j !== "object" ? JSON.parse(responseData_j) : responseData_j;
      }
      return typeof responseData_i !== "object" ? JSON.parse(responseData_i) : responseData_i;
    } catch (error) {
      setgloballoadingprogress(100);
      if (axios.isCancel(error)) {
        setglobalalert({error: true, body: "Request was canceled."});
        throw new Error('Request was canceled');
      } else if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            setglobalalert({error: true, body: 'Bad Request: ' + data});
            console.error('Bad Request:', data);
            break;
          case 401:
            setglobalalert({error: true, body: 'Unauthorized: ' + data});
            console.error('Unauthorized:', data);
            break;
          case 403:
            setglobalalert({error: true, body: 'Forbidden: ' + data});
            console.error('Forbidden:', data);
            break;
          case 404:
            setglobalalert({error: true, body: 'Not Found: ' + data});
            console.error('Not Found:', data);
            break;
          default:
            setglobalalert({error: true, body: `Server Error (${status}): `+ data});
            console.error(`Server Error (${status}):`, data);
        }
        setglobalalert({error: true, body: `Server Error (${status}): ${data}`});
        throw new Error(`Server Error (${status}): ${data}`);
      } else if (error.request) {
        setglobalalert({error: true, body: 'No response received:' + error.request});
        console.error('No response received:', error.request);
        throw new Error('No response received');
      } else {
        setglobalalert({error: true, body: 'Error setting up the request:' + error.message});
        console.error('Error setting up the request:', error.message);
        throw new Error(`Error setting up the request: ${error.message}`);
      }
    }
  };

  return fetchData;
};

export default useAxiosAPI;

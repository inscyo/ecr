import { useContext } from 'react';
import axios from 'axios';
import api from '../helpers/api';
import { GlobalErrorContext } from '../context/global-alert';
import { ShadcnCleverEarwig74Loader } from '../layout/loaders';
import { delay, getRandomNumber } from '../helpers/all';

const useAxiosAPI = () => {
  const { setglobalalert } = useContext(GlobalErrorContext);

  const fetchData = async (spname, fnparameter, body) => {
    setglobalalert({error: true, body: <ShadcnCleverEarwig74Loader stroke="#fff" />});
    try {
      const source = axios.CancelToken.source();
      await delay(getRandomNumber(300, 1500));
      
      const { data: esignedData } = await api.post('/Free/SignedHash', body, { cancelToken: source.token });
      await delay(getRandomNumber(300, 1500));

      if (!esignedData) {
        throw new Error('Error retrieving E-signed data.');
      }

      const { errorCode: esignedErrorCode, errorDescription: esigned } = esignedData;
      if (esignedErrorCode > 0) throw new Error(`Error in E-signed data: ${esigned}`);

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
      await delay(getRandomNumber(300, 1500));
      setglobalalert({error: false});
      const responseData_i = response.data["objectData"] ?? response.data["ObjectData"];

      if (responseData_i.includes('"response":')) {
        const { ErrorCode, ErrorDesc, ObjectData, UserID } = JSON.parse(JSON.parse(responseData_i)[0].response)[0];

        if (Number(ErrorCode) > 0) {
          throw new Error(`Error while processing data: ${ErrorDesc}`);
        }
        const responseData_j = JSON.parse(ObjectData);
        if(UserID) responseData_j.UserId = UserID;
        return typeof responseData_j !== "object" ? JSON.parse(responseData_j) : responseData_j;
      }
      return typeof responseData_i !== "object" ? JSON.parse(responseData_i) : responseData_i;
    } catch (error) {
      if (axios.isCancel(error)) {
        setglobalalert({error: true, color: "#E54D2E", body: "Request was canceled."});
        throw new Error('Request was canceled');
      } else if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            setglobalalert({error: true, color: "#E54D2E", body: 'Bad Request: ' + data});
            console.error('Bad Request:', data);
            break;
          case 401:
            setglobalalert({error: true, color: "#E54D2E", body: 'Unauthorized: ' + data});
            console.error('Unauthorized:', data);
            break;
          case 403:
            setglobalalert({error: true, color: "#E54D2E", body: 'Forbidden: ' + data});
            console.error('Forbidden:', data);
            break;
          case 404:
            setglobalalert({error: true, color: "#E54D2E", body: 'Not Found: ' + data});
            console.error('Not Found:', data);
            break;
          default:
            setglobalalert({error: true, color: "#E54D2E", body: `Server Error (${status}): `+ data});
            console.error(`Server Error (${status}):`, data);
        }
        setglobalalert({error: true, color: "#E54D2E", body: `Server Error (${status}): ${data}`});
        throw new Error(`Server Error (${status}): ${data}`);
      } else if (error.request) {
        setglobalalert({error: true, color: "#E54D2E", body: 'Server Error : No response received ' + error.request});
        console.error('No response received:', error.request);
        throw new Error('No response received');
      } else {
        setglobalalert({error: true, color: "#E54D2E", body: 'Error setting up the request: ' + error.message});
        console.error('Error setting up the request:', error.message);
        throw new Error(`Error setting up the request: ${error.message}`);
      }
    }
  };

  return fetchData;
};

export default useAxiosAPI;

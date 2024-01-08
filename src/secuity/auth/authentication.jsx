import { useState, useEffect, useContext } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { browserName, browserVersion } from "react-device-detect";
import { cryptoEncrypt, delay, getRandomNumber } from "../../helpers/all";
import { GlobalErrorContext } from "../../context/global-alert";
import Cookies from "js-cookie";
import useAxiosAPI from "../../hooks/axios-api";
import { ShadcnCleverEarwig74Loader } from "../../layout/loaders";

export default function Authentication() {
  const { setglobalalert } = useContext(GlobalErrorContext);

  const [searchParams] = useSearchParams();

  const [authenticated, setAuthenticated] = useState(false);

  const redirectafterauth = searchParams.get("redirect");
  const hasurlsession = searchParams.get("Session");

  const hassession = Cookies.get("session");

  const apiRequest = useAxiosAPI();

  const verify = async () => {
    try {
      const verifySessionResponse = await apiRequest('Exam_VerifySession', "Json", { sessionid: hasurlsession });
      const { SessionId, ExpirationMinutes, Valid }  = verifySessionResponse[0];

      if (!Valid) {
        setAuthenticated(false);
        setglobalalert({error: true, variant: "destructive", body: "Unauthorized access invalid login credentials."});
        return;
      }

      const expires = ExpirationMinutes / (24 * 60);
      const cookiesConfig = { expires }; 

      const examVerifyUserSessionResponse = await apiRequest("Exam_VerifyUserSession", "Json", {
        sessionid: SessionId,
        device: navigator.userAgent,
        browser: `${browserName} - ${browserVersion}`,
        component: window.location.origin + window.location.pathname,
        devicetime: new Date().toString(),
        curtoken: Cookies.get("token") || "",
      });
      
      const { "@token": token, UserId } = examVerifyUserSessionResponse;
      console.log(UserId)
      if(!UserId) return setglobalalert({error: true, variant: "destructive", body: "Unauthorized access invalid login credentials."});
      const examGetUserProfileResponse = await apiRequest("Exam_GetUserProfile", "Json", { UserId: import.meta.env.VITE_USER_ID?.length > 0 ? import.meta.env.VITE_USER_ID : UserId });
      const { 
        LastName, 
        FirstName, 
        MiddleName, 
        Email,
        UserType, 
        RegistrationDate, 
        StudentType, 
        ContactNo, 
        Length 
      } = examGetUserProfileResponse[0];

      if (Length <= 0) {
        setAuthenticated(false);
        setglobalalert({error: true, variant: "destructive", body: "The server encountered an issue while processing the data. Please try again later."});
        return;
      }
      setglobalalert({error: true, body: <span className="block text-center">Authenticated successfully redirecting please wait.</span>});
      Cookies.set("session", SessionId, cookiesConfig);

      Cookies.set("token", token, cookiesConfig);

      Cookies.set(
        "user",
        cryptoEncrypt(
          JSON.stringify({
            LastName,
            FirstName,
            MiddleName,
            Email,
            UserType,
            RegistrationDate,
            StudentType,
            ContactNo,
            UserId: import.meta.env.VITE_USER_ID?.length > 0 ? import.meta.env.VITE_USER_ID : UserId,
          }),
        ),
        cookiesConfig,
      );
      await delay(2000);
      if (redirectafterauth?.length > 5) window.location.href = redirectafterauth;

      setAuthenticated(true);

      setglobalalert({error: false});
    } catch (err) {
        console.log(err)
        setAuthenticated(false);
        setglobalalert({error: true, variant: "destructive", body: "The server encountered an issue while processing the data. Please try again later."});
      }
  };

  const onload = async () => {
    if (hassession) {
     
      setAuthenticated(true);
      setglobalalert({error: false});
      return;
    }
    if (hasurlsession) {
      verify();
      return;
    }

    setglobalalert({error: true, variant: "destructive", body: "Unauthorized access invalid login credentials."});
  }
  
  useEffect(() => {
    onload()
  }, []);

  return authenticated && <Outlet />;
}
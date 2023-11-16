import { useState, useEffect, useContext } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { browserName, browserVersion } from "react-device-detect";
import { useAllowedQueryResultV2 } from "../../hooks/rtk-query";
import { cryptoDecrypt, cryptoEncrypt, delay } from "../../helpers/all";
import { GlobalErrorContext } from "../../context/global-alert";
import Cookies from "js-cookie";
import { GlobalLoadingContext } from "../../context/loading";

export default function Authentication() {
  const { setglobalalert } = useContext(GlobalErrorContext);
  const { setgloballoadingprogress } = useContext(GlobalLoadingContext);
  // This code defines the variables and functions used to check if the user is authenticated.

  const [searchParams] = useSearchParams();

  const [authenticated, setAuthenticated] = useState(false);
  // This hook stores the authenticated state and provides a setter function.
  
  const queryResultV2 = useAllowedQueryResultV2();
  // This hook gets the allowed query results from the database.
  const redirectafterauth = searchParams.get("redirect");
  const hasurlsession = searchParams.get("Session");
  // This variable checks if the URL contains the "Session" parameter.

  const hassession = Cookies.get("session");
  // This variable checks if the browser has a "session" cookie.

  const verify = async () => {
    
    try {
      const { SessionId, ExpirationMinutes, Valid } = JSON.parse(await queryResultV2(["Exam_VerifySession", "Json", { sessionid: hasurlsession }]))[0];
      // Check if the session is valid
      const isSessionValid = JSON.parse(Valid);
      if (!isSessionValid) {
        // If the session is not valid, set the authenticated state to false and show an error message
        setAuthenticated(false);
        setglobalalert({error: true, variant: "destructive", body: "Unauthorized access invalid login credentials."});
        setgloballoadingprogress(100)
        return;
      }
      // Set the session cookie
      const expires = ExpirationMinutes / (24 * 60);
      const cookiesConfig = { expires }; //{ expires, sameSite: "strict", secure: true }

      setgloballoadingprogress(60);
      Cookies.set("session", SessionId, cookiesConfig);

      // Verify the user session
      const config = {
        sessionid: SessionId,
        device: navigator.userAgent,
        browser: `${browserName} - ${browserVersion}`,
        component: window.location.origin + window.location.pathname,
        devicetime: new Date().toString(),
        curtoken: Cookies.get("token") || "",
      };
      const { response: Exam_VerifyUserSessionResults } = JSON.parse(await queryResultV2(["Exam_VerifyUserSession", "Json", config]))[0];
      console.log(Exam_VerifyUserSessionResults)
      // Get the user's profile data
      const { ObjectData, UserID: UserId } = JSON.parse(Exam_VerifyUserSessionResults)[0];
      const { LastName, FirstName, MiddleName, Email, UserType, RegistrationDate, StudentType, ContactNo, Length } = JSON.parse(await queryResultV2(["Exam_GetUserProfile", "Json", { UserId }]))[0];
      // Get the user's token
      const { "@token": token } = JSON.parse(ObjectData);
      
      if (Length <= 0) {
        // If the user's profile data is not found, set the authenticated state to false and show an error message
        setAuthenticated(false);
        setglobalalert({error: true, variant: "destructive", body: "The server encountered an issue while processing the data. Please try again later."});
        setgloballoadingprogress(100)
        return;
      }
      setglobalalert({error: true, body: <span className="block text-center">Authenticated successfully redirecting please wait.</span>});
      setgloballoadingprogress(80);
      // Set the token cookie
      Cookies.set("token", token, cookiesConfig);
      // Set the user cookie
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
            UserId,
          }),
        ),
        cookiesConfig,
      );
      await delay(2000);
      if (redirectafterauth?.length > 5) window.location.href = redirectafterauth;
      // Set the authenticated state to true
      setAuthenticated(true);
      // Hide the error message
      setglobalalert({error: false});
      setgloballoadingprogress(100);
    } catch (err) {
        console.log(err)
        setAuthenticated(false);
        setglobalalert({error: true, variant: "destructive", body: "The server encountered an issue while processing the data. Please try again later."});
        setgloballoadingprogress(100);
      }
  };

  const onload = async () => {
    setglobalalert({error: true, color: "#e8e8e8", body: "Authenticating please wait for a while."});
    setgloballoadingprogress(30)
    // This function checks if the user is authenticated and returns the appropriate response.
    if (hassession) {
      // If the user has a session, set the authenticated state to true and return.
      setAuthenticated(true);
      setglobalalert({error: false});
      setgloballoadingprogress(100)
      return;
    }
    if (hasurlsession) {
      // If the user has a URL session, verify the session and return.
      verify();
      return;
    }
    // If the user does not have a session, throw an error.
    setglobalalert({error: true, variant: "destructive", body: "Unauthorized access invalid login credentials."});
    setgloballoadingprogress(100);
  }
  useEffect(() => {
    onload()
  }, []);



  return authenticated && <Outlet />;
}

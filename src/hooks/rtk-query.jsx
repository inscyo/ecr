import { useContext } from 'react'
import { queryResultApiEndpoints } from '../redux/api-endpoints/query-result.endpoints'
import { dateApiEndpoints } from '../redux/api-endpoints/date.endpoints'
import { queryErrorApiEndpoints } from '../redux/api-endpoints/queryerror.endpoints'
import { signedHashApiEndpoints } from '../redux/api-endpoints/signedhash.endpoints'
import Cookies from 'js-cookie'
import { cryptoDecrypt } from '../helpers/all';
import { GlobalErrorContext } from '../context/global-alert'
import { GlobalLoadingContext } from '../context/loading'

const IS_TOKEN_REQUIRED = JSON.parse(import.meta.env.VITE_TOKEN_REQUIRED);

export const useQueryError = () => {
  const [datefnquery] = dateApiEndpoints.getDate.useLazyQuery()
  const [queryerrorfnquery] = queryErrorApiEndpoints.queryError.useMutation()
  const { setglobalalert } = useContext(GlobalErrorContext);
  const { setgloballoadingprogress } = useContext(GlobalLoadingContext);

  return (ticket, callback) => {
    const ticketNumber = ticket.includes('with ticket#')
      ? ticket.split(' Error Encountered with ticket# -> ')[1]
      : ticket
    datefnquery()
      .unwrap()
      .then(({ month, day, year, time }) =>
        queryerrorfnquery({
          YYYYMMDD: `${year}${month}${day}`,
          TicketNo: ticketNumber
        })
          .unwrap()
          .then(callback)
      )
      .catch((err) => {
        setgloballoadingprogress(100);
        setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
        Cookies.remove("token");
      })
  }
}

export const useSignedHash = () => {
  const [signedhashquery] = signedHashApiEndpoints.signedHash.useMutation()
  const { setglobalalert } = useContext(GlobalErrorContext);
  const { setgloballoadingprogress } = useContext(GlobalLoadingContext);

  const queryError = useQueryError()
  return (obj, callback = () => {}) => {
    signedhashquery(obj)
      .unwrap()
      .then(
        ({ apiCmd, errorCode, errorDescription, objectData, serverSource }) => {
          if (Number(errorCode) > 0) {
            setgloballoadingprogress(100);
            setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
            if (errorCode === '88') {
              if (!errorDescription.includes('No Record(s)')) {
                return;
              }
              callback({ errorCode, errorDescription, objectData })
              return
            }
            if (errorCode === '99')
              return queryError(
                errorDescription.split(
                  ' Error Encountered with ticket# -> '
                )[1],
                ({ errorCode, errorDescription, objectData }) => {
                 
                  Cookies.remove("token");
                }
              )
            return
          }
          callback({ errorCode, errorDescription, objectData })
        }
      )
      .catch((err) => {
        setgloballoadingprogress(100);
        setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
      })
  }
}

export const useAllowedSignedHash = () => {
  const [signedhashquery] = signedHashApiEndpoints.allowedSignedHash.useMutation()
  const queryError = useQueryError()
  const { setglobalalert } = useContext(GlobalErrorContext);
  const { setgloballoadingprogress } = useContext(GlobalLoadingContext);
  
  return (obj, callback = () => {}) => {
    signedhashquery(obj)
      .unwrap()
      .then(
        ({ apiCmd, errorCode, errorDescription, objectData, serverSource }) => {
          if (Number(errorCode) > 0) {
            setgloballoadingprogress(100);
            setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
            if (errorCode === '88') {
              if (!errorDescription.includes('No Record(s)')) {
                return
              }
              callback({ errorCode, errorDescription, objectData })
              return
            }
            if (errorCode === '99')
              return queryError(
                errorDescription.split(
                  ' Error Encountered with ticket# -> '
                )[1],
                ({ errorCode, errorDescription, objectData }) => {
                  
                  Cookies.remove("token");
                }
              )
            return
          }
          callback({ errorCode, errorDescription, objectData })
        }
      )
      .catch((err) => {
        setgloballoadingprogress(100);
        setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
      })
  }
}

export const useAllowedQueryResult = () => {
  const signedHash = useAllowedSignedHash()
  const [fnquery] = queryResultApiEndpoints.allowedQueryResult.useMutation()
  const queryError = useQueryError()
  const { setglobalalert } = useContext(GlobalErrorContext);
  const { setgloballoadingprogress } = useContext(GlobalLoadingContext);
  return ([spname, fnparameter, body], callback = () => {}) => {
    signedHash(body, ({ errorDescription: hashed }) => {
      fnquery({ spname, fnparameter, hashed, body })
        .unwrap()
        .then(({ errorCode, errorDescription, objectData }) => {
          if (Number(errorCode) > 0) {
            setgloballoadingprogress(100);
            setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
            if (errorCode === '88') {
              if (!errorDescription.includes('No Record(s)')) {
                return
              }
              callback({ errorCode, errorDescription, objectData })
              return
            }
            if (errorCode === '99')
              return queryError(
                errorDescription.split(
                  ' Error Encountered with ticket# -> '
                )[1],
                ({ errorCode, errorDescription, objectData }) => {
                }
              )
            return
          }
          const json = JSON.parse(objectData)
          const rt =
            json[0]?.ErrorDesc === 'Process completed succesfully'
              ? JSON.stringify([])
              : objectData
          callback({ errorCode, errorDescription, objectData: rt })
        })
        .catch((err) => {
          setgloballoadingprogress(100);
          setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
        })
    })
  }
}

export const useAllowedQueryResultV2 = () => {
  const signedHash = useAllowedSignedHash()
  const [fnquery] = queryResultApiEndpoints.allowedQueryResult.useMutation()
  const queryError = useQueryError()
  const { setglobalalert } = useContext(GlobalErrorContext);
  const { setgloballoadingprogress } = useContext(GlobalLoadingContext);
  return ([spname, fnparameter, body]) => {
    return new Promise((resolve, reject) => {
      signedHash(body, ({ errorDescription: hashed }) => {
        fnquery({ spname, fnparameter, hashed, body })
          .unwrap()
          .then(({ errorCode, errorDescription, objectData }) => {
            console.log(objectData)
            if (Number(errorCode) > 0) {
              setgloballoadingprogress(100);
              setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
              if (errorCode === '88') {
                if (!errorDescription.includes('No Record(s)')){
                  return reject({ errorCode, errorDescription, objectData })
                }
                return reject({ errorCode, errorDescription, objectData })
              }
              if (errorCode === '99') {
                queryError(
                  errorDescription.split(
                    ' Error Encountered with ticket# -> '
                  )[1],
                  ({ errorCode, errorDescription, objectData }) => {
                    reject({ errorCode, errorDescription, objectData })
                  }
                )
                return
              }
              reject({ errorCode, errorDescription, objectData })
              return
            }
            const json = JSON.parse(objectData)
            const rt =
              json[0]?.ErrorDesc === 'Process completed succesfully'
                ? JSON.stringify([])
                : objectData
            resolve(rt)
          })
          .catch((err) => {
            setgloballoadingprogress(100);
            setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
            reject(err)
          }
            )
      })
    })
  }
}

export const useQueryResultV2 = () => {
  const { setglobalalert } = useContext(GlobalErrorContext);
  const { setgloballoadingprogress } = useContext(GlobalLoadingContext);
  const signedHash = IS_TOKEN_REQUIRED ? useSignedHash() : useAllowedSignedHash();
  const [fnquery] = queryResultApiEndpoints[IS_TOKEN_REQUIRED ? 'queryResult' : 'allowedQueryResult'].useMutation()
  const queryError = useQueryError()
  const allowedQueryResultV2 = useAllowedQueryResultV2()
  return ([spname, fnparameter = "", body = {}]) => {
    return new Promise(async (resolve, reject) => {
      const hassession = Cookies.get('session')
      if (!hassession) {
        setgloballoadingprogress(100);
        setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
        reject()
        return
      }

      // const { Valid: CookieSessionValid } = JSON.parse(
      //   await allowedQueryResultV2([
      //     'Exam_VerifySession',
      //     'Json',
      //     { sessionid: hassession }
      //   ])
      // )[0]
      // if (!JSON.parse(CookieSessionValid)) {
      //   throwError(UNAUTHORIZED_LOGIN_MESSAGE)
      //   reject()
      //   return
      // }
      signedHash(body, ({ errorDescription: hashed }) => {
        fnquery({ spname, fnparameter, hashed, body })
          .unwrap()
          .then(({ errorCode, errorDescription, objectData }) => {
            if (Number(errorCode) > 0) {
              setgloballoadingprogress(100);
              setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
              if (errorCode === '88') {
                if (!errorDescription.includes('No Record(s)')){
                  return reject({ errorCode, errorDescription, objectData })
                }
                return reject({ errorCode, errorDescription, objectData })
              }
              if (errorCode === '99') {
                queryError(
                  errorDescription.split(
                    ' Error Encountered with ticket# -> '
                  )[1],
                  ({ errorCode, errorDescription, objectData }) => {
                    reject({ errorCode, errorDescription, objectData })
                  }
                )
                return
              }
              reject({ errorCode, errorDescription, objectData })
              return
            }
            const json = JSON.parse(objectData)
            const rt =
              json[0]?.ErrorDesc === 'Process completed succesfully'
                ? JSON.stringify([])
                : objectData
            resolve(rt)
          })
          .catch((err) => {
            setgloballoadingprogress(100);
            setglobalalert({error: true, variant: "destructive", body: "Something went wrong please try again."});
            reject(err)
          })
      })
    })
  }
}

export const useSaveError =  () => {
  const hasuser = Cookies.get("user");
  if(!hasuser) return () => {};
  const query = useAllowedQueryResultV2();
  const session = Cookies.get("session");
  const token = Cookies.get("token");
  const user = cryptoDecrypt(hasuser);
  return async (Error) => {
    const obj = {
      UserInfo: user,
      Cookies: document.cookie,
      LocalStorage: JSON.stringify(localStorage),
      Url: JSON.stringify(window.location),
      Error: JSON.stringify(Error)
    }
    const result = await query(["Exam_InsertErrorEncountered", "Json", obj]);
  }
}
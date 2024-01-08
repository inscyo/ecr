import { useContext, useState } from "react";
import { PageTitleContext } from "../../../context/page-title";
import { useEffect } from "react";
import useAxiosAPI from "../../../hooks/axios-api";
import { cryptoDecrypt } from "../../../helpers/all";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function RequestContro0lHistory() {
  const apiRequest = useAxiosAPI();
  const { requestcontrol } = useParams();
  const { settitle } = useContext(PageTitleContext);
  const [requestcontrolhistory, setrequestcontrolhistory] = useState([]);
  const { UserId: StudentID } = JSON.parse(cryptoDecrypt(Cookies.get("user")));

  const requestcontrolhistoryfn = async () => {
    const response = await apiRequest("ACR_RequestControlHistory", "JSON", { StudentID: import.meta.env.VITE_STUDENT_ID?.length > 0 ? import.meta.env.VITE_STUDENT_ID : StudentID, RequestControl: requestcontrol });
    setrequestcontrolhistory(response);
  };

  useEffect(() => {
    settitle("Histoty for ");
    requestcontrolhistoryfn();
  }, []);

  return (
    <>
      <div className="p-2">
        {requestcontrolhistory.length > 0 && (
            requestcontrolhistory.map((history, i) => (
                <p className="text-[#B4B4B4] pl-2 font-normal">
                    <span key={i} className="inline-block w-auto">
                        <span> {history.ParseDate}</span> {history.Message} {history?.From?.includes('Payment') && <span>({history?.From})</span>} 
                    </span>
                </p>
            ))
        )}
        {requestcontrolhistory.length <= 0 && (
            <p className="text-[#B4B4B4] pl-2 font-normal">
                <span className="inline-block w-auto">
                    No transaction history found.
                </span>
            </p>
        )}
      </div>
    </>
  );
}

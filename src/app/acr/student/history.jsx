import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useContext, useState } from "react";
import { PageTitleContext } from "../../../context/page-title";
import { useEffect } from "react";
import truncateString, { allowedExtensions, cryptoEncrypt, delay, formatFileSize, formatNumberWithCommas, truncateFilenameWithExtension, validateFileExtension, isNullOrEmpty, isValidEmail, isValidPhoneNumber, getRandomNumber, isNullOrEmptyOrWhitespace, isJSON } from "../../../helpers/all";
import useAxiosAPI from "../../../hooks/axios-api";
import { cryptoDecrypt } from "../../../helpers/all";
import { ShadcnCleverEarwig74Loader } from "../../../layout/loaders";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function RequestControlHistory() {
  const apiRequest = useAxiosAPI();
  const { requestcontrol } = useParams();
  const { settitle } = useContext(PageTitleContext);
  const [requestcontrolhistory, setrequestcontrolhistory] = useState([]);
  const { UserId: StudentID, FirstName, MiddleName, LastName } = JSON.parse(cryptoDecrypt(Cookies.get("user")));

  const requestcontrolhistoryfn = async () => {
    const response = await apiRequest("ACR_RequestControlHistory", "JSON", { UserID: StudentID, RequestControl: requestcontrol });
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

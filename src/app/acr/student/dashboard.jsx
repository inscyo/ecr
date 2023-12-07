import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useContext, useRef, useState } from "react";
import { PageTitleContext } from "../../../context/page-title";
import { useEffect } from "react";
import { GlobalErrorContext } from "../../../context/global-alert";
import { ShadcnCleverEarwig74Loader } from "../../../layout/loaders";
import { allowedExtensions, cryptoEncrypt, delay, formatFileSize, formatNumberWithCommas, truncateFilenameWithExtension, validateFileExtension, isNullOrEmpty, isValidEmail, isValidPhoneNumber, getRandomNumber, isNullOrEmptyOrWhitespace } from "../../../helpers/all";
import useAxiosAPI from "../../../hooks/axios-api";
import { cryptoDecrypt } from "../../../helpers/all";
import Cookies from "js-cookie";
import { useMemo } from "react";
import { Box } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StudentRequestDashboard() {
  const apiRequest = useAxiosAPI();
  const { settitle } = useContext(PageTitleContext);
  const { setglobalalert } = useContext(GlobalErrorContext);
  const [studentrequestitems, setstudentrequestitems] = useState([]);

  const { UserId: StudentID, FirstName, MiddleName, LastName } = JSON.parse(cryptoDecrypt(Cookies.get("user")));

  const studentrequestitemsfn = async () => {
    const response = await apiRequest("ACR_StudentRequestedItems", "JSON", { StudentID });

    setstudentrequestitems(response);
  };

  useEffect(() => {
    settitle("Student Request");
    studentrequestitemsfn();
  }, []);

  return (
    <>
      <div className="pt-0">
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <Table className="width-full">
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead className="p-4 text-[15px]">RequestID</TableHead>
                  <TableHead className="p-4 text-[15px]">ReferenceNo</TableHead>
                  <TableHead className="p-4 text-[15px]">Program</TableHead>
                  <TableHead className="p-4 text-[15px]">Status</TableHead>
                  <TableHead className="p-4 text-[15px]">Total Amount</TableHead>
                  <TableHead className="p-4 text-[15px]">Requested Date</TableHead>
                  <TableHead className="p-4 text-[15px]">Items(s)</TableHead>
                  <TableHead className="p-4 text-[15px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentrequestitems.length > 0 &&
                  studentrequestitems.map((item, i) => {
                    console.log(item);
                    return (
                      <TableRow key={i} className="bg-muted/60">
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className="text-[#0090FF] font-semibold  underline cursor-pointer text-[14px]">{item?.RequestControl}</span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-[14px] font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className="text-[#0090FF] font-semibold  underline cursor-pointer text-[14px]">{item?.RequestReferenceNo}</span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className="font-semibold text-[14px]">{item?.DisplayName}</span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className="text-[#FFCA16] font-semibold text-[14px]">{item?.RequestStatus}</span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className=" text-center text-[14px]">{formatNumberWithCommas(item?.RequestedItemsTotalAmount)} php</span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className=" text-[14px]">{item?.ParsedDateCreated}</span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className="text-[#0090FF] cursor-pointer text-[14px]">{item?.TotalRequestedItems} items</span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] text-center">Logs</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogDescription>Transaction logs for the specified request control.</DialogDescription>
                              </DialogHeader>
                              <DialogDescription className="submit-request-warning hidden"></DialogDescription>
                              <DialogFooter className="sm:justify-start flex">
                                <DialogClose>
                                  <p className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 submit-requested-documents-btn" type="button" variant="secondary">
                                    Cancel
                                  </p>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
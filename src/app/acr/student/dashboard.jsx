import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useContext, useRef, useState } from "react";
import { PageTitleContext } from "../../../context/page-title";
import { useEffect } from "react";
import { GlobalErrorContext } from "../../../context/global-alert";
import truncateString, { allowedExtensions, cryptoEncrypt, delay, formatFileSize, formatNumberWithCommas, truncateFilenameWithExtension, validateFileExtension, isNullOrEmpty, isValidEmail, isValidPhoneNumber, getRandomNumber, isNullOrEmptyOrWhitespace, isJSON } from "../../../helpers/all";
import useAxiosAPI from "../../../hooks/axios-api";
import { cryptoDecrypt } from "../../../helpers/all";
import Cookies from "js-cookie";
import { ShadcnCleverEarwig74Loader } from "../../../layout/loaders";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
let refdetailsfethcing = false;

export default function StudentRequestDashboard() {
  const apiRequest = useAxiosAPI();
  const { settitle } = useContext(PageTitleContext);
  const { setglobalalert } = useContext(GlobalErrorContext);
  const [studentrequestitems, setstudentrequestitems] = useState([]);
  const [referencenoinfo, setreferencenoinfo] = useState({});
  const [requesteditemslist, setrequesteditemslist] = useState([]);
  const [uploadedfileslist, setuploadedfileslist] = useState([]);

  const { UserId: StudentID, FirstName, MiddleName, LastName } = JSON.parse(cryptoDecrypt(Cookies.get("user")));

  const studentrequestitemsfn = async () => {
    const response = await apiRequest("ACR_StudentRequestedItems", "JSON", { StudentID });
    setstudentrequestitems(response);
  };

  const viewrefnoinfo = async (RequestControl, ReferenceNo) => {
    if (refdetailsfethcing) return;
    setreferencenoinfo({});
    const dialog = document.querySelector(".dashboard-refno-dialog");
    refdetailsfethcing = true;

    const refeinforesponse = await apiRequest("ACR_RequestReferenceNoInfo", "JSON", { RequestControl, StudentID, ReferenceNo });
    setreferencenoinfo(refeinforesponse[0]);

    dialog.click();
    refdetailsfethcing = false;
  };

  const viewrequesteditems = async (RequestControl) => {
    if (refdetailsfethcing) return;
    const dialog = document.querySelector(".requested-items-dialog");
    refdetailsfethcing = true;
    setrequesteditemslist([]);
    setuploadedfileslist([]);

    const requesteditemsresponse = await apiRequest("ACR_StudentRequestedItemsDocuments", "JSON", { RequestControl, StudentID });
    const requesteditemsuploadedfilesresponse = await apiRequest("ACR_StudentRequestedItemsUploadedSupportedDocuments", "JSON", { RequestControl, StudentID });
    setuploadedfileslist(requesteditemsuploadedfilesresponse);
    setrequesteditemslist(requesteditemsresponse);

    dialog.click();
    refdetailsfethcing = false;
  };

  const operequesthistorywindow = (requestcontrol) => {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const windowWith = screenWidth  / 1.5;
      const windowHeight = screenHeight / 1.5;
      const left = screenWidth - windowWith;
      const top = window.innerHeight / 3.5;
      
      const features = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + windowWith + ', height=' + windowHeight + ', top=' + top + ', left=' + left;
      const newWindow = window.open('/acr/student/history/'+requestcontrol, requestcontrol, features);

      if (window.focus && newWindow) {
          newWindow.focus();
      }
      return newWindow;
  }

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
                  <TableHead className="p-4 text-[15px] text-center">Items(s)</TableHead>
                  <TableHead className="p-4 text-[15px]">Program</TableHead>
                  <TableHead className="p-4 text-[15px]">Total Amount</TableHead>
                  <TableHead className="p-4 text-[15px]">Requested Date</TableHead>
                  <TableHead className="p-4 text-[15px]"></TableHead>
                  <TableHead className="p-4 text-[15px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentrequestitems.length > 0 &&
                  studentrequestitems.map((item, i) => {
                    return (
                      <TableRow key={i} className="bg-muted/60">
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                        <Dialog>
                            <DialogTrigger asChild>
                            <span className="font-semibold text-[#a78bfa] cursor-pointer text-[14px]">{item?.RequestControl}</span>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Other Information</DialogTitle>
                                <DialogDescription>Here is the other information for this request.</DialogDescription>
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
                        <TableCell className=" p-4 text-left text-[14px] font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span onClick={() => viewrefnoinfo(item?.RequestControl, item?.RequestReferenceNo)} className="text-[#0090FF] relative font-semibold  cursor-pointer text-[14px]">
                            {truncateString(item?.RequestReferenceNo, 16)}
                            <span className="absolute right-0">
                              <ShadcnCleverEarwig74Loader strokewidth="4" classess={`relative hidden left-[25px] ${item?.RequestControl}`} width="18px" height="18px" stroke="#b4b4b4" />
                            </span>
                          </span>
                          {console.log(item?.RequestReferenceNo)}
                          <Dialog large>
                            <DialogTrigger asChild>
                              <span className={`dashboard-refno-dialog hidden`}></span>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Payment Information</DialogTitle>
                                <DialogDescription>Transaction records for the payment reference number.</DialogDescription>
                                <div className="mb-4 w-full grid items-start pb-4last:mb-0 last:pb-0">
                                  <div className="flex w-full mt-2">
                                    <p className="text-sm font-medium leading-none">Reference:</p>
                                    <p className="text-sm mt-[-3px] ml-[10px] text-muted-foreground">{referencenoinfo?.ReferenceNo}</p>
                                  </div>
                                </div>
                                {/* <div className="mb-4 w-full grid items-start pb-4last:mb-0 last:pb-0">
                                  <div className="flex w-full mt-2">
                                    <p className="text-sm font-medium leading-none">Type:</p>
                                    <p className="text-sm mt-[-3px] ml-[10px] text-muted-foreground">{referencenoinfo?.PaymentType || "-"}</p>
                                  </div>
                                </div>
                                <div className="mb-4 w-full grid items-start pb-4last:mb-0 last:pb-0">
                                  <div className="flex w-full mt-2">
                                    <p className="text-sm font-medium leading-none">Method:</p>
                                    <p className="text-sm mt-[-3px] ml-[10px] capitalize text-muted-foreground">{referencenoinfo?.PaymentMethodDescription || referencenoinfo?.PaymentMethod || "-"}</p>
                                  </div>
                                </div> */}
                                <div className="mb-4 w-full grid items-start pb-4last:mb-0 last:pb-0">
                                  <div className="flex w-full mt-2">
                                    <p className="text-sm font-medium leading-none">Channel:</p>
                                    <p className="text-sm mt-[-3px] ml-[10px] text-muted-foreground">{`${referencenoinfo?.PaymentDesc}` || "-"}</p>
                                  </div>
                                </div>
                                <div className="mb-4 w-full grid items-start pb-4last:mb-0 last:pb-0">
                                  <div className="flex w-full mt-2">
                                    <p className="text-sm font-medium leading-none">Total amount:</p>
                                    <p className="text-sm mt-[-3px] ml-[10px] text-muted-foreground">{`${formatNumberWithCommas(referencenoinfo?.ItemTotalAmount) + " Php" || "-"}`}</p>
                                  </div>
                                </div>
                                {/* <div className="mb-4 w-full grid items-start pb-4last:mb-0 last:pb-0">
                                  <div className="flex w-full mt-2">
                                    <p className="text-sm font-medium leading-none">Net Amount:</p>
                                    <p className="text-sm mt-[-3px] ml-[10px] text-muted-foreground">{`${formatNumberWithCommas(referencenoinfo?.NetAmount) + " Php" || "-"}`}</p>
                                  </div>
                                </div> */}
                                <div className="mb-4 w-full grid items-start pb-4last:mb-0 last:pb-0">
                                  <div className="flex w-full mt-2">
                                    <p className="text-sm font-medium leading-none">Status:</p>
                                    <p className="text-sm mt-[-3px] capitalize ml-[10px] text-muted-foreground">{referencenoinfo?.PaymentStatus || "-"}</p>
                                  </div>
                                </div>
                                <div className="mb-4 w-full ">
                                  <div className="w-full">
                                    <p className="text-sm mt-[5px] text-[#FFCA16]">{referencenoinfo?.response_advise}</p>
                                  </div>
                                </div>
                              </DialogHeader>
                              <DialogDescription className="submit-request-warning hidden"></DialogDescription>
                              <DialogFooter className="sm:justify-start flex">
                                <DialogClose>
                                  <p className="cancel-requested-documents inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 submit-requested-documents-btn" type="button" variant="secondary">
                                    Close
                                  </p>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        
                        <TableCell className=" p-4 text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span onClick={() => viewrequesteditems(item?.RequestControl)} className="text-[#0090FF] relative font-semibold  underline cursor-pointer text-[14px]">
                            {item?.TotalRequestedItems} item{item?.TotalRequestedItems > 1 ? "s" : ""}
                            <span className="absolute right-0">
                              <ShadcnCleverEarwig74Loader strokewidth="4" classess={`relative hidden left-[25px] ${item?.RequestControl}-items`} width="18px" height="18px" stroke="#b4b4b4" />
                            </span>
                          </span>
                          <Dialog large>
                            <DialogTrigger asChild>
                              <span className={`requested-items-dialog hidden`}></span>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Documents</DialogTitle>
                                <DialogDescription>List of documents that you have requested and uploaded.</DialogDescription>
                              </DialogHeader>
                              <Tabs defaultValue="requested-items" className="w-full ">
                                <TabsList className="grid rounded-sm w-full h-auto grid-cols-2">
                                  <TabsTrigger className="rounded-sm" value="requested-items">
                                    Requested Items
                                  </TabsTrigger>
                                  <TabsTrigger className="" value="uploaded-files">
                                    Uploaded Files
                                  </TabsTrigger>
                                </TabsList>
                                <ScrollArea className="h-auto mt-3 scroll-area" style={{ maxHeight: "25em" }}>
                                  <TabsContent value="requested-items" className=" mt-6">
                                    {requesteditemslist?.length > 0 ? (
                                      requesteditemslist?.map((item, i) => {
                                        return (
                                          <div key={i} className="mb-2 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                            <div className="space-y-1">
                                              <p className="text-sm capitalize font-medium leading-none">{item.ItemDesc}</p>
                                              <p className="text-sm text-muted-foreground">{formatNumberWithCommas(item.ItemPrice)} Php</p>
                                            </div>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <DialogDescription className="text-[#FFCA16] text-center">Requested items are currently empty..</DialogDescription>
                                    )}
                                  </TabsContent>
                                  <TabsContent value="uploaded-files" className=" mt-6">
                                    {uploadedfileslist?.length > 0 && (
                                      <>
                                        {uploadedfileslist?.map((item, i) => {
                                          return (
                                            <div key={i} className="mb-2 grid items-start pb-4 last:mb-0 last:pb-0">
                                              <div className="space-y-1">
                                                <a title="click to download this file" href={item.DocumentData} download={item.RequiredDocumentDescription} className="text-sm capitalize font-medium leading-none flex">
                                                  {item.RequiredDocumentDescription}{" "}
                                                  <span className="text-sm ml-2 underline cursor-pointer text-blue-600 text-muted-foreground">
                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                                    </svg>
                                                  </span>
                                                </a>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </>
                                    )}
                                    {uploadedfileslist?.length <= 0 && <DialogDescription className="text-[#FFCA16] text-center">No uploaded files found.</DialogDescription>}
                                  </TabsContent>
                                </ScrollArea>
                              </Tabs>

                              <DialogFooter className="sm:justify-start flex mt-4">
                                <DialogClose>
                                  <p className="cancel-requested-documents inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 submit-requested-documents-btn" type="button" variant="secondary">
                                    Close
                                  </p>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className="font-semibold text-[14px]">{item?.DisplayName}</span>
                        </TableCell>
                       
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className=" text-center text-[14px]">{formatNumberWithCommas(item?.RequestedItemsTotalAmount)} php</span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span className=" text-[14px]">{item?.ParsedDateCreated}</span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <span style={{color: item?.RouteToStep == '0' ? '#FF6847EB' : '#B88C67'}} className={`font-normal text-[14px] flex`}>
                            {item?.RouteDescription}
                            {item?.RequestMessageToStudent && (
                              <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-pointer mt-[3px] ml-[5px] text-[#B5B3AD] opacity-[.7]">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49972C0.877075 3.84204 3.84222 0.876892 7.49991 0.876892C11.1576 0.876892 14.1227 3.84204 14.1227 7.49972C14.1227 11.1574 11.1576 14.1226 7.49991 14.1226C3.84222 14.1226 0.877075 11.1574 0.877075 7.49972ZM7.49991 1.82689C4.36689 1.82689 1.82708 4.36671 1.82708 7.49972C1.82708 10.6327 4.36689 13.1726 7.49991 13.1726C10.6329 13.1726 13.1727 10.6327 13.1727 7.49972C13.1727 4.36671 10.6329 1.82689 7.49991 1.82689ZM8.24993 10.5C8.24993 10.9142 7.91414 11.25 7.49993 11.25C7.08571 11.25 6.74993 10.9142 6.74993 10.5C6.74993 10.0858 7.08571 9.75 7.49993 9.75C7.91414 9.75 8.24993 10.0858 8.24993 10.5ZM6.05003 6.25C6.05003 5.57211 6.63511 4.925 7.50003 4.925C8.36496 4.925 8.95003 5.57211 8.95003 6.25C8.95003 6.74118 8.68002 6.99212 8.21447 7.27494C8.16251 7.30651 8.10258 7.34131 8.03847 7.37854L8.03841 7.37858C7.85521 7.48497 7.63788 7.61119 7.47449 7.73849C7.23214 7.92732 6.95003 8.23198 6.95003 8.7C6.95004 9.00376 7.19628 9.25 7.50004 9.25C7.8024 9.25 8.04778 9.00601 8.05002 8.70417L8.05056 8.7033C8.05924 8.6896 8.08493 8.65735 8.15058 8.6062C8.25207 8.52712 8.36508 8.46163 8.51567 8.37436L8.51571 8.37433C8.59422 8.32883 8.68296 8.27741 8.78559 8.21506C9.32004 7.89038 10.05 7.35382 10.05 6.25C10.05 4.92789 8.93511 3.825 7.50003 3.825C6.06496 3.825 4.95003 4.92789 4.95003 6.25C4.95003 6.55376 5.19628 6.8 5.50003 6.8C5.80379 6.8 6.05003 6.55376 6.05003 6.25Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-[15px]">{item?.RequestMessageToStudent}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className=" p-4 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <Button onClick={() => operequesthistorywindow(item?.RequestControl)} className="text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] text-center">Logs 
                          <span className="ml-[3px]">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 13C12.5523 13 13 12.5523 13 12V3C13 2.44771 12.5523 2 12 2H3C2.44771 2 2 2.44771 2 3V6.5C2 6.77614 2.22386 7 2.5 7C2.77614 7 3 6.77614 3 6.5V3H12V12H8.5C8.22386 12 8 12.2239 8 12.5C8 12.7761 8.22386 13 8.5 13H12ZM9 6.5C9 6.5001 9 6.50021 9 6.50031V6.50035V9.5C9 9.77614 8.77614 10 8.5 10C8.22386 10 8 9.77614 8 9.5V7.70711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L7.29289 7H5.5C5.22386 7 5 6.77614 5 6.5C5 6.22386 5.22386 6 5.5 6H8.5C8.56779 6 8.63244 6.01349 8.69139 6.03794C8.74949 6.06198 8.80398 6.09744 8.85143 6.14433C8.94251 6.23434 8.9992 6.35909 8.99999 6.49708L8.99999 6.49738" fill="currentColor"></path></svg>
                          </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {studentrequestitems.length <= 0 && (
                  <TableRow className="bg-muted/60">
                    <TableCell colSpan={8} className="p-2 text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                      -
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

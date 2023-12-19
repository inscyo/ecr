import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useParams } from "react-router-dom";
import { replaceExceedingLetters } from "../../../helpers/string";

export default function ECRViewRequest() {
  const apiRequest = useAxiosAPI();
  const { settitle } = useContext(PageTitleContext);
  const { setglobalalert } = useContext(GlobalErrorContext);
  const { studentno: StudentID, requestcontrol: RequestControl } = useParams();
  const { UserId: UserID } = JSON.parse(cryptoDecrypt(Cookies.get("user")));
  const addfileref = useRef();
  const [requestinfo, setrequestinfo] = useState([]);

  const getrequestinfo = async () => {
    if (requestinfo?.length > 0) return;
    const requestinforesponse = await apiRequest("ACR_ViewRequest_Registrar", "JSON", { StudentID, RequestControl, UserID });

    const response = requestinforesponse?.[0];
    if (response?.responsecode == "1") {
      setglobalalert({ error: true, body: <p>{response?.responsemessage}</p> });
      return;
    }

    setrequestinfo({
      ...(response ?? {}),
      RequestedItems: JSON.parse(response?.RequestedItems ?? "[]"),
      UploadedSupportingDocuments: JSON.parse(response?.UploadedSupportingDocuments ?? "[]"),
    });
  };

  const addfilefn = async (el) => {
    const btn = el.target;
    const currentref = addfileref.current;
    const file = currentref.files[0];
    const loader = document.querySelector(".addfilefnrefloader");
    const warning = document.querySelector(".file-warning-message");
    warning.style.display = "none";
    warning.style.color = "#FFA057";

    if (!file) {
      warning.style.display = "block";
      warning.innerText = "Please select a file";
      return;
    }

    loader.style.display = "block";
    currentref.style.cursor = "not-allowed";
    btn.style.cursor = "not-allowed";
    currentref.disabled = true;
    btn.disabled = true;
    await delay(1000);

    if (file?.size <= 0) {
      warning.style.display = "block";
      warning.innerText = "Please select a file";
      return;
    }

    if (!validateFileExtension(file?.name)) {
      currentref.style.cursor = "pointer";
      btn.style.cursor = "pointer";
      currentref.disabled = false;
      btn.disabled = false;
      loader.style.display = "none";
      warning.style.display = "block";
      warning.innerText = `file selected is not valid`;
      return;
    }

    if (file?.size > 104857600) {
      currentref.style.cursor = "pointer";
      btn.style.cursor = "pointer";
      currentref.disabled = false;
      btn.disabled = false;
      loader.style.display = "none";
      warning.style.display = "block";
      warning.innerText = `file is to large (${formatFileSize(file?.size)})`;
      return;
    }

    const readFile = (f) => {
      return new Promise((resolve) => {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileData = e.target.result;
            resolve({ name: file?.name, file: fileData });
          };
          reader.readAsDataURL(f);
        } catch (err) {
          warning.innerText = "Unable to add file please try again";
          warning.style.display = "block";
          loader.style.display = "none";
          currentref.style.cursor = "pointer";
          btn.style.cursor = "pointer";
          currentref.disabled = false;
          btn.disabled = false;
        }
      });
    };

    const readedFile = await readFile(file);

    const fileobj = {
      RequestControl: requestinfo?.RequestControl,
      UserID,
      StudentID,
      FileName: readedFile?.name,
      FileData: readedFile?.file,
    };

    const uploadresponse = await apiRequest("ACR_UploadRequestControlFile", "JSON", fileobj, false);
    const { responsecode, responsemessage, UploadedSupportingDocuments } = uploadresponse[0];
    if (responsecode == "1") {
      currentref.style.cursor = "pointer";
      btn.style.cursor = "pointer";
      currentref.disabled = false;
      btn.disabled = false;
      loader.style.display = "none";
      warning.style.display = "block";
      warning.innerText = responsemessage;
      return;
    }

    setrequestinfo((obj) => {
      return {
        ...obj,
        UploadedSupportingDocuments: JSON.parse(UploadedSupportingDocuments ?? "[]"),
      };
    });

    addfileref.current.value = "";
    currentref.style.cursor = "pointer";
    btn.style.cursor = "pointer";
    currentref.disabled = false;
    btn.disabled = false;
    loader.style.display = "none";
    warning.style.display = "block";
    warning.style.color = "#33B074";
    warning.innerText = responsemessage;
  };

  const removeuploadeddocument = async (SupportedID, { target }) => {
    const warning = document.querySelector(".delete-file-warning");
    warning.style.display = "none";
    target.innerText = "Deleting...";
    const deleteresponse = await apiRequest("ACR_DeleteUploadRequestControlFile", "JSON", { StudentID, UserID, RequestControl: requestinfo?.RequestControl, SupportedID }, false);
    const { responsecode, responsemessage, UploadedSupportingDocuments } = deleteresponse[0];
    if (responsecode == "1") {
      warning.style.display = "block";
      warning.innerText = responsemessage;
      return;
    }

    setrequestinfo((obj) => {
      return {
        ...obj,
        UploadedSupportingDocuments: JSON.parse(UploadedSupportingDocuments ?? "[]"),
      };
    });
  };

  useEffect(() => {
    settitle("Request Info");
    getrequestinfo();
  }, []);

  return (
    <>
      {console.log(requestinfo)}
      <Tabs defaultValue="student-request" className="w-full border-none">
        <TabsList className="grid w-full rounded-sm h-auto grid-cols-3">
          <TabsTrigger className="p-3" value="student-request">
            Student Request
          </TabsTrigger>
          <TabsTrigger className="p-3" value="procsess-history">
            Process History
          </TabsTrigger>
          <TabsTrigger className="p-3" value="document-viewer">
            Document Viewer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="student-request" className="mt-6">
          <Card className="border-none shadow">
            <CardContent className="bg-muted/60 rounded-sm pt-6">
              <div className="items-start p-0 justify-center w-full sm:block">
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2 mb-4">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Student#:
                    </label>
                    <Input className="flex disabled h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" disabled={true} defaultValue={requestinfo?.StudentID} placeholder="--" />
                  </div>
                  <div className="grid gap-2 mb-4">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Program:
                    </label>
                    <Select disabled={true} className="disable">
                      <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        <SelectValue placeholder={requestinfo?.DisplayName} />
                        <span className="hidden program-selected">{requestinfo?.Program}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-auto" style={{ maxHeight: "15em" }}>
                          <SelectItem value="-">
                            {requestinfo?.Program} <span className="hidden program-selected">-</span>
                          </SelectItem>
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 mb-4">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Request Control#:
                    </label>
                    <Input className="flex disabled h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" disabled={true} defaultValue={requestinfo?.RequestControl} placeholder="--" />
                  </div>
                </div>
                <div className="grid gap-2 mb-4">
                  <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                    Student Name:
                  </label>
                  <Input className="flex disabled h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" defaultValue={requestinfo?.StudentName} disabled={true} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 mb-4">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Email:
                    </label>
                    <Input disabled={true} className="flex disabled h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" defaultValue={requestinfo?.Email} placeholder="--" />
                  </div>
                  <div className="grid gap-2 mb-4">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Contact#:
                    </label>
                    <Input disabled={true} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" defaultValue={requestinfo?.Contact} placeholder="--" />
                  </div>
                </div>
                <div className="grid gap-2 mb-4">
                  <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                    Purpose:
                  </label>
                  <Textarea disabled={true} className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="description" placeholder="--" defaultValue={requestinfo?.Purpose} />
                </div>
              </div>
            </CardContent>
          </Card>
          <h1 className="text-[23px] font-semibold mt-6 bg-muted/60 p-4 pb-0">Requested items</h1>
          <Table className="bg-muted/60">
            <TableHeader className="">
              <TableRow className="hover:bg-muted/0">
                <TableHead className="rounded-tl-sm p-4">Document Type</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Unit Price</TableHead>
                <TableHead className="text-center rounded-tr-sm">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestinfo?.RequestedItems?.length > 0 && (
                <>
                  {requestinfo?.RequestedItems?.map((items, i) => {
                    return (
                      <TableRow key={i} className="bg-muted/60 ">
                        <TableCell style={{ color: "#ebebeb" }} className="p-4 align-middle font-medium text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          {items?.ItemDesc}
                        </TableCell>
                        <TableCell style={{ color: "#ebebeb" }} className="p-4 align-middle font-medium text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          {items?.ItemQuantity}
                        </TableCell>
                        <TableCell style={{ color: "#ebebeb" }} className="p-4 align-middle font-medium text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          {items?.ItemPrice}
                        </TableCell>
                        <TableCell style={{ color: "#ebebeb" }} className="p-4 align-middle font-medium text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          {items?.ItemTotalAmount}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              )}
            </TableBody>
          </Table>
          <div className="flex bg-muted/60 ">
            <p className="p-2 mb-2 mt-2  px-4 text-[#fff] inline-block rounded-sm font-medium">
              {" "}
              <span>
                Total Amount: <span>{formatNumberWithCommas(requestinfo?.RequestedItemsTotalAmount)}</span> PHP
              </span>
              <span style={{ backgroundColor: requestinfo?.PaymentStatus == "0" ? "#E5484D" : "#2F7C57" }} className={`p-1 ml-3 font-semibold rounded-sm text-[13px]`}>
                {requestinfo?.PaymentStatus == "0" ? "Not cleared" : "Cleared"}
              </span>
            </p>
          </div>
          <h1 className="text-[23px] font-semibold mt-6 bg-muted/60 p-4 pb-0">Supporting documents</h1>
          <Table className="bg-muted/60">
            <TableHeader>
              <TableRow className="hover:bg-muted/0">
                <TableHead className="rounded-tl-sm p-4">File</TableHead>
                <TableHead className="text-center">Uploaded by</TableHead>
                <TableHead className="text-center">Date time</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestinfo?.UploadedSupportingDocuments?.length > 0 && (
                <>
                  {requestinfo?.UploadedSupportingDocuments?.map((items, i) => {
                    return (
                      <TableRow key={i} className="bg-muted/60">
                        <TableCell className="p-4 align-middle font-medium text-left  text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          <a href="" download={items?.DocumentName} className="underline flex text-[#3E63DD]">
                            {truncateString(items?.DocumentName, 20)}
                            <span className="mt-[4px] ml-[5px]">
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </span>
                          </a>
                        </TableCell>
                        <TableCell style={{ color: "#ebebeb" }} className="p-4 align-middle font-medium text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          {items?.UploadedBy || "-"}
                        </TableCell>
                        <TableCell style={{ color: "#ebebeb" }} className="p-4 align-middle font-medium text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                          {items?.DateCreated}
                        </TableCell>
                        <TableCell className="text-center">
                          {items?.UploadedBy.includes(UserID) ? (
                            <div onClick={(el) => removeuploadeddocument(items?.SUPPORTED_DOCUMENT_ID, el)} className="text-[#E54D2E] cursor-pointer w-auto flex justify-center">
                              Remove{" "}
                              <span className="ml-2 relative top-[4px]">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              )}
            </TableBody>
          </Table>
          <div className=" p-4 mb-6  bg-muted/60">
            <p colSpan={6} className="py-4 delete-file-warning hidden text-[#FFC53D] pt-0 text-left text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
              An unexpected error occurred . Please try your request again. If the problem persists, contact support for assistance.
            </p>
            <div className="flex justify-start">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-auto text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] text-center">
                    Upload
                    <span className="ml-2">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload</DialogTitle>
                    <DialogDescription>
                      please select the desired file and proceed by clicking submit
                      <span className="mt-5 mb-2 inline-block w-full">allowed file types: </span>
                      <span className="text-[#33B074]">{allowedExtensions.join(", ")}</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input ref={addfileref} className="pt-[6px]" type="file" />
                      </div>
                    </div>
                  </div>
                  <DialogDescription className="file-warning-message hidden lowercase"></DialogDescription>
                  <DialogFooter className="sm:justify-start flex">
                    <Button onClick={(el) => addfilefn(el)} type="button" variant="secondary">
                      Submit
                    </Button>
                    <ShadcnCleverEarwig74Loader strokewidth="5" classess="ml-2 mt-2 hidden addfilefnrefloader" width="20px" height="20px" stroke="#B4B4B4" />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <h1 className="text-[23px] font-semibold bg-muted/60 p-4 pb-0">Released type: Delivery</h1>
          <div className="bg-muted/60 p-4 mb-6  text-card-foreground shadow">
            <div className="grid gap-6"></div>
            <div className="mb-4">
              <div className="flex items-center justify-center relative [&>div]:w-full">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Line address 1:
                    </label>
                    <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" defaultValue={"Commonwealth Ever"} placeholder="--" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Line address 2:
                    </label>
                    <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Municipality/City:
                    </label>
                    <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" defaultValue={"Quezon City"} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Province:
                    </label>
                    <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" defaultValue={"NCR"} placeholder="--" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2 mb-4">
                      <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                        Contry:
                      </label>

                      <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" defaultValue={"Philippines"} />
                    </div>

                    <div className="grid gap-2 mb-4">
                      <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                        Zip:
                      </label>
                      <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" defaultValue={"1144"} placeholder="--" />
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
          <h1 className="text-[23px] font-semibold bg-muted/60 p-4 pb-0">Disposition</h1>
          <div className="bg-muted/60 p-4 mb-6  text-card-foreground shadow">
            <div className="grid gap-6"></div>
            <div className="mb-4">
              <div className="flex items-center justify-center relative [&>div]:w-full">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Remarks:
                    </label>
                    <Textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="description" placeholder="--" defaultValue={""} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                      Message to student:
                    </label>
                    <Textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="description" placeholder="--" defaultValue={""} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-auto text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] text-center">
                      Pending
                      <span className="ml-2">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </span>
                    </Button>
                    <Button variant="outline" className="w-auto text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] text-center">
                      Route To
                      <span className="ml-2">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </span>
                    </Button>
                    <Button variant="outline" className="w-auto text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] text-center">
                      Approve / Proceed
                      <span className="ml-2">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRrule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        </TabsContent>
        <TabsContent value="procsess-history" className=" mt-6">
          <Card className="pt-6">
            <CardContent className="space-y-2">
              <div className="items-start justify-center w-full gap-6 rounded-lg sm:block mb-6">
                <div className="rounded-xl  border-none bg-card text-card-foreground">
                  {/* <p className="text-md text-muted-foreground">What area are you having problems with?</p> */}
                  <div className=" gap-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2 mb-4">
                        <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                          Student#:
                        </label>
                        <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" />
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                          Program:
                        </label>
                        <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" />
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                          Request Control#:
                        </label>
                        <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" />
                      </div>
                    </div>
                    <div className="grid gap-2 mb-4">
                      <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                        Student Name:
                      </label>
                      <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2 mb-4">
                        <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                          Email#:
                        </label>
                        <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" />
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                          Contact#:
                        </label>
                        <Input className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="subject" placeholder="--" />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2 mb-4">
                    <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="description">
                      Purpose:
                    </label>
                    <Textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" id="description" placeholder="--" defaultValue={""} />
                  </div>
                </div>
                <div className="pt-6">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Date & Time</div>
                            </th>
                            <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Step#</div>
                            </th>
                            <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Status</div>
                            </th>
                            <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">User ID</div>
                            </th>
                            <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Username</div>
                            </th>
                            <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Disposition</div>
                            </th>
                            <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Remarks</div>
                            </th>
                            <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Message to Requestor</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" data-state="false">
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">01/05/2023 10:00AM</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">2.1</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Paid</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">USN#1234</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Juan Dela Cruz</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Paid</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Paid 1,000.00 PHP</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left"></div>
                            </td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" data-state="false">
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">01/05/2023 10:00AM</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">3.1</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Processing</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">USN#1234</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">ACR Processor 1</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Processed</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Notify Requestor</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Please upload supporting files.</div>
                            </td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" data-state="false">
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">01/05/2023 10:00AM</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">1.1</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Requested</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">USN#1234</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Juan Dela Cruz</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Requested</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Requested TOR, Diploma, etc.</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left"></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

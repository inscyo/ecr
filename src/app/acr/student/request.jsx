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
import { ScrollArea } from "@/components/ui/scroll-area"

const ACRStudentRequest = () => {
  const apiRequest = useAxiosAPI();
  const { settitle } = useContext(PageTitleContext);
  const { setglobalalert } = useContext(GlobalErrorContext);
  const [availablerequestlist, setavailablerequestlist] = useState([]);
  const [selectedrequestitem, setselectedrequestitem] = useState([]);
  const [selecteditemrequireddocuments, setselecteditemrequireddocuments] = useState([]);
  const [studentprogramlist, setstudentprogramlist] = useState([]);
  const [availablepayments, setavailablepayments] = useState([]);

  const { UserId: StudentID, FirstName, MiddleName, LastName } = JSON.parse(cryptoDecrypt(Cookies.get("user")));

  const addfileref = useRef();
  const controlnumberref = useRef();

  const requestcontrolnumber = async () => {
    const paymentsresponse = await apiRequest("ACR_GetAvailablePaymentChannels", "", {});
    if (!paymentsresponse || paymentsresponse.length <= 0) {
      setglobalalert({
        error: true,
        variant: "destructive",
        body: "Something went wrong please reload the page.",
      });
      return;
    }

    const studentprogramresponse = await apiRequest("ACR_StudentProgramCodeList", "JSON", { StudentID: StudentID });
    const response = await apiRequest("ACR_RequestControlNumber", "", {});
    const controlnumber = response?.[0]?.GeneratedControlNumber;
    if (!controlnumber) {
      setglobalalert({
        error: true,
        variant: "destructive",
        body: "Something went wrong please reload the page.",
      });
      return;
    }
    controlnumberref.current = controlnumber;
    setstudentprogramlist(studentprogramresponse);
    setavailablepayments(
      paymentsresponse.map((d) => {
        d.hash = cryptoEncrypt(JSON.stringify(d));
        return d;
    }));
  };

  const getrequestdocumentlist = async () => {
    const btn = document.querySelector(".open-request-item-selection");
    const requestdocumentsloader = document.querySelector(".request-documents-loader");
    const requestdocumentsicon = document.querySelector(".request-documents-icon");
    const requestdocumentsbtn = document.querySelector(".request-documents-btn");
    requestdocumentsloader.style.display = "block";
    requestdocumentsicon.style.display = "none";
    requestdocumentsbtn.disabled = true;
    requestdocumentsbtn.childNodes[0].innerText = "Please wait";
    await delay(getRandomNumber(100, 1000));
    if (availablerequestlist.length > 0) {
      requestdocumentsloader.style.display = "none";
      requestdocumentsicon.style.display = "block";
      requestdocumentsbtn.disabled = false;
      requestdocumentsbtn.childNodes[0].innerText = "Add Item";
      return btn?.click();
    }

    const response = await apiRequest("ACR_StudentRequestItems", "", {}, false);
    if (!response || response.length <= 0) {
      setglobalalert({
        error: true,
        variant: "destructive",
        body: "Something went wrong please reload the page.",
      });
      return;
    }

    setavailablerequestlist(
      response.map((d) => {
        d.hash = cryptoEncrypt(JSON.stringify(d));
        return d;
      }),
    );

    requestdocumentsloader.style.display = "none";
    requestdocumentsicon.style.display = "block";
    requestdocumentsbtn.disabled = false;
    requestdocumentsbtn.childNodes[0].innerText = "Add Item";
    btn?.click();
  };

  const addrequestitemfn = async () => {
    const requesteditem = document.querySelector(".selected-request-item").innerText;
    const warning = document.querySelector(".request-item-warning");
    warning.style.display = "none";
    warning.style.color = "#FFA057";

    try {
      if (requesteditem?.length <= 0 || requesteditem?.length == 2) {
        warning.style.display = "block";
        warning.innerText = "Please select an item";
        return;
      }

      const availablerequestliststring = JSON.stringify(availablerequestlist);

      if (!availablerequestliststring.includes(requesteditem)) {
        warning.style.display = "block";
        warning.style.color = "#E54D2E";
        warning.innerText = "Something went wrong please try again";
        return;
      }

      const { ItemCode, ItemDesc, ItemPrice, MinAmount, MaxAmount, DeliveryFee } = JSON.parse(cryptoDecrypt(requesteditem)) ?? undefined;
      const alreadyadded = selectedrequestitem.filter((e) => e.ItemCode == ItemCode);
      if (alreadyadded.length > 0) {
        warning.style.display = "block";
        warning.innerText = "Item already added";
        return;
      }
      const requireddocumentsresponse = await apiRequest("ACR_RequestItemCodeRequiredDocuments", "Json", { ItemCode });
      if (requireddocumentsresponse?.length > 0)
        setselecteditemrequireddocuments((p) => [
          ...p,
          ...requireddocumentsresponse.filter(
            ({ ItemCode, RequiredDocumentCode, RequiredDocumentDescription, Required }) =>
              ItemCode && {
                ItemCode,
                RequiredDocumentCode,
                RequiredDocumentDescription,
                Required,
              },
          ),
        ]);

      setselectedrequestitem((p) => [
        ...p,
        {
          ItemCode,
          ItemDesc,
          ItemPrice,
          MinAmount,
          MaxAmount,
          DeliveryFee,
          Quantity: 1,
          TotalAmount: ItemPrice// + DeliveryFee,
        },
      ]);
      warning.innerText = "Item added successfully";
      warning.style.display = "block";
      warning.style.color = "#33B074";
    } catch (err) {
      warning.style.display = "block";
      warning.style.color = "#E54D2E";
      warning.innerText = "Something went wrong please try again";
    }
  };

  const addfilefn = async (el, itemcode, documentcode) => {
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
    setselecteditemrequireddocuments((p) => {
      return p.map((docs) => {
        if (docs.RequiredDocumentCode === documentcode && docs?.ItemCode === itemcode) {
          docs.UploadedFileName = readedFile?.name;
          docs.UploadedFileData = readedFile?.file;
        }
        return docs;
      });
    });
    addfileref.current.value = "";
    currentref.style.cursor = "pointer";
    btn.style.cursor = "pointer";
    currentref.disabled = false;
    btn.disabled = false;
    loader.style.display = "none";
    warning.style.display = "block";
    warning.style.color = "#33B074";
    warning.innerText = "File added successfully";
  };

  const calculatetotalunitprice = ({ target }, item, itemelement) => {
    const inputValue = target.value.trim();
    const value = parseInt(inputValue.replace(/[^0-9]/g, ""), 10) || 0;

    target.value = value;

    const el = document.querySelector(`.${itemelement}`);
    const unitprice = value * item?.ItemPrice;
    let totalamount = 0;
    if (value < 0) {
      target.value = 0;
    } else if (unitprice > item?.MaxAmount) {
      const maxQuantity = Math.ceil(item?.MaxAmount / item?.ItemPrice);
      target.value = maxQuantity;
      totalamount = item?.MaxAmount;
    } else {
      totalamount = unitprice;
    }

    const finalamount = totalamount;
    el.innerText = formatNumberWithCommas(finalamount );//+ item?.DeliveryFee
    if (item?.ItemPrice == item?.MaxAmount || finalamount == item?.MaxAmount) return;
    setselectedrequestitem((requestitems) => {
      return requestitems.map((items) => {
        if (items.ItemCode == item.ItemCode) {
          items.Quantity = value;
          items.TotalAmount = finalamount ;//+ item?.DeliveryFee
        }
        return items;
      });
    });
  };

  const removeselecteditem = (itemcode) => {
    if (!itemcode) return;
    setselectedrequestitem((requestitems) => requestitems.filter((item) => item.ItemCode != itemcode));
    if (selecteditemrequireddocuments?.length <= 0) return;
    setselecteditemrequireddocuments((p) => p.filter((docs) => docs?.ItemCode != itemcode));
  };

  const requestitemtotalamount = useMemo(() => {
    let amount = 0;
    for (let item of selectedrequestitem) {
      amount += item?.TotalAmount;
    }
    return formatNumberWithCommas(amount);
  }, [selectedrequestitem]);

  const studentemailref = useRef();
  const studentcontactref = useRef();
  const studentpurposeref = useRef();
  const studentdeliverymoderef = useRef();
  const studentlineaddress1ref = useRef();
  const studentlineaddress2ref = useRef();
  const studentprovinceref = useRef();
  const studentmunicipalitycityref = useRef();
  const studentcountryref = useRef();
  const studentzipcoderef = useRef();

  const payrequest = async () => {
    const submitrequestwarning = document.querySelector(".submit-request-warning");
    const btn = document.querySelector(".submit-requested-documents-btn");
    const cancel = document.querySelector(".cancel-requested-documents");
    const loader = document.querySelector(".submit-requested-documents-loader");
    try {
      const program = document.querySelector(".program-selected")?.innerText;
      const studentemail = studentemailref.current?.value;
      const studentcontact = studentcontactref.current?.value;
      const studentpurpose = studentpurposeref.current?.value;
      const studentdeliverymode = studentdeliverymoderef.current || "direct-delivery";
      const studentlineaddress1 = studentlineaddress1ref.current?.value;
      const studentlineaddress2 = studentlineaddress2ref.current?.value;
      const studentprovince = studentprovinceref.current?.value;
      const studentmunicipalitycity = studentmunicipalitycityref.current?.value;
      const studentcountry = studentcountryref.current?.value;
      const studentzipcode = studentzipcoderef.current?.value;
      const paymentchannel = document.querySelector(".paymentchannel-selected")?.innerText;
      
      submitrequestwarning.style.display = "none";
      submitrequestwarning.style.color = "#FFA057";
      submitrequestwarning.innerText = "";

      const validations = [
        {
          field: StudentID,
          message: "Please ensure you have entered the student ID. This field is required for accurate identification of the student.",
        },
        {
          field: controlnumberref.current,
          message: "The control number is a mandatory field. Kindly input the assigned control number for proper record-keeping.",
        },
        {
          field: program,
          message: "To proceed, please choose a program from the available options. This information helps us tailor our services to meet your specific academic needs.",
        },
        {
          field: studentemail,
          message: "Ensure the email address provided is valid. A valid email is crucial for communication purposes. If unsure, double-check and confirm your email address.",
          isValid: isValidEmail,
        },
        {
          field: studentcontact,
          message: "Please enter a valid contact number. This ensures that we can reach you promptly if needed. Check for correct formatting and avoid any additional characters.",
          isValid: isValidPhoneNumber,
        },
        // { field: studentpurpose, message: 'Specify the purpose of your request. Providing a clear purpose helps us understand your needs better and allows for a smoother process.' },
        {
          field: studentdeliverymode,
          message: "Choose a preferred delivery mode for your request. This selection ensures that we can fulfill your request in the most convenient way for you.",
        },
        {
          field: studentlineaddress1,
          message: "Input your primary line address. This information is vital for the accurate delivery of any physical materials or documents.",
        },
        // { field: studentlineaddress2, message: 'If applicable, provide a secondary line address. This additional information assists us in case of any complexities in the delivery process.' },
        {
          field: studentprovince,
          message: "Select the province where you are currently located. This information aids us in understanding your geographical location for various logistical purposes.",
        },
        {
          field: studentmunicipalitycity,
          message: "Enter the municipality or city of your residence. This data is necessary for administrative purposes and ensuring accurate service delivery.",
        },
        {
          field: studentcountry,
          message: "Choose your country of residence. This information is essential for processing requests based on regional considerations and requirements.",
        },
        {
          field: studentzipcode,
          message: "Provide the zip code of your location. This detail helps in streamlining the delivery process and ensures accuracy in the handling of your request.",
        },
        {
          field: paymentchannel,
          message: "Kindly choose a payment channel.",
          hidesubmit: false,
        },
      ];

      for (const { field, message, isValid, hidesubmit } of validations) {
        if (isNullOrEmpty(field) || (isValid && !isValid(field))) {
          submitrequestwarning.style.display = "block";
          submitrequestwarning.innerText = message;
          if(hidesubmit && !hidesubmit){
            btn.style.display = "none";
            cancel.innerText = "Ok";
            cancel.style.marginLeft = "-8px";
          }
          return;
        }
      }

      if (selectedrequestitem?.length <= 0) {
        submitrequestwarning.style.display = "block";
        btn.style.display = "none";
        submitrequestwarning.innerText = "Request atleast one document";
        cancel.innerText = "Ok";
        cancel.style.marginLeft = "-8px";
        return;
      }

      const validatesupportingdocuments = () => {
        return new Promise(resolve => {
          if (selecteditemrequireddocuments?.length > 0) {
            !selecteditemrequireddocuments.map((obj) => {
              if(obj.Required >= 1){
                if(!obj.UploadedFileData || !obj.UploadedFileName){
                  resolve(false);
                  return 
                }
                return
              }
              resolve(true);
            })
            return
          }
          resolve(true)
        })
      }

      const istruevalidatesupportingdocuments = await validatesupportingdocuments();
      if(!istruevalidatesupportingdocuments){
        submitrequestwarning.style.display = "block";
        btn.style.display = "none";
        submitrequestwarning.innerText = "Please upload supporting documents";
        cancel.innerText = "Ok";
        cancel.style.marginLeft = "-8px";
        return;
      }

      btn.innerText = "Please wait";
      loader.style.display = "block";
      cancel.style.display = "none";
      btn.disabled = true;

      const requestinfo = {
        ControlNumber: controlnumberref.current,
        StudentID,
        ProgramCode: program,
        Email: studentemail,
        Contact: studentcontact,
        Purpose: studentpurpose,
        DeliveryMode: studentdeliverymode,
        LineAddress1: studentlineaddress1,
        LineAddress2: studentlineaddress2,
        Province: studentprovince,
        Municipality: studentmunicipalitycity,
        Country: studentcountry,
        ZipCode: studentzipcode,
        PaymentChannel: paymentchannel,
        RequestedItems: selectedrequestitem,
        RequiredDocuments: selecteditemrequireddocuments,
      };

      const stringifyrequestinfo = requestinfo;
      console.log(stringifyrequestinfo);
      const submitrequestresponse = await apiRequest("ACR_SaveStudentRequest", "Json", stringifyrequestinfo, false);
      let responsemessage = "";
      let request = undefined;
      for (let i = submitrequestresponse.length; i--; ) {
        const { responsecode, responsemessage: message, Request } = submitrequestresponse[i];
        request = Request;
        responsemessage = message;
        if (responsecode == "1") {
          loader.style.display = "none";
          cancel.style.display = "block";
          btn.disabled = false;
          submitrequestwarning.style.display = "block";
          submitrequestwarning.innerText = responsemessage;
          btn.innerText = "Submit";
          return;
        }
      }
      await delay(3000);
      if(!request){
        loader.style.display = "none";
        cancel.style.display = "block";
        btn.disabled = false;
        submitrequestwarning.style.display = "block";
        submitrequestwarning.innerText = "Something went wrong, please try again.";
        btn.innerText = "Submit";
        return
      }
      console.log("open")
      window.open(`https://dcapi.amasystem.net:4445?payload=${request}`, '_blank');

      loader.style.display = "none";
      cancel.style.display = "block";
      btn.disabled = false;
      submitrequestwarning.style.display = "block";
      submitrequestwarning.style.color = "#33B074";
      submitrequestwarning.innerText = responsemessage;
      btn.innerText = "Submit";
      btn.style.display = "none";
      cancel.style.marginLeft = "-8px";
      cancel.innerText = "Go to my request dashboard";
      cancel.addEventListener("click", function(){
        window.location.reload();
      });

    } catch (err) {
      loader.style.display = "none";
      cancel.style.display = "block";
      btn.disabled = false;
      submitrequestwarning.style.display = "block";
      submitrequestwarning.style.color = "#E54D2E";
      submitrequestwarning.innerText = "Unexpected error occured: \n" + err;
      btn.innerText = "Submit";
    }
  };

  useEffect(() => {
    settitle("Student Request");
    requestcontrolnumber();
  }, []);

  return (
    <>
      <div className="items-start justify-center w-full gap-6 rounded-lg sm:block mb-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 bg-muted/60 gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2 mb-4">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                  Student#:
                </label>
                <Input
                  className="flex disabled h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  disabled={true}
                  defaultValue={StudentID}
                  placeholder="--"
                />
              </div>
              <div className="grid gap-2 mb-4">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                  Program:
                </label>
                <Select>
                  <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-auto" style={{maxHeight: "15em"}}>
                      {studentprogramlist?.length > 0 &&
                        studentprogramlist.map((program, i) => (
                          <SelectItem key={i} value={program.SYTProgramCode}>
                            {program.DisplayName} <span className="hidden program-selected">{program.SYTProgramCode}</span>
                          </SelectItem>
                        ))}
                      {studentprogramlist?.length <= 0 && (
                        <SelectItem value="-">
                          No available program <span className="hidden program-selected">-</span>
                        </SelectItem>
                      )}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 mb-4">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                  Request Control#:
                </label>
                <Input
                  className="flex disabled h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  disabled={true}
                  placeholder="--"
                  defaultValue={controlnumberref.current}
                />
              </div>
            </div>
            <div className="grid gap-2 mb-4">
              <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                Student Name:
              </label>
              <Input
                className="flex disabled h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                id="subject"
                placeholder="--"
                disabled={true}
                defaultValue={`${LastName || "-"}, ${FirstName || "-"} ${MiddleName || "-"}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 mb-4">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                  Email:
                </label>
                <Input
                  ref={studentemailref}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  defaultValue={"sample@gmail.com"}
                  placeholder="--"
                />
              </div>
              <div className="grid gap-2 mb-4">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                  Contact#:
                </label>
                <Input
                  ref={studentcontactref}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  defaultValue={"09123456789"}
                  placeholder="--"
                />
              </div>
            </div>
            <div className="grid gap-2 mb-4">
              <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                Purpose:
              </label>
              <Textarea
                ref={studentpurposeref}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                id="description"
                placeholder="--"
                defaultValue={""}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-muted/60 border mb-6 p-6 text-card-foreground">
        <div className=" flex-col mb-4 space-y-1.5">
          <h2 className="font-semibold text-xl leading-none tracking-tight ">Requested Documents</h2>
        </div>
        <div className="pt-0">
          
          <div className="rounded-md border">
            
            <div className="relative w-full overflow-auto">
           
              <Table className="width-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Type</TableHead>
                    <TableHead>QTY</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Delivery Fee</TableHead>
                    <TableHead>Total + Delivery Fee</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {console.log(selectedrequestitem)}
                  {selectedrequestitem.length > 0 &&
                    selectedrequestitem.map((item, i) => {
                      const itemprice = formatNumberWithCommas(item.ItemPrice);
                      const delivery = formatNumberWithCommas(item.DeliveryFee);
                      const totalitemamout = formatNumberWithCommas(item.ItemPrice);  {/* + item.DeliveryFee */}
                      
                      if(typeof itemprice === "boolean" || typeof delivery === "boolean" || typeof totalitemamout === "boolean") {
                        return (
                          <TableRow key={i} className="bg-muted/60">
                            <TableCell colSpan={6} className="p-2 text-[#E54D2E] text-center [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              An error occured please <a href="" className="underline">reload the page</a>.
                            </TableCell>
                          </TableRow>
                        )
                      }
                      return (
                        <TableRow key={i} className="bg-muted/60">
                          <TableCell className="font-medium">{item?.ItemDesc}</TableCell>
                          <TableCell>
                            <Input
                              className="flex w-[100px] disabled focus:outline-none border-none bg-transparent px-2 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              id="subject"
                              defaultValue={1}
                              placeholder="--"
                              type="number"
                              onInput={(el) => calculatetotalunitprice(el, item, `request-item-unit-${item?.ItemCode}`)}
                              onBlur={(el) => calculatetotalunitprice(el, item, `request-item-unit-${item?.ItemCode}`)}
                              onChange={(el) => calculatetotalunitprice(el, item, `request-item-unit-${item?.ItemCode}`)}
                              min={1}
                            />
                          </TableCell>
                          <TableCell>{itemprice}</TableCell>
                          <TableCell>{delivery}</TableCell>
                          <TableCell className={`text-left request-item-unit-${item?.ItemCode}`}>{totalitemamout}</TableCell>
                          <TableCell className="text-left">
                            <div onClick={() => removeselecteditem(item?.ItemCode)} className="text-[#E54D2E] cursor-pointer w-auto flex">
                              Remove{" "}
                              <span className="ml-2 relative top-[4px]">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {selectedrequestitem.length <= 0 && (
                    <TableRow className="bg-muted/60">
                      <TableCell colSpan={6} className="p-2 text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                        -
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="flex mt-2">
          <div className=" justify-start">
            <Button onClick={getrequestdocumentlist} className="w-auto request-documents-btn disabled text-[#fff] rounded-sm bg-[#104D87] hover:bg-[#104D87] mt-[10px] text-center">
              <span>Add Item</span>
              <ShadcnCleverEarwig74Loader strokewidth="5" classess="ml-[10px] mt-[2px] hidden request-documents-loader" width="15px" height="15px" stroke="#dfdfdf" />
              <span className="ml-2 request-documents-icon">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.2 1H4.17741H4.1774C3.86936 0.999988 3.60368 0.999978 3.38609 1.02067C3.15576 1.04257 2.92825 1.09113 2.71625 1.22104C2.51442 1.34472 2.34473 1.51442 2.22104 1.71625C2.09113 1.92825 2.04257 2.15576 2.02067 2.38609C1.99998 2.60367 1.99999 2.86935 2 3.17738V3.1774V3.2V11.8V11.8226V11.8226C1.99999 12.1307 1.99998 12.3963 2.02067 12.6139C2.04257 12.8442 2.09113 13.0717 2.22104 13.2837C2.34473 13.4856 2.51442 13.6553 2.71625 13.779C2.92825 13.9089 3.15576 13.9574 3.38609 13.9793C3.60368 14 3.86937 14 4.17741 14H4.2H10.8H10.8226C11.1306 14 11.3963 14 11.6139 13.9793C11.8442 13.9574 12.0717 13.9089 12.2837 13.779C12.4856 13.6553 12.6553 13.4856 12.779 13.2837C12.9089 13.0717 12.9574 12.8442 12.9793 12.6139C13 12.3963 13 12.1306 13 11.8226V11.8V3.2V3.17741C13 2.86936 13 2.60368 12.9793 2.38609C12.9574 2.15576 12.9089 1.92825 12.779 1.71625C12.6553 1.51442 12.4856 1.34472 12.2837 1.22104C12.0717 1.09113 11.8442 1.04257 11.6139 1.02067C11.3963 0.999978 11.1306 0.999988 10.8226 1H10.8H4.2ZM3.23875 2.07368C3.26722 2.05623 3.32362 2.03112 3.48075 2.01618C3.64532 2.00053 3.86298 2 4.2 2H10.8C11.137 2 11.3547 2.00053 11.5193 2.01618C11.6764 2.03112 11.7328 2.05623 11.7613 2.07368C11.8285 2.11491 11.8851 2.17147 11.9263 2.23875C11.9438 2.26722 11.9689 2.32362 11.9838 2.48075C11.9995 2.64532 12 2.86298 12 3.2V11.8C12 12.137 11.9995 12.3547 11.9838 12.5193C11.9689 12.6764 11.9438 12.7328 11.9263 12.7613C11.8851 12.8285 11.8285 12.8851 11.7613 12.9263C11.7328 12.9438 11.6764 12.9689 11.5193 12.9838C11.3547 12.9995 11.137 13 10.8 13H4.2C3.86298 13 3.64532 12.9995 3.48075 12.9838C3.32362 12.9689 3.26722 12.9438 3.23875 12.9263C3.17147 12.8851 3.11491 12.8285 3.07368 12.7613C3.05624 12.7328 3.03112 12.6764 3.01618 12.5193C3.00053 12.3547 3 12.137 3 11.8V3.2C3 2.86298 3.00053 2.64532 3.01618 2.48075C3.03112 2.32362 3.05624 2.26722 3.07368 2.23875C3.11491 2.17147 3.17147 2.11491 3.23875 2.07368ZM5 10C4.72386 10 4.5 10.2239 4.5 10.5C4.5 10.7761 4.72386 11 5 11H8C8.27614 11 8.5 10.7761 8.5 10.5C8.5 10.2239 8.27614 10 8 10H5ZM4.5 7.5C4.5 7.22386 4.72386 7 5 7H10C10.2761 7 10.5 7.22386 10.5 7.5C10.5 7.77614 10.2761 8 10 8H5C4.72386 8 4.5 7.77614 4.5 7.5ZM5 4C4.72386 4 4.5 4.22386 4.5 4.5C4.5 4.77614 4.72386 5 5 5H10C10.2761 5 10.5 4.77614 10.5 4.5C10.5 4.22386 10.2761 4 10 4H5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-auto open-request-item-selection hidden disabled text-[#fff] rounded-sm bg-[#104D87] hover:bg-[#104D87] mt-[10px] text-center"></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Document</DialogTitle>
                  <DialogDescription>Select the desired item and proceed by clicking submit</DialogDescription>
                </DialogHeader>
                <Select>
                  <SelectTrigger className="flex h-auto rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-72" style={{maxHeight: "15em"}}>
                      {availablerequestlist.map((items, i) => {
                        return (
                          <SelectItem key={i} title={items.ItemDesc} value={items?.ItemCode}>
                            {items.ItemDesc}
                            <span className="hidden selected-request-item">{items?.hash}</span>
                          </SelectItem>
                        );
                      })}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <DialogDescription className="request-item-warning hidden"></DialogDescription>
                <DialogFooter className="sm:justify-start flex">
                  <Button onClick={(el) => addrequestitemfn(el)} type="button" variant="secondary">
                    Submit
                  </Button>
                  <ShadcnCleverEarwig74Loader strokewidth="5" classess="ml-2 mt-2 hidden addfilefnrefloader" width="20px" height="20px" stroke="#B4B4B4" />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="p-2 px-4 mt-2 ml-4  text-[#fff] inline-block rounded-sm font-medium">
            {" "}
            <span>
              Total Amount: <span>{requestitemtotalamount}</span> PHP
            </span>
          </p>
        </div>
      </div>
      <div className="rounded-xl bg-muted/60 p-6 pt-6 mb-6 scroll-pb-60 border text-card-foreground">
        <div className="flex flex-col mb-4 space-y-1.5">
          <h2 className="font-semibold text-xl leading-none tracking-tight">Upload Supporting Documents</h2>
        </div>
        <div className="pt-0">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/60">
                    <TableHead>Item</TableHead>
                    <TableHead>Require Document</TableHead>
                    <TableHead>Selected file</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selecteditemrequireddocuments?.length > 0 &&
                    selecteditemrequireddocuments.map((docs, i) => {
                      return (
                        <TableRow key={i} className="bg-muted/60">
                           <TableCell className="p-2 text-left font-semibold [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">{docs.ItemDesc}</TableCell>
                          <TableCell className="p-2 text-left font-semibold [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">{docs.RequiredDocumentDescription}</TableCell>
                          <TableCell className="p-2 text-muted-foreground text-left [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                            {!docs?.UploadedFileName ? (
                              "No file selected"
                            ) : (
                              <a target="_blank" href={docs?.UploadedFileData} download={docs?.UploadedFileName} className="underline cursor-pointer text-[#3B9EFF]">
                                {truncateFilenameWithExtension(docs?.UploadedFileName, 20)}
                              </a>
                            )}
                          </TableCell>
                          <TableCell className="p-2 text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                            <div className="flex">
                              <div className=" justify-start">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="w-auto text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] text-center">
                                      {docs?.UploadedFileName ? "Choose again" : "Upload"}
                                      <span className="ml-2">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path
                                            d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>{docs.RequiredDocumentDescription}</DialogTitle>
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
                                      <Button onClick={(el) => addfilefn(el, docs?.ItemCode, docs?.RequiredDocumentCode)} type="button" variant="secondary">
                                        Submit
                                      </Button>
                                      <ShadcnCleverEarwig74Loader strokewidth="5" classess="ml-2 mt-2 hidden addfilefnrefloader" width="20px" height="20px" stroke="#B4B4B4" />
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                  })}
                  {selecteditemrequireddocuments?.length <= 0 && (
                    <TableRow className="bg-muted/60">
                      <TableCell colSpan={4} className="p-2 text-center text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                        -
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-muted/60 p-6 mb-6 border text-card-foreground shadow">
        <div className="grid gap-6"></div>
        <div className="mb-4">
          <div className="flex items-center justify-center relative [&>div]:w-full">
            <div className="grid gap-6">
              <RadioGroup onValueChange={(e) => (studentdeliverymoderef.current = e)} defaultValue="direct-delivery" className="flex relative">
                <div className="flex items-center space-x-2 mr-2">
                  <RadioGroupItem value="direct-delivery" id="direct-delivery" />
                  <Label className="text-[18px]" htmlFor="direct-delivery">
                    Direct Delivery
                    <span></span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label className="text-[18px]" htmlFor="pickup">
                    Pickup
                  </Label>
                </div>
              </RadioGroup>
              <div className="grid gap-2">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                  Line address 1:
                </label>
                <Input
                  ref={studentlineaddress1ref}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  defaultValue={"Commonwealth Ever"}
                  placeholder="--"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                  Line address 2:
                </label>
                <Input
                  ref={studentlineaddress2ref}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  placeholder="--"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                  Municipality/City:
                </label>
                <Input
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  placeholder="--"
                  defaultValue={"Quezon City"}
                  ref={studentmunicipalitycityref}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                  Province:
                </label>
                <Input
                  ref={studentprovinceref}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  defaultValue={"NCR"}
                  placeholder="--"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2 mb-4">
                  <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                    Contry:
                  </label>

                  <Input
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    id="subject"
                    placeholder="--"
                    defaultValue={"Philippines"}
                    ref={studentcountryref}
                  />
                </div>

                <div className="grid gap-2 mb-4">
                  <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="subject">
                    Zip:
                  </label>
                  <Input
                    ref={studentzipcoderef}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    id="subject"
                    defaultValue={"1144"}
                    placeholder="--"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="flex">
          <div className=" justify-start">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-[120px] text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] text-center">Pay Request</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to continue?</DialogTitle>
                  <DialogDescription>Please select a <span className="text-[#3B9EFF] font-semibold">payment info</span> and click submit to continue.</DialogDescription>
                </DialogHeader>
                <DialogTitle className="font-semibold text-[15px]">Payment Channel:</DialogTitle>
                <Select>
                  <SelectTrigger className="flex h-auto w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-72" style={{maxHeight: "15em"}}>
                    {
                        availablepayments.map((obj, i) => (
                          <SelectItem value={obj.PaymentChannel} key={i}>
                            {obj.PaymentDesc} <span className="hidden paymentchannel-selected">{obj.PaymentChannel}</span>
                          </SelectItem>
                        ))
                      }
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <DialogDescription className="submit-request-warning hidden"></DialogDescription>
                <DialogFooter className="sm:justify-start flex">
                  <Button onClick={payrequest} type="button" variant="secondary" className="submit-requested-documents-btn">
                    Submit
                  </Button>
                  <ShadcnCleverEarwig74Loader strokewidth="5" classess="ml-2 mt-2 hidden submit-requested-documents-loader" width="20px" height="20px" stroke="#B4B4B4" />
                  <DialogClose>
                    <p
                      className="cancel-requested-documents inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 submit-requested-documents-btn"
                      type="button"
                      variant="secondary"
                    >
                      Cancel
                    </p>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default ACRStudentRequest;

import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageTitleContext } from "../../../context/page-title";
const ACRDashboard = () => {
    const {settitle} = useContext(PageTitleContext);

    useEffect(() => {
      settitle("Dashboard");
    }, []);
  return (
    <>
      <Tabs defaultValue="student-request" className="w-full ">
        <TabsList className="grid w-full h-auto grid-cols-3 p-2">
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
        <TabsContent value="student-request" className=" mt-6">
          <Card className="pt-6">
            <CardContent className="space-y-2">
              <div className="items-start justify-center w-full gap-6 rounded-lg sm:block mb-6">
                <div className="rounded-xl  border-none bg-card text-card-foreground">
                  {/* <p className="text-md text-muted-foreground">What area are you having problems with?</p> */}
                  <div className=" gap-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Student#:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Program:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Request Control#:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2 mb-4">
                      <label
                        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="subject"
                      >
                        Student Name:
                      </label>
                      <Input
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        id="subject"
                        placeholder="--"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Email#:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Contact#:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2 mb-4">
                    <label
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="description"
                    >
                      Purpose:
                    </label>
                    <Textarea
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      id="description"
                      placeholder="--"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-xl pb-4 pt-2 bg-card text-card-foreground">
                <div className=" flex-col mb-4 space-y-1.5">
                  <h2 className="font-semibold text-xl leading-none tracking-tight ">
                    Requested Documents
                  </h2>
                </div>
                <div className="pt-0">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              Document Type
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">QTY</div>
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Unit Price</div>
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">Total</div>
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-center">Action</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          <tr
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            data-state="false"
                          >
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="">Transcript of records</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="capitalize">2</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="">500.00</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left font-medium">
                                1,000.00
                              </div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-center justify-center  text-[#E54D2E] cursor-pointer w-auto flex">
                                Delete{" "}
                                <span className="ml-2 relative top-[4px]">
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            data-state="false"
                          >
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="">Diploma</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="capitalize">1</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="">400.00</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left font-medium">
                                400.00
                              </div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-center justify-center  text-[#E54D2E] cursor-pointer w-auto flex">
                                Delete{" "}
                                <span className="ml-2 relative top-[4px]">
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="flex mt-2">
                  <Button className="w-auto cursor-not-allowed disabled text-[#fff] rounded-sm bg-[#104D87] hover:bg-[#104D87] mt-[10px] text-center">
                    Payment Details
                    <span className="ml-2">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </Button>
                  <p className="p-2 px-4 mt-2 ml-4  text-[#fff] inline-block rounded-sm font-medium">
                    {" "}
                    <span>
                      Total Amount: <span>1,400.00</span> PHP
                    </span>
                    <span className="p-1 ml-3 bg-[#2F7C57] font-semibold rounded-sm text-[13px]">
                      cleared
                    </span>
                  </p>
                </div>
              </div>
              <div className="rounded-xl mb-6 scroll-pb-60 border-none bg-card text-card-foreground">
                <div className="flex flex-col mb-4 mt-4 space-y-1.5">
                  <h2 className="font-semibold text-xl leading-none tracking-tight">
                    Uploading Supporting Documents
                  </h2>
                </div>
                <div className="pt-0">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">File(s)</div>
                            </th>
                            <th className="h-10 px-2 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-center">Action</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          <tr
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            data-state="false"
                          >
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">School ID</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-center justify-center  text-[#E54D2E] cursor-pointer w-auto flex">
                                Delete{" "}
                                <span className="ml-2 relative top-[4px]">
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            data-state="false"
                          >
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">PSA</div>
                            </td>
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-center justify-center  text-[#E54D2E] cursor-pointer w-auto flex">
                                Delete{" "}
                                <span className="ml-2 relative top-[4px]">
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className=" justify-start">
                    <Button className="w-[100px] text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] hover:opacity-4 mt-[20px] text-center">
                      Upload
                      <span className="ml-2">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="rounded-xl mb-6 pt-6 border-none bg-card text-card-foreground">
                <div className="mb-4">
                  <div className="flex items-center justify-center relative [&>div]:w-full">
                    <div className="grid gap-6">
                      <div className=" flex-col mb-4 space-y-1.5">
                        <h2 className="font-semibold text-xl leading-none tracking-tight ">
                          Requested Type:{" "}
                          <span className="ml-2">Direct Delivery</span>
                        </h2>
                      </div>
                      <div className="grid gap-2">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Line address 1:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Line address 2:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Municipality/City:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Province:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2 mb-4">
                          <label
                            className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="subject"
                          >
                            Country:
                          </label>
                          <Input
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            id="subject"
                            placeholder="--"
                          />
                        </div>
                        <div className="grid gap-2 mb-4">
                          <label
                            className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="subject"
                          >
                            Zip Code:
                          </label>
                          <Input
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            id="subject"
                            placeholder="--"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
              <div className="rounded-xl mb-6 pt-2 border-none bg-card text-card-foreground">
                <div className="mb-4">
                  <div className="flex items-center justify-center relative [&>div]:w-full">
                    <div className="grid gap-6">
                      <div className=" flex-col mb-4 space-y-1.5">
                        <h2 className="font-semibold text-xl leading-none tracking-tight ">
                          Desposition:
                        </h2>
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="description"
                        >
                          Remarks:
                        </label>
                        <Textarea
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="description"
                          placeholder="--"
                          defaultValue={""}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="description"
                        >
                          Message to Student:{" "}
                          <span className="text-[red]">
                            (message will put the request to PENDING)
                          </span>
                        </label>
                        <Textarea
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="description"
                          placeholder="--"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-auto text-[#fff] rounded-sm bg-[#205D9E] hover:bg-[#205D9E] text-center">
                Approve/Proceed
                <span className="ml-2">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </Button>
              </div>
            </CardContent>
          </Card>
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
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Student#:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Program:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Request Control#:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2 mb-4">
                      <label
                        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="subject"
                      >
                        Student Name:
                      </label>
                      <Input
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        id="subject"
                        placeholder="--"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Email#:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                      <div className="grid gap-2 mb-4">
                        <label
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="subject"
                        >
                          Contact#:
                        </label>
                        <Input
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md-sm transition-colors file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          id="subject"
                          placeholder="--"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2 mb-4">
                    <label
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="description"
                    >
                      Purpose:
                    </label>
                    <Textarea
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      id="description"
                      placeholder="--"
                      defaultValue={""}
                    />
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
                              <div className="text-left">
                                Message to Requestor
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          <tr
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            data-state="false"
                          >
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">
                                01/05/2023 10:00AM
                              </div>
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
                          <tr
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            data-state="false"
                          >
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">
                                01/05/2023 10:00AM
                              </div>
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
                              <div className="text-left">
                                Please upload supporting files.
                              </div>
                            </td>
                          </tr>
                          <tr
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            data-state="false"
                          >
                            <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&:has([role=checkbox])]:pl-3">
                              <div className="text-left">
                                01/05/2023 10:00AM
                              </div>
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
                              <div className="text-left">
                                Requested TOR, Diploma, etc.
                              </div>
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
};

export default ACRDashboard;

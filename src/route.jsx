import { lazy, Suspense, useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/* # shadcn */

import "./styles/index.css";
import "./styles/all.css";
import "./styles/global.css";
import "./styles/uiverse-loader.css";
import DefaultLayout from "./layout/default-layout";
import Authentication from "./secuity/auth/authentication";
import { UiverseLoader } from "./layout/loader";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

/* # contexts */
import { GlobalErrorContext } from "./context/global-alert";
import { GlobalLoadingContext } from "./context/loading";

/* # register all components here */
const DefaultIndex = lazy(() => import("./app/default")); 
const ACRHomepage = lazy(() => import("./app/acr/registrar/ecr-homepage")); 
const ACRStudentRequest = lazy(() => import("./app/acr/student/request")); 
const ACRDashboard = lazy(() => import("./app/acr/registrar/dashboard"));
const PurchaseOrderTagging = lazy(() => import("./app/acr/registrar/purchase-order-tagging"));
const DeliveryReceiptTagging = lazy(() => import("./app/acr/registrar/delivery-receipt-tagging"));
const ViewRequestControl = lazy(() => import("./app/acr/registrar/view-request"));

const StudentRequestDashboard = lazy(() => import("./app/acr/student/dashboard"));
const RequestControlHistory = lazy(() => import("./app/acr/student/history"));


export default function AppRoutes(){
    const { globalalert, setglobalalert } = useContext(GlobalErrorContext);
    const { globalloadingprogress, setgloballoadingprogress } = useContext(GlobalLoadingContext);
    /* 
        # register all routes here
        # database routes and static routes
    */
    useEffect(() => {
        document.body.style.overflow = globalalert?.error ? 'hidden' : 'visible';
    }, [globalalert]);
    const jsx = (
        <>
         {globalalert?.error && (
            <>
                <div data-state="open" className="fixed inset-0 z-[99999] bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" style={{pointerEvents: 'auto'}} data-aria-hidden="true" aria-hidden="true" />
                <div role="dialog" id="radix-:r0:" aria-describedby="radix-:r2:" aria-labelledby="radix-:r1:" data-state="open" 
                className="fixed left-[50%] top-[50%] z-[999999] grid w-full max-w-lg translate-x-[-50%] translate-y-[-60%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full outline-none sm:max-w-md border-none bg-transparent" tabIndex={-1} style={{pointerEvents: 'auto'}}><div className="w-auto flex justify-center" style={{wordBreak: 'break-word', color: globalalert?.textColor}} />
                    <center>
                        {globalalert?.body}
                        {globalalert?.hasClose && (
                            <div className="inline-block w-full mt-4">
                                <button onClick={() => setglobalalert({error: false})} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2" type="button">
                                    {globalalert?.label}
                                </button>
                            </div>
                        )}
                    </center>
                </div>
            </>
         )}
            {/* {globalloadingprogress > 0 && <UiverseLoader progress={globalloadingprogress} progressfn={setgloballoadingprogress} color="#ffc53d" />} */}
            <BrowserRouter>
                <Suspense>
                    <Routes>
                        <Route element={<Authentication />}>
                            <Route element={<DefaultLayout />}>
                                <Route path="/" exact element={<DefaultIndex />} />
                                <Route path="/acr/registrar" exact element={<ACRHomepage />} />
                                <Route path="/acr/registrar/dashboard" exact element={<ACRDashboard />} />
                                <Route path="/acr/registrar/purchase-order-tagging" exact element={<PurchaseOrderTagging />} />
                                <Route path="/acr/registrar/delivery-receipt-tagging" exact element={<DeliveryReceiptTagging />} />
                                <Route path="/acr/registrar/view/:studentid/:requestcontrol" exact element={<ViewRequestControl />} />
                                <Route path="/acr/student/request" exact element={<ACRStudentRequest />} />
                                <Route path="/acr/student/dashboard" exact element={<StudentRequestDashboard />} />
                            </Route>
                            <Route path="/acr/student/history/:requestcontrol" exact element={<RequestControlHistory />} />
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )

    return jsx
}
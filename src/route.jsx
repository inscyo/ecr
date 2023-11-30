import { lazy, Suspense, useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/* # shadcn */
import ShadcnAlert from "./shadcn/alert";

import "./styles/index.css";
import "./styles/all.css";
import "./styles/global.css";
import "./styles/uiverse-loader.css";
import DefaultLayout from "./layout/default-layout";
import Authentication from "./secuity/auth/authentication";
import { UiverseLoader } from "./layout/loader";

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

export default function AppRoutes(){
    const { globalalert } = useContext(GlobalErrorContext);
    const { globalloadingprogress, setgloballoadingprogress } = useContext(GlobalLoadingContext);
    /* 
        # register all routes here
        # database routes and static routes
    */
    const jsx = (
        <>
            {globalalert?.error && <ShadcnAlert textColor={globalalert?.color} body={globalalert?.body} /> }
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
                                <Route path="/acr/student/request" exact element={<ACRStudentRequest />} />
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )

    return jsx
}
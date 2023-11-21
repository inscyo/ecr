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
const ECRHomepage = lazy(() => import("./app/registrar/ecr-homepage")); 

export default function AppRoutes(){
    const { globalalert } = useContext(GlobalErrorContext);
    const { globalloadingprogress, setgloballoadingprogress } = useContext(GlobalLoadingContext);
    /* 
        # register all routes here
        # database routes and static routes
    */
    const jsx = (
        <>
            {globalalert?.error && <ShadcnAlert body={globalalert?.body} /> }
            {/* {globalloadingprogress > 0 && <UiverseLoader progress={globalloadingprogress} progressfn={setgloballoadingprogress} color="#ffc53d" />} */}
            <BrowserRouter>
                <Suspense>
                    <Routes>
                        <Route element={<Authentication />}>
                            <Route element={<DefaultLayout />}>
                                <Route path="/" exact element={<DefaultIndex />} />
                                <Route path="/registrar/ecr" exact element={<ECRHomepage />} />
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )

    return jsx
}
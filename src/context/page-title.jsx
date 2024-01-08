import { createContext, useEffect, useState } from "react"

export const PageTitleContext = createContext();

export default function PageTitleContextProvider ({children}) {

    const [title, settitle] = useState(0);

    useEffect(() => {
        document.title = title || 'ACR';
    }, [title]);
    
    return <PageTitleContext.Provider value={{title, settitle}}>{children}</PageTitleContext.Provider>
}
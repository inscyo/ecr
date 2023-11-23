import { createContext, useState } from "react"

export const PageTitleContext = createContext();

export default function PageTitleContextProvider ({children}) {
    const [title, settitle] = useState(0);
    return <PageTitleContext.Provider value={{title, settitle}}>{children}</PageTitleContext.Provider>
}
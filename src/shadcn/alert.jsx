

import { useEffect, useContext } from "react";
import { GlobalErrorContext } from "../context/global-alert";
const ShadcnAlert = ({body, textColor, hasClose = false, closeName = "Close", outsideclose = false}) => {
    const { setglobalalert } = useContext(GlobalErrorContext);
    const backdrop = () => {
        console.log(outsideclose)
        if(!outsideclose) return null;
        setglobalalert({error: false});
    }
    return (
       
    )
  }

  export default ShadcnAlert;
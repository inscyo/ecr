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
import { useEffect } from "react";

const ShadcnAlert = ({body, textColor}) => {
    return (
        <Dialog open asChild modal>
            <DialogContent className="outline-none sm:max-w-md border-none bg-transparent">
                <DialogClose></DialogClose>
                <div className="w-auto flex justify-center" style={{wordBreak: "break-word", color: textColor}}>{body}</div>
            </DialogContent>
        </Dialog>
    )
  }

  export default ShadcnAlert;
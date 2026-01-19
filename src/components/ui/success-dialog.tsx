import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export function SuccessDialog({ isOpen, onClose, title, description }: SuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-none bg-white p-0 overflow-hidden rounded-[2rem]">
        <div className="relative p-8 md:p-12 text-center">
          {/* Animated Background Element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </motion.div>

          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl md:text-4xl font-serif font-medium text-[#1a1a1a]">
              {title}
            </DialogTitle>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
          </DialogHeader>

          <div className="mt-10">
            <Button
              onClick={onClose}
              className="w-full h-14 bg-black text-white hover:bg-green-600 rounded-xl text-xs font-sans font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-black/10"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

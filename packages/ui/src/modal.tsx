import React from "react";
import { X } from "lucide-react";

interface DialogComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // <div className="relative top-0 left-0 inset-0 w-screen h-screen flex items-center justify-center !  z-50 p-4 overflow-y-auto">
    //   <div
    //     className="absolute w-full max-w-md !bg-red-500 z-[999] rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col"
    //     role="dialog"
    //     aria-modal="true"
    //   >
        <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
            <div className="p-6 overflow-y-auto flex-grow">{children}</div>
      </div>
    // </div>
  );
};

export default DialogComponent;

import { Alert, Snackbar } from "@mui/material";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type ToastSeverity = "success" | "info" | "warning" | "error";

type ToastState = {
  open: boolean;
  message: string;
  severity: ToastSeverity;
};

type ToastContextValue = {
  showToast: (message: string, severity?: ToastSeverity) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
  });

  const value = useMemo(
    () => ({
      showToast: (message: string, severity: ToastSeverity = "info") => {
        setToast({ open: true, message, severity });
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        autoHideDuration={3000}
        open={toast.open}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}


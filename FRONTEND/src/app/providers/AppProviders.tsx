import { DeleteConfirmProvider } from "../../components/feedback/DeleteConfirmProvider";
import { ReactNode } from "react";
import { ToastProvider } from "../../components/feedback/ToastProvider";
import { TaskDialogProvider } from "../../features/tasks/components/TaskDialogProvider";
import { ProfileDialogProvider } from "../../features/users/components/ProfileDialogProvider";
import { UserDialogProvider } from "../../features/users/components/UserDialogProvider";
import { NotificationProvider } from "../../features/notifications/components/NotificationProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider>
      <DeleteConfirmProvider>
        <NotificationProvider>
          <TaskDialogProvider>
            <UserDialogProvider>
              <ProfileDialogProvider>{children}</ProfileDialogProvider>
            </UserDialogProvider>
          </TaskDialogProvider>
        </NotificationProvider>
      </DeleteConfirmProvider>
    </ToastProvider>
  );
}

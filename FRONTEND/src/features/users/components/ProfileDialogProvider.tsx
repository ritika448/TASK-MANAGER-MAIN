import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Dialog, IconButton, Paper } from "@mui/material";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useToast } from "../../../components/feedback/ToastProvider";
import { currentUserApi } from "../api/current-user.api";
import { usersApi, type UserLocationLookups, type UserUpsertPayload } from "../api/users.api";
import { ProfileFormContent } from "./ProfileFormContent";

type ProfileDialogContextValue = {
  openProfileDialog: () => void;
  closeProfileDialog: () => void;
};

const ProfileDialogContext = createContext<ProfileDialogContextValue | null>(null);

export function ProfileDialogProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lookups, setLookups] = useState<UserLocationLookups>({
    countries: [],
    states: [],
    cities: [],
  });
  const [userData, setUserData] = useState<UserUpsertPayload | undefined>();
  const [managerInfo, setManagerInfo] = useState<{ name: string; email: string } | null>(null);

  const value = useMemo(
    () => ({
      openProfileDialog: async () => {
        try {
          setLoading(true);
          const [user, locationLookups] = await Promise.all([
            currentUserApi.getModel(),
            usersApi.getLocationLookups(),
          ]);
          setUserData({
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            address: user.address,
            zipCode: user.zipCode,
            country: user.countryId ?? "",
            state: user.stateId ?? "",
            city: user.cityId ?? "",
          });
          setManagerInfo(
            user.managerName
              ? {
                  name: user.managerName,
                  email: user.managerEmail ?? "",
                }
              : null,
          );
          setLookups(locationLookups);
          setOpen(true);
        } catch (error) {
          showToast(error instanceof Error ? error.message : "Unable to open profile.", "error");
        } finally {
          setLoading(false);
        }
      },
      closeProfileDialog: () => setOpen(false),
    }),
    [showToast],
  );

  return (
    <ProfileDialogContext.Provider value={value}>
      {children}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "#ffffff" },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
          <Paper elevation={0} sx={{ borderRadius: 0, bgcolor: "transparent" }}>
            <ProfileFormContent
              compact
              loading={loading}
              initialValues={userData}
              lookups={lookups}
              managerInfo={managerInfo}
              onCancel={() => setOpen(false)}
              onSubmit={async (payload) => {
                try {
                  setLoading(true);
                  await currentUserApi.update(payload);
                  setUserData(payload);
                  showToast("Profile updated successfully.", "success");
                  setOpen(false);
                } catch (error) {
                  showToast(error instanceof Error ? error.message : "Unable to update profile.", "error");
                } finally {
                  setLoading(false);
                }
              }}
            />
          </Paper>
        </Box>
      </Dialog>
    </ProfileDialogContext.Provider>
  );
}

export function useProfileDialog() {
  const context = useContext(ProfileDialogContext);

  if (!context) {
    throw new Error("useProfileDialog must be used inside ProfileDialogProvider");
  }

  return context;
}

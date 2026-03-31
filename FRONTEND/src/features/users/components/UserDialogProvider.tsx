import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Dialog, IconButton } from "@mui/material";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "../../../components/feedback/ToastProvider";
import { usersApi, type UserLocationLookups, type UserRecord, type UserUpsertPayload } from "../api/users.api";
import { UserForm } from "./UserForm";

type UserDialogMode = "create" | "edit";

type UserDialogContextValue = {
  openCreateUserDialog: () => void;
  openEditUserDialog: (userId: string) => void;
  closeUserDialog: () => void;
  refreshKey: number;
};

const emptyLookups: UserLocationLookups = {
  countries: [],
  states: [],
  cities: [],
};

const UserDialogContext = createContext<UserDialogContextValue | null>(null);

export function UserDialogProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [mode, setMode] = useState<UserDialogMode | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [lookups, setLookups] = useState<UserLocationLookups>(emptyLookups);
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadDialogData() {
      if (!mode) {
        return;
      }

      try {
        setLoading(true);
        const [locationLookups, userModel] = await Promise.all([
          usersApi.getLocationLookups(),
          mode === "edit" && selectedUserId ? usersApi.getModel(selectedUserId) : Promise.resolve(null),
        ]);
        setLookups(locationLookups);
        setUser(userModel);
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Unable to open user dialog.", "error");
        setMode(null);
      } finally {
        setLoading(false);
      }
    }

    void loadDialogData();
  }, [mode, selectedUserId, showToast]);

  const value = useMemo(
    () => ({
      openCreateUserDialog: () => {
        setSelectedUserId(null);
        setUser(null);
        setMode("create");
      },
      openEditUserDialog: (userId: string) => {
        setSelectedUserId(userId);
        setMode("edit");
      },
      closeUserDialog: () => setMode(null),
      refreshKey,
    }),
    [refreshKey],
  );

  async function handleSubmit(payload: UserUpsertPayload) {
    if (!payload.firstName.trim() || !payload.lastName.trim() || !payload.emailId.trim()) {
      showToast("First name, last name, and email are required.", "warning");
      return;
    }

    if (payload.updatePassword && !payload.password?.trim()) {
      showToast("Password is required.", "warning");
      return;
    }

    try {
      setSaving(true);
      if (mode === "edit" && selectedUserId) {
        const updatedUser = await usersApi.update(selectedUserId, payload);
        showToast(
          `Employee updated: ${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
          "success",
        );
      } else {
        const createdUser = await usersApi.create(payload);
        showToast(
          `Employee account created for ${createdUser.firstName} ${createdUser.lastName}. Login email: ${createdUser.emailId}`,
          "success",
        );
      }
      setMode(null);
      setRefreshKey((current) => current + 1);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to save user.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <UserDialogContext.Provider value={value}>
      {children}
      <Dialog
        open={mode !== null}
        onClose={() => setMode(null)}
        fullWidth
        maxWidth="md"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxHeight: { xs: "calc(100vh - 24px)", sm: "calc(100vh - 48px)" },
            overflowY: "auto",
            overflowX: "hidden",
            background: "linear-gradient(180deg, rgba(245,239,235,0.88) 0%, #ffffff 100%)",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setMode(null)}
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.92)",
              "&:hover": { bgcolor: "#ffffff" },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
          {mode ? (
            <UserForm
              mode={mode}
              initialValues={
                user
                  ? {
                      firstName: user.firstName,
                      lastName: user.lastName,
                      emailId: user.emailId,
                      address: user.address,
                      zipCode: user.zipCode,
                      country: user.countryId ?? "",
                      state: user.stateId ?? "",
                      city: user.cityId ?? "",
                    }
                  : undefined
              }
              lookups={lookups}
              isSubmitting={loading || saving}
              onSubmit={handleSubmit}
              onCancel={() => setMode(null)}
            />
          ) : null}
        </Box>
      </Dialog>
    </UserDialogContext.Provider>
  );
}

export function useUserDialog() {
  const context = useContext(UserDialogContext);

  if (!context) {
    throw new Error("useUserDialog must be used inside UserDialogProvider");
  }

  return context;
}

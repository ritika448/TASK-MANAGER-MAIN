import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDeleteConfirm } from "../../../components/feedback/DeleteConfirmProvider";
import { useToast } from "../../../components/feedback/ToastProvider";
import { PageHeaderCard } from "../../../components/common/PageHeaderCard";
import { PageReveal } from "../../../components/common/PageReveal";
import { countriesApi, type LookupOption as CountryLookupOption } from "../api/countries.api";
import { statesApi, type StateRecord } from "../api/states.api";
import { StateForm } from "../components/StateForm";
import { StatesTable } from "../components/StatesTable";
import { StatesToolbar } from "../components/StatesToolbar";

export function StatesPage() {
  const { showToast } = useToast();
  const { openDeleteDialog } = useDeleteConfirm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [states, setStates] = useState<StateRecord[]>([]);
  const [countryOptions, setCountryOptions] = useState<CountryLookupOption[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedState, setSelectedState] = useState<StateRecord | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      const [statesResponse, countriesResponse] = await Promise.all([
        statesApi.getList(),
        countriesApi.getLookupList(),
      ]);
      setStates(statesResponse);
      setCountryOptions(countriesResponse);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to load states.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredStates = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return states.filter((state) => {
      const matchesSearch =
        !query ||
        state.stateName.toLowerCase().includes(query) ||
        state.countryName.toLowerCase().includes(query);
      const matchesCountry = !selectedCountryId || state.countryId === selectedCountryId;
      return matchesSearch && matchesCountry;
    });
  }, [searchValue, selectedCountryId, states]);

  return (
    <>
      <Stack spacing={2.5}>
        <PageReveal delay={0}>
          <PageHeaderCard
            title="States"
            description="Manage state-level records with a consistent, softly layered admin layout."
            action={
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setSelectedState(null);
                  setDialogMode("create");
                }}
                sx={{
                  borderRadius: "8px",
                  px: 2,
                  py: 1,
                  background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
                  boxShadow: "0 10px 22px rgba(47, 65, 86, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
                    boxShadow: "0 12px 26px rgba(47, 65, 86, 0.24)",
                  },
                }}
              >
                Add State
              </Button>
            }
          />
        </PageReveal>

        <PageReveal delay={90}>
          <StatesToolbar
            searchValue={searchValue}
            selectedCountryId={selectedCountryId}
            countryOptions={countryOptions}
            onSearchChange={setSearchValue}
            onCountryChange={setSelectedCountryId}
          />
        </PageReveal>
        <PageReveal delay={180}>
          <StatesTable
            states={filteredStates}
            loading={loading}
            onEditState={(state) => {
              setSelectedState(state);
              setDialogMode("edit");
            }}
            onDeleteState={(state) =>
              openDeleteDialog({
                title: "Delete State",
                description: `Are you sure you want to delete ${state.stateName}?`,
                confirmLabel: "Delete State",
                successMessage: `${state.stateName} deleted successfully.`,
                onConfirm: async () => {
                  await statesApi.delete(state.id);
                  await loadData();
                },
              })
            }
          />
        </PageReveal>
      </Stack>

      <StateForm
        open={dialogMode !== null}
        mode={dialogMode ?? "create"}
        initialValue={
          selectedState
            ? {
                stateName: selectedState.stateName,
                countryId: selectedState.countryId ?? "",
              }
            : undefined
        }
        countryOptions={countryOptions}
        isSubmitting={saving}
        onClose={() => setDialogMode(null)}
        onSubmit={async (payload) => {
          try {
            setSaving(true);
            if (!payload.stateName.trim() || !payload.countryId) {
              showToast("State name and country are required.", "warning");
              return;
            }

            if (dialogMode === "edit" && selectedState) {
              await statesApi.update(selectedState.id, payload);
              showToast("State updated successfully.", "success");
            } else {
              await statesApi.create(payload);
              showToast("State created successfully.", "success");
            }

            setDialogMode(null);
            await loadData();
          } catch (error) {
            showToast(error instanceof Error ? error.message : "Unable to save state.", "error");
          } finally {
            setSaving(false);
          }
        }}
      />
    </>
  );
}

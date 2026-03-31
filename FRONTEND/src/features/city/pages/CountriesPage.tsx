import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDeleteConfirm } from "../../../components/feedback/DeleteConfirmProvider";
import { useToast } from "../../../components/feedback/ToastProvider";
import { PageHeaderCard } from "../../../components/common/PageHeaderCard";
import { PageReveal } from "../../../components/common/PageReveal";
import { countriesApi, type CountryRecord } from "../api/countries.api";
import { CountriesTable } from "../components/CountriesTable";
import { CountriesToolbar } from "../components/CountriesToolbar";
import { CountryForm } from "../components/CountryForm";

export function CountriesPage() {
  const { showToast } = useToast();
  const { openDeleteDialog } = useDeleteConfirm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryRecord | null>(null);

  async function loadCountries() {
    try {
      setLoading(true);
      setCountries(await countriesApi.getList());
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to load countries.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return countries;
    }
    return countries.filter((country) => country.countryName.toLowerCase().includes(query));
  }, [countries, searchValue]);

  return (
    <>
      <Stack spacing={2.5}>
        <PageReveal delay={0}>
          <PageHeaderCard
            title="Countries"
            description="Keep country records tidy with the same soft gradient treatment used across the dashboard."
            action={
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setSelectedCountry(null);
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
                Add Country
              </Button>
            }
          />
        </PageReveal>

        <PageReveal delay={90}>
          <CountriesToolbar searchValue={searchValue} onSearchChange={setSearchValue} />
        </PageReveal>
        <PageReveal delay={180}>
          <CountriesTable
            countries={filteredCountries}
            loading={loading}
            onEditCountry={(country) => {
              setSelectedCountry(country);
              setDialogMode("edit");
            }}
            onDeleteCountry={(country) =>
              openDeleteDialog({
                title: "Delete Country",
                description: `Are you sure you want to delete ${country.countryName}?`,
                confirmLabel: "Delete Country",
                successMessage: `${country.countryName} deleted successfully.`,
                onConfirm: async () => {
                  await countriesApi.delete(country.id);
                  await loadCountries();
                },
              })
            }
          />
        </PageReveal>
      </Stack>

      <CountryForm
        open={dialogMode !== null}
        mode={dialogMode ?? "create"}
        initialValue={selectedCountry?.countryName}
        isSubmitting={saving}
        onClose={() => setDialogMode(null)}
        onSubmit={async (payload) => {
          try {
            setSaving(true);
            if (!payload.countryName.trim()) {
              showToast("Country name is required.", "warning");
              return;
            }

            if (dialogMode === "edit" && selectedCountry) {
              await countriesApi.update(selectedCountry.id, payload);
              showToast("Country updated successfully.", "success");
            } else {
              await countriesApi.create(payload);
              showToast("Country created successfully.", "success");
            }

            setDialogMode(null);
            await loadCountries();
          } catch (error) {
            showToast(error instanceof Error ? error.message : "Unable to save country.", "error");
          } finally {
            setSaving(false);
          }
        }}
      />
    </>
  );
}

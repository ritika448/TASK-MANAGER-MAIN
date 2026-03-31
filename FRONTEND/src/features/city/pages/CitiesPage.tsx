import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDeleteConfirm } from "../../../components/feedback/DeleteConfirmProvider";
import { useToast } from "../../../components/feedback/ToastProvider";
import { PageHeaderCard } from "../../../components/common/PageHeaderCard";
import { PageReveal } from "../../../components/common/PageReveal";
import { citiesApi, type CityRecord } from "../api/cities.api";
import { countriesApi, type LookupOption as CountryLookupOption } from "../api/countries.api";
import { statesApi, type LookupOption as StateLookupOption } from "../api/states.api";
import { CitiesTable } from "../components/CitiesTable";
import { CitiesToolbar } from "../components/CitiesToolbar";
import { CityForm } from "../components/CityForm";

export function CitiesPage() {
  const { showToast } = useToast();
  const { openDeleteDialog } = useDeleteConfirm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [countryOptions, setCountryOptions] = useState<CountryLookupOption[]>([]);
  const [stateOptions, setStateOptions] = useState<StateLookupOption[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityRecord | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      const [citiesResponse, countriesResponse, statesResponse] = await Promise.all([
        citiesApi.getList(),
        countriesApi.getLookupList(),
        statesApi.getLookupList(),
      ]);
      setCities(citiesResponse);
      setCountryOptions(countriesResponse);
      setStateOptions(statesResponse);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to load cities.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredStateOptions = useMemo(() => {
    if (!selectedCountryId) {
      return stateOptions;
    }
    return stateOptions.filter((state) => state.countryId === selectedCountryId);
  }, [selectedCountryId, stateOptions]);

  const filteredCities = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return cities.filter((city) => {
      const matchesSearch =
        !query ||
        city.cityName.toLowerCase().includes(query) ||
        city.stateName.toLowerCase().includes(query) ||
        city.countryName.toLowerCase().includes(query);
      const matchesState = !selectedStateId || city.stateId === selectedStateId;
      const matchesCountry = !selectedCountryId || city.countryId === selectedCountryId;
      return matchesSearch && matchesState && matchesCountry;
    });
  }, [cities, searchValue, selectedCountryId, selectedStateId]);

  return (
    <>
      <Stack spacing={2.5}>
        <PageReveal delay={0}>
          <PageHeaderCard
            title="Cities"
            description="Organize city records, zip codes, and location data with a more polished management view."
            action={
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => {
                  setSelectedCity(null);
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
                Add City
              </Button>
            }
          />
        </PageReveal>

        <PageReveal delay={90}>
          <CitiesToolbar
            searchValue={searchValue}
            selectedStateId={selectedStateId}
            selectedCountryId={selectedCountryId}
            stateOptions={filteredStateOptions}
            countryOptions={countryOptions}
            onSearchChange={setSearchValue}
            onStateChange={setSelectedStateId}
            onCountryChange={(value) => {
              setSelectedCountryId(value);
              setSelectedStateId("");
            }}
          />
        </PageReveal>
        <PageReveal delay={180}>
          <CitiesTable
            cities={filteredCities}
            loading={loading}
            onEditCity={(city) => {
              setSelectedCity(city);
              setDialogMode("edit");
            }}
            onDeleteCity={(city) =>
              openDeleteDialog({
                title: "Delete City",
                description: `Are you sure you want to delete ${city.cityName}?`,
                confirmLabel: "Delete City",
                successMessage: `${city.cityName} deleted successfully.`,
                onConfirm: async () => {
                  await citiesApi.delete(city.id);
                  await loadData();
                },
              })
            }
          />
        </PageReveal>
      </Stack>

      <CityForm
        open={dialogMode !== null}
        mode={dialogMode ?? "create"}
        initialValue={
          selectedCity
            ? {
                cityName: selectedCity.cityName,
                stateId: selectedCity.stateId ?? "",
                zipCodes: selectedCity.zipCodes,
              }
            : undefined
        }
        stateOptions={stateOptions}
        isSubmitting={saving}
        onClose={() => setDialogMode(null)}
        onSubmit={async (payload) => {
          try {
            setSaving(true);
            if (!payload.cityName.trim() || !payload.stateId) {
              showToast("City name and state are required.", "warning");
              return;
            }

            if (dialogMode === "edit" && selectedCity) {
              await citiesApi.update(selectedCity.id, payload);
              showToast("City updated successfully.", "success");
            } else {
              await citiesApi.create(payload);
              showToast("City created successfully.", "success");
            }

            setDialogMode(null);
            await loadData();
          } catch (error) {
            showToast(error instanceof Error ? error.message : "Unable to save city.", "error");
          } finally {
            setSaving(false);
          }
        }}
      />
    </>
  );
}

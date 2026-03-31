import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../../components/feedback/ToastProvider";
import { PageHeaderCard } from "../../../components/common/PageHeaderCard";
import { PageReveal } from "../../../components/common/PageReveal";
import { usersApi, type UserRecord } from "../api/users.api";
import { UsersFilters } from "../components/UsersFilters";
import { useUserDialog } from "../components/UserDialogProvider";
import { UsersTable } from "../components/UsersTable";

export function UsersListPage() {
  const { showToast } = useToast();
  const { openCreateUserDialog, refreshKey } = useUserDialog();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [locationLookups, setLocationLookups] = useState({
    countries: [] as Array<{ id: string; name: string }>,
    states: [] as Array<{ id: string; name: string; countryId: string }>,
    cities: [] as Array<{ id: string; name: string; stateId: string }>,
  });

  async function loadUsers() {
    try {
      setLoading(true);
      const [usersResponse, lookupsResponse] = await Promise.all([
        usersApi.getList(),
        usersApi.getLocationLookups(),
      ]);
      setUsers(usersResponse);
      setLocationLookups(lookupsResponse);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to load users.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, [refreshKey]);

  const filteredStateOptions = useMemo(
    () =>
      selectedCountryId
        ? locationLookups.states.filter((state) => state.countryId === selectedCountryId)
        : locationLookups.states,
    [locationLookups.states, selectedCountryId],
  );

  const filteredCityOptions = useMemo(
    () =>
      selectedStateId
        ? locationLookups.cities.filter((city) => city.stateId === selectedStateId)
        : locationLookups.cities,
    [locationLookups.cities, selectedStateId],
  );

  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.trim().toLowerCase();
      const locationText = [user.city, user.state, user.country].join(" ").toLowerCase();
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        user.emailId.toLowerCase().includes(query) ||
        locationText.includes(query);
      const matchesCountry = !selectedCountryId || user.countryId === selectedCountryId;
      const matchesState = !selectedStateId || user.stateId === selectedStateId;
      const matchesCity = !selectedCityId || user.cityId === selectedCityId;
      return matchesSearch && matchesCountry && matchesState && matchesCity;
    });
  }, [searchValue, selectedCountryId, selectedStateId, selectedCityId, users]);

  return (
    <Stack spacing={2.5}>
      <PageReveal delay={0}>
        <PageHeaderCard
          title="Users"
          description="Manage your team members and user accounts with a cleaner workspace overview."
          action={
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={openCreateUserDialog}
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
              Add Employee
            </Button>
          }
        />
      </PageReveal>

      <PageReveal delay={90}>
        <Stack
          direction={{ xs: "column", xl: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", xl: "center" }}
          spacing={1.5}
        >
          <UsersFilters
            searchValue={searchValue}
            cityOptions={filteredCityOptions}
            stateOptions={filteredStateOptions.map((state) => ({ id: state.id, name: state.name }))}
            countryOptions={locationLookups.countries}
            selectedCityId={selectedCityId}
            selectedStateId={selectedStateId}
            selectedCountryId={selectedCountryId}
            onSearchChange={setSearchValue}
            onCityChange={setSelectedCityId}
            onStateChange={(value) => {
              setSelectedStateId(value);
              setSelectedCityId("");
            }}
            onCountryChange={(value) => {
              setSelectedCountryId(value);
              setSelectedStateId("");
              setSelectedCityId("");
            }}
          />
          <Button
            variant="text"
            onClick={() => {
              setSearchValue("");
              setSelectedCityId("");
              setSelectedStateId("");
              setSelectedCountryId("");
            }}
            sx={{
              alignSelf: { xs: "flex-start", xl: "center" },
              textTransform: "none",
              color: "#2F4156",
              fontWeight: 700,
            }}
          >
            Clear filters
          </Button>
        </Stack>
      </PageReveal>
      <PageReveal delay={180}>
        <UsersTable
          users={filteredUsers}
          loading={loading}
          onDeleteUser={async (user) => {
            try {
              await usersApi.delete(user.id);
              setUsers((current) => current.filter((currentUser) => currentUser.id !== user.id));
            } catch (error) {
              showToast(error instanceof Error ? error.message : "Unable to delete user.", "error");
            }
          }}
        />
      </PageReveal>
    </Stack>
  );
}

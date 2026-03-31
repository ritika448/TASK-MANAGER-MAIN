import { apiClient } from "../../../services/api/client";

export type StateRecord = {
  id: string;
  stateName: string;
  countryId: string | null;
  countryName: string;
};

export type LookupOption = {
  id: string;
  name: string;
  countryId: string | null;
};

export const statesApi = {
  getList: () => apiClient.get<StateRecord[]>("CityManagement/State/GetList"),
  getLookupList: (countryId?: string) =>
    apiClient.get<LookupOption[]>(
      `CityManagement/State/GetLookupList${countryId ? `?countryId=${encodeURIComponent(countryId)}` : ""}`,
    ),
  create: (body: { stateName: string; countryId: string }) =>
    apiClient.post<StateRecord>("CityManagement/State/Insert", body),
  update: (id: string, body: { stateName: string; countryId: string }) =>
    apiClient.put<StateRecord>(`CityManagement/State/Update/${id}`, body),
  delete: (id: string) => apiClient.delete<{ message: string }>(`CityManagement/State/Delete/${id}`),
};

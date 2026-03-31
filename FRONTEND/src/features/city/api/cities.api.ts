import { apiClient } from "../../../services/api/client";

export type CityRecord = {
  id: string;
  cityName: string;
  stateId: string | null;
  stateName: string;
  countryId: string | null;
  countryName: string;
  zipCodes: string[];
};

export type LookupOption = {
  id: string;
  name: string;
  stateId: string | null;
  countryId: string | null;
};

export const citiesApi = {
  getList: () => apiClient.get<CityRecord[]>("CityManagement/City/GetList"),
  getLookupList: (stateId?: string) =>
    apiClient.get<LookupOption[]>(
      `CityManagement/City/GetLookupList${stateId ? `?stateId=${encodeURIComponent(stateId)}` : ""}`,
    ),
  create: (body: { cityName: string; stateId: string; zipCodes: string[] }) =>
    apiClient.post<CityRecord>("CityManagement/City/Insert", body),
  update: (id: string, body: { cityName: string; stateId: string; zipCodes: string[] }) =>
    apiClient.put<CityRecord>(`CityManagement/City/Update/${id}`, body),
  delete: (id: string) => apiClient.delete<{ message: string }>(`CityManagement/City/Delete/${id}`),
};

import { apiClient } from "../../../services/api/client";

export type CountryRecord = {
  id: string;
  countryName: string;
};

type CountryApiResponse = {
  id?: string;
  _id?: string;
  countryName: string;
};

export type LookupOption = {
  id: string;
  name: string;
};

function normalizeCountry(country: CountryApiResponse): CountryRecord {
  return {
    id: country.id ?? country._id ?? "",
    countryName: country.countryName,
  };
}

export const countriesApi = {
  getList: async () => {
    const response = await apiClient.get<CountryApiResponse[]>("CityManagement/Country/GetList");
    return response.map(normalizeCountry);
  },
  getLookupList: () => apiClient.get<LookupOption[]>("CityManagement/Country/GetLookupList"),
  create: (body: { countryName: string }) =>
    apiClient.post<CountryApiResponse>("CityManagement/Country/Insert", body).then(normalizeCountry),
  update: (id: string, body: { countryName: string }) =>
    apiClient
      .put<CountryApiResponse>(`CityManagement/Country/Update/${id}`, body)
      .then(normalizeCountry),
  delete: (id: string) => apiClient.delete<{ message: string }>(`CityManagement/Country/Delete/${id}`),
};

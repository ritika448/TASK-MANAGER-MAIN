import { apiClient } from "../../../services/api/client";

export const countryApi = {
  getList: () => apiClient.get("CityManagement/Country/GetList"),
  getLookupList: () => apiClient.get("CityManagement/Country/GetLookupList"),
};


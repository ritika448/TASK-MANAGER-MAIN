import { apiClient } from "../../../services/api/client";

export const cityApi = {
  getList: () => apiClient.get("CityManagement/City/GetList"),
  getLookupList: () => apiClient.get("CityManagement/City/GetLookupList"),
};


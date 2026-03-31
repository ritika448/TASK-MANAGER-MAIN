import { apiClient } from "../../../services/api/client";

export const stateApi = {
  getList: () => apiClient.get("CityManagement/State/GetList"),
  getLookupList: () => apiClient.get("CityManagement/State/GetLookupList"),
};


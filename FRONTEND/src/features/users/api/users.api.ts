import { apiClient } from "../../../services/api/client";

export type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  address: string;
  zipCode: string;
  countryId: string | null;
  country: string;
  stateId: string | null;
  state: string;
  cityId: string | null;
  city: string;
  role: "manager" | "employee";
  managerId?: string | null;
  managerName?: string;
  managerEmail?: string;
  profileImage: string;
};

export type UserLookup = {
  id: string;
  name: string;
};

export type UserLocationLookups = {
  countries: Array<{ id: string; name: string }>;
  states: Array<{ id: string; name: string; countryId: string }>;
  cities: Array<{ id: string; name: string; stateId: string }>;
};

export type UserUpsertPayload = {
  firstName: string;
  lastName: string;
  emailId: string;
  address: string;
  zipCode: string;
  country: string;
  state: string;
  city: string;
  role?: "manager" | "employee";
  password?: string;
  updatePassword?: boolean;
};

export const usersApi = {
  getList: () => apiClient.get<UserRecord[]>("UserManagement/User/GetList"),
  getLookupList: () => apiClient.get<UserLookup[]>("UserManagement/User/GetLookupList"),
  getModel: (id: string) => apiClient.get<UserRecord>(`UserManagement/User/GetModel/${id}`),
  getLocationLookups: () => apiClient.get<UserLocationLookups>("UserManagement/User/LocationLookups"),
  create: (body: UserUpsertPayload) => apiClient.post<UserRecord>("UserManagement/User/Insert", body),
  update: (id: string, body: UserUpsertPayload) =>
    apiClient.put<UserRecord>(`UserManagement/User/Update/${id}`, body),
  delete: (id: string) => apiClient.delete<{ message: string }>(`UserManagement/User/Delete/${id}`),
};

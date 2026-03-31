import { apiClient } from "../../../services/api/client";
import {
  AuthLocationLookups,
  AuthMessageResponse,
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  SignupRequest,
} from "../types/auth.types";

export const authApi = {
  login: (payload: LoginRequest) =>
    apiClient.post<AuthResponse>("UserManagement/Authentication/Login", payload),
  signup: (payload: SignupRequest) =>
    apiClient.post<AuthMessageResponse>("UserManagement/Authentication/Signup", payload),
  forgotPassword: (payload: ForgotPasswordRequest) =>
    apiClient.post<AuthMessageResponse>("UserManagement/Authentication/ForgotPassword", payload),
  getLocationLookups: () =>
    apiClient.get<AuthLocationLookups>("UserManagement/Authentication/LocationLookups"),
};

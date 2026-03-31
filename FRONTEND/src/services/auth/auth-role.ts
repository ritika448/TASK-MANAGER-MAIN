import { authStorage } from "./auth-storage";

export function getCurrentUserRole() {
  return authStorage.getUser()?.role ?? "manager";
}

export function isEmployeeUser() {
  return getCurrentUserRole() === "employee";
}

export function isManagerUser() {
  return getCurrentUserRole() === "manager";
}

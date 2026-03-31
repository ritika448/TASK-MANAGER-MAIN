export type LoginRequest = {
  emailId: string;
  password: string;
  rememberMe: boolean;
};

export type SignupRequest = {
  firstName: string;
  lastName: string;
  emailId: string;
  country: string;
  state: string;
  city: string;
  role: "manager" | "employee";
  password: string;
};

export type ForgotPasswordRequest = {
  emailId: string;
};

export type AuthLocationLookups = {
  countries: Array<{ id: string; name: string }>;
  states: Array<{ id: string; name: string; countryId: string }>;
  cities: Array<{ id: string; name: string; stateId: string }>;
};

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  role: "manager" | "employee";
};

export type AuthResponse = {
  authToken: string;
  user: AuthUser;
};

export type AuthMessageResponse = {
  message: string;
};

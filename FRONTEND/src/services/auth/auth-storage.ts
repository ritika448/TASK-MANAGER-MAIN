const TOKEN_KEY = "task-manager-token";
const USER_KEY = "task-manager-user";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY),
  getUser: () => {
    const rawUser = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as {
        id: string;
        firstName: string;
        lastName: string;
        emailId: string;
        role: "manager" | "employee";
      };
    } catch {
      return null;
    }
  },
  setToken: (token: string, rememberMe: boolean) => {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event("auth-changed"));
      return;
    }

    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event("auth-changed"));
  },
  setUser: (
    user: {
      id: string;
      firstName: string;
      lastName: string;
      emailId: string;
      role: "manager" | "employee";
    },
    rememberMe: boolean,
  ) => {
    const serializedUser = JSON.stringify(user);

    if (rememberMe) {
      localStorage.setItem(USER_KEY, serializedUser);
      sessionStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("auth-changed"));
      return;
    }

    sessionStorage.setItem(USER_KEY, serializedUser);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth-changed"));
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth-changed"));
  },
};

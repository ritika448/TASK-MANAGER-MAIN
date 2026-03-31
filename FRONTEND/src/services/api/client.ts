const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5002";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const storedToken = localStorage.getItem("task-manager-token") ?? sessionStorage.getItem("task-manager-token");

  const response = await fetch(`${API_BASE_URL}/${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const data = (await response.json()) as { message?: string };
      if (data.message) {
        message = data.message;
      }
    } catch {
      // Ignore JSON parse errors and fall back to status-based message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};

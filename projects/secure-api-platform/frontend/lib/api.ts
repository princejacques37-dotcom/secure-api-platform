export type User = { id: number; email: string; role: string; created_at: string };
export type Task = { id: number; owner_id: number; title: string; description: string; created_at: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

function csrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.split("; ").find((part) => part.startsWith("csrf_token="));
  return match?.split("=").slice(1).join("=");
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof body?.detail === "string" ? body.detail : `Request failed (${response.status})`;
    throw new Error(detail);
  }
  return body as T;
}

export async function seedCsrf() {
  const response = await fetch(`${API_URL}/auth/csrf`, { credentials: "include", cache: "no-store" });
  return parseResponse<{ status: string }>(response);
}

function csrfHeaders(): Record<string, string> {
  const token = csrfToken();
  return token ? { "X-CSRF-Token": token } : {};
}

export async function register(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...csrfHeaders() },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse<User>(response);
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...csrfHeaders() },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse<User>(response);
}

export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST", credentials: "include", headers: csrfHeaders(),
  });
  return parseResponse<{ status: string }>(response);
}

export async function me() {
  const response = await fetch(`${API_URL}/me`, { credentials: "include", cache: "no-store" });
  return parseResponse<User>(response);
}

export async function listTasks() {
  const response = await fetch(`${API_URL}/tasks`, { credentials: "include", cache: "no-store" });
  return parseResponse<Task[]>(response);
}

export async function createTask(title: string, description: string) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...csrfHeaders() },
    body: JSON.stringify({ title, description }),
  });
  return parseResponse<Task>(response);
}

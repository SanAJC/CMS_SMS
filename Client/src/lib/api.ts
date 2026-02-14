const API_BASE_URL = "http://localhost:8000";

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      throw new Error("No autorizado");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Error desconocido" }));
      throw new Error(error.detail || `Error ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("access_token", data.access_token);
    return data;
  }

  async register(email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password}),
    });
  }

  // Contacts
  async getContacts(page = 1, limit = 10) {
    // Backend does not expect page/limit — call plain /contacts
    const res = await this.request<any>(`/contacts`);
    try {
      // eslint-disable-next-line no-console
      console.debug("api.getContacts response:", res);
    } catch {}

    const normalizeItem = (item: any) => ({
      id: item.id ?? item.ID ?? item.uuid ?? "",
      name: item.name ?? item.nombre ?? item.nombre_completo ?? item.full_name ?? "",
      phone: item.phone ?? item.telefono ?? item.telefono_celular ?? item.mobile ?? "",
      email: item.email ?? item.correo ?? item.mail ?? undefined,
      created_at: item.created_at ?? item.fecha ?? item.createdAt ?? "",
    });

    // If backend returns an array of contacts
    if (Array.isArray(res)) {
      const items = res.map(normalizeItem);
      return items;
    }

    // If backend returns an envelope with items
    const body = res && res.data ? res.data : res;
    const rawItems = (body && body.items) ?? [];
    const items = Array.isArray(rawItems) ? rawItems.map(normalizeItem) : [];
    return {
      ...(body || {}),
      items,
      total: (body && (body.total ?? items.length)) ?? items.length,
      pages: (body && (body.pages ?? 1)) ?? 1,
    };
  }

  async getContact(id: string) {
    return this.request<Contact>(`/contacts/${id}`);
  }

  async uploadContacts(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<{ uploaded: number }>("/contacts/upload", {
      method: "POST",
      body: formData,
    });
  }

  // Messages
  async getMessages(page = 1, limit = 10, status?: string) {
    let url = `/messages?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return this.request<{ items: Message[]; total: number; page: number; pages: number }>(url);
  }

  async sendMessage(content: string, contact_id: string) {
    return this.request<Message>("/messages", {
      method: "POST",
      body: JSON.stringify({ content, contact_id }),
    });
  }

  logout() {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }
}

export const api = new ApiService(API_BASE_URL);

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
}

export interface Message {
  id: string;
  content: string;
  contact_id: string;
  contact_name?: string;
  contact_phone?: string;
  status: "pending" | "sent" | "failed";
  created_at: string;
}

export type RequestConfig<TData = unknown> = {
  url?: string;
  method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
  params?: Record<string, string | number | boolean | undefined>;
  data?: TData;
  responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream";
  signal?: AbortSignal;
  headers?: HeadersInit;
};

export type ResponseConfig<T = unknown> = {
  data: T;
  status: number;
  statusText: string;
};

export type ResponseErrorConfig<T = unknown> = ResponseConfig<T>;

export type Client = <T, E = unknown, D = unknown>(
  config: RequestConfig<D>
) => Promise<ResponseConfig<T>>;

function getBaseURL(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "");
  }
  return "http://localhost:8080/api/v1";
}

function buildUrl(url: string, params?: Record<string, string | number | boolean | undefined>): string {
  if (!params || Object.keys(params).length === 0) return url;
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") search.set(k, String(v));
  }
  const q = search.toString();
  return q ? `${url}${url.includes("?") ? "&" : "?"}${q}` : url;
}

const defaultClient: Client = async <T>(config: RequestConfig) => {
  const base = getBaseURL();
  const path = config.url ?? "";
  const fullUrl = buildUrl(
    path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`,
    config.params
  );
  const res = await fetch(fullUrl, {
    method: config.method,
    headers: config.headers ?? { "Content-Type": "application/json" },
    signal: config.signal,
    body: config.data != null ? JSON.stringify(config.data) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as T;
  if (!res.ok) {
    const err = new Error(res.statusText || String(res.status)) as Error & { status: number; data: T };
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return { data, status: res.status, statusText: res.statusText };
};

export default defaultClient;

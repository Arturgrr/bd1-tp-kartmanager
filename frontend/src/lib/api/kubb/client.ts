export type RequestConfig<TData = unknown> = {
  url?: string;
  method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
  params?: object;
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

const defaultClient: Client = async <T>(config: RequestConfig) => {
  const base = getBaseURL();
  const url = config.url ? `${base}${config.url.startsWith("/") ? config.url : `/${config.url}`}` : base;
  const res = await fetch(url, {
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

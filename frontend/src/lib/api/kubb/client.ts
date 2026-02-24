import axios, { type AxiosError, type AxiosResponse } from "axios"

export type RequestConfig<TData = unknown> = {
  url?: string
  method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE"
  params?: unknown
  data?: TData
  responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream"
  signal?: AbortSignal
  headers?: Record<string, string>
}

export type ResponseConfig<TData = unknown> = {
  data: TData
  status: number
  statusText: string
  headers?: AxiosResponse["headers"]
}

export type ResponseErrorConfig<TError = unknown> = {
  data: TError
  status: number
  statusText: string
}

const baseURL =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SERVER_URL
    ? process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "") + "/api/v1"
    : "http://localhost:3333/api/v1"

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export type Client = <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
) => Promise<ResponseConfig<TData>>

export const client = async <TData, TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  try {
    const response = await axiosInstance.request<TData, AxiosResponse<TData>>({
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
      responseType: config.responseType ?? "json",
      signal: config.signal,
      headers: config.headers,
    })
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }
  } catch (err) {
    const axiosError = err as AxiosError<TError>
    const data = axiosError.response?.data ?? (axiosError.message as TError)
    const status = axiosError.response?.status ?? 0
    const statusText = axiosError.response?.statusText ?? axiosError.message
    throw {
      data,
      status,
      statusText,
    } satisfies ResponseErrorConfig<TError>
  }
}

export default client

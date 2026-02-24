import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetCorridasCompletedQueryResponse,
  GetCorridasCompleted500,
} from "../types/GetCorridasCompleted";

function getGetCorridasCompletedUrl() {
  const res = { method: "GET", url: `/corridas/completed` as const };
  return res;
}

/**
 * @summary Lista corridas finalizadas
 * {@link /corridas/completed}
 */
export async function getCorridasCompleted(
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetCorridasCompletedQueryResponse,
    ResponseErrorConfig<GetCorridasCompleted500>,
    unknown
  >({
    method: "GET",
    url: getGetCorridasCompletedUrl().url.toString(),
    ...requestConfig,
  });
  return res.data;
}

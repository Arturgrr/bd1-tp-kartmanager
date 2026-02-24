import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetCorridasUpcomingQueryResponse,
  GetCorridasUpcoming500,
} from "../types/GetCorridasUpcoming";

function getGetCorridasUpcomingUrl() {
  const res = { method: "GET", url: `/corridas/upcoming` as const };
  return res;
}

/**
 * @summary Lista corridas futuras
 * {@link /corridas/upcoming}
 */
export async function getCorridasUpcoming(
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetCorridasUpcomingQueryResponse,
    ResponseErrorConfig<GetCorridasUpcoming500>,
    unknown
  >({
    method: "GET",
    url: getGetCorridasUpcomingUrl().url.toString(),
    ...requestConfig,
  });
  return res.data;
}

import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetPilotosQueryResponse,
  GetPilotos500,
} from "../types/GetPilotos";

function getGetPilotosUrl() {
  const res = { method: "GET", url: `/pilotos` as const };
  return res;
}

/**
 * @summary Lista todos os pilotos
 * {@link /pilotos}
 */
export async function getPilotos(
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetPilotosQueryResponse,
    ResponseErrorConfig<GetPilotos500>,
    unknown
  >({
    method: "GET",
    url: getGetPilotosUrl().url.toString(),
    ...requestConfig,
  });
  return res.data;
}

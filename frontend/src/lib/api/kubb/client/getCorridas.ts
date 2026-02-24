import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetCorridasQueryResponse,
  GetCorridas500,
} from "../types/GetCorridas";

function getGetCorridasUrl() {
  const res = { method: "GET", url: `/corridas` as const };
  return res;
}

/**
 * @summary Lista todas as corridas
 * {@link /corridas}
 */
export async function getCorridas(
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetCorridasQueryResponse,
    ResponseErrorConfig<GetCorridas500>,
    unknown
  >({
    method: "GET",
    url: getGetCorridasUrl().url.toString(),
    ...requestConfig,
  });
  return res.data;
}

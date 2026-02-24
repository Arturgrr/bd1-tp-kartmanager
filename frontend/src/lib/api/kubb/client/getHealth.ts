import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type { GetHealthQueryResponse } from "../types/GetHealth";

function getGetHealthUrl() {
  const res = { method: "GET", url: `/health` as const };
  return res;
}

/**
 * @summary Health check
 * {@link /health}
 */
export async function getHealth(
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetHealthQueryResponse,
    ResponseErrorConfig<Error>,
    unknown
  >({ method: "GET", url: getGetHealthUrl().url.toString(), ...requestConfig });
  return res.data;
}

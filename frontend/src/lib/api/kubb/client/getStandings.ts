import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetStandingsQueryResponse,
  GetStandingsQueryParams,
  GetStandings400,
  GetStandings500,
} from "../types/GetStandings";

function getGetStandingsUrl() {
  const res = { method: "GET", url: `/standings` as const };
  return res;
}

/**
 * @summary Lista standings por categoria e temporada
 * {@link /standings}
 */
export async function getStandings(
  params: GetStandingsQueryParams,
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetStandingsQueryResponse,
    ResponseErrorConfig<GetStandings400 | GetStandings500>,
    unknown
  >({
    method: "GET",
    url: getGetStandingsUrl().url.toString(),
    params,
    ...requestConfig,
  });
  return res.data;
}

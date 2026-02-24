import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetAdminSummaryQueryResponse,
  GetAdminSummary401,
  GetAdminSummary500,
} from "../types/GetAdminSummary";

function getGetAdminSummaryUrl() {
  const res = { method: "GET", url: `/admin/summary` as const };
  return res;
}

/**
 * @summary Resumo do dashboard admin (contagens)
 * {@link /admin/summary}
 */
export async function getAdminSummary(
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetAdminSummaryQueryResponse,
    ResponseErrorConfig<GetAdminSummary401 | GetAdminSummary500>,
    unknown
  >({
    method: "GET",
    url: getGetAdminSummaryUrl().url.toString(),
    ...requestConfig,
  });
  return res.data;
}

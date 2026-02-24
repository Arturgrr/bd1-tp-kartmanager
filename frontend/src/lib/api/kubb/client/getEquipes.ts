import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetEquipesQueryResponse,
  GetEquipes500,
} from "../types/GetEquipes";

function getGetEquipesUrl() {
  const res = { method: "GET", url: `/equipes` as const };
  return res;
}

/**
 * @summary Lista todas as equipes
 * {@link /equipes}
 */
export async function getEquipes(
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetEquipesQueryResponse,
    ResponseErrorConfig<GetEquipes500>,
    unknown
  >({
    method: "GET",
    url: getGetEquipesUrl().url.toString(),
    ...requestConfig,
  });
  return res.data;
}

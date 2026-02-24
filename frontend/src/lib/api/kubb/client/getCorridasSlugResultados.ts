import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetCorridasSlugResultadosQueryResponse,
  GetCorridasSlugResultadosPathParams,
  GetCorridasSlugResultados400,
  GetCorridasSlugResultados500,
} from "../types/GetCorridasSlugResultados";

function getGetCorridasSlugResultadosUrl(
  slug: GetCorridasSlugResultadosPathParams["slug"],
) {
  const res = { method: "GET", url: `/corridas/${slug}/resultados` as const };
  return res;
}

/**
 * @summary Lista resultados de uma corrida
 * {@link /corridas/:slug/resultados}
 */
export async function getCorridasSlugResultados(
  slug: GetCorridasSlugResultadosPathParams["slug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetCorridasSlugResultadosQueryResponse,
    ResponseErrorConfig<
      GetCorridasSlugResultados400 | GetCorridasSlugResultados500
    >,
    unknown
  >({
    method: "GET",
    url: getGetCorridasSlugResultadosUrl(slug).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetCorridasSlugResultadosPosicaoQueryResponse,
  GetCorridasSlugResultadosPosicaoPathParams,
  GetCorridasSlugResultadosPosicao400,
  GetCorridasSlugResultadosPosicao404,
  GetCorridasSlugResultadosPosicao500,
} from "../types/GetCorridasSlugResultadosPosicao";

function getGetCorridasSlugResultadosPosicaoUrl(
  slug: GetCorridasSlugResultadosPosicaoPathParams["slug"],
  posicao: GetCorridasSlugResultadosPosicaoPathParams["posicao"],
) {
  const res = {
    method: "GET",
    url: `/corridas/${slug}/resultados/${posicao}` as const,
  };
  return res;
}

/**
 * @summary Busca resultado de uma corrida por posição
 * {@link /corridas/:slug/resultados/:posicao}
 */
export async function getCorridasSlugResultadosPosicao(
  slug: GetCorridasSlugResultadosPosicaoPathParams["slug"],
  posicao: GetCorridasSlugResultadosPosicaoPathParams["posicao"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetCorridasSlugResultadosPosicaoQueryResponse,
    ResponseErrorConfig<
      | GetCorridasSlugResultadosPosicao400
      | GetCorridasSlugResultadosPosicao404
      | GetCorridasSlugResultadosPosicao500
    >,
    unknown
  >({
    method: "GET",
    url: getGetCorridasSlugResultadosPosicaoUrl(slug, posicao).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

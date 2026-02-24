import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PutAdminCorridasSlugResultadosPosicaoMutationRequest,
  PutAdminCorridasSlugResultadosPosicaoMutationResponse,
  PutAdminCorridasSlugResultadosPosicaoPathParams,
  PutAdminCorridasSlugResultadosPosicao400,
  PutAdminCorridasSlugResultadosPosicao401,
  PutAdminCorridasSlugResultadosPosicao404,
  PutAdminCorridasSlugResultadosPosicao422,
  PutAdminCorridasSlugResultadosPosicao500,
} from "../types/PutAdminCorridasSlugResultadosPosicao";

function getPutAdminCorridasSlugResultadosPosicaoUrl(
  slug: PutAdminCorridasSlugResultadosPosicaoPathParams["slug"],
  posicao: PutAdminCorridasSlugResultadosPosicaoPathParams["posicao"],
) {
  const res = {
    method: "PUT",
    url: `/admin/corridas/${slug}/resultados/${posicao}` as const,
  };
  return res;
}

/**
 * @summary Atualiza resultado de corrida (admin)
 * {@link /admin/corridas/:slug/resultados/:posicao}
 */
export async function putAdminCorridasSlugResultadosPosicao(
  slug: PutAdminCorridasSlugResultadosPosicaoPathParams["slug"],
  posicao: PutAdminCorridasSlugResultadosPosicaoPathParams["posicao"],
  data: PutAdminCorridasSlugResultadosPosicaoMutationRequest,
  config: Partial<
    RequestConfig<PutAdminCorridasSlugResultadosPosicaoMutationRequest>
  > & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PutAdminCorridasSlugResultadosPosicaoMutationResponse,
    ResponseErrorConfig<
      | PutAdminCorridasSlugResultadosPosicao400
      | PutAdminCorridasSlugResultadosPosicao401
      | PutAdminCorridasSlugResultadosPosicao404
      | PutAdminCorridasSlugResultadosPosicao422
      | PutAdminCorridasSlugResultadosPosicao500
    >,
    PutAdminCorridasSlugResultadosPosicaoMutationRequest
  >({
    method: "PUT",
    url: getPutAdminCorridasSlugResultadosPosicaoUrl(
      slug,
      posicao,
    ).url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

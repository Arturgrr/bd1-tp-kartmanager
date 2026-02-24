import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  DeleteAdminCorridasSlugResultadosPosicaoMutationResponse,
  DeleteAdminCorridasSlugResultadosPosicaoPathParams,
  DeleteAdminCorridasSlugResultadosPosicao401,
  DeleteAdminCorridasSlugResultadosPosicao404,
  DeleteAdminCorridasSlugResultadosPosicao500,
} from "../types/DeleteAdminCorridasSlugResultadosPosicao";

function getDeleteAdminCorridasSlugResultadosPosicaoUrl(
  slug: DeleteAdminCorridasSlugResultadosPosicaoPathParams["slug"],
  posicao: DeleteAdminCorridasSlugResultadosPosicaoPathParams["posicao"],
) {
  const res = {
    method: "DELETE",
    url: `/admin/corridas/${slug}/resultados/${posicao}` as const,
  };
  return res;
}

/**
 * @summary Remove resultado de corrida (admin)
 * {@link /admin/corridas/:slug/resultados/:posicao}
 */
export async function deleteAdminCorridasSlugResultadosPosicao(
  slug: DeleteAdminCorridasSlugResultadosPosicaoPathParams["slug"],
  posicao: DeleteAdminCorridasSlugResultadosPosicaoPathParams["posicao"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    DeleteAdminCorridasSlugResultadosPosicaoMutationResponse,
    ResponseErrorConfig<
      | DeleteAdminCorridasSlugResultadosPosicao401
      | DeleteAdminCorridasSlugResultadosPosicao404
      | DeleteAdminCorridasSlugResultadosPosicao500
    >,
    unknown
  >({
    method: "DELETE",
    url: getDeleteAdminCorridasSlugResultadosPosicaoUrl(
      slug,
      posicao,
    ).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

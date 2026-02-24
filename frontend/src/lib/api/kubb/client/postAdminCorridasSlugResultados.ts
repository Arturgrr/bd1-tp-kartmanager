import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PostAdminCorridasSlugResultadosMutationRequest,
  PostAdminCorridasSlugResultadosMutationResponse,
  PostAdminCorridasSlugResultadosPathParams,
  PostAdminCorridasSlugResultados400,
  PostAdminCorridasSlugResultados401,
  PostAdminCorridasSlugResultados409,
  PostAdminCorridasSlugResultados422,
  PostAdminCorridasSlugResultados500,
} from "../types/PostAdminCorridasSlugResultados";

function getPostAdminCorridasSlugResultadosUrl(
  slug: PostAdminCorridasSlugResultadosPathParams["slug"],
) {
  const res = {
    method: "POST",
    url: `/admin/corridas/${slug}/resultados` as const,
  };
  return res;
}

/**
 * @summary Cria resultado de corrida (admin)
 * {@link /admin/corridas/:slug/resultados}
 */
export async function postAdminCorridasSlugResultados(
  slug: PostAdminCorridasSlugResultadosPathParams["slug"],
  data: PostAdminCorridasSlugResultadosMutationRequest,
  config: Partial<
    RequestConfig<PostAdminCorridasSlugResultadosMutationRequest>
  > & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PostAdminCorridasSlugResultadosMutationResponse,
    ResponseErrorConfig<
      | PostAdminCorridasSlugResultados400
      | PostAdminCorridasSlugResultados401
      | PostAdminCorridasSlugResultados409
      | PostAdminCorridasSlugResultados422
      | PostAdminCorridasSlugResultados500
    >,
    PostAdminCorridasSlugResultadosMutationRequest
  >({
    method: "POST",
    url: getPostAdminCorridasSlugResultadosUrl(slug).url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

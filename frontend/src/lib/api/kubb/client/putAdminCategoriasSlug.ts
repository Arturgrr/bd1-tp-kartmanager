import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PutAdminCategoriasSlugMutationRequest,
  PutAdminCategoriasSlugMutationResponse,
  PutAdminCategoriasSlugPathParams,
  PutAdminCategoriasSlug400,
  PutAdminCategoriasSlug401,
  PutAdminCategoriasSlug404,
  PutAdminCategoriasSlug422,
  PutAdminCategoriasSlug500,
} from "../types/PutAdminCategoriasSlug";

function getPutAdminCategoriasSlugUrl(
  slug: PutAdminCategoriasSlugPathParams["slug"],
) {
  const res = { method: "PUT", url: `/admin/categorias/${slug}` as const };
  return res;
}

/**
 * @summary Atualiza categoria (admin)
 * {@link /admin/categorias/:slug}
 */
export async function putAdminCategoriasSlug(
  slug: PutAdminCategoriasSlugPathParams["slug"],
  data: PutAdminCategoriasSlugMutationRequest,
  config: Partial<RequestConfig<PutAdminCategoriasSlugMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PutAdminCategoriasSlugMutationResponse,
    ResponseErrorConfig<
      | PutAdminCategoriasSlug400
      | PutAdminCategoriasSlug401
      | PutAdminCategoriasSlug404
      | PutAdminCategoriasSlug422
      | PutAdminCategoriasSlug500
    >,
    PutAdminCategoriasSlugMutationRequest
  >({
    method: "PUT",
    url: getPutAdminCategoriasSlugUrl(slug).url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

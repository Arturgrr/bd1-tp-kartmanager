import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  DeleteAdminCategoriasSlugMutationResponse,
  DeleteAdminCategoriasSlugPathParams,
  DeleteAdminCategoriasSlug401,
  DeleteAdminCategoriasSlug404,
  DeleteAdminCategoriasSlug500,
} from "../types/DeleteAdminCategoriasSlug";

function getDeleteAdminCategoriasSlugUrl(
  slug: DeleteAdminCategoriasSlugPathParams["slug"],
) {
  const res = { method: "DELETE", url: `/admin/categorias/${slug}` as const };
  return res;
}

/**
 * @summary Remove categoria (admin)
 * {@link /admin/categorias/:slug}
 */
export async function deleteAdminCategoriasSlug(
  slug: DeleteAdminCategoriasSlugPathParams["slug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    DeleteAdminCategoriasSlugMutationResponse,
    ResponseErrorConfig<
      | DeleteAdminCategoriasSlug401
      | DeleteAdminCategoriasSlug404
      | DeleteAdminCategoriasSlug500
    >,
    unknown
  >({
    method: "DELETE",
    url: getDeleteAdminCategoriasSlugUrl(slug).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

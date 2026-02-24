import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  DeleteAdminEquipesSlugMutationResponse,
  DeleteAdminEquipesSlugPathParams,
  DeleteAdminEquipesSlug401,
  DeleteAdminEquipesSlug404,
  DeleteAdminEquipesSlug500,
} from "../types/DeleteAdminEquipesSlug";

function getDeleteAdminEquipesSlugUrl(
  slug: DeleteAdminEquipesSlugPathParams["slug"],
) {
  const res = { method: "DELETE", url: `/admin/equipes/${slug}` as const };
  return res;
}

/**
 * @summary Remove equipe (admin)
 * {@link /admin/equipes/:slug}
 */
export async function deleteAdminEquipesSlug(
  slug: DeleteAdminEquipesSlugPathParams["slug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    DeleteAdminEquipesSlugMutationResponse,
    ResponseErrorConfig<
      | DeleteAdminEquipesSlug401
      | DeleteAdminEquipesSlug404
      | DeleteAdminEquipesSlug500
    >,
    unknown
  >({
    method: "DELETE",
    url: getDeleteAdminEquipesSlugUrl(slug).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

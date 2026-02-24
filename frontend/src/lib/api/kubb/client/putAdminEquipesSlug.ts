import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PutAdminEquipesSlugMutationRequest,
  PutAdminEquipesSlugMutationResponse,
  PutAdminEquipesSlugPathParams,
  PutAdminEquipesSlug400,
  PutAdminEquipesSlug401,
  PutAdminEquipesSlug404,
  PutAdminEquipesSlug422,
  PutAdminEquipesSlug500,
} from "../types/PutAdminEquipesSlug";

function getPutAdminEquipesSlugUrl(
  slug: PutAdminEquipesSlugPathParams["slug"],
) {
  const res = { method: "PUT", url: `/admin/equipes/${slug}` as const };
  return res;
}

/**
 * @summary Atualiza equipe (admin)
 * {@link /admin/equipes/:slug}
 */
export async function putAdminEquipesSlug(
  slug: PutAdminEquipesSlugPathParams["slug"],
  data: PutAdminEquipesSlugMutationRequest,
  config: Partial<RequestConfig<PutAdminEquipesSlugMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PutAdminEquipesSlugMutationResponse,
    ResponseErrorConfig<
      | PutAdminEquipesSlug400
      | PutAdminEquipesSlug401
      | PutAdminEquipesSlug404
      | PutAdminEquipesSlug422
      | PutAdminEquipesSlug500
    >,
    PutAdminEquipesSlugMutationRequest
  >({
    method: "PUT",
    url: getPutAdminEquipesSlugUrl(slug).url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

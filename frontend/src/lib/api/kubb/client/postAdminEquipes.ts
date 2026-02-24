import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PostAdminEquipesMutationRequest,
  PostAdminEquipesMutationResponse,
  PostAdminEquipes400,
  PostAdminEquipes401,
  PostAdminEquipes409,
  PostAdminEquipes422,
  PostAdminEquipes500,
} from "../types/PostAdminEquipes";

function getPostAdminEquipesUrl() {
  const res = { method: "POST", url: `/admin/equipes` as const };
  return res;
}

/**
 * @summary Cria equipe (admin)
 * {@link /admin/equipes}
 */
export async function postAdminEquipes(
  data: PostAdminEquipesMutationRequest,
  config: Partial<RequestConfig<PostAdminEquipesMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PostAdminEquipesMutationResponse,
    ResponseErrorConfig<
      | PostAdminEquipes400
      | PostAdminEquipes401
      | PostAdminEquipes409
      | PostAdminEquipes422
      | PostAdminEquipes500
    >,
    PostAdminEquipesMutationRequest
  >({
    method: "POST",
    url: getPostAdminEquipesUrl().url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

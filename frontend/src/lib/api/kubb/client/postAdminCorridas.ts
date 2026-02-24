import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PostAdminCorridasMutationRequest,
  PostAdminCorridasMutationResponse,
  PostAdminCorridas400,
  PostAdminCorridas401,
  PostAdminCorridas409,
  PostAdminCorridas422,
  PostAdminCorridas500,
} from "../types/PostAdminCorridas";

function getPostAdminCorridasUrl() {
  const res = { method: "POST", url: `/admin/corridas` as const };
  return res;
}

/**
 * @summary Cria corrida (admin)
 * {@link /admin/corridas}
 */
export async function postAdminCorridas(
  data: PostAdminCorridasMutationRequest,
  config: Partial<RequestConfig<PostAdminCorridasMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PostAdminCorridasMutationResponse,
    ResponseErrorConfig<
      | PostAdminCorridas400
      | PostAdminCorridas401
      | PostAdminCorridas409
      | PostAdminCorridas422
      | PostAdminCorridas500
    >,
    PostAdminCorridasMutationRequest
  >({
    method: "POST",
    url: getPostAdminCorridasUrl().url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

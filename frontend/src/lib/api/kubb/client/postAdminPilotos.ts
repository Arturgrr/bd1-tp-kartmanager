import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PostAdminPilotosMutationRequest,
  PostAdminPilotosMutationResponse,
  PostAdminPilotos400,
  PostAdminPilotos401,
  PostAdminPilotos409,
  PostAdminPilotos422,
  PostAdminPilotos500,
} from "../types/PostAdminPilotos";

function getPostAdminPilotosUrl() {
  const res = { method: "POST", url: `/admin/pilotos` as const };
  return res;
}

/**
 * @summary Cria piloto (admin)
 * {@link /admin/pilotos}
 */
export async function postAdminPilotos(
  data: PostAdminPilotosMutationRequest,
  config: Partial<RequestConfig<PostAdminPilotosMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PostAdminPilotosMutationResponse,
    ResponseErrorConfig<
      | PostAdminPilotos400
      | PostAdminPilotos401
      | PostAdminPilotos409
      | PostAdminPilotos422
      | PostAdminPilotos500
    >,
    PostAdminPilotosMutationRequest
  >({
    method: "POST",
    url: getPostAdminPilotosUrl().url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

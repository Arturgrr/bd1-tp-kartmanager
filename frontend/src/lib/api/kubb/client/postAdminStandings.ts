import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PostAdminStandingsMutationRequest,
  PostAdminStandingsMutationResponse,
  PostAdminStandings400,
  PostAdminStandings401,
  PostAdminStandings409,
  PostAdminStandings422,
  PostAdminStandings500,
} from "../types/PostAdminStandings";

function getPostAdminStandingsUrl() {
  const res = { method: "POST", url: `/admin/standings` as const };
  return res;
}

/**
 * @summary Cria entrada piloto temporada (admin)
 * {@link /admin/standings}
 */
export async function postAdminStandings(
  data: PostAdminStandingsMutationRequest,
  config: Partial<RequestConfig<PostAdminStandingsMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PostAdminStandingsMutationResponse,
    ResponseErrorConfig<
      | PostAdminStandings400
      | PostAdminStandings401
      | PostAdminStandings409
      | PostAdminStandings422
      | PostAdminStandings500
    >,
    PostAdminStandingsMutationRequest
  >({
    method: "POST",
    url: getPostAdminStandingsUrl().url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

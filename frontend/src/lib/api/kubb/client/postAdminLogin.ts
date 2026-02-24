import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PostAdminLoginMutationRequest,
  PostAdminLoginMutationResponse,
  PostAdminLogin400,
  PostAdminLogin422,
  PostAdminLogin500,
} from "../types/PostAdminLogin";

function getPostAdminLoginUrl() {
  const res = { method: "POST", url: `/admin/login` as const };
  return res;
}

/**
 * @summary Login admin
 * {@link /admin/login}
 */
export async function postAdminLogin(
  data: PostAdminLoginMutationRequest,
  config: Partial<RequestConfig<PostAdminLoginMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PostAdminLoginMutationResponse,
    ResponseErrorConfig<
      PostAdminLogin400 | PostAdminLogin422 | PostAdminLogin500
    >,
    PostAdminLoginMutationRequest
  >({
    method: "POST",
    url: getPostAdminLoginUrl().url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

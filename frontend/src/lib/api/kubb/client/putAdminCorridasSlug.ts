import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PutAdminCorridasSlugMutationRequest,
  PutAdminCorridasSlugMutationResponse,
  PutAdminCorridasSlugPathParams,
  PutAdminCorridasSlug400,
  PutAdminCorridasSlug401,
  PutAdminCorridasSlug404,
  PutAdminCorridasSlug422,
  PutAdminCorridasSlug500,
} from "../types/PutAdminCorridasSlug";

function getPutAdminCorridasSlugUrl(
  slug: PutAdminCorridasSlugPathParams["slug"],
) {
  const res = { method: "PUT", url: `/admin/corridas/${slug}` as const };
  return res;
}

/**
 * @summary Atualiza corrida (admin)
 * {@link /admin/corridas/:slug}
 */
export async function putAdminCorridasSlug(
  slug: PutAdminCorridasSlugPathParams["slug"],
  data: PutAdminCorridasSlugMutationRequest,
  config: Partial<RequestConfig<PutAdminCorridasSlugMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PutAdminCorridasSlugMutationResponse,
    ResponseErrorConfig<
      | PutAdminCorridasSlug400
      | PutAdminCorridasSlug401
      | PutAdminCorridasSlug404
      | PutAdminCorridasSlug422
      | PutAdminCorridasSlug500
    >,
    PutAdminCorridasSlugMutationRequest
  >({
    method: "PUT",
    url: getPutAdminCorridasSlugUrl(slug).url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

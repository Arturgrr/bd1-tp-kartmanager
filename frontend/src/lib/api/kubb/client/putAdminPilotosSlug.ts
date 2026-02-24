import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PutAdminPilotosSlugMutationRequest,
  PutAdminPilotosSlugMutationResponse,
  PutAdminPilotosSlugPathParams,
  PutAdminPilotosSlug400,
  PutAdminPilotosSlug401,
  PutAdminPilotosSlug404,
  PutAdminPilotosSlug422,
  PutAdminPilotosSlug500,
} from "../types/PutAdminPilotosSlug";

function getPutAdminPilotosSlugUrl(
  slug: PutAdminPilotosSlugPathParams["slug"],
) {
  const res = { method: "PUT", url: `/admin/pilotos/${slug}` as const };
  return res;
}

/**
 * @summary Atualiza piloto (admin)
 * {@link /admin/pilotos/:slug}
 */
export async function putAdminPilotosSlug(
  slug: PutAdminPilotosSlugPathParams["slug"],
  data: PutAdminPilotosSlugMutationRequest,
  config: Partial<RequestConfig<PutAdminPilotosSlugMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PutAdminPilotosSlugMutationResponse,
    ResponseErrorConfig<
      | PutAdminPilotosSlug400
      | PutAdminPilotosSlug401
      | PutAdminPilotosSlug404
      | PutAdminPilotosSlug422
      | PutAdminPilotosSlug500
    >,
    PutAdminPilotosSlugMutationRequest
  >({
    method: "PUT",
    url: getPutAdminPilotosSlugUrl(slug).url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  DeleteAdminPilotosSlugMutationResponse,
  DeleteAdminPilotosSlugPathParams,
  DeleteAdminPilotosSlug401,
  DeleteAdminPilotosSlug404,
  DeleteAdminPilotosSlug500,
} from "../types/DeleteAdminPilotosSlug";

function getDeleteAdminPilotosSlugUrl(
  slug: DeleteAdminPilotosSlugPathParams["slug"],
) {
  const res = { method: "DELETE", url: `/admin/pilotos/${slug}` as const };
  return res;
}

/**
 * @summary Remove piloto (admin)
 * {@link /admin/pilotos/:slug}
 */
export async function deleteAdminPilotosSlug(
  slug: DeleteAdminPilotosSlugPathParams["slug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    DeleteAdminPilotosSlugMutationResponse,
    ResponseErrorConfig<
      | DeleteAdminPilotosSlug401
      | DeleteAdminPilotosSlug404
      | DeleteAdminPilotosSlug500
    >,
    unknown
  >({
    method: "DELETE",
    url: getDeleteAdminPilotosSlugUrl(slug).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

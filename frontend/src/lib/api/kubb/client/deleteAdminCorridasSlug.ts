import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  DeleteAdminCorridasSlugMutationResponse,
  DeleteAdminCorridasSlugPathParams,
  DeleteAdminCorridasSlug401,
  DeleteAdminCorridasSlug404,
  DeleteAdminCorridasSlug500,
} from "../types/DeleteAdminCorridasSlug";

function getDeleteAdminCorridasSlugUrl(
  slug: DeleteAdminCorridasSlugPathParams["slug"],
) {
  const res = { method: "DELETE", url: `/admin/corridas/${slug}` as const };
  return res;
}

/**
 * @summary Remove corrida (admin)
 * {@link /admin/corridas/:slug}
 */
export async function deleteAdminCorridasSlug(
  slug: DeleteAdminCorridasSlugPathParams["slug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    DeleteAdminCorridasSlugMutationResponse,
    ResponseErrorConfig<
      | DeleteAdminCorridasSlug401
      | DeleteAdminCorridasSlug404
      | DeleteAdminCorridasSlug500
    >,
    unknown
  >({
    method: "DELETE",
    url: getDeleteAdminCorridasSlugUrl(slug).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetCorridasSlugQueryResponse,
  GetCorridasSlugPathParams,
  GetCorridasSlug400,
  GetCorridasSlug404,
  GetCorridasSlug500,
} from "../types/GetCorridasSlug";

function getGetCorridasSlugUrl(slug: GetCorridasSlugPathParams["slug"]) {
  const res = { method: "GET", url: `/corridas/${slug}` as const };
  return res;
}

/**
 * @summary Busca corrida por slug
 * {@link /corridas/:slug}
 */
export async function getCorridasSlug(
  slug: GetCorridasSlugPathParams["slug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetCorridasSlugQueryResponse,
    ResponseErrorConfig<
      GetCorridasSlug400 | GetCorridasSlug404 | GetCorridasSlug500
    >,
    unknown
  >({
    method: "GET",
    url: getGetCorridasSlugUrl(slug).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

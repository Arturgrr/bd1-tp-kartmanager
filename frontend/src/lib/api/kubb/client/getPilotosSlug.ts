import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetPilotosSlugQueryResponse,
  GetPilotosSlugPathParams,
  GetPilotosSlug400,
  GetPilotosSlug404,
  GetPilotosSlug500,
} from "../types/GetPilotosSlug";

function getGetPilotosSlugUrl(slug: GetPilotosSlugPathParams["slug"]) {
  const res = { method: "GET", url: `/pilotos/${slug}` as const };
  return res;
}

/**
 * @summary Busca piloto por slug
 * {@link /pilotos/:slug}
 */
export async function getPilotosSlug(
  slug: GetPilotosSlugPathParams["slug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetPilotosSlugQueryResponse,
    ResponseErrorConfig<
      GetPilotosSlug400 | GetPilotosSlug404 | GetPilotosSlug500
    >,
    unknown
  >({
    method: "GET",
    url: getGetPilotosSlugUrl(slug).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetCategoriasSlugQueryResponse,
  GetCategoriasSlugPathParams,
  GetCategoriasSlug400,
  GetCategoriasSlug404,
  GetCategoriasSlug500,
} from "../types/GetCategoriasSlug";

function getGetCategoriasSlugUrl(slug: GetCategoriasSlugPathParams["slug"]) {
  const res = { method: "GET", url: `/categorias/${slug}` as const };
  return res;
}

/**
 * @summary Busca categoria por slug
 * {@link /categorias/:slug}
 */
export async function getCategoriasSlug(
  slug: GetCategoriasSlugPathParams["slug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetCategoriasSlugQueryResponse,
    ResponseErrorConfig<
      GetCategoriasSlug400 | GetCategoriasSlug404 | GetCategoriasSlug500
    >,
    unknown
  >({
    method: "GET",
    url: getGetCategoriasSlugUrl(slug).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

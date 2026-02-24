import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetEquipesSlugQueryResponse,
  GetEquipesSlugPathParams,
  GetEquipesSlug400,
  GetEquipesSlug404,
  GetEquipesSlug500,
} from "../types/GetEquipesSlug";

function getGetEquipesSlugUrl(slug: GetEquipesSlugPathParams["slug"]) {
  const res = { method: "GET", url: `/equipes/${slug}` as const };
  return res;
}

/**
 * @summary Busca equipe por slug
 * {@link /equipes/:slug}
 */
export async function getEquipesSlug(
  slug: GetEquipesSlugPathParams["slug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetEquipesSlugQueryResponse,
    ResponseErrorConfig<
      GetEquipesSlug400 | GetEquipesSlug404 | GetEquipesSlug500
    >,
    unknown
  >({
    method: "GET",
    url: getGetEquipesSlugUrl(slug).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  GetCategoriasQueryResponse,
  GetCategorias500,
} from "../types/GetCategorias";

function getGetCategoriasUrl() {
  const res = { method: "GET", url: `/categorias` as const };
  return res;
}

/**
 * @summary Lista todas as categorias
 * {@link /categorias}
 */
export async function getCategorias(
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    GetCategoriasQueryResponse,
    ResponseErrorConfig<GetCategorias500>,
    unknown
  >({
    method: "GET",
    url: getGetCategoriasUrl().url.toString(),
    ...requestConfig,
  });
  return res.data;
}

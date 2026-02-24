import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PostAdminCategoriasMutationRequest,
  PostAdminCategoriasMutationResponse,
  PostAdminCategorias400,
  PostAdminCategorias401,
  PostAdminCategorias409,
  PostAdminCategorias422,
  PostAdminCategorias500,
} from "../types/PostAdminCategorias";

function getPostAdminCategoriasUrl() {
  const res = { method: "POST", url: `/admin/categorias` as const };
  return res;
}

/**
 * @summary Cria categoria (admin)
 * {@link /admin/categorias}
 */
export async function postAdminCategorias(
  data: PostAdminCategoriasMutationRequest,
  config: Partial<RequestConfig<PostAdminCategoriasMutationRequest>> & {
    client?: Client;
  } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PostAdminCategoriasMutationResponse,
    ResponseErrorConfig<
      | PostAdminCategorias400
      | PostAdminCategorias401
      | PostAdminCategorias409
      | PostAdminCategorias422
      | PostAdminCategorias500
    >,
    PostAdminCategoriasMutationRequest
  >({
    method: "POST",
    url: getPostAdminCategoriasUrl().url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

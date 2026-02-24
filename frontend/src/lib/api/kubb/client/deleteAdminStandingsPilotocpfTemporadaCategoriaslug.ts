import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  DeleteAdminStandingsPilotocpfTemporadaCategoriaslugMutationResponse,
  DeleteAdminStandingsPilotocpfTemporadaCategoriaslugPathParams,
  DeleteAdminStandingsPilotocpfTemporadaCategoriaslug401,
  DeleteAdminStandingsPilotocpfTemporadaCategoriaslug404,
  DeleteAdminStandingsPilotocpfTemporadaCategoriaslug500,
} from "../types/DeleteAdminStandingsPilotocpfTemporadaCategoriaslug";

function getDeleteAdminStandingsPilotocpfTemporadaCategoriaslugUrl(
  pilotoCpf: DeleteAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["pilotoCpf"],
  temporada: DeleteAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["temporada"],
  categoriaSlug: DeleteAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["categoriaSlug"],
) {
  const res = {
    method: "DELETE",
    url: `/admin/standings/${pilotoCpf}/${temporada}/${categoriaSlug}` as const,
  };
  return res;
}

/**
 * @summary Remove piloto temporada (admin)
 * {@link /admin/standings/:pilotoCpf/:temporada/:categoriaSlug}
 */
export async function deleteAdminStandingsPilotocpfTemporadaCategoriaslug(
  pilotoCpf: DeleteAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["pilotoCpf"],
  temporada: DeleteAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["temporada"],
  categoriaSlug: DeleteAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["categoriaSlug"],
  config: Partial<RequestConfig> & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const res = await request<
    DeleteAdminStandingsPilotocpfTemporadaCategoriaslugMutationResponse,
    ResponseErrorConfig<
      | DeleteAdminStandingsPilotocpfTemporadaCategoriaslug401
      | DeleteAdminStandingsPilotocpfTemporadaCategoriaslug404
      | DeleteAdminStandingsPilotocpfTemporadaCategoriaslug500
    >,
    unknown
  >({
    method: "DELETE",
    url: getDeleteAdminStandingsPilotocpfTemporadaCategoriaslugUrl(
      pilotoCpf,
      temporada,
      categoriaSlug,
    ).url.toString(),
    ...requestConfig,
  });
  return res.data;
}

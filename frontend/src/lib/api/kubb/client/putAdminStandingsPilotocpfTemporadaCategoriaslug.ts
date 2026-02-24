import fetch from "../client";
import type { Client, RequestConfig, ResponseErrorConfig } from "../client";
import type {
  PutAdminStandingsPilotocpfTemporadaCategoriaslugMutationRequest,
  PutAdminStandingsPilotocpfTemporadaCategoriaslugMutationResponse,
  PutAdminStandingsPilotocpfTemporadaCategoriaslugPathParams,
  PutAdminStandingsPilotocpfTemporadaCategoriaslug400,
  PutAdminStandingsPilotocpfTemporadaCategoriaslug401,
  PutAdminStandingsPilotocpfTemporadaCategoriaslug404,
  PutAdminStandingsPilotocpfTemporadaCategoriaslug422,
  PutAdminStandingsPilotocpfTemporadaCategoriaslug500,
} from "../types/PutAdminStandingsPilotocpfTemporadaCategoriaslug";

function getPutAdminStandingsPilotocpfTemporadaCategoriaslugUrl(
  pilotoCpf: PutAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["pilotoCpf"],
  temporada: PutAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["temporada"],
  categoriaSlug: PutAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["categoriaSlug"],
) {
  const res = {
    method: "PUT",
    url: `/admin/standings/${pilotoCpf}/${temporada}/${categoriaSlug}` as const,
  };
  return res;
}

/**
 * @summary Atualiza piloto temporada (admin)
 * {@link /admin/standings/:pilotoCpf/:temporada/:categoriaSlug}
 */
export async function putAdminStandingsPilotocpfTemporadaCategoriaslug(
  pilotoCpf: PutAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["pilotoCpf"],
  temporada: PutAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["temporada"],
  categoriaSlug: PutAdminStandingsPilotocpfTemporadaCategoriaslugPathParams["categoriaSlug"],
  data: PutAdminStandingsPilotocpfTemporadaCategoriaslugMutationRequest,
  config: Partial<
    RequestConfig<PutAdminStandingsPilotocpfTemporadaCategoriaslugMutationRequest>
  > & { client?: Client } = {},
) {
  const { client: request = fetch, ...requestConfig } = config;

  const requestData = data;

  const res = await request<
    PutAdminStandingsPilotocpfTemporadaCategoriaslugMutationResponse,
    ResponseErrorConfig<
      | PutAdminStandingsPilotocpfTemporadaCategoriaslug400
      | PutAdminStandingsPilotocpfTemporadaCategoriaslug401
      | PutAdminStandingsPilotocpfTemporadaCategoriaslug404
      | PutAdminStandingsPilotocpfTemporadaCategoriaslug422
      | PutAdminStandingsPilotocpfTemporadaCategoriaslug500
    >,
    PutAdminStandingsPilotocpfTemporadaCategoriaslugMutationRequest
  >({
    method: "PUT",
    url: getPutAdminStandingsPilotocpfTemporadaCategoriaslugUrl(
      pilotoCpf,
      temporada,
      categoriaSlug,
    ).url.toString(),
    data: requestData,
    ...requestConfig,
  });
  return res.data;
}

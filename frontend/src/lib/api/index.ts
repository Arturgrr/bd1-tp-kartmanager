import { getCategorias as kubbGetCategorias } from "./kubb/client/getCategorias";
import { getCategoriasSlug as kubbGetCategoriasSlug } from "./kubb/client/getCategoriasSlug";
import { getCorridas as kubbGetCorridas } from "./kubb/client/getCorridas";
import { getCorridasCompleted as kubbGetCorridasCompleted } from "./kubb/client/getCorridasCompleted";
import { getCorridasSlug as kubbGetCorridasSlug } from "./kubb/client/getCorridasSlug";
import { getCorridasSlugResultados as kubbGetCorridasSlugResultados } from "./kubb/client/getCorridasSlugResultados";
import { getCorridasUpcoming as kubbGetCorridasUpcoming } from "./kubb/client/getCorridasUpcoming";
import { getEquipes as kubbGetEquipes } from "./kubb/client/getEquipes";
import { getEquipesSlug as kubbGetEquipesSlug } from "./kubb/client/getEquipesSlug";
import { getPilotos as kubbGetPilotos } from "./kubb/client/getPilotos";
import { getPilotosSlug as kubbGetPilotosSlug } from "./kubb/client/getPilotosSlug";
import { getStandings as kubbGetStandings } from "./kubb/client/getStandings";
import type {
  CategoriaFromAPI,
  CorridaFromAPI,
  EquipeFromAPI,
  PilotoFromAPI,
  RaceResultFromAPI,
  StandingFromAPI,
} from "./types";

export type {
  CategoriaFromAPI,
  CorridaFromAPI,
  EquipeFromAPI,
  PilotoFromAPI,
  RaceResultFromAPI,
  StandingFromAPI,
};

export async function fetchCategorias(): Promise<CategoriaFromAPI[]> {
  const data = await kubbGetCategorias();
  return data as CategoriaFromAPI[];
}

export async function fetchCategoriaBySlug(slug: string): Promise<CategoriaFromAPI | null> {
  try {
    const data = await kubbGetCategoriasSlug(slug);
    return data as CategoriaFromAPI;
  } catch {
    return null;
  }
}

export async function fetchPilotos(): Promise<PilotoFromAPI[]> {
  const data = await kubbGetPilotos();
  return data as PilotoFromAPI[];
}

export async function fetchPilotoBySlug(slug: string): Promise<PilotoFromAPI | null> {
  try {
    const data = await kubbGetPilotosSlug(slug);
    return data as PilotoFromAPI;
  } catch {
    return null;
  }
}

export async function fetchEquipes(): Promise<EquipeFromAPI[]> {
  const data = await kubbGetEquipes();
  return data as EquipeFromAPI[];
}

export async function fetchEquipeBySlug(slug: string): Promise<EquipeFromAPI | null> {
  try {
    const data = await kubbGetEquipesSlug(slug);
    return data as EquipeFromAPI;
  } catch {
    return null;
  }
}

export async function fetchCorridas(): Promise<CorridaFromAPI[]> {
  const data = await kubbGetCorridas();
  return data as CorridaFromAPI[];
}

export async function fetchCorridasCompleted(): Promise<CorridaFromAPI[]> {
  const data = await kubbGetCorridasCompleted();
  return data as CorridaFromAPI[];
}

export async function fetchCorridasUpcoming(): Promise<CorridaFromAPI[]> {
  const data = await kubbGetCorridasUpcoming();
  return data as CorridaFromAPI[];
}

export async function fetchCorridaBySlug(slug: string): Promise<CorridaFromAPI | null> {
  try {
    const data = await kubbGetCorridasSlug(slug);
    return data as CorridaFromAPI;
  } catch {
    return null;
  }
}

export async function fetchResultadosByCorrida(slug: string): Promise<RaceResultFromAPI[]> {
  const data = await kubbGetCorridasSlugResultados(slug);
  return (data ?? []) as RaceResultFromAPI[];
}

export async function fetchStandings(categoriaSlug: string, temporada: string): Promise<StandingFromAPI[]> {
  const data = await kubbGetStandings(
    { categoriaSlug, temporada } as { categoriaSlug: string; temporada: string },
    {}
  );
  return (data ?? []) as StandingFromAPI[];
}

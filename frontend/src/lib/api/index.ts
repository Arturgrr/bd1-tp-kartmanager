import {
  getCategorias as kubbGetCategorias,
  getCategoriasSlug as kubbGetCategoriasSlug,
  getPilotos as kubbGetPilotos,
  getPilotosSlug as kubbGetPilotosSlug,
} from "@/lib/api/kubb";
import type { CategoriaFromAPI, PilotoFromAPI } from "@/lib/api/types";

export type { CategoriaFromAPI, PilotoFromAPI };

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

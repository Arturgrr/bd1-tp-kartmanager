export type CategoriaFromAPI = {
  id: string;
  name: string;
  slug: string;
  minAge: number;
  maxAge: number;
  description: string;
};

export type PilotoFromAPI = {
  cpf: string;
  name: string;
  slug: string;
  number: number;
  birthYear: number;
  city: string;
  teamSlug: string;
  categorySlug: string;
};

export type EquipeFromAPI = {
  id: string;
  name: string;
  slug: string;
  color: string;
  foundedYear: number;
  city: string;
};

export type CorridaFromAPI = {
  id: string;
  name: string;
  slug: string;
  date: string;
  track: string;
  categoryId: string;
  season: string;
  status: string;
};

export type RaceResultFromAPI = {
  position: number;
  pilotId: string;
  teamId: string;
  bestLap: string;
  totalTime: string;
  points: number;
};

export type StandingFromAPI = {
  pilotId: string;
  season: string;
  categoryId: string;
  teamId: string;
  points: number;
  wins: number;
  podiums: number;
  bestLap: string;
  position: number;
};

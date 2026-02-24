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

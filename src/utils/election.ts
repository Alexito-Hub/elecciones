export interface ElectionCandidate {
  id: string;
  nombre: string;
  partido: string;
  votos: number;
  porcentaje: number;
  enc: number;
  sim: number;
  image?: string;
  logo?: string;
  ideo: string;
  color: string;
  initials: string;
  links: { l: string; u: string }[];
  planId?: number;
  props?: string[];
}

export interface ElectionData {
  candidatos: ElectionCandidate[];
  total: number;
  timestamp: number;
}

export interface Candidato {
    id: string;
    nombre: string;
    partido: string;
    ideo: string;
    color: string;
    initials: string;
    image?: string;
    logo?: string;
    enc: number;
    sim: number;
    props: string[];
    links: { l: string; u: string }[];
}
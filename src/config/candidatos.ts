export interface Candidato {
  id: string;
  nombre: string;
  partido: string;
  ideo: string;
  color: string;
  initials: string;
  image?: string; // Ruta local o remota
  logo?: string;  // Ruta al logo del partido
  enc: number;
  sim: number;
  props: string[];
  links: { l: string; u: string }[];
}

export const CANDIDATOS: Candidato[] = [
    {
        id: 'lopez_aliaga', nombre: 'Rafael López Aliaga', partido: 'Renovación Popular',
        ideo: 'Derecha · Conservador', color: '#e63c3c', initials: 'RLA', enc: 10.0, sim: 17.2,
        image: 'https://peru2026.link/img/rla.png',
        logo: 'https://peru2026.link/logo/rp.png',
        props: [
            'Mano dura contra la delincuencia con estado de emergencia en zonas críticas',
            'Reducción radical del aparato y gasto estatal para sanear las finanzas públicas',
            'Combate frontal a la corrupción con sanciones inmediatas y sin impunidad',
            'Privatización de empresas públicas que generan pérdidas al Estado',
            'Defensa de la familia y política de valores en la educación pública',
        ],
        links: [
            { l: 'Plan de Gobierno 2026 (PDF)', u: 'https://declara.jne.gob.pe/ASSETS/PLANGOBIERNO/FILE_PLANGOBIERNO67/PlanGobierno_3720015.pdf' },
            { l: 'Hoja de Vida (JNE)', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'keiko', nombre: 'Keiko Fujimori', partido: 'Fuerza Popular',
        ideo: 'Derecha · Conservador', color: '#f97316', initials: 'KF', enc: 10.7, sim: 14.2,
        image: '/assets/candidatos/keiko.png',
        logo: '/assets/partidos/fp.png',
        props: [
            'Seguridad ciudadana como prioridad absoluta frente al crimen organizado',
            'Reactivación económica con inversión privada y reducción de burocracia',
            'Reforma educativa con calidad, meritocracia y valores como ejes centrales',
            'Plan de infraestructura vial para conectar regiones alejadas del centro',
            'Política exterior soberana con enfoque pragmático y pro-inversión',
        ],
        links: [
            { l: 'Plan de Gobierno 2026 (PDF)', u: 'https://declara.jne.gob.pe/ASSETS/PLANGOBIERNO/FILE_PLANGOBIERNO67/PlanGobierno_3723878.pdf' },
            { l: 'Hoja de Vida (JNE)', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'alvarez', nombre: 'Carlos Álvarez', partido: 'País para Todos',
        ideo: 'Centro · Independiente', color: '#10b981', initials: 'CA', enc: 5.0, sim: 8.9,
        image: '/assets/candidatos/alvarez.png',
        logo: '/assets/partidos/ppt.png',
        props: [
            'Anticorrupción como eje transversal de toda la gestión pública',
            'Formalización laboral y reducción del empleo informal como motor de crecimiento',
            'Salud pública universal, descentralizada y de acceso efectivo para todos',
            'Cultura y turismo como motor económico para las regiones del interior',
            'Transparencia total y rendición de cuentas en tiempo real al ciudadano',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'acuna', nombre: 'César Acuña', partido: 'Alianza para el Progreso',
        ideo: 'Centroderecha · Independiente', color: '#8b5cf6', initials: 'CA', enc: 5.2, sim: 8.1,
        image: '/assets/candidatos/acuna.png',
        logo: '/assets/partidos/app.png',
        props: [
            'Apoyo a la micro, pequeña y mediana empresa y al emprendimiento nacional',
            'Educación universitaria gratuita y de calidad en universidades públicas',
            'Organismos autónomos e independientes para la lucha anticorrupción',
            'Infraestructura hídrica urgente para combatir la sequía en el norte y sur',
            'Programas sociales focalizados en la pobreza extrema con resultados verificables',
        ],
        links: [
            { l: 'Plan de Gobierno 2026 (PDF)', u: 'https://declara.jne.gob.pe/ASSETS/PLANGOBIERNO/FILE_PLANGOBIERNO67/PlanGobierno_3720043.pdf' },
            { l: 'Hoja de Vida (JNE)', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'lopez_chau', nombre: 'Alfonso López Chau', partido: 'Ahora Nación',
        ideo: 'Centroderecha · Tecnocrático', color: '#0ea5e9', initials: 'ALC', enc: 5.5, sim: 6.3,
        image: '/assets/candidatos/lopez_chau.png',
        logo: '/assets/partidos/an.png',
        props: [
            'Modernización del Estado con inteligencia artificial y tecnología de punta',
            'Plan de infraestructura masiva para conectar las regiones del interior del país',
            'Reforma tributaria para ampliar la base de contribuyentes y reducir evasión',
            'Educación técnica, bilingüismo y habilidades digitales universales',
            'Descentralización real del presupuesto con autonomía para las regiones',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'grozo', nombre: 'Wolfgang Grozo', partido: 'Integridad Democrática',
        ideo: 'Centro · Reformista', color: '#f59e0b', initials: 'WG', enc: 4.2, sim: 4.1,
        image: '/assets/candidatos/grozo.png',
        logo: '/assets/partidos/id.png',
        props: [
            'Reforma política integral del sistema de partidos y su financiamiento',
            'Transparencia total y acceso digital ciudadano a la información pública',
            'Agenda climática vinculante con economía circular como eje de desarrollo',
            'Poder judicial independiente del poder político y del poder económico',
            'Descentralización fiscal efectiva con recursos reales para las regiones',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'sanchez', nombre: 'Roberto Sánchez', partido: 'Juntos por el Perú',
        ideo: 'Izquierda · Progresista', color: '#f43f5e', initials: 'RS', enc: 2.4, sim: 3.2,
        image: '/assets/candidatos/sanchez.png',
        logo: '/assets/partidos/jp.png',
        props: [
            'Renegociación de contratos mineros para mayor canon y beneficio regional',
            'Reforma constitucional vía asamblea constituyente democrática',
            'Educación y salud sin privatización, garantizadas plenamente por el Estado',
            'Igualdad de género y derechos plenos de comunidades indígenas amazónicas',
            'Transición energética hacia fuentes renovables y economía verde',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'vizcarra', nombre: 'Mario Vizcarra', partido: 'Perú Primero',
        ideo: 'Centro · Independiente', color: '#64748b', initials: 'MV', enc: 3.2, sim: 2.8,
        image: '/assets/candidatos/vizcarra.png',
        logo: '/assets/partidos/pp.png',
        props: [
            'Reactivación económica con inversión pública en infraestructura productiva',
            'Diálogo nacional y reconciliación política entre regiones y Lima',
            'Conectividad vial y aérea prioritaria en zonas rurales y amazónicas',
            'Salud y educación como derechos fundamentales garantizados por el Estado',
            'Gestión pública transparente, eficiente y orientada a resultados medibles',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'luna', nombre: 'José Luna Gálvez', partido: 'Podemos Perú',
        ideo: 'Centroderecha · Independiente', color: '#e879f9', initials: 'JLG', enc: 3.0, sim: 2.5,
        image: '/assets/candidatos/luna.png',
        logo: '/assets/partidos/podemos.png',
        props: [
            'Educación universitaria accesible y de calidad para todos los peruanos',
            'Simplificación administrativa y reducción de la burocracia estatal',
            'Incentivos tributarios para atraer inversión nacional y extranjera',
            'Seguridad ciudadana con enfoque preventivo y rehabilitación social',
            'Agua potable y saneamiento garantizados para toda la población nacional',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'lescano', nombre: 'Yonhy Lescano', partido: 'Cooperación Popular',
        ideo: 'Centro · Socialcristiano', color: '#06b6d4', initials: 'YL', enc: 2.2, sim: 2.1,
        image: '/assets/candidatos/lescano.png',
        logo: '/assets/partidos/cp.png',
        props: [
            'Defensa efectiva de los derechos del consumidor con legislación actualizada',
            'Reforma agraria y apoyo decidido al campo peruano y al pequeño agricultor',
            'Descentralización real del poder ejecutivo hacia las regiones del país',
            'Educación pública con énfasis en valores cívicos y democráticos',
            'Salud preventiva gratuita en todo el territorio nacional sin distinción',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'forsyth', nombre: 'George Forsyth', partido: 'Somos Perú',
        ideo: 'Centro · Independiente', color: '#3b82f6', initials: 'GF', enc: 1.9, sim: 1.8,
        image: '/assets/candidatos/forsyth.png',
        logo: '/assets/partidos/sp.png',
        props: [
            'Seguridad ciudadana con tecnología avanzada: cámaras, drones e inteligencia artificial',
            'Deporte y recreación como herramientas para reducir la delincuencia juvenil',
            'Simplificación administrativa para acelerar inversiones públicas y privadas',
            'Apoyo efectivo con recursos reales a municipios y gobiernos locales',
            'Formalización del comercio ambulatorio y la economía informal peruana',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'belmont', nombre: 'Ricardo Belmont', partido: 'Partido Cívico OBRAS',
        ideo: 'Centro · Pro-infraestructura', color: '#a78bfa', initials: 'RB', enc: 1.4, sim: 1.2,
        image: '/assets/candidatos/belmont.png',
        logo: '/assets/partidos/obras.png',
        props: [
            'Obras públicas masivas como principal motor del crecimiento económico nacional',
            'Concesiones viales, aeropuertos y puertos en las regiones del interior',
            'Agua potable garantizada para el 100% de los peruanos antes de 2030',
            'Empleo directo a través de grandes proyectos de infraestructura nacional',
            'Lima policéntrica con mejora del transporte y descentralización de la capital',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'williams', nombre: 'José Williams', partido: 'Avanza País',
        ideo: 'Derecha · Liberal', color: '#2dd4bf', initials: 'JW', enc: 1.3, sim: 1.1,
        image: '/assets/candidatos/williams.png',
        logo: '/assets/partidos/ap.png',
        props: [
            'Libre mercado y respeto irrestricto a la propiedad privada como base del desarrollo',
            'Reducción del Estado con mayor eficiencia en el uso del gasto público',
            'Seguridad nacional con Fuerzas Armadas y Policía Nacional fortalecidas',
            'Atracción masiva de inversión extranjera directa para generar empleo',
            'Descentralización con autonomía real para los gobiernos regionales',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'guevara', nombre: 'Mesías Guevara', partido: 'Partido Morado',
        ideo: 'Centroizquierda · Progresista', color: '#c084fc', initials: 'MG', enc: 1.0, sim: 0.9,
        image: '/assets/candidatos/guevara.png',
        logo: '/assets/partidos/pm.png',
        props: [
            'Reforma judicial profunda para garantizar una justicia independiente y transparente',
            'Igualdad real de oportunidades para todos los peruanos sin discriminación',
            'Agenda de género y ampliación de derechos civiles para todos los ciudadanos',
            'Protección efectiva del medioambiente, los recursos naturales y la Amazonía',
            'Inversión significativa en ciencia, tecnología, innovación y desarrollo',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'olivera', nombre: 'Fernando Olivera', partido: 'Frente de la Esperanza',
        ideo: 'Centro · Demócrata', color: '#fb923c', initials: 'FO', enc: 0.9, sim: 0.8,
        image: '/assets/candidatos/olivera.png',
        logo: '/assets/partidos/fe.png',
        props: [
            'Lucha frontal contra la corrupción con nueva legislación eficaz',
            'Reforma estructural del sistema político y de los partidos',
            'Seguridad jurídica para la inversión nacional y extranjera responsable',
            'Acceso universal a salud y educación de calidad para todo el país',
            'Descentralización real del poder y los recursos hacia las regiones',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'valderrama', nombre: 'Enrique Valderrama', partido: 'Partido Aprista Peruano',
        ideo: 'Centroizquierda · Socialdemócrata', color: '#fbbf24', initials: 'EV', enc: 0.8, sim: 0.7,
        image: '/assets/candidatos/valderrama.png',
        logo: '/assets/partidos/apra.png',
        props: [
            'Recuperación del proyecto histórico aprista actualizado para el siglo XXI',
            'Estado fuerte que garantice con efectividad los derechos sociales básicos',
            'Reforma agraria e industrialización descentralizada de los recursos naturales',
            'Inversión pública prioritaria en educación técnica y universidades públicas',
            'Política exterior de integración latinoamericana y comercio estratégico',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'nieto', nombre: 'Jorge Nieto', partido: 'Partido del Buen Gobierno',
        ideo: 'Centro · Tecnocrático', color: '#4ade80', initials: 'JN', enc: 0.8, sim: 0.6,
        image: '/assets/candidatos/nieto.png',
        logo: '/assets/partidos/bg.png',
        props: [
            'Buen gobierno con ética pública y eficiencia en la administración estatal',
            'Reforma profunda de la administración pública con servidores competentes',
            'Política exterior con visión estratégica y capacidad diplomática real',
            'Seguridad nacional con inteligencia del Estado modernizada y fortalecida',
            'Desarrollo sostenible que equilibre el crecimiento económico y el ambiente',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'cerron', nombre: 'Vladimir Cerrón', partido: 'Perú Libre',
        ideo: 'Izquierda · Marxista-Leninista', color: '#b91c1c', initials: 'VC', enc: 0.7, sim: 0.6,
        image: '/assets/candidatos/cerron.png',
        logo: '/assets/partidos/pl.png',
        props: [
            'Nacionalización de los recursos naturales estratégicos del país',
            'Nueva Constitución Política vía asamblea constituyente democrática',
            'Estado empresario en minería, petróleo y telecomunicaciones nacionales',
            'Reforma agraria profunda y redistribución equitativa de tierras',
            'Educación y salud 100% estatales, sin ningún tipo de privatización',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'chiabra', nombre: 'Roberto Chiabra', partido: 'Alianza Unidad Nacional',
        ideo: 'Derecha · Conservador', color: '#7c3aed', initials: 'RC', enc: 0.6, sim: 0.5,
        image: '/assets/candidatos/chiabra.png',
        logo: '/assets/partidos/aun.png',
        props: [
            'Orden y seguridad pública con Fuerzas Armadas en apoyo a la PNP',
            'Economía de mercado con mano firme contra toda forma de criminalidad',
            'Combate integral al terrorismo y al narcotráfico en todo el territorio',
            'Protección efectiva de la inversión nacional y extranjera productiva',
            'Unidad nacional, valores patrióticos e identidad peruana como base',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'molinelli', nombre: 'Fiorella Molinelli', partido: 'Alianza Fuerza y Libertad',
        ideo: 'Centroderecha · Liberal', color: '#e11d48', initials: 'FM', enc: 0.5, sim: 0.5,
        image: '/assets/candidatos/molinelli.png',
        logo: '/assets/partidos/afl.png',
        props: [
            'Libre mercado and simplificación de trámites para las empresas nacionales',
            'Reducción de la presión tributaria sobre las micro y pequeñas empresas',
            'Sistema de salud mixto público-privado eficiente y accesible para todos',
            'Digitalización completa de los servicios del Estado al ciudadano',
            'Educación con estándares internacionales de calidad y competitividad',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'paz_barra', nombre: 'Álvaro Paz de la Barra', partido: 'Partido Fe en el Perú',
        ideo: 'Centroderecha · Independiente', color: '#16a34a', initials: 'APB', enc: 0.5, sim: 0.4,
        image: '/assets/candidatos/paz.png',
        logo: '/assets/partidos/fe_peru.png',
        props: [
            'Fe en el emprendimiento peruano como principal motor del desarrollo',
            'Seguridad ciudadana con tecnología y fuerte enfoque en prevención del delito',
            'Educación con valores sólidos como base del desarrollo de la sociedad',
            'Economía sostenible con responsabilidad social empresarial real',
            'Descentralización efectiva con plena autonomía de los gobiernos locales',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'belaunde', nombre: 'Rafael Belaunde Llosa', partido: 'Libertad Popular',
        ideo: 'Derecha · Liberal', color: '#0369a1', initials: 'RBL', enc: 0.4, sim: 0.4,
        image: '/assets/candidatos/belaunde.png',
        logo: '/assets/partidos/lp.png',
        props: [
            'Libertad económica y respeto irrestricto a la propiedad privada',
            'Estado mínimo y eficiente con baja carga tributaria para los ciudadanos',
            'Educación con libertad de elección plena para las familias peruanas',
            'Salud con sistema mixto y competencia entre proveedores de calidad',
            'Política exterior de apertura total y libre comercio estratégico',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'chirinos', nombre: 'Walter Chirinos', partido: 'PRIN',
        ideo: 'Centro · Regionalista', color: '#92400e', initials: 'WC', enc: 0.4, sim: 0.3,
        image: '/assets/candidatos/chirinos.png',
        logo: '/assets/partidos/prin.png',
        props: [
            'Desarrollo regional como eje central de toda la política nacional',
            'Descentralización real de recursos y decisiones estratégicas a las regiones',
            'Inversión prioritaria en agricultura e industria regional productiva',
            'Presencia efectiva del Estado en zonas rurales y alejadas del centro',
            'Identidad regional y cultural como fortaleza y valor del Perú',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'jaico', nombre: 'Carlos Jaico', partido: 'Perú Moderno',
        ideo: 'Centro · Tecnocrático', color: '#0891b2', initials: 'CJ', enc: 0.3, sim: 0.3,
        image: '/assets/candidatos/jaico.png',
        logo: '/assets/partidos/pm_mod.png',
        props: [
            'Gestión pública moderna con indicadores de resultados verificables y públicos',
            'Digitalización total del Estado y reducción de trámites presenciales',
            'Economía del conocimiento e industrias creativas como sectores prioritarios',
            'Sistema educativo plenamente alineado con las necesidades del mercado laboral',
            'Infraestructura de datos y conectividad de internet universal en el país',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'espa', nombre: 'Carlos Espá', partido: 'Sí Creo',
        ideo: 'Centro · Independiente', color: '#d97706', initials: 'CE', enc: 0.3, sim: 0.3,
        image: '/assets/candidatos/espa.png',
        logo: '/assets/partidos/sc.png',
        props: [
            'Comunicación directa y permanente entre la ciudadanía y el gobierno',
            'Transparencia total en el uso y destino de todos los recursos públicos',
            'Lucha anticorrupción con amplia participación ciudadana real y efectiva',
            'Educación cívica amplia como base del fortalecimiento democrático del país',
            'Acceso a la información pública como derecho fundamental garantizado',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'ortiz', nombre: 'Antonio Ortiz', partido: 'Salvemos al Perú',
        ideo: 'Centro · Independiente', color: '#b45309', initials: 'AO', enc: 0.3, sim: 0.2,
        image: '/assets/candidatos/ortiz.png',
        logo: '/assets/partidos/sap.png',
        props: [
            'Rescate y fortalecimiento de las instituciones democráticas peruanas',
            'Lucha frontal contra la infiltración del crimen organizado en la política',
            'Economía productiva nacional con industrialización descentralizada',
            'Salud y educación como pilares irrenunciables del desarrollo humano',
            'Seguridad ciudadana con plena participación de la comunidad organizada',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'caller', nombre: 'Herbert Caller', partido: 'Partido Patriótico del Perú',
        ideo: 'Centroderecha · Independiente', color: '#1d4ed8', initials: 'HC', enc: 0.2, sim: 0.2,
        image: '/assets/candidatos/caller.png',
        logo: '/assets/partidos/ppp.png',
        props: [
            'Patriotismo activo y defensa de los intereses nacionales en toda decisión',
            'Seguridad interna con Fuerzas Armadas modernas, equipadas y bien pagadas',
            'Industrialización real de los recursos naturales dentro del territorio peruano',
            'Educación técnica y científica de alto nivel para el desarrollo del país',
            'Integración latinoamericana desde una posición soberana e independiente',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'carrasco', nombre: 'Charlie Carrasco', partido: 'Partido Demócrata Unido Perú',
        ideo: 'Centro · Demócrata', color: '#0f766e', initials: 'CC', enc: 0.2, sim: 0.2,
        image: '/assets/candidatos/carrasco.png',
        logo: '/assets/partidos/pdup.png',
        props: [
            'Democracia representativa fortalecida con mayor participación ciudadana efectiva',
            'Reforma del sistema electoral para garantizar mayor equidad y transparencia',
            'Descentralización real del poder político y los recursos a todas las regiones',
            'Lucha anticorrupción con organismos verdaderamente independientes del poder',
            'Economía inclusiva para reducir la desigualdad y ampliar las oportunidades',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'masse', nombre: 'Armando Massé', partido: 'Partido Democrático Federal',
        ideo: 'Centro · Federalista', color: '#065f46', initials: 'AM', enc: 0.2, sim: 0.2,
        image: '/assets/candidatos/masse.png',
        logo: '/assets/partidos/pdf.png',
        props: [
            'Estado federal como modelo para una descentralización plena y real del poder',
            'Autonomía regional total con recursos propios y presupuesto garantizado',
            'Inversión estratégica en infraestructura en las regiones más alejadas del país',
            'Seguridad con modelos de orden públicoadaptados a cada realidad regional',
            'Identidad cultural de cada región como fortaleza y orgullo de la nación',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'atencio', nombre: 'Ronald Atencio', partido: 'Venceremos',
        ideo: 'Izquierda · Progresista', color: '#7f1d1d', initials: 'RA', enc: 0.2, sim: 0.1,
        image: '/assets/candidatos/atencio.png',
        logo: '/assets/partidos/venceremos.png',
        props: [
            'Reforma constitucional con participación popular directa y vinculante',
            'Derechos plenos para trabajadores y todos los sectores vulnerables del país',
            'Economía solidaria y cooperativas como alternativa real al modelo actual',
            'Recuperación de los recursos naturales para el beneficio directo del pueblo',
            'Justicia social efectiva y reducción real de la desigualdad estructural',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'gonzalez', nombre: 'Alex González', partido: 'Partido Demócrata Verde',
        ideo: 'Centro · Ecologista', color: '#166534', initials: 'AG', enc: 0.1, sim: 0.1,
        image: '/assets/candidatos/gonzalez.png',
        logo: '/assets/partidos/pdv.png',
        props: [
            'Ecología y medioambiente como prioridad irrenunciable de la política nacional',
            'Economía verde y transición energética acelerada hacia fuentes renovables',
            'Protección urgente de la Amazonía, los recursos hídricos y la biodiversidad',
            'Agricultura orgánica e industria verde y sostenible como modelo productivo',
            'Turismo ecológico responsable como motor económico en las regiones naturales',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'fernandez', nombre: 'Rosario Fernández', partido: 'Un Camino Diferente',
        ideo: 'Centro · Independiente', color: '#9d174d', initials: 'RF', enc: 0.1, sim: 0.1,
        image: '/assets/candidatos/fernandez.png',
        logo: '/assets/partidos/ucd.png',
        props: [
            'Justicia real, accesible e igualitaria para todos los ciudadanos sin excepción',
            'Reforma profunda del sistema de justicia penal del Perú',
            'Igualdad real ante la ley sin distinción de clase social o afiliación política',
            'Transparencia plena en el funcionamiento del Poder Judicial peruano',
            'Descentralización efectiva de los servicios de justicia a todo el territorio',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'diez', nombre: 'Francisco Diez Canseco', partido: 'Perú Acción',
        ideo: 'Izquierda · Socialista', color: '#dc2626', initials: 'FDC', enc: 0.1, sim: 0.1,
        image: '/assets/candidatos/diez.png',
        logo: '/assets/partidos/pa.png',
        props: [
            'Acción decidida del Estado en defensa de los más pobres y vulnerables',
            'Reforma agraria profunda and apoyo prioritario al pequeño agricultor peruano',
            'Salud y educación pública de calidad garantizada como derecho universal',
            'Recursos naturales al servicio directo del pueblo peruano en su conjunto',
            'Política exterior de no alineamiento, soberanía y defensa del interés nacional',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'perez_tello', nombre: 'María Pérez Tello', partido: 'Primero la Gente',
        ideo: 'Centroderecha · Independiente', color: '#be185d', initials: 'MPT', enc: 0.1, sim: 0.1,
        image: '/assets/candidatos/perez.png',
        logo: '/assets/partidos/plg.png',
        props: [
            'La gente primero: políticas públicas diseñadas desde y para el ciudadano',
            'Sistema de justicia moderno, transparente y verdaderamente accesible',
            'Igualdad real de derechos y oportunidades plenas para todas las mujeres',
            'Descentralización real con plena participación ciudadana local activa',
            'Educación de calidad con valores sólidos y competencias globales actualizadas',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
    {
        id: 'jaimes', nombre: 'Paul Jaimes', partido: 'Progresemos',
        ideo: 'Centro · Independiente', color: '#1e40af', initials: 'PJ', enc: 0.1, sim: 0.1,
        image: '/assets/candidatos/jaimes.png',
        logo: '/assets/partidos/prog.png',
        props: [
            'Progreso económico sostenible con inclusión social efectiva para todos',
            'Inversión decidida en ciencia y tecnología para el desarrollo del Perú',
            'Educación moderna con competencias reales para el mercado del siglo XXI',
            'Infraestructura que conecte al Perú de la costa a la selva profunda',
            'Gestión pública transparente, austera y orientada a resultados concretos',
        ],
        links: [
            { l: 'Plataforma Electoral JNE', u: 'https://plataformaelectoral.jne.gob.pe/' },
        ],
    },
];

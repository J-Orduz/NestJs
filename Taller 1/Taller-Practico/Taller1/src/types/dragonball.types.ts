// Tipos básicos y utilidades
export type Nullable<T> = T | null;
export type ID = number;
export type ApiDate = string; // ISO date string

// Interface base para respuestas paginadas de la API
export interface ApiPaginatedResponse<T> {
    items: T[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
    links: {
        first: string;
        previous: Nullable<string>;
        next: Nullable<string>;
        last: string;
    };
}

// Interface para respuesta de un solo ítem
export interface ApiSingleItemResponse<T> {
    item: T;
    links: {
        self: string;
    };
}

// PERSONAJES

// Interface cruda para transformación desde API
export interface ApiTransformation {
    id: ID;
    name: string;
    ki: string;
    image: Nullable<string>;
    deletedAt: Nullable<ApiDate>;
    character?: ApiCharacterSummary;
}

// Interface resumida de personaje
export interface ApiCharacterSummary {
    id: ID;
    name: string;
    ki: string;
    maxKi: string;
    race: string;
    gender: string;
    image: Nullable<string>;
    affiliation: string;
}

// Interface completa de personaje desde API
export interface ApiCharacter extends ApiCharacterSummary {
    description: string;
    transformations: ApiTransformation[];
    originPlanet?: ApiPlanetSummary;
    deletedAt: Nullable<ApiDate>;
    createdAt: ApiDate;
    updatedAt: ApiDate;
}

// PLANETAS 

// Interface resumida de planeta
export interface ApiPlanetSummary {
    id: ID;
    name: string;
    isDestroyed: boolean;
    image: Nullable<string>;
}

// Interface completa de planeta desde API
export interface ApiPlanet extends ApiPlanetSummary {
    description: string;
    characters: ApiCharacterSummary[];
    deletedAt: Nullable<ApiDate>;
    createdAt: ApiDate;
    updatedAt: ApiDate;
}

// FILTROS Y PARÁMETROS

// Parámetros de consulta para endpoints paginados
export interface QueryParams {
    page?: number;
    limit?: number;
    name?: string;
    race?: string;
    affiliation?: string;
    gender?: string;
}

// Opciones de búsqueda
export interface SearchOptions {
    type: 'characters' | 'planets' | 'transformations';
    term: string;
    exactMatch?: boolean;
    includeRelations?: boolean;
}

// ESTADOS DE LA APLICACIÓN 
// Estado de carga para la UI
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Interface para estado de una búsqueda
export interface SearchState {
    query: string;
    type: 'characters' | 'planets' | 'transformations';
    results: any[];
    loading: LoadingState;
    error: Nullable<string>;
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

//Interface para filtros activos
export interface ActiveFilters {
    race?: string;
    affiliation?: string;
    gender?: string;
    minKi?: number;
    maxKi?: number;
    destroyedOnly?: boolean;
}

// EVENTOS Y HANDLERS 
// Tipo para eventos de búsqueda
export interface SearchEvent {
    type: 'search' | 'filter' | 'page-change';
    payload: any;
    timestamp: Date;
}

//Callback para manejar resultados
export type ResultCallback<T> = (results: T[], error: Nullable<ApiError>) => void;

// ESTADÍSTICAS 

// Estadísticas de personajes
export interface CharacterStats {
    totalCharacters: number;
    byRace: Record<string, number>;
    byGender: Record<string, number>;
    byAffiliation: Record<string, number>;
    averageKi: number;
    strongestCharacter: Nullable<{
        name: string;
        ki: string;
        image: Nullable<string>;
    }>;
}

// Estadísticas de planetas
export interface PlanetStats {
    totalPlanets: number;
    destroyedPlanets: number;
    intactPlanets: number;
    mostPopulated: Nullable<{
        name: string;
        characterCount: number;
        image: Nullable<string>;
    }>;
}

// CONFIGURACIÓN

// Configuración de la aplicación
export interface AppConfig {
    api: {
        baseUrl: string;
        timeout: number;
        retries: number;
    };
    ui: {
        itemsPerPage: number;
        maxResultsToShow: number;
        enableAnimations: boolean;
        theme: 'light' | 'dark' | 'system';
    };
    cache: {
        enabled: boolean;
        ttl: number;
        maxSize: number;
    };
}

// UTILIDADES 
//Tipo para el ordenamiento
export type SortOrder = 'asc' | 'desc';

// Campos por los que se puede ordenar
export type SortableFields = 'name' | 'ki' | 'createdAt' | 'id';

//Interface para opciones de ordenamiento
export interface SortOptions {
    field: SortableFields;
    order: SortOrder;
}

//Tipo guard para verificar si una respuesta es paginada
export function isPaginatedResponse<T>(response: any): response is ApiPaginatedResponse<T> {
    return response && 
           Array.isArray(response.items) && 
           response.meta && 
           typeof response.meta.totalPages === 'number';
}

// Tipo guard para verificar si un objeto es un personaje
export function isCharacter(item: any): item is ApiCharacter {
    return item && 
           typeof item.ki === 'string' && 
           Array.isArray(item.transformations);
}

// Tipo guard para verificar si un objeto es un planeta
export function isPlanet(item: any): item is ApiPlanet {
    return item && 
           typeof item.isDestroyed === 'boolean' && 
           Array.isArray(item.characters);
}

// ENUMS 

// Géneros disponibles en Dragon Ball
export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
    UNKNOWN = 'Unknown'
}

// Razas en Dragon Ball
export enum Race {
    SAIYAN = 'Saiyan',
    HUMAN = 'Human',
    NAMEKIAN = 'Namekian',
    FRIEZA_RACE = 'Frieza Race',
    ANDROID = 'Android',
    CORE_PERSON = 'Core Person',
    MAJIN = 'Majin',
    GOD = 'God',
    ANGEL = 'Angel',
    UNKNOWN = 'Unknown',
    EVIL = 'Evil',
    NUCLEICO = 'Nucleico',
    JINER = 'Jiner'
}

// Afiliaciones en Dragon Ball
export enum Affiliation {
    Z_FIGHTER = 'Z Fighter',
    RED_RIBBON_ARMY = 'Red Ribbon Army',
    FRIEZA_FORCE = 'Frieza Force',
    PRIDE_TROOPERS = 'Pride Troopers',
    UNIVERSE_SURVIVORS = 'Universe Survivors',
    OTHER = 'Other'
}

// Tipos de búsqueda disponibles
export enum SearchType {
    CHARACTERS = 'characters',
    PLANETS = 'planets',
    TRANSFORMATIONS = 'transformations'
}

// Exportar todo desde un solo objeto para importaciones más limpias
export const DragonballTypes = {
    Gender,
    Race,
    Affiliation,
    SearchType,
    isCharacter,
    isPlanet,
    isPaginatedResponse
};
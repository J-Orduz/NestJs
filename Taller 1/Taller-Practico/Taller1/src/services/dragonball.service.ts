import { Character, Planet, Transformation, ModelFactory } from '../models/dragonball.models';

//Configuración del servicio
interface ServiceConfig {
    baseUrl: string;
    timeout: number;
    retries: number;
}

// Respuesta paginada de la API
export interface ApiResponse<T> {
    items: T[];
    total: number;
    currentPage: number;
    totalPages: number;
}

// Error personalizado para la API
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public endpoint?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Servicio singleton para consumir la Dragonball API
export class DragonballService {
    private static instance: DragonballService;
    private readonly config: ServiceConfig;
    private abortController: AbortController | null = null;

    private constructor() {
        this.config = {
            baseUrl: 'https://dragonball-api.com/api',
            timeout: 10000, // 10 segundos
            retries: 3
        };
    }

    // Obtener instancia única del servicio 
    public static getInstance(): DragonballService {
        if (!DragonballService.instance) {
            DragonballService.instance = new DragonballService();
        }
        return DragonballService.instance;
    }

    // Método genérico para hacer peticiones GET
    private async fetchWithRetry<T>(
        endpoint: string,   
        attempt: number = 1
    ): Promise<T> {
        // Crear NUEVO AbortController para ESTA petición
        const abortController = new AbortController();
        const { signal } = abortController;
        
        // Guardar referencia para posible cancelación externa
        this.abortController = abortController;

        try {
            // Timeout promise
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => {
                    reject(new ApiError(
                        `Timeout después de ${this.config.timeout}ms`,
                        undefined,
                        endpoint
                    ));
                }, this.config.timeout);
            });

            // Fetch promise
            const fetchPromise = fetch(`${this.config.baseUrl}${endpoint}`, {
                signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

            if (!response.ok) {
                throw new ApiError(
                    `HTTP Error: ${response.status} ${response.statusText}`,
                    response.status,
                    endpoint
                );
            }

            const data = await response.json();
            return data as T;

        } catch (error) {
            // Solo reintentar si NO es un abort error y tenemos intentos restantes
            if (attempt < this.config.retries && 
                error instanceof Error && 
                error.name !== 'AbortError') {
                console.log(`Reintentando (${attempt}/${this.config.retries})...`);
                await this.delay(1000 * attempt);
                return this.fetchWithRetry<T>(endpoint, attempt + 1);
            }

            // Si es AbortError, lanzarlo con un mensaje más claro
            if (error instanceof Error && error.name === 'AbortError') {
                throw new ApiError('La petición fue cancelada', undefined, endpoint);
            }

            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(
                error instanceof Error ? error.message : 'Error desconocido',
                undefined,
                endpoint
            );
        } finally {
            // Solo limpiar si este controller sigue siendo el actual
            if (this.abortController === abortController) {
                this.abortController = null;
            }
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Cancelar petición en curso
    public cancelRequest(): void {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    // MÉTODOS PARA PERSONAJES 

    //Obtener todos los personajes
    async getAllCharacters(page: number = 1, limit: number = 10): Promise<ApiResponse<Character>> {
        try {
            const data = await this.fetchWithRetry<any>(
                `/characters?page=${page}&limit=${limit}`
            );
            
            return {
                items: ModelFactory.createCharactersFromApiArray(data.items || []),
                total: data.total || 0,
                currentPage: data.currentPage || page,
                totalPages: data.totalPages || 0
            };
        } catch (error) {
            console.error('Error obteniendo personajes:', error);
            throw error;
        }
    }

    // Obtener personaje por ID
    async getCharacterById(id: number): Promise<Character> {
        try {
            if (!id || id <= 0) {
                throw new ApiError('ID de personaje inválido');
            }

            const data = await this.fetchWithRetry<any>(`/characters/${id}`);
            return ModelFactory.createCharacterFromApi(data);
        } catch (error) {
            console.error(`Error obteniendo personaje ${id}:`, error);
            throw error;
        }
    }

    // Buscar personaje por nombre
    async searchCharacterByName(name: string): Promise<Character[]> {
        try {
            if (!name || name.trim().length < 1) {
                throw new ApiError('El nombre debe tener al menos 1 caracter');
            }

            console.log('Buscando:', name);
            const data = await this.fetchWithRetry<any>(
                `/characters?name=${encodeURIComponent(name.trim())}`
            );

            console.log('Respuesta API:', data);
            const items = data.items || data.results || data || [];
            return ModelFactory.createCharactersFromApiArray(items);
        } catch (error) {
            console.error(`Error buscando personaje "${name}":`, error);
            throw error;
        }
    }

    // MÉTODOS PARA PLANETAS

    // Obtener todos los planetas
    async getAllPlanets(page: number = 1, limit: number = 10): Promise<ApiResponse<Planet>> {
        try {
            const data = await this.fetchWithRetry<any>(
                `/planets?page=${page}&limit=${limit}`
            );
            
            return {
                items: ModelFactory.createPlanetsFromApiArray(data.items || []),
                total: data.total || 0,
                currentPage: data.currentPage || page,
                totalPages: data.totalPages || 0
            };
        } catch (error) {
            console.error('Error obteniendo planetas:', error);
            throw error;
        }
    }

    // Obtener planeta por ID
    async getPlanetById(id: number): Promise<Planet> {
        try {
            if (!id || id <= 0) {
                throw new ApiError('ID de planeta inválido');
            }

            const data = await this.fetchWithRetry<any>(`/planets/${id}`);
            return ModelFactory.createPlanetFromApi(data);
        } catch (error) {
            console.error(`Error obteniendo planeta ${id}:`, error);
            throw error;
        }
    }

    // Buscar planeta por nombre
    async searchPlanetByName(name: string): Promise<Planet[]> {
        try {
            if (!name || name.trim().length < 1) {
                throw new ApiError('El nombre debe tener al menos 1 caracter');
            }

            console.log('Buscando planeta:', name);
            const data = await this.fetchWithRetry<any>(
                `/planets?name=${encodeURIComponent(name.trim())}`
            );

            console.log('Respuesta planetas API:', data);
            
            const items = data.items || data.results || data || [];
            return ModelFactory.createPlanetsFromApiArray(items);
        } catch (error) {
            console.error(`Error buscando planeta "${name}":`, error);
            throw error;
        }
    }

    // MÉTODOS PARA TRANSFORMACIONES 
    // Obtener transformaciones de un personaje
    async getTransformationsByCharacterId(characterId: number): Promise<Transformation[]> {
        try {
            if (!characterId || characterId <= 0) {
                throw new ApiError('ID de personaje inválido');
            }

            // Primero obtenemos el personaje con sus transformaciones
            const character = await this.getCharacterById(characterId);
            return character.transformations;
        } catch (error) {
            console.error(`Error obteniendo transformaciones del personaje ${characterId}:`, error);
            throw error;
        }
    }

    // MÉTODOS DE BÚSQUEDA GENERAL

    async searchTransformationByName(name: string): Promise<Transformation[]> {
        try {
            if (!name || name.trim().length < 1) {
                throw new ApiError('El nombre debe tener al menos 1 caracter');
            }

            const searchTerm = name.trim().toLowerCase();
            console.log('Buscando transformación por nombre:', searchTerm);

            // 1. Obtener TODAS las transformaciones (la API ignora el filtro)
            const data = await this.fetchWithRetry<any[]>(
                `/transformations?name=${encodeURIComponent(searchTerm)}`
            );

            console.log('Respuesta API transformaciones (total):', data?.length || 0);

            // 2. Asegurar que tenemos un array
            const allTransformations = Array.isArray(data) ? data : [];
            
            // 3. FILTRAR LOCALMENTE por nombre (insensible a mayúsculas)
            const filteredTransformations = allTransformations.filter(item => {
                const itemName = item.name?.toLowerCase() || '';
                return itemName.includes(searchTerm);
            });

            console.log(`Transformaciones filtradas para "${searchTerm}":`, filteredTransformations.length);

            // 4. Convertir a objetos Transformation usando el ModelFactory
            return filteredTransformations.map(item => 
                ModelFactory.createTransformationFromApi(item)
            );
            
        } catch (error) {
            console.error(`Error buscando transformación por nombre "${name}":`, error);
            throw error; 
        }
    }

    // Obtener transformación por ID
    async getTransformationById(id: number): Promise<Transformation | null> {
        try {
            // Algunas APIs tienen endpoint directo de transformaciones
            const data = await this.fetchWithRetry<any>(`/transformations/${id}`);
            return ModelFactory.createTransformationFromApi(data);
        } catch {
            // Si no existe endpoint directo, buscar en todos los personajes
            try {
                const characters = await this.getAllCharacters(1, 100);
                for (const character of characters.items) {
                    const transformation = character.transformations.find(t => t.id === id);
                    if (transformation) return transformation;
                }
            } catch {
                // Ignorar error
            }
            return null;
        }
    }

    // Búsqueda inteligente que determina el tipo de búsqueda
    async searchAll(searchTerm: string, type: 'characters' | 'planets' | 'transformations'): Promise<any[]> {
        const term = searchTerm.trim();
        
        if (!term) {
            throw new ApiError('Término de búsqueda vacío');
        }

        // Verificar si es ID (solo números)
        const isId = /^\d+$/.test(term);
        console.log(`Buscando ${type} con término: "${term}", es ID: ${isId}`); // DEBUG
        
        try {
            switch (type) {
                case 'characters':
                    if (isId) {
                        console.log('Buscando personaje por ID:', parseInt(term));
                        const character = await this.getCharacterById(parseInt(term));
                        return character ? [character] : [];
                    }
                    return await this.searchCharacterByName(term);
                
                case 'planets':
                    if (isId) {
                        console.log('Buscando planeta por ID:', parseInt(term));
                        const planet = await this.getPlanetById(parseInt(term));
                        return planet ? [planet] : [];
                    }
                    return await this.searchPlanetByName(term);
                
                case 'transformations':
                    if (isId) {
                        console.log('Buscando transformación por ID:', parseInt(term));
                        const transformation = await this.getTransformationById(parseInt(term));
                        return transformation ? [transformation] : [];
                    }
                    return await this.searchTransformationByName(term); 
                
                default:
                    throw new ApiError(`Tipo de búsqueda no soportado: ${type}`);
            }
        } catch (error) {
            console.error(`Error en búsqueda ${type}:`, error);
            throw error;
        }
    }
}

// Exportar instancia única por defecto
export default DragonballService.getInstance();
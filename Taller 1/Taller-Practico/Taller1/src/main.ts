import './styles/style.css';
import { DragonballService, ApiError } from './services/dragonball.service';
import { SearchBar } from './components/search-bar';
import { CharacterCard } from './components/character-card';
import { PlanetCard } from './components/planet-card';
import { ErrorMessage } from './components/error-message';
import { Loader } from './components/loader';
import { SearchType, type SearchState } from './types/dragonball.types';
import { Character } from './models/dragonball.models';
import { Planet } from './models/dragonball.models';
import { Transformation } from './models/dragonball.models';

// Clase principal de la aplicación
class DragonballApp {
    private service: DragonballService;
    private searchBar: SearchBar;
    private loader: Loader;
    private resultsContainer: HTMLElement;
    private errorContainer: HTMLElement;
    
    private searchState: SearchState = {
        query: '',
        type: SearchType.CHARACTERS,
        results: [],
        loading: 'idle',
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    };

    constructor() {
        this.service = DragonballService.getInstance();
        this.initializeContainers();
        this.initializeComponents();
        this.attachGlobalEvents();
    }

    // Inicializa los contenedores principales
    private initializeContainers(): void {
        // Verificar que existan los contenedores necesarios
        const results = document.getElementById('results');
        if (!results) {
            throw new Error('No se encontró el contenedor de resultados');
        }
        this.resultsContainer = results;

        const error = document.getElementById('errorMessage');
        if (!error) {
            throw new Error('No se encontró el contenedor de errores');
        }
        this.errorContainer = error;
    }

    // Inicializa los componentes
    private initializeComponents(): void {
        // Crear loader
        this.loader = new Loader();
        document.querySelector('main')?.appendChild(this.loader.getElement());

        // Crear barra de búsqueda
        this.searchBar = new SearchBar({
            onSearch: (term: string, type: SearchType) => {
                this.handleSearch(term, type);
            },
            placeholder: 'Busca personajes, planetas o transformaciones...'
        });

        // Insertar barra de búsqueda en el DOM
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            searchSection.appendChild(this.searchBar.getElement());
        }
    }

    // Adjunta eventos globales
    private attachGlobalEvents(): void {
        // Manejar tecla Escape para limpiar búsqueda
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });

        // Manejar cambios en la paginación si existiera
        window.addEventListener('popstate', () => {
            // Manejar navegación con historial si implementamos paginación
        });
    }

    // Maneja la búsqueda
    private async handleSearch(term: string, type: SearchType): Promise<void> {
        // Actualizar estado
        this.searchState.query = term;
        this.searchState.type = type;
        this.searchState.loading = 'loading';
        this.searchState.error = null;
        
        // Limpiar resultados anteriores
        this.clearResults();
        
        // Mostrar loader
        this.loader.show(`Buscando ${term}...`);
        
        // Ocultar errores anteriores
        this.clearErrors();

        try {
            // Realizar búsqueda
            const results = await this.service.searchAll(term, type);
            
            // Actualizar estado
            this.searchState.results = results;
            this.searchState.loading = 'success';
            this.searchState.totalItems = results.length;
            
            // Mostrar resultados
            this.renderResults(results, type);
            
            // Si no hay resultados, mostrar mensaje
            if (results.length === 0) {
                this.showNoResults(term, type);
            }
            
        } catch (error) {
            // Manejar error
            this.handleError(error);
            this.searchState.loading = 'error';
            this.searchState.error = error instanceof Error ? error.message : 'Error desconocido';
            
        } finally {
            // Ocultar loader
            this.loader.hide();
        }
    }

    // Renderiza los resultados según el tipo
    private renderResults(results: any[], type: SearchType): void {
        this.resultsContainer.innerHTML = ''; // Limpiar contenedor
        
        if (results.length === 0) return;

        // Añadir contador de resultados
        this.addResultsCounter(results.length);

        // Renderizar cada resultado según su tipo
        results.forEach(item => {
            let card: HTMLElement;

            if (type === SearchType.CHARACTERS || item instanceof Character) {
                card = this.createCharacterCard(item as Character);
            } else if (type === SearchType.PLANETS || item instanceof Planet) {
                card = this.createPlanetCard(item as Planet);
            } else {
                card = this.createTransformationItem(item as Transformation);
            }

            this.resultsContainer.appendChild(card);
        });
    }

    // Crea una tarjeta de personaje
    private createCharacterCard(character: Character): HTMLElement {
        const card = new CharacterCard({
            character,
            onClick: (char) => {
                this.showCharacterDetails(char);
            },
            showTransformations: true
        });
        
        return card.getElement();
    }

    // Crea una tarjeta de planeta
    private createPlanetCard(planet: Planet): HTMLElement {
        const card = new PlanetCard({
            planet,
            onClick: (pl) => {
                this.showPlanetDetails(pl);
            },
            showCharacters: true
        });
        
        return card.getElement();
    }

    // Crea un elemento de transformación
    private createTransformationItem(transformation: Transformation): HTMLElement {
        const div = document.createElement('div');
        div.className = 'transformation-card';
        
        div.innerHTML = `
            <div class="transformation-card-inner">
                <img 
                    src="${transformation.getImageUrl() || 'https://via.placeholder.com/100x100'}" 
                    alt="${transformation.name}"
                    class="transformation-image"
                    onerror="this.src='https://via.placeholder.com/100x100'"
                >
                <div class="transformation-details">
                    <h4>${transformation.name}</h4>
                    <p class="transformation-ki">Ki: ${transformation.ki}</p>
                </div>
            </div>
        `;
        
        return div;
    }

    // Muestra detalles del personaje (puede expandirse a modal)
    private showCharacterDetails(character: Character): void {
        console.log('Mostrando detalles de:', character.name);
        // Aquí podrías implementar un modal o expandir la tarjeta
    }

    // Muestra detalles del planeta (puede expandirse a modal)
    private showPlanetDetails(planet: Planet): void {
        console.log('Mostrando detalles de:', planet.name);
        // Aquí podrías implementar un modal o expandir la tarjeta
    }

    // Añade un contador de resultados
    private addResultsCounter(count: number): void {
        const counter = document.createElement('div');
        counter.className = 'results-counter';
        counter.innerHTML = `
            <span>📊 ${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}</span>
        `;
        this.resultsContainer.appendChild(counter);
    }

    // Muestra mensaje de sin resultados
    private showNoResults(term: string, type: SearchType): void {
        const typeNames = {
            [SearchType.CHARACTERS]: 'personajes',
            [SearchType.PLANETS]: 'planetas',
            [SearchType.TRANSFORMATIONS]: 'transformaciones'
        };

        const message = document.createElement('div');
        message.className = 'no-results';
        message.innerHTML = `
            <div class="no-results-content">
                <span class="no-results-icon">🔍</span>
                <h3>No se encontraron resultados</h3>
                <p>No hay ${typeNames[type]} que coincidan con "<strong>${term}</strong>"</p>
                <p class="no-results-suggestion">Sugerencia: Prueba con otro término o verifica la ortografía</p>
            </div>
        `;
        
        this.resultsContainer.appendChild(message);
    }

    // Maneja errores
    private handleError(error: unknown): void {
        console.error('Error en la aplicación:', error);
        
        let errorMessage: ErrorMessage;
        
        if (error instanceof ApiError) {
            errorMessage = ErrorMessage.fromApiError(error, () => {
                // Reintentar la última búsqueda
                if (this.searchState.query) {
                    this.handleSearch(this.searchState.query, this.searchState.type);
                }
            });
        } else if (error instanceof Error) {
            errorMessage = new ErrorMessage({
                message: error.message,
                type: 'error',
                onRetry: () => {
                    if (this.searchState.query) {
                        this.handleSearch(this.searchState.query, this.searchState.type);
                    }
                },
                onDismiss: () => this.clearErrors()
            });
        } else {
            errorMessage = new ErrorMessage({
                message: 'Ocurrió un error inesperado',
                type: 'error',
                onRetry: () => {
                    if (this.searchState.query) {
                        this.handleSearch(this.searchState.query, this.searchState.type);
                    }
                },
                onDismiss: () => this.clearErrors()
            });
        }
        
        // Limpiar errores anteriores y mostrar nuevo error
        this.clearErrors();
        this.errorContainer.appendChild(errorMessage.getElement());
    }

    // Limpia los resultados
    private clearResults(): void {
        this.resultsContainer.innerHTML = '';
    }

    // Limpia los errores
    private clearErrors(): void {
        this.errorContainer.innerHTML = '';
    }

    // Limpia la búsqueda actual
    private clearSearch(): void {
        this.searchBar.clear();
        this.clearResults();
        this.clearErrors();
        this.searchState = {
            query: '',
            type: SearchType.CHARACTERS,
            results: [],
            loading: 'idle',
            error: null,
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
        };
    }

    // Inicia la aplicación
    public async start(): Promise<void> {
        // Cargar datos iniciales (personajes populares)
        this.loader.show('Cargando personajes populares...');
        
        try {
            const initialResults = await this.service.getAllCharacters(1, 6);
            this.renderResults(initialResults.items, SearchType.CHARACTERS);
            this.searchState.results = initialResults.items;
            this.searchState.totalItems = initialResults.total;
            this.searchState.totalPages = initialResults.totalPages;
        } catch (error) {
            this.handleError(error);
        } finally {
            this.loader.hide();
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new DragonballApp();
        app.start();
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
        
        // Mostrar error en el DOM
        const root = document.getElementById('results') || document.body;
        root.innerHTML = `
            <div class="fatal-error">
                <h2>Error al iniciar la aplicación</h2>
                <p>${error instanceof Error ? error.message : 'Error desconocido'}</p>
                <button onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
});

// Manejar errores no capturados
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa no manejada:', event.reason);
    
    const errorContainer = document.getElementById('errorMessage');
    if (errorContainer) {
        const errorMessage = new ErrorMessage({
            message: 'Error inesperado en la aplicación',
            type: 'error',
            onDismiss: () => {
                errorContainer.innerHTML = '';
            }
        });
        errorContainer.appendChild(errorMessage.getElement());
    }
});

// Exportar para debugging
export default DragonballApp;
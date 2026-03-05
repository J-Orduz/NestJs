import { SearchType } from '../types/dragonball.types';

// Configuración del componente de búsqueda
interface SearchBarConfig {
    onSearch: (term: string, type: SearchType) => void;
    placeholder?: string;
    initialType?: SearchType;
}

// Componente de barra de búsqueda
export class SearchBar {
    private element: HTMLDivElement;
    private searchInput: HTMLInputElement;
    private typeSelect: HTMLSelectElement;
    private searchButton: HTMLButtonElement;
    private currentType: SearchType;

    constructor(private config: SearchBarConfig) {
        this.currentType = config.initialType || SearchType.CHARACTERS;
        this.element = document.createElement('div');
        this.element.className = 'search-bar-container';
        
        this.render();
        this.attachEvents();
    }

    // Renderiza el componente
    private render(): void {
        this.element.innerHTML = `
            <div class="search-bar">
                <select class="search-type-select" aria-label="Tipo de búsqueda">
                    <option value="${SearchType.CHARACTERS}" ${
                        this.currentType === SearchType.CHARACTERS ? 'selected' : ''
                    }>Personajes</option>
                    <option value="${SearchType.PLANETS}" ${
                        this.currentType === SearchType.PLANETS ? 'selected' : ''
                    }>Planetas</option>
                    <option value="${SearchType.TRANSFORMATIONS}" ${
                        this.currentType === SearchType.TRANSFORMATIONS ? 'selected' : ''
                    }>Transformaciones</option>
                </select>
                
                <div class="search-input-group">
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="${this.config.placeholder || 'Buscar por nombre o ID...'}"
                        aria-label="Término de búsqueda"
                    >
                    <button class="search-button" aria-label="Buscar">
                        <span class="search-icon">🔍</span>
                        Buscar
                    </button>
                </div>
            </div>
        `;

        // Obtener referencias a los elementos
        this.typeSelect = this.element.querySelector('.search-type-select')!;
        this.searchInput = this.element.querySelector('.search-input')!;
        this.searchButton = this.element.querySelector('.search-button')!;
    }

    // Adjunta los event listeners
    private attachEvents(): void {
        // Búsqueda al hacer clic en el botón
        this.searchButton.addEventListener('click', () => {
            this.performSearch();
        });

        // Búsqueda al presionar Enter
        this.searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
        });

        // Cambiar tipo de búsqueda
        this.typeSelect.addEventListener('change', () => {
            this.currentType = this.typeSelect.value as SearchType;
            this.searchInput.placeholder = this.getPlaceholderByType();
        });

        // Debounce para búsqueda automática
        this.searchInput.addEventListener('input', this.debounce(() => {
            if (this.searchInput.value.length >= 3) {
                this.performSearch();
            }
        }, 500));
    }

    // Ejecuta la búsqueda
    private performSearch(): void {
        const term = this.searchInput.value.trim();
        if (term.length < 1) {
            this.showError('Ingresa al menos 1 caracter');
            return;
        }

        this.config.onSearch(term, this.currentType);
    }

    //Obtiene el placeholder según el tipo de búsqueda
    private getPlaceholderByType(): string {
        const placeholders = {
            [SearchType.CHARACTERS]: 'Ej: Goku, Vegeta, 1...',
            [SearchType.PLANETS]: 'Ej: Namek, Tierra, 1...',
            [SearchType.TRANSFORMATIONS]: 'Ej: Super Saiyan, 1...'
        };
        return placeholders[this.currentType];
    }

    // Muestra un error temporal
    private showError(message: string): void {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'search-error';
        errorDiv.textContent = message;
        
        this.element.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    private debounce(func: Function, wait: number): () => void {
        let timeout: number | null = null;
        return () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => func(), wait);
        };
    }

    // Limpia el input de búsqueda
    public clear(): void {
        this.searchInput.value = '';
    }

    // Establece un valor en el input
    public setValue(value: string): void {
        this.searchInput.value = value;
    }

    // Obtiene el elemento DOM del componente
    public getElement(): HTMLElement {
        return this.element;
    }

    // Habilita/deshabilita el componente
    public setEnabled(enabled: boolean): void {
        this.searchInput.disabled = !enabled;
        this.searchButton.disabled = !enabled;
        this.typeSelect.disabled = !enabled;
    }

    // Destruye el componente y limpia eventos
    public destroy(): void {
        // Remover event listeners
        this.searchButton.removeEventListener('click', this.performSearch);
        this.searchInput.removeEventListener('keypress', this.performSearch);
        this.typeSelect.removeEventListener('change', () => {});
        
        // Remover del DOM
        this.element.remove();
    }
}
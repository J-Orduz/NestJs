import { Planet } from '../models/dragonball.models';

// Configuración de la tarjeta de planeta
interface PlanetCardConfig {
    planet: Planet;
    onClick?: (planet: Planet) => void;
    showCharacters?: boolean;
}

// Componente tarjeta de planeta
export class PlanetCard {
    private element: HTMLDivElement;
    private planet: Planet;
    private charactersExpanded: boolean = false;

    constructor(private config: PlanetCardConfig) {
        this.planet = config.planet;
        this.element = document.createElement('div');
        this.element.className = 'planet-card';
        
        this.render();
        this.attachEvents();
    }

    // Renderiza la tarjeta
    private render(): void {
        const status = this.planet.getStatus();
        const statusClass = this.planet.isDestroyed ? 'destroyed' : 'intact';
        
        this.element.innerHTML = `
            <div class="planet-card-inner">
                ${this.renderImage()}
                
                <div class="planet-info">
                    <h3 class="planet-name">${this.planet.name}</h3>
                    
                    <div class="planet-status ${statusClass}">
                        ${status}
                    </div>
                    
                    <p class="planet-description">${this.truncateText(this.planet.description, 200)}</p>
                    
                    ${this.renderCharacters()}
                </div>
            </div>
        `;
    }

    // Renderiza la imagen del planeta
    private renderImage(): string {
        const imageUrl = this.planet.getImageUrl();
        const fallbackImage = 'https://via.placeholder.com/300x300?text=Planeta';
        
        return `
            <div class="planet-image-container">
                <img 
                    src="${imageUrl || fallbackImage}" 
                    alt="${this.planet.name}"
                    class="planet-image"
                    onerror="this.src='${fallbackImage}'"
                >
            </div>
        `;
    }

    // Renderiza los personajes del planeta
    private renderCharacters(): string {
        if (!this.config.showCharacters || this.planet.characters.length === 0) {
            return '';
        }

        return `
            <div class="characters-section">
                <button class="characters-toggle">
                    <span>Personajes (${this.planet.characters.length})</span>
                    <span class="toggle-icon">${this.charactersExpanded ? '▼' : '▶'}</span>
                </button>
                
                ${this.charactersExpanded ? `
                    <div class="characters-mini-list">
                        ${this.planet.characters.slice(0, 5).map(c => `
                            <div class="mini-character">
                                <img 
                                    src="${c.getImageUrl() || 'https://via.placeholder.com/50x50'}" 
                                    alt="${c.name}"
                                    class="mini-character-image"
                                >
                                <span class="mini-character-name">${c.name}</span>
                            </div>
                        `).join('')}
                        ${this.planet.characters.length > 5 ? 
                            `<div class="more-characters">+${this.planet.characters.length - 5} más</div>` 
                            : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Adjunta eventos
    private attachEvents(): void {
        this.element.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).closest('.characters-toggle')) {
                this.config.onClick?.(this.planet);
            }
        });

        const toggleBtn = this.element.querySelector('.characters-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCharacters();
            });
        }
    }

    //Alterna la visualización de personajes
    private toggleCharacters(): void {
        this.charactersExpanded = !this.charactersExpanded;
        this.render();
        this.attachEvents();
    }

    // Trunca texto largo
    private truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Obtiene el elemento DOM
    public getElement(): HTMLElement {
        return this.element;
    }

    // Destruye el componente
    public destroy(): void {
        this.element.remove();
    }
}
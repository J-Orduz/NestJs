import { Character } from '../models/dragonball.models';

// Configuración de la tarjeta de personaje
interface CharacterCardConfig {
    character: Character;
    onClick?: (character: Character) => void;
    showTransformations?: boolean;
}

// Componente tarjeta de personaje
export class CharacterCard {
    private element: HTMLDivElement;
    private character: Character;
    private transformationsExpanded: boolean = false;

    constructor(private config: CharacterCardConfig) {
        this.character = config.character;
        this.element = document.createElement('div');
        this.element.className = 'character-card';
        
        this.render();
        this.attachEvents();
    }

    // Renderiza la tarjeta
    private render(): void {
        const powerLevel = this.character.getPowerLevel();
        const powerLevelClass = this.getPowerLevelClass(powerLevel);
        
        this.element.innerHTML = `
            <div class="character-card-inner">
                ${this.renderImage()}
                
                <div class="character-info">
                    <h3 class="character-name">${this.character.name}</h3>
                    
                    <div class="character-badges">
                        <span class="badge race-badge">${this.character.race}</span>
                        <span class="badge gender-badge">${this.character.gender}</span>
                        <span class="badge affiliation-badge">${this.character.affiliation}</span>
                    </div>
                    
                    <div class="character-power">
                        <div class="power-level ${powerLevelClass}">
                            <span class="power-label">Ki:</span>
                            <span class="power-value">${this.character.ki}</span>
                        </div>
                        <div class="max-power">
                            <span class="power-label">Máx Ki:</span>
                            <span class="power-value">${this.character.maxKi}</span>
                        </div>
                    </div>
                    
                    <p class="character-description">${this.truncateText(this.character.description, 150)}</p>
                    
                    ${this.renderTransformations()}
                </div>
            </div>
        `;
    }

    // Renderiza la imagen del personaje
    private renderImage(): string {
        const imageUrl = this.character.getImageUrl();
        const fallbackImage = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
        
        return `
            <div class="character-image-container">
                <img 
                    src="${imageUrl || fallbackImage}" 
                    alt="${this.character.name}"
                    class="character-image"
                    onerror="this.src='${fallbackImage}'"
                >
                ${!imageUrl ? '<span class="no-image-label">Sin imagen</span>' : ''}
            </div>
        `;
    }

    // Renderiza las transformaciones
    private renderTransformations(): string {
        if (!this.config.showTransformations || !this.character.hasTransformations()) {
            return '';
        }

        const transformations = this.character.transformations;
        
        return `
            <div class="transformations-section">
                <button class="transformations-toggle">
                    <span>Transformaciones (${transformations.length})</span>
                    <span class="toggle-icon">${this.transformationsExpanded ? '▼' : '▶'}</span>
                </button>
                
                ${this.transformationsExpanded ? `
                    <div class="transformations-list">
                        ${transformations.map(t => `
                            <div class="transformation-item">
                                <img 
                                    src="${t.getImageUrl() || fallbackImage}" 
                                    alt="${t.name}"
                                    class="transformation-thumbnail"
                                    onerror="this.src='${fallbackImage}'"
                                >
                                <div class="transformation-info">
                                    <span class="transformation-name">${t.name}</span>
                                    <span class="transformation-ki">Ki: ${t.ki}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Adjunta eventos
    private attachEvents(): void {
        // Click en la tarjeta
        this.element.addEventListener('click', (e) => {
            // No disparar si se hizo clic en el botón de transformaciones
            if (!(e.target as HTMLElement).closest('.transformations-toggle')) {
                this.config.onClick?.(this.character);
            }
        });

        // Toggle de transformaciones
        const toggleBtn = this.element.querySelector('.transformations-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTransformations();
            });
        }
    }

    // Alterna la visualización de transformaciones
    private toggleTransformations(): void {
        this.transformationsExpanded = !this.transformationsExpanded;
        this.render();
        this.attachEvents();
    }

    // Determina la clase CSS según el nivel de poder
    private getPowerLevelClass(level: number): string {
        if (level >= 1e9) return 'power-god';
        if (level >= 1e6) return 'power-super';
        if (level >= 1e3) return 'power-high';
        return 'power-normal';
    }

    //Trunca texto largo
    private truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Obtiene el elemento DOM
    public getElement(): HTMLElement {
        return this.element;
    }

    //Actualiza el personaje
    public update(character: Character): void {
        this.character = character;
        this.render();
        this.attachEvents();
    }

    // Destruye el componente
    public destroy(): void {
        this.element.remove();
    }
}
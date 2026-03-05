export class Loader {
    private element: HTMLDivElement;
    private loadingCount: number = 0;

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'loader-container hidden';
        this.element.innerHTML = `
            <div class="loader-spinner">
                <div class="spinner"></div>
                <p class="loader-text">Cargando...</p>
            </div>
        `;
    }

    // Muestra el loader
    public show(message?: string): void {
        this.loadingCount++;
        
        if (message) {
            const textElement = this.element.querySelector('.loader-text');
            if (textElement) {
                textElement.textContent = message;
            }
        }
        
        this.element.classList.remove('hidden');
    }

    // Oculta el loader
    public hide(): void {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        
        if (this.loadingCount === 0) {
            this.element.classList.add('hidden');
        }
    }

    // Fuerza ocultar el loader
    public forceHide(): void {
        this.loadingCount = 0;
        this.element.classList.add('hidden');
    }

    //Obtiene el elemento DOM
    public getElement(): HTMLElement {
        return this.element;
    }
}
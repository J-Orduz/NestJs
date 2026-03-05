import { ApiError } from '../services/dragonball.service';

// Configuración del mensaje de error
interface ErrorMessageConfig {
    message: string;
    type?: 'error' | 'warning' | 'info';
    onRetry?: () => void;
    onDismiss?: () => void;
    autoDismiss?: number; // milisegundos
}

// Componente de mensaje de error
export class ErrorMessage {
    private element: HTMLDivElement;
    private dismissTimeout?: number;

    constructor(private config: ErrorMessageConfig) {
        this.element = document.createElement('div');
        this.element.className = `error-message ${config.type || 'error'}`;
        
        this.render();
        this.attachEvents();
        this.setAutoDismiss();
    }

    // Renderiza el mensaje
    private render(): void {
        this.element.innerHTML = `
            <div class="error-content">
                <span class="error-icon">${this.getIcon()}</span>
                <div class="error-text">
                    <strong>${this.getTitle()}</strong>
                    <p>${this.config.message}</p>
                </div>
                <div class="error-actions">
                    ${this.config.onRetry ? `
                        <button class="retry-button" title="Reintentar">
                            <span>↻</span>
                        </button>
                    ` : ''}
                    ${this.config.onDismiss ? `
                        <button class="dismiss-button" title="Cerrar">
                            <span>✕</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Obtiene el icono según el tipo
    private getIcon(): string {
        const icons = {
            error: '⚠️',
            warning: '⚠',
            info: 'ℹ️'
        };
        return icons[this.config.type || 'error'];
    }

    // Obtiene el título según el tipo
    private getTitle(): string {
        const titles = {
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[this.config.type || 'error'];
    }

    // Adjunta eventos
    private attachEvents(): void {
        const retryBtn = this.element.querySelector('.retry-button');
        const dismissBtn = this.element.querySelector('.dismiss-button');

        retryBtn?.addEventListener('click', () => {
            this.config.onRetry?.();
            this.dismiss();
        });

        dismissBtn?.addEventListener('click', () => {
            this.dismiss();
        });
    }

    private setAutoDismiss(): void {
        if (this.config.autoDismiss) {
            this.dismissTimeout = setTimeout(() => {
                this.dismiss();
            }, this.config.autoDismiss);
        }
    }

    // Descarta el mensaje
    public dismiss(): void {
        if (this.dismissTimeout) {
            clearTimeout(this.dismissTimeout);
        }
        
        this.element.classList.add('fade-out');
        
        setTimeout(() => {
            this.element.remove();
            this.config.onDismiss?.();
        }, 300);
    }

    //Crea un mensaje de error desde ApiError
    public static fromApiError(error: ApiError, onRetry?: () => void): ErrorMessage {
        let message = error.message;
        
        if (error.statusCode === 404) {
            message = 'No se encontraron resultados';
        } else if (error.statusCode === 500) {
            message = 'Error en el servidor. Intenta más tarde';
        } else if (error.statusCode === 429) {
            message = 'Demasiadas peticiones. Espera un momento';
        }

        return new ErrorMessage({
            message,
            type: 'error',
            onRetry,
            onDismiss: () => {}
        });
    }

    // Obtiene el elemento DOM
    public getElement(): HTMLElement {
        return this.element;
    }
}
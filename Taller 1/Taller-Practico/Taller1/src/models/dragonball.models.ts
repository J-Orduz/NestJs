//Modelo base que representa una entidad de Dragon Ball
export abstract class BaseModel {
    constructor(public id: number) {}

    abstract getDisplayName(): string;
    abstract getImageUrl(): string | null;
}

//Modelo para Personajes
export class Character extends BaseModel {
    constructor(
        id: number,
        public name: string,
        public ki: string,
        public maxKi: string,
        public race: string,
        public gender: string,
        public description: string,
        public affiliation: string,
        public imageUrl: string | null,
        public transformations: Transformation[] = []
    ) {
        super(id);
    }

    getDisplayName(): string {
        return this.name;
    }

    getImageUrl(): string | null {
        return this.imageUrl;
    }

    // Calcula el nivel de poder aproximado (parsea el string de ki)
    getPowerLevel(): number {
        const parseKi = (ki: string): number => {
            const multipliers: { [key: string]: number } = {
                'Mil': 1e3,
                'Millón': 1e6,
                'Billón': 1e9
            };
            
            for (const [word, multiplier] of Object.entries(multipliers)) {
                if (ki.includes(word)) {
                    const number = parseFloat(ki.replace(word, '').trim()) || 1;
                    return number * multiplier;
                }
            }
            return parseFloat(ki) || 0;
        };

        return parseKi(this.ki);
    }

    // Verifica si el personaje tiene transformaciones
    hasTransformations(): boolean {
        return this.transformations.length > 0;
    }
}

// Modelo para Planetas
export class Planet extends BaseModel {
    constructor(
        id: number,
        public name: string,
        public description: string,
        public isDestroyed: boolean,
        public imageUrl: string | null,
        public characters: Character[] = []
    ) {
        super(id);
    }

    getDisplayName(): string {
        return this.name;
    }

    getImageUrl(): string | null {
        return this.imageUrl;
    }

    // Estado del planeta (destruido o no)
    getStatus(): string {
        return this.isDestroyed ? '💥 Destruido' : '✅ Intacto';
    }
}

// Modelo para Transformaciones
export class Transformation extends BaseModel {
    constructor(
        id: number,
        public name: string,
        public ki: string,
        public imageUrl: string | null,
        public character?: Character
    ) {
        super(id);
    }

    getDisplayName(): string {
        return this.name;
    }

    getImageUrl(): string | null {
        return this.imageUrl;
    }

    // Nivel de ki como número
    getKiValue(): number {
        return parseFloat(this.ki) || 0;
    }
}

//Factory para crear modelos a partir de respuestas de la API
export class ModelFactory {
    // Crea un Personaje desde datos de API
    static createCharacterFromApi(data: any): Character {
        return new Character(
            data.id,
            data.name || 'Desconocido',
            data.ki || '0',
            data.maxKi || '0',
            data.race || 'Desconocida',
            data.gender || 'Desconocido',
            data.description || '',
            data.affiliation || 'Desconocida',
            data.image || null,
            (data.transformations || []).map((t: any) => 
                ModelFactory.createTransformationFromApi(t)
            )
        );
    }

    // Crea un Planeta desde datos de API
    static createPlanetFromApi(data: any): Planet {
        return new Planet(
            data.id,
            data.name || 'Desconocido',
            data.description || '',
            data.isDestroyed || false,
            data.image || null
        );
    }

    // Crea un Transformation desde datos de API
    static createTransformationFromApi(data: any): Transformation {
            return new Transformation(
            data.id || 0,
            data.name || 'Desconocida',
            data.ki || '0',
            data.image || null // Mapeamos 'image' a 'imageUrl'
            // El parámetro 'character' es opcional en el constructor, lo dejamos sin definir.
        );
    }

    // Crea múltiples personajes desde array de datos API
    static createCharactersFromApiArray(dataArray: any[]): Character[] {
        return dataArray.map(data => this.createCharacterFromApi(data));
    }

    // Crea múltiples planetas desde array de datos API
    static createPlanetsFromApiArray(dataArray: any[]): Planet[] {
        return dataArray.map(data => this.createPlanetFromApi(data));
    }
}
# Taller Nest CRUD

API REST básica en NestJS para administrar instrumentos.

## Descripción
Este proyecto es un modulo que permite administrar el inventario de instrumentos de una tienda, permitiendo consultar, crear, actualizar y eliminar instrumentos. 

## 📁 Estructura principal
- `src/main.ts`: Punto de entrada de la aplicación.
- `src/app.module.ts`: Módulo raíz que importa `InstrumentsModule`.
- `src/instruments/instruments.controller.ts`: Define rutas HTTP para CRUD.
- `src/instruments/instruments.service.ts`: Lógica de negocio y almacenamiento en memoria.
- `src/instruments/dtos/instruments.dto.ts`: DTO para validación de entrada.
- `src/instruments/interfaces/instruments.interface.ts`: Interface del instrumento.


## Ejecutar la API
```bash
npm run start:dev
```
Luego abre `http://localhost:3000`.

## 🔧 Endpoints
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/instruments` | Listar todos los instrumentos |
| GET | `/instruments/:id` | Obtener instrumento por ID |
| POST | `/instruments` | Crear instrumento  |
| PUT | `/instruments/:id` | Actualizar instrumento |
| DELETE | `/instruments/:id` | Eliminar instrumento |

### Ejemplo de body para POST
```json
{
  "name": "Guitarra Stratocaster",
  "type": "guitarra",
  "brand": "Fender"
}

```

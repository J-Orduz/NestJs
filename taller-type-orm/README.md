# Taller TypeORM - API de Libros

Este taller es una aplicación NestJS que implementa un CRUD completo para la gestión de libros utilizando TypeORM y PostgreSQL.

## Descripción del Proyecto

Este proyecto es una API RESTful construida con **NestJS** para gestionar un catálogo de libros. Utiliza **TypeORM** como ORM para interactuar con una base de datos **PostgreSQL** y valida las solicitudes con **class-validator**.

### Características principales:
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Validación de datos con decoradores
- Base de datos PostgreSQL con TypeORM
- Gestión de configuración con variables de entorno

---

## Instalación y Configuración

### 1. Clonar y navegar al proyecto
```bash
cd taller-type-orm
```

### 2. Instalar dependencias base
```bash
npm install
```

### 3. Instalar el driver de PostgreSQL
```bash
npm install pg
```

### 4. Instalar módulo de configuración de NestJS
```bash
npm install @nestjs/config
```

### 5. Instalar class validator y class transformer
```bash
npm install class-validator class-transformer
```

---

## Endpoints de la API

Base URL: `http://localhost:3000/books`

### 1. Obtener todos los libros
```http
GET /books
```

**Respuesta (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "titulo": "Harry Potter",
    "autor": "J.K. Rowling",
    "anio": 1997,
    "disponible": true
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "titulo": "El Quijote",
    "autor": "Miguel de Cervantes",
    "anio": 1605,
    "disponible": true
  }
]
```

---

### 2. Obtener un libro por ID
```http
GET /books/:id
```

**Ejemplo:**
```http
GET /books/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Harry Potter",
  "autor": "J.K. Rowling",
  "anio": 1997,
  "disponible": true
}
```

---

### 3. Crear un nuevo libro
```http
POST /books
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "1984",
  "autor": "George Orwell",
  "anio": 1949,
  "disponible": true
}
```

**Respuesta (201 Created):**
```json
{
  "id": "7ce2b820-1fab-22e2-91c5-11d15fd541d9",
  "titulo": "1984",
  "autor": "George Orwell",
  "anio": 1949,
  "disponible": true
}
```

---

### 4. Actualizar un libro
```http
PATCH /books/:id
```

**Ejemplo:**
```http
PATCH /books/550e8400-e29b-41d4-a716-446655440000
```

**Headers:**
```
Content-Type: application/json
```

**Body (campos opcionales):**
```json
{
  "titulo": "Harry Potter y la Piedra Filosofal",
  "disponible": false
}
```

**Respuesta (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Harry Potter y la Piedra Filosofal",
  "autor": "J.K. Rowling",
  "anio": 1997,
  "disponible": false
}
```

---

### 5. Eliminar un libro
```http
DELETE /books/:id
```

**Ejemplo:**
```http
DELETE /books/550e8400-e29b-41d4-a716-446655440000
```

---

## Estructura del Proyecto

```
src/
├── books/
│   ├── entities/
│   │   └── Books.entities.ts      # Entidad de la base de datos
│   ├── dtos/
│   │   ├── books.dto.ts           # DTO para crear libros
│   │   └── updateBooks.dto.ts     # DTO para actualizar libros
│   ├── interfaces/
│   │   └── books.Interface.ts     # Interfaces de libros
│   ├── books.controller.ts        # Rutas y controladores
│   ├── books.service.ts           # Lógica de negocio
│   └── books.module.ts            # Módulo de libros
├── app.module.ts                  # Módulo principal
└── main.ts                        # Punto de entrada
```

---

## Validaciones

Los campos obligatorios para crear y actualizar libros son:

- **titulo**: string (obligatorio)
- **autor**: string (obligatorio)
- **anio**: número positivo (obligatorio)
- **disponible**: booleano (obligatorio)

---
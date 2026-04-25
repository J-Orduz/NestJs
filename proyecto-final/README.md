# Veterinaria PetHealth

## Descripción

Este proyecto es una aplicación backend desarrollada con **NestJS** que proporciona un sistema integral de gestión de usuarios, veterinarios, dueños, mascotas y citas. Permite realizar operaciones CRUD completas sobre estos recursos, incluyendo autenticación segura de usuarios.

### Tecnologías principales:
- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **Node.js**: v18+

## Requisitos previos

Antes de utilizar el proyecto, asegúrate de tener instalado:

- Node.js (versión 18 o superior)
- npm o yarn
- PostgreSQL
- Un gestor de variables de entorno (archivo `.env`)

## Configuración e instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto `Backend/` con la siguiente estructura:

```env
# Base de Datos PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=tu_usuario
DATABASE_PASSWORD=tu_contraseña
DATABASE_NAME=nombre_tu_bd

# Puerto de la aplicación
PORT=3000
```

### 3. Crear la base de datos

Asegúrate de que PostgreSQL esté corriendo y crea la base de datos:

```sql
CREATE DATABASE nombre_tu_bd;
```

## Uso del proyecto

### Ejecutar en modo desarrollo

```bash
npm run start:dev
```

El servidor se iniciará en `http://localhost:3000` (o el puerto especificado en `.env`)


## Endpoints principales

La aplicación expone endpoints para:

- **Autenticación**: Registro e inicio de sesión de usuarios
- **Usuarios**: Crear, leer, actualizar y eliminar usuarios
- **Veterinarios**: Gestionar información de veterinarios

Para más detalles sobre los endpoints, consulta la documentación de la API o explora los controladores en `src/`.

## Notas importantes

- La aplicación requiere una conexión activa a PostgreSQL
- Las credenciales de base de datos deben estar configuradas correctamente en `.env`
- Asegúrate de que el puerto especificado esté disponible en tu máquina

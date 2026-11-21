# Food Store · Sistema de pedidos de comida

Trabajo Práctico Integrador · Programación 4 · Tecnicatura Universitaria en Programación a Distancia (UTN)

**Alumna:** Estefanía Avalos

**Repositorio:** https://github.com/tefiavalos/food-store

[**Video de demostración:**](https://drive.google.com/file/d/1ONQFxdypBZFHSm3GeCIuMU-n7ecMRWyE/view?usp=sharing)

Aplicación web para un negocio de comidas. Los clientes se registran, recorren el catálogo, arman un carrito y confirman pedidos indicando dirección y forma de pago. El administrador gestiona categorías, productos, stock, pedidos y usuarios desde un panel.

- **Backend:** FastAPI + SQLModel + PostgreSQL, arquitectura en capas con Unit of Work, JWT en cookie HttpOnly y roles.
- **Frontend:** React + TypeScript + Vite + Tailwind CSS, TanStack Query / Form / Table, Zustand y Axios.

---

## Requisitos

| Herramienta | Versión                                              |
| ----------- | ---------------------------------------------------- |
| Python      | 3.11, 3.12 o 3.13 (SQLModel no funciona con 3.14)    |
| PostgreSQL  | 15 o superior (para desarrollo se puede usar SQLite) |
| Node.js     | 20.19 o superior                                     |
| pnpm        | 9 o superior (`npm install -g pnpm`)                 |

---

## 1. Backend

```bash
cd backend

# Entorno virtual
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate

# Dependencias
pip install -r requirements.txt

# Variables de entorno
cp .env.example .env        # en Windows (cmd): copy .env.example .env
```

Crear la base de datos en PostgreSQL (una sola vez):

```sql
CREATE DATABASE foodstore_db;
```

y revisar que `DATABASE_URL` en `backend/.env` tenga el usuario y la contraseña de tu PostgreSQL.

Cargar los datos iniciales y levantar la API:

```bash
python -m app.db.seed
uvicorn app.main:app --reload
```

- API: http://localhost:8000/api/v1
- Documentación: http://localhost:8000/docs y http://localhost:8000/redoc

### Variables de entorno del backend (`backend/.env`)

| Variable                      | Descripción                                     | Ejemplo                                                                                           |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                | Conexión a la base                              | `postgresql://postgres:postgres@localhost:5432/foodstore_db` (SQLite: `sqlite:///./foodstore.db`) |
| `SECRET_KEY`                  | Clave para firmar el JWT (mínimo 32 caracteres) | `cambiar-esta-clave-de-al-menos-32-caracteres`                                                    |
| `ALGORITHM`                   | Algoritmo del JWT                               | `HS256`                                                                                           |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token y de la cookie               | `30`                                                                                              |
| `FRONTEND_ORIGIN`             | Origen permitido en CORS                        | `http://localhost:5173`                                                                           |

### Usuario administrador del seed

| Usuario | Contraseña   | Rol   |
| ------- | ------------ | ----- |
| `admin` | `Admin1234!` | admin |

El seed también crea 4 categorías y 8 productos con stock. Se puede ejecutar varias veces: no duplica datos.

---

## 2. Frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env        # en Windows (cmd): copy .env.example .env
pnpm install
pnpm build                  # verifica los tipos y compila
pnpm dev
```

- Aplicación: http://localhost:5173

### Variables de entorno del frontend (`frontend/.env`)

| Variable       | Descripción        | Ejemplo                        |
| -------------- | ------------------ | ------------------------------ |
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api/v1` |

> Usar `localhost` (y no `127.0.0.1`) tanto en el navegador como en `VITE_API_URL` y `FRONTEND_ORIGIN`, para que la cookie de sesión y CORS coincidan.

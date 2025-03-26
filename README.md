# 📆 Reservations API

API RESTful desarrollada con Node.js, Express y MongoDB que permite a los usuarios registrarse, autenticarse y gestionar sus reservas. Incluye validación, seguridad, pruebas unitarias y pruebas de rendimiento.

---

## 📁 Estructura del Proyecto

reservations-api/ ├── src/ │ ├── app.js # Configuración principal de Express │ ├── config/ │ │ └── database.js # Conexión a MongoDB │ ├── controllers/ │ │ ├── authController.js │ │ └── reservationController.js │ ├── middlewares/ │ │ └── authMiddleware.js │ ├── models/ │ │ ├── User.js │ │ └── Reservation.js │ ├── routes/ │ │ ├── authRoutes.js │ │ └── reservationRoutes.js │ ├── services/ │ │ └── reservationService.js │ └── tests/ │ ├── auth.test.js │ └── reservation.test.js ├── scripts/ │ ├── load-test.yml # Prueba de carga (Artillery) │ ├── stress-test.yml # Prueba de estrés (Artillery) │ └── users.csv # Datos de usuarios para pruebas ├── .env # Variables de entorno ├── package.json └── README.md

## 🚀 Funcionalidades

- 🔐 Registro e inicio de sesión con JWT
- 📅 Crear, modificar, cancelar y consultar reservas
- 🔎 Ver disponibilidad por fecha
- ✅ Validaciones:
  - No se permiten fechas pasadas
  - No se permiten reservas duplicadas
- 🛡️ Seguridad básica (JWT, validaciones, manejo de errores)
- 🧪 Pruebas unitarias y funcionales con Jest + Supertest
- 📈 Pruebas de rendimiento con Artillery

---

## 🔧 Instalación y Uso

1. Clonar el repositorio:

```bash
git clone https://github.com/tuusuario/reservations-api.git
cd reservations-api

2. Instalar dependencias:

npm install

3. Configurar archivo .env:

MONGO_URI=mongodb://localhost:27017/reservationsdb
JWT_SECRET=tu_clave_secreta
PORT=5000

4. Iniciar servidor:

node src/app.js

🧪 Pruebas

▶️ Ejecutar pruebas unitarias:

npm test

📊 Pruebas de Rendimiento (Artillery)

▶️ Prueba de carga (10 usuarios/seg durante 30s):

npm run load:test

▶️ Prueba de estrés (50–100 usuarios/seg durante 90s):

npm run stress:test

Asegúrate de que el servidor esté corriendo antes de ejecutar las pruebas.

Endpoints principales

Método	Ruta	Descripción	
POST	/auth/register	Registro de usuario	
POST	/auth/login	Login y obtención de token JWT	
POST	/reservations	Crear una reserva	
GET	/reservations	Obtener reservas del usuario	
PUT	/reservations/:id	Modificar reserva	
DELETE	/reservations/:id	Cancelar reserva	
GET	/reservations/availability?date=YYYY-MM-DD	Consultar disponibilidad

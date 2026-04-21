# 📋 Agenda de Contactos

Stack: **Angular 17** · **Node.js + Express** · **MySQL 8** · **Docker Compose**

---

## 🚀 Despliegue rápido

### 1. Clonar / copiar el proyecto en la VM

```bash
# Sube la carpeta al servidor o clona el repo
scp -r agenda-contactos/ usuario@IP_VM:~/
ssh usuario@IP_VM
cd agenda-contactos
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
nano .env   # Edita las contraseñas y la IP de tu VM
```

> **Importante**: en `VITE_API_URL` pon la IP de tu VM si accedes desde otra máquina:
> ```
> VITE_API_URL=http://192.168.1.100:3001
> ```
> Si solo accedes desde la propia VM, deja `http://localhost:3001`.

### 3. Levantar todo

```bash
docker compose up -d --build
```

El primer build tarda unos minutos (descarga imágenes + instala dependencias + compila Angular).

### 4. Verificar

```bash
docker compose ps          # todos los servicios "Up"
docker compose logs -f     # ver logs en tiempo real
```

- **Frontend** → http://IP_VM (puerto 80)
- **Backend API** → http://IP_VM:3001/api/contacts
- **Health check** → http://IP_VM:3001/health

---

## 🔧 Comandos útiles

```bash
# Ver logs de un servicio
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql

# Reiniciar un servicio tras cambios
docker compose restart backend

# Rebuild completo (tras cambios de código)
docker compose up -d --build

# Parar todo
docker compose down

# Parar y borrar volúmenes (⚠️ borra la BBDD)
docker compose down -v
```

---

## 🗄️ Acceso directo a MySQL

```bash
docker exec -it agenda_mysql mysql -u agenda_user -pagenda_pass agenda_db
```

---

## 📁 Estructura del proyecto

```
agenda-contactos/
├── docker-compose.yml
├── .env.example
├── mysql-init/
│   └── 01-init.sql          ← Schema + datos de ejemplo
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js          ← Servidor Express
│       ├── db.js             ← Pool MySQL con reintentos
│       └── routes/
│           ├── contacts.js   ← CRUD contactos
│           └── upload.js     ← Subida de fotos
└── frontend/
    ├── Dockerfile            ← Build Angular + Nginx
    ├── nginx.conf            ← Proxy /api → backend
    ├── angular.json
    ├── package.json
    └── src/app/
        ├── models/           ← Interfaces TypeScript
        ├── services/         ← ContactService, ToastService
        ├── components/       ← Avatar, ConfirmDialog, Toast
        └── pages/            ← ContactList, ContactDetail, ContactForm
```

---

## 🌐 Funcionalidades

- ✅ Listar contactos agrupados alfabéticamente
- ✅ Buscar por nombre, apellido, email, teléfono o empresa
- ✅ Crear, editar y eliminar contactos
- ✅ Subir y gestionar foto de perfil (redimensionada a WebP)
- ✅ Marcar/desmarcar favoritos
- ✅ Filtrar solo favoritos
- ✅ Campos: nombre, apellidos, email, 2 teléfonos, empresa, dirección, ciudad, país, notas
- ✅ Notificaciones toast
- ✅ Diseño oscuro responsive
- ✅ Datos de ejemplo precargados

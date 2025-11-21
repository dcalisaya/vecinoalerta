# Vecino Alerta 🚨

**Vecino Alerta** es una plataforma de seguridad comunitaria de código abierto diseñada para empoderar a los barrios con tecnología de respuesta rápida ante emergencias.

El sistema permite a los vecinos reportar incidentes, activar alarmas disuasivas y notificar a su comunidad en tiempo real a través de una aplicación móvil, mientras que un comité de seguridad gestiona las alertas desde un panel web centralizado.

## 🚀 Características

- **Botón de Pánico (Botón Rojo):** Activación inmediata de sirenas y notificaciones push.
- **Reportes Silenciosos:** Informar actividad sospechosa sin alertar al perpetrador.
- **Geolocalización:** Ubicación precisa del incidente en tiempo real.
- **Panel de Administración:** Dashboard para el Comité de Seguridad y SuperAdmin.
- **Gestión de Barrios:** Soporte multi-barrio con roles y permisos (RBAC).

## 🛠️ Stack Tecnológico

Este proyecto es un monorepo que contiene:

- **Mobile App:** Flutter (Android/iOS)
- **Web Panel:** React + Vite + Tailwind CSS
- **Backend:** Firebase (Cloud Functions, Firestore, Auth, Messaging)

## 📂 Estructura del Proyecto

```bash
vecino-alerta/
├── vecino-alerta-app/      # Aplicación Móvil (Flutter)
├── vecino-alerta-backend/  # Cloud Functions & Firestore Rules
├── vecino-alerta-panel/    # Panel Web (React)
└── vecino-alerta-docs/     # Documentación
```

## ⚙️ Configuración e Instalación

### Prerrequisitos
- Node.js (v18+)
- Flutter SDK (v3.x+)
- Firebase CLI (`npm install -g firebase-tools`)
- Cuenta de Google/Firebase

### 1. Configuración del Backend (Firebase)

1.  Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2.  Habilita **Authentication** (Email/Password), **Firestore**, y **Functions**.
3.  Actualiza a plan **Blaze** (requerido para Cloud Functions).
4.  En tu terminal:
    ```bash
    firebase login
    firebase use --add <TU_PROJECT_ID>
    ```
5.  Despliega el backend:
    ```bash
    cd vecino-alerta-backend/functions
    npm install
    npm run build
    cd ../..
    firebase deploy --only functions,firestore
    ```

### 2. Configuración del Panel Web

1.  Navega al directorio del panel:
    ```bash
    cd vecino-alerta-panel
    ```
2.  Crea el archivo de entorno:
    ```bash
    cp .env.example .env.local
    ```
3.  Edita `.env.local` con tus credenciales de Firebase (obtenlas en Project Settings > General > Web App).
4.  Instala y corre:
    ```bash
    npm install
    npm run dev
    ```

### 3. Configuración de la App Móvil

1.  Navega al directorio de la app:
    ```bash
    cd vecino-alerta-app
    ```
2.  Configura Firebase para Flutter:
    ```bash
    flutterfire configure
    ```
    *Sigue las instrucciones para seleccionar tu proyecto y plataformas.*
3.  Corre la app:
    ```bash
    flutter run
    ```

## 🔐 Roles y Permisos

El sistema utiliza **Custom Claims** de Firebase Auth.
Para asignar el rol de `superadmin` o `comite` a un usuario, utiliza el script incluido:

```bash
cd vecino-alerta-backend/functions
# Genera una Service Account Key en Firebase Console y guárdala como serviceAccountKey.json
npx ts-node scripts/setRole.ts <EMAIL_USUARIO> <ROL> [BARRIO_ID]
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo y contribuir.

---
*Desarrollado con ❤️ para comunidades más seguras.*

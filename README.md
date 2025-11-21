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

### 🔐 Configuración de Credenciales

Este proyecto NO incluye credenciales reales por seguridad. Debes generar las tuyas propias:

#### 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita los siguientes servicios:
   - **Authentication** (Phone, Email/Password)
   - **Firestore Database**
   - **Cloud Functions**
   - **Cloud Messaging (FCM)**
   - **Hosting**
4. Actualiza a plan **Blaze** (requerido para Cloud Functions)

#### 2. Obtener Credenciales

Ejecuta los siguientes comandos en tu terminal:

```bash
# Login a Firebase
firebase login

# Selecciona tu proyecto
firebase use --add <TU_PROJECT_ID>

# Obtén las credenciales para cada plataforma
firebase apps:sdkconfig web > web-config.json
firebase apps:sdkconfig android > android-config.json
firebase apps:sdkconfig ios > ios-config.json
```

#### 3. Configurar Backend (Cloud Functions)

```bash
cd vecino-alerta-backend/functions

# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus valores
# FIREBASE_PROJECT_ID=tu-project-id
# SIREN_API_URL=https://tu-api-de-sirenas.com
# SIREN_API_KEY=tu-api-key

# Genera Service Account Key desde Firebase Console:
# Settings > Service Accounts > Generate New Private Key
# Guárdala como serviceAccountKey.json

# Instala dependencias
npm install

# Despliega
cd ../..
firebase deploy --only functions,firestore
```

#### 4. Configurar Panel Web

```bash
cd vecino-alerta-panel

# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con los valores de web-config.json:
# VITE_FIREBASE_API_KEY=tu-api-key
# VITE_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID=tu-project-id
# VITE_FIREBASE_STORAGE_BUCKET=tu-project.firebasestorage.app
# VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
# VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
# VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Instala y corre
npm install
npm run dev
```

#### 5. Configurar Firebase (Mobile App)

#### Opción A: Usar FlutterFire CLI (Recomendado)
```bash
cd vecino-alerta-app
flutterfire configure
```

#### Opción B: Manual
```bash
# 1. Copiar el archivo example
cd vecino-alerta-app/lib
cp firebase_options.example.dart firebase_options.dart

# 2. Obtener credenciales de Firebase
firebase apps:sdkconfig web --project vecinoalerta-2e0de
firebase apps:sdkconfig android --project vecinoalerta-2e0de
firebase apps:sdkconfig ios --project vecinoalerta-2e0de

# 3. Reemplazar los placeholders YOUR_* en firebase_options.dart
# con las credenciales reales obtenidas
```
 (Android App)
#    y colócalo en: android/app/google-services.json
# 2. Descarga GoogleService-Info.plist (iOS App)
#    y colócalo en: ios/Runner/GoogleService-Info.plist
# 3. Edita lib/firebase_options.dart con tus credenciales

# Instala dependencias
flutter pub get

# Corre la app
flutter run
```

### 1. Configuración del Backend (Firebase)


## 🔐 Roles y Permisos

El sistema utiliza **Custom Claims** de Firebase Auth.
Para asignar el rol de `superadmin` o `comite` a un usuario:

```bash
cd vecino-alerta-backend/functions
# Asegúrate de tener serviceAccountKey.json configurado
npx ts-node scripts/setRole.ts <EMAIL_USUARIO> <ROL> [BARRIO_ID]
```

Roles disponibles:
- `superadmin`: Acceso total al sistema
- `comite`: Gestión de un barrio específico

## ⚠️ Archivos Sensibles (NO SUBIR A GIT)

Los siguientes archivos contienen credenciales y están excluidos del repositorio:

- `vecino-alerta-app/lib/firebase_options.dart`
- `vecino-alerta-app/android/app/google-services.json`
- `vecino-alerta-app/ios/Runner/GoogleService-Info.plist`
- `vecino-alerta-backend/functions/serviceAccountKey.json`
- `vecino-alerta-backend/functions/.env`
- `vecino-alerta-panel/.env.local`

**Usa siempre los archivos `.example` como referencia.**


## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo y contribuir.

---
*Desarrollado con ❤️ para comunidades más seguras.*

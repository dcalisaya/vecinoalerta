# Roadmap: Vecino Alerta

Este documento detalla el plan de implementación paso a paso para el proyecto Vecino Alerta, basado en `BRIEF.MD` y `AGENTS.MD`.

## FASE 0: Inicialización y Configuración
**Estimación:** 1-2 días
**Límite:** N/A (Configuración interna)

- [x] **Estructura de Repositorios**
    - Crear `/vecino-alerta-app` (Flutter)
    - Crear `/vecino-alerta-backend` (Firebase Functions)
    - Crear `/vecino-alerta-panel` (React + Vite)
    - Crear `/vecino-alerta-docs` (Documentación)
- [x] **Documentación Inicial**
    - Copiar `BRIEF.MD` y `AGENTS.MD` a `/vecino-alerta-docs`
    - Crear README.md en cada repositorio

## FASE 1: Backend (Firebase)
**Estimación:** 1-2 semanas
**Límite:** Entorno de Desarrollo (Emuladores), 0 usuarios reales.

- [x] **Configuración de Proyecto**
    - Inicializar Firebase (Firestore, Auth, Functions)
    - Configurar entorno de desarrollo
- [x] **Base de Datos (Firestore)**
    - Definir colecciones: `barrios`, `usuarios`, `incidentes`, `analytics`
    - Implementar reglas de seguridad (Firestore Rules)
- [x] **Authentication & Roles**
    - Configurar PhoneAuth
    - Implementar Custom Claims (`superadmin`, `comite`, `vecino`, `barrioId`)
    - Implementar lógica de asignación de roles
- [x] **Cloud Functions**
    - Implementar `triggerEmergency` (Integración con Sirena + Modo Prueba)
    - Implementar `cancelEmergency`
    - Implementar `createSilentReport`
    - Implementar `getHeatmapData`
    - Implementar `generateMonthlyReport` (Scheduled)
    - Implementar `checkGuardianAvailability` (Flujo Guardianes)
- [x] **Gestión de Dispositivos (SuperAdmin)**
    - API para registrar/probar sirenas (Tuya/Sonoff/Shelly)
    - Implementar `testSiren` (Modo Prueba)

## FASE 2: Aplicación Móvil (Flutter)
**Estimación:** 2-3 semanas
**Límite:** Alpha Test (Internal), Máx 10 usuarios (Equipo + Comité Piloto).

- [x] **Setup**
    - `flutter create`
    - Configurar paquetes de Firebase (Core, Auth, Firestore, Functions, Messaging)
- [x] **UI/UX - Pantallas**
    - Onboarding (Login/Registro)
    - Home (Botón de Pánico, Estado, Modo Prueba)
    - PanicConfirm (Cuenta regresiva)
    - SilentReport (Formulario simple)
    - Success (Feedback visual)
- [x] **Lógica de Negocio**
    - Integración con PhoneAuth
    - Gestión de estado y Roles (Mostrar/Ocultar funciones según rol)
    - Geolocalización (GPS)
    - Llamadas a Cloud Functions
    - Recepción de Push Notifications (FCM)

## FASE 3: Panel Web (React + Vite)
**Estimación:** 2 semanas
**Límite:** Beta Test (1 Barrio Real), Máx 100 usuarios.

- [x] **Setup**
    - Crear proyecto Vite + React + Tailwind
    - Configurar Firebase Web SDK
- [x] **Módulos Comité**
    - Login (Admin/Comité)
    - Dashboard Principal
    - Mapa de Calor (Visualización de incidentes)
    - Listado de Alertas
    - Generador de Reportes PDF
    - Gestión de Guardianes
- [x] **Módulos SuperAdmin**
    - Dashboard Nacional (Métricas Globales)
    - Gestión de Barrios (Crear/Editar/Borrar)
    - Gestión de Sirenas (Vincular/Probar)
    - Logs del Sistema

## FASE 4: Verificación y Despliegue
**Estimación:** 1 semana
**Límite:** Producción (Multi-barrio), Sin límite de usuarios.
- [x] **Testing**
    - Unit Tests (Backend & Frontend)
    - Integration Tests (Flujo completo de alerta)
- [x] **Despliegue**
    - Backend: `firebase deploy --only functions,firestore`
    - Web: Despliegue en Vercel o Firebase Hosting
    - Mobile: Generar APK/AAB y build de iOS
- [x] **Manuales**
    - Guía de despliegue para nuevos barrios
    - Manual de usuario final
    - Mantenimiento de "Estado del Arte" y comparativas

## Detalle Técnico: Integración Sirena
La función `triggerEmergency` realizará una petición POST a la API del dispositivo IoT.
**Ejemplo de implementación:**
- **URL:** `https://api.tuya-ejemplo.com/v1.0/devices/{device_id}/commands` (Configurable)
- **Método:** `POST`
- **Headers:** Authorization, Content-Type
- **Body:** `{"state": "ON", "duration": 60}`

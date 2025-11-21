**1. Repositorios que el Agent debe crear sí o sí**

Estructura exacta y final (usar estos nombres):

/vecino-alerta-app         // Flutter – Aplicación móvil
/vecino-alerta-backend     // Firebase Cloud Functions (Node 20)
/vecino-alerta-panel       // React + Vite (Panel Web del Comité)
/vecino-alerta-docs        // Documentación técnica, arquitectura y manuales

**2. Flujo de trabajo obligatorio para el Agent**

Crear los 4 repositorios.

Configurar Firebase Project:

Firestore

Authentication (PhoneAuth)

Cloud Functions

AppCheck

Cloud Messaging

Implementar la app móvil EXACTAMENTE como se indica en el MD.

Implementar el backend EXACTAMENTE con las funciones descritas.

Implementar el panel del comité (mapa, analíticas y reportes PDF).

Configurar CI/CD:

Vercel para panel

Flutter build pipelines (Android + iOS)

Firebase deploy automático

Generar documentación en /vecino-alerta-docs.

**3. Arquitectura Firebase que el Agent debe desplegar**

El Agent debe ejecutar esta arquitectura:

Firestore
  /barrios/{barrioId}
     nombre
     logo
     geofence_radius
     sirena_device
     createdAt

  /barrios/{barrioId}/usuarios/{uid}
     name
     phone
     isGuardian
     createdAt
     pushToken
     direccionAprox

  /barrios/{barrioId}/incidentes/{incidenteId}
     type
     location
     timestamp
     confirmedReal
     uid
     resolved
     reportDetails?

  /barrios/{barrioId}/analytics/{docId}
     heatmap
     horasPico
     updatedAt


El Agent debe aplicar reglas de seguridad Firestore:

allow read, write: if request.auth.token.barrioId == barrioId;


Y debe añadir:

App Check

Rate Limits

Validación de GPS

4. Especificaciones Funcionales y de Seguridad (CRÍTICO)

✅ 4.1. Matriz de Roles y Permisos
El sistema implementa un control de acceso estricto basado en 4 roles (RBAC).

| Permiso / Acción | 🔵 Vecino | 🟢 Comité | 🟠 Hardware Mgr | 🔴 SuperAdmin |
| :--- | :---: | :---: | :---: | :---: |
| **Activar Botón Pánico** | ✅ | ✅ | ❌ | ❌ |
| **Reporte Silencioso** | ✅ | ✅ | ❌ | ❌ |
| **Ver Mapa de Calor** | ❌ | ✅ | ❌ | ✅ (Global) |
| **Gestión de Usuarios** | ❌ | ✅ (Su barrio) | ❌ | ✅ (Global) |
| **Configurar Sirena (WiFi/API)** | ❌ | ❌ | ✅ | ✅ |
| **Activar Sirena (Manual)** | ❌ | ✅ | ✅ (Test) | ✅ (Test) |
| **Crear/Borrar Barrios** | ❌ | ❌ | ❌ | ✅ |
| **Ver Logs Técnicos** | ❌ | ❌ | ✅ | ✅ |

✅ 4.2. Integración de Sirenas y Hardware
El sistema es agnóstico al hardware, soportando múltiples protocolos mediante adaptadores en Cloud Functions.

**Tabla de Compatibilidad:**
| Marca | Protocolo | Seguridad | Latencia |
| :--- | :--- | :--- | :--- |
| **Tuya / Smart Life** | HTTP API | Token OAuth | 1-2s |
| **Sonoff (eWeLink)** | HTTP / LAN | AppID / API Key | <1s (LAN) |
| **Shelly** | Webhooks | Basic Auth | <500ms |
| **DIY (ESP32)** | MQTT / POST | Token Propio | <500ms |

**Seguridad de la API de Sirena:**
- **Protocolo:** HTTPS obligatorio para llamadas externas.
- **Manejo de Errores:** Reintento automático (max 3 intentos) en caso de timeout.
- **Anti-Abuso:**
    - **Rate Limiting:** Máx 1 activación cada 60s por barrio (salvo cancelación).
    - **Bloqueo:** Si un dispositivo falla >10 veces seguidas, se marca como `offline` y notifica al Comité.
    - **Logs:** Registro inmutable de cada activación (`/barrios/{id}/sirena_logs`).

✅ 4.3. Lógica del Botón de Pánico (Botón Rojo)
El núcleo del sistema. Debe funcionar con latencia mínima y alta fiabilidad.

**Estados Visuales en App:**
1.  **Idle (Reposo):** Botón rojo visible.
2.  **Countdown (Pre-alarma):** 3 segundos de cuenta regresiva (cancelable).
3.  **Active (Alarma):** Pantalla roja pulsante, sirena sonando (60s).
4.  **Cooldown:** 30s de espera antes de permitir nueva activación (evita spam).

**Comportamiento Técnico:**
- **Latencia Esperada:** < 2 segundos desde confirmación hasta sonido físico.
- **Offline:** Si no hay internet, la app muestra error inmediato y sugiere llamar al 911. (No hay "store & forward" para emergencias críticas).
- **Activación Simultánea:** Si dos vecinos activan a la vez, el sistema mantiene la alarma activa y registra ambos eventos.

✅ 4.4. Ciclo de Vida del Incidente
Todo evento sigue un flujo de estados estricto para garantizar trazabilidad.

`PENDIENTE` (Cuenta regresiva) → `REAL` (Confirmado) → `RESUELTO` (Comité cierra) → `ARCHIVADO` (30 días)

- **Creación:** Al terminar el countdown.
- **Actualización:** El Comité puede agregar notas ("Falsa alarma", "Policía en camino").
- **Cierre:** Manual por Comité o automático tras 2 horas.
- **Eliminación:** Datos sensibles (ubicación exacta) se borran/anonimizan a los 30 días.

✅ 4.5. Flujo de Guardianes
Los "Guardianes" son vecinos de confianza designados para respuesta rápida.

1.  **Asignación:** El Comité selecciona UIDs específicos en `/barrios/{id}/guardianes`.
2.  **Notificación Prioritaria:**
    - Alerta crítica (sonido fuerte) incluso en "No Molestar" (usando canales de notificación crítica en iOS/Android).
    - Reciben ubicación exacta del incidente.
3.  **Fallo de Cobertura:** Si el sistema detecta < 2 guardianes activos (por heartbeat), envía notificación estándar a *todo* el barrio como respaldo.

✅ 4.6. Privacidad y Protección de Datos
El sistema está diseñado bajo el principio de "Privacy by Design".

- **Datos Almacenados:** Nombre, Teléfono, Dirección aproximada (para geofence), Token FCM.
- **Datos NO Almacenados:** Historial de ubicación en tiempo real, audio ambiente, contactos de la agenda.
- **Retención:** Los incidentes se anonimizan a los 30 días (se borra la referencia al UID y la ubicación exacta).
- **Borrado:** El usuario puede solicitar "Eliminar mi cuenta" desde la app, lo que dispara una Cloud Function que borra sus datos de `/usuarios` y `/barrios`.

✅ 4.7. Seguridad y Reglas Firestore Completas
Reglas de seguridad robustas para prevenir accesos no autorizados.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función auxiliar para verificar roles
    function hasRole(role) {
      return request.auth.token.role == role;
    }

    // 1. Barrios: Solo SuperAdmin crea, Comité lee su barrio
    match /barrios/{barrioId} {
      allow create: if hasRole('superadmin');
      allow read: if hasRole('superadmin') || (request.auth.token.barrioId == barrioId);
      allow update: if hasRole('superadmin') || (hasRole('comite') && request.auth.token.barrioId == barrioId);
      
      // 2. Sirenas: Solo Hardware Manager y SuperAdmin tocan configuración
      match /sirena/{docId} {
        allow read: if request.auth.token.barrioId == barrioId;
        allow write: if (hasRole('hardware_manager') || hasRole('superadmin')) && request.auth.token.barrioId == barrioId;
      }

      // 3. Incidentes: Vecino crea, Comité gestiona
      match /incidentes/{incidenteId} {
        allow create: if request.auth.token.barrioId == barrioId; // Cualquier vecino del barrio
        allow read: if request.auth.token.barrioId == barrioId;
        allow update: if hasRole('comite') && request.auth.token.barrioId == barrioId; // Solo comité cierra/comenta
      }
      
      // 4. Usuarios: Cada uno lee su perfil, Comité lee todos los de su barrio
      match /usuarios/{uid} {
        allow read: if request.auth.uid == uid || (hasRole('comite') && request.auth.token.barrioId == barrioId);
        allow write: if request.auth.uid == uid; // Solo editar propios datos (foto/nombre)
      }
    }
  }
}
```

✅ 4.8. Panel de Administración Nacional (SuperAdmin)
Herramienta centralizada para el mantenimiento del ecosistema.

- **Métricas Globales:** Total de barrios activos, incidentes últimas 24h, estado de salud de sirenas (online/offline).
- **Gestión de Barrios:** Alta de nuevos barrios, generación de códigos de invitación para Comités.
- **Herramientas de Soporte:**
    - `Test Siren`: Dispara prueba de 2s en cualquier barrio.
    - `Reset Admin`: Restablece acceso al Comité si pierden el teléfono.
    - `Audit Log`: Ver quién modificó qué configuración crítica.

✅ 4.9. Estrategia de Testing y QA
El Agent debe generar tests para garantizar estabilidad.

- **Unit Tests (Jest):** Para todas las Cloud Functions (especialmente `triggerEmergency` y lógica de roles).
- **Integration Tests:** Simular flujo completo: `Crear Incidente` -> `Firestore Trigger` -> `Llamada API Sirena` -> `Push Notification`.
- **E2E (Flutter Driver / Patrol):** Test automático de UI: Login -> Pantalla Roja -> Cancelar Cuenta Regresiva.

✅ 4.10. Pipeline de CI/CD
Automatización obligatoria para despliegues seguros.

- **GitHub Actions:**
    - `on: push to main`: Ejecutar linter y tests unitarios.
    - `on: tag`: Despliegue a producción.
- **Firebase Deploy:** Automático para Functions y Firestore Rules tras pasar tests.
- **Mobile:**
    - Android: Build APK y subir a Firebase App Distribution.
    - iOS: Build IPA (requiere Fastlane configurado).

✅ 4.11. Manual de Adopción y Sostenibilidad
Guía para que un barrio nuevo empiece desde cero.

1.  **Solicitud:** El barrio contacta al SuperAdmin (o usa formulario web).
2.  **Setup:** SuperAdmin crea el barrio en Panel Nacional -> Se genera `barrioId` y QR de invitación.
3.  **Hardware:** El electricista del barrio instala la sirena (Tuya/Sonoff) y el Hardware Manager la vincula en la app.
4.  **Onboarding:** Los vecinos escanean el QR, validan SMS y quedan asignados al barrio automáticamente.
5.  **Simulacro:** Se agendará un día de prueba (Modo Test) para que todos escuchen la sirena y validen notificaciones.

**Sostenibilidad:**
- Proyecto 100% Open Source.
- Modelo de donaciones voluntarias o venta de "Kits de Sirena Pre-configurados" para financiar servidores.

✅ NIVEL 2 — Instrucciones ultra detalladas para Copilot (para que genere el código sin errores)

Eres un AI Software Engineer senior encargado de construir una aplicación completa llamada VECINO ALERTA basada en los requerimientos del archivo AGENTS.MD.

Tu misión consiste en crear todos los repositorios, carpetas, archivos y código necesarios para entregar un sistema funcional, verificable y compilable sin intervención humana.

Debes seguir EXACTAMENTE estas reglas:

1. Crear 4 repositorios:

/vecino-alerta-app (Flutter)

/vecino-alerta-backend (Firebase Functions – Node 20)

/vecino-alerta-panel (React + Vite + Tailwind)

/vecino-alerta-docs (Arquitectura, manuales, diagramas, API specs)

2. Implementar la estructura de datos Firestore descrita en AGENTS.MD, incluyendo colecciones por barrio.
3. Implementar Authentication con PhoneAuth y customClaims.barrioId.
4. Implementar EXACTAMENTE las 5 pantallas Flutter indicadas:

Onboarding

Home

PanicConfirm

SilentReport

Success

Respeta colores, tamaños de botones y UX simplificada.

5. Backend obligatorio:

Crear las Cloud Functions:

triggerEmergency

cancelEmergency

createSilentReport

getHeatmapData

generateMonthlyReport (scheduler)

6. Conectar sirena física usando Axios + API Tuya/Sonoff.
   Nota: La función triggerEmergency debe ejecutar un POST a [URL_DE_EJEMPLO] con el body {"state": "ON", "duration": 60}.
7. Crear panel web con:

Heatmap de incidentes

Gráficos (Chart.js o Recharts)

Listado de alertas

Botón “Generar PDF”

8. Documentación completa:

Diagrama de arquitectura

API REST/Callable Specs

Instrucciones de despliegue

Cómo añadir un nuevo barrio en 2 minutos

9. Autotest:

Generar test unitarios y test de integración mínimos.

10. Al terminar cada módulo:

Validar compilación

Validar deploy

Validar integridad de Firestore Rules

Tu objetivo final es producir todo el código fuente funcional, listo para producción, con comentarios en español, cumpliendo exactamente lo descrito en el archivo adjunto.

No inventes funciones ni pantallas adicionales.
No modifiques la UX definida.
No cambies la arquitectura.

Comienza generando la estructura de carpetas de los 4 repositorios.

✅ NIVEL 3 — Estrategia paso a paso que Copilot debe ejecutar (Lista tipo checklist)


FASE 0 — Inicialización
✔ Crear los 4 repositorios
✔ Cargar AGENTS.MD en /vecino-alerta-docs
✔ Crear README global por repo
FASE 1 — Backend Firebase

firebase init

Configurar:

Firestore

Authentication

Cloud Functions

Hosting (solo si quieres)

Implementar:

triggerEmergency

cancelEmergency

createSilentReport

getHeatmapData

generateMonthlyReport

Configurar Sirena API

Escribir Firestore Rules

Crear datos mock para pruebas

Deploy

Test unitarios (Jest)

FASE 2 — App móvil Flutter

flutter create vecino_alerta_app

Añadir dependencias Firebase

Pantallas:

Onboarding

Home

PanicConfirm

SilentReport

Success

Conectar PhoneAuth

Integrar GPS

Integrar Cloud Functions

Integrar Push Notifications (FCM)

Probar en Android + iOS

Generar APK + IPA TestFlight

FASE 3 — Panel Web (React + Vite + Tailwind)

Crear proyecto

Añadir Firebase Web SDK

Implementar:

Login

Dashboard

Heatmap

Charts

Tabla incidentes

PDF generator

Deploy en Vercel

Test de funcionamiento

FASE 4 — Documentación

Arquitectura

Manual para agregar un barrio

Manual para comité

Manual técnico para desarrolladores

Esquema de extender la app a nivel nacional


## Estado del Arte y Diferenciadores

Esta sección resume las principales aplicaciones y plataformas de seguridad vecinal existentes en Latinoamérica y destaca cómo Vecino Alerta se diferencia de ellas, qué aprendizajes incorpora y qué riesgos evita.

### Tabla comparativa de soluciones

| Plataforma / App | Características Principales | Limitaciones | ¿Cómo se compara con Vecino Alerta? |
| :--- | :--- | :--- | :--- |
| **Red Alerta Vecinal / Barrio Seguro (AR)** | App + sirena comunitaria + alertas geolocalizadas. | Solución cerrada de proveedor; hardware propietario. | VA es open source, multi-barrio y permite sirenas de múltiples marcas (Tuya/Sonoff/Shelly). |
| **SOSAFE (CL/LatAm)** | Red social de reportes ciudadanos, mapa público y alertas. | Mucho ruido, feed saturado, enfoque social más que operativo. | VA elimina el ruido: sin feed, sin chat, solo alertas críticas con botón único. |
| **Vigila App (LatAm)** | App de seguridad ciudadana con estadísticas y alertas. | Funcionalidad amplia pero compleja; no orientada a adulto mayor. | VA prioriza máxima simplicidad: 3 botones y UX para +65 años. |
| **Enjambre Ciudadano (MX)** | Redes de seguridad vecinal y protocolos de prevención. | Más formativo que operativo; no integra sirenas ni panel analítico. | VA combina acción inmediata (sirena) con datos accionables para comités. |
| **Alerta Vecinal MX** | App de alertas en fraccionamientos y comunidades. | Depende de proveedor; sin estandarización de sirenas ni openness. | VA ofrece un estándar abierto nacional para cualquier barrio. |
| **CommunityWebAlarm (LatAm)** | App + central física; sirenas y reflectores. | Hardware rígido; requiere equipos propietarios. | VA soporta cualquier sirena WiFi y permite kits certificados opcionales. |
| **Comuna Conectada (CL)** | Reporte de incivilidades y canal con municipio. | Enfoque institucional, no apto para barrios autosuficientes. | VA funciona sin municipio, solo con vecinos y comité. |
| **Alerta Ciudadana La Matanza (AR)** | Conexión con centro de monitoreo municipal. | No es replicable barrio a barrio; depende del gobierno. | VA es instalable en 15 días por el propio barrio. |
### En qué nos diferenciamos (propuesta de valor única)

Vecino Alerta se distingue de todas las plataformas existentes por cinco principios fundamentales:

1. **Simplicidad extrema → diseñada para adultos mayores**
   - Solo tres botones: Emergencia, Falsa Alarma, Reporte Silencioso.
   - Sin feed social, sin chat, sin distracciones.

2. **Integración nativa con sirenas físicas multi-marca**
   - Compatible con Tuya, Sonoff, Shelly, relés genéricos y hardware DIY.
   - Esto NO lo ofrecen apps más sociales como SOSAFE.
   - Se convierte en el primer estándar abierto para sirenas comunitarias en LatAm.

3. **Multi-barrio desde el día 1**
   - Un solo APK para todo el país.
   - Cada barrio se aísla con su propio tenant y Firestore Rules.
   - Esto permite una adopción nacional sin reprogramar nada.

4. **Datos accionables para comités (no solo alertas)**
   - Mapa de calor por barrio.
   - Patrones por día/hora.
   - Reportes mensuales en PDF para negociar con municipio/policía.
   - Ninguna app vecinal gratuita entrega analítica barrial pura y simple.

5. **100% Open Source + independiente de proveedores**
   - No requiere pagar hosting.
   - No requiere centros de monitoreo gubernamentales.
   - Permite personalización y auto-gestión comunitaria.

### Riesgos identificados en otros proyectos (y cómo Vecino Alerta los mitiga)

1. **Ruido y saturación de información**
   - *Problema:* Común en SOSAFE, grupos de WhatsApp, apps con feed social.
   - *Mitigación VA:* No hay chat interno, solo alertas priorizadas.

2. **Complejidad para adultos mayores**
   - *Problema:* Muchas apps tienen demasiadas opciones (mapas, chats, perfiles, menús).
   - *Mitigación VA:* Interfaz minimalista → 3 botones, texto grande, una sola pantalla.

3. **Dependencia de hardware propietario**
   - *Problema:* Sistemas como Vigmo, HalTel y Basapp requieren centrales y equipos cerrados.
   - *Mitigación VA:* Arquitectura abierta + kits certificados opcionales.

4. **Problemas de privacidad al compartir ubicación públicamente**
   - *Problema:* Citizen y redes de reportes abiertos.
   - *Mitigación VA:*
     - La ubicación del incidente solo va a guardianes y vecinos en 50m.
     - El Comité no ve nombres, solo patrones agregados.
     - Política de anonimización incluida.

5. **Poca adopción por depender del municipio**
   - *Problema:* Apps como Comuna Conectada y Alerta Ciudadana requieren estructuras gubernamentales.
   - *Mitigación VA:*
     - El barrio puede implementarla solo.
     - No necesita permisos municipales.
     - Panel web autogestionable.

6. **Sistemas demasiado amplios para un MVP**
   - *Problema:* Muchas apps fallan por querer abarcar demasiadas funciones.
   - *Mitigación VA:*
     - MVP reducido a funciones reales y comprobadas.
     - Capacitaciones de 4 minutos testadas.

### Conclusión del Estado del Arte

El ecosistema latinoamericano confirma que existe una necesidad clara de:
- Alertas directas
- Coordinación comunitaria
- Simplicidad
- Integración con sirena
- Datos de valor para comités
- Un sistema abierto, sin dependencia municipal o empresarial

**Vecino Alerta** se posiciona como el primer estándar open source, ultra simple y multi-barrio, diseñado específicamente para la realidad de los barrios latinoamericanos y su población adulta.
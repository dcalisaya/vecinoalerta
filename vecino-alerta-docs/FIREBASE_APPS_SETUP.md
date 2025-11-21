# Guía: Crear Apps iOS y Android en Firebase

## 📋 Información de tu Proyecto

**Package Names actuales:**
- **Android:** `com.vecinoalerta.vecino_alerta_app`
- **iOS:** `com.vecinoalerta.vecinoAlertaApp`
- **Proyecto Firebase:** `vecinoalerta-2e0de`

---

## 📱 Paso 1: Crear App iOS

### 1.1 En Firebase Console

1. Ve a: https://console.firebase.google.com/project/vecinoalerta-2e0de/overview
2. Click en el ícono **iOS** (o "Add app" si no hay apps)
3. Completa el formulario:
   ```
   iOS bundle ID: com.vecinoalerta.vecinoAlertaApp
   App nickname: Vecino Alerta iOS
   App Store ID: (dejar vacío por ahora)
   ```
4. Click **"Register app"**

### 1.2 Descargar GoogleService-Info.plist

1. Click **"Download GoogleService-Info.plist"**
2. Guarda el archivo en tu computadora
3. **IMPORTANTE:** Colócalo en:
   ```
   /Users/imacpro/Developer/vecinoalerta/vecino-alerta-app/ios/Runner/GoogleService-Info.plist
   ```

### 1.3 Verificar en Terminal

```bash
cd /Users/imacpro/Developer/vecinoalerta/vecino-alerta-app

# Verificar que el archivo existe
ls -la ios/Runner/GoogleService-Info.plist

# Obtener configuración vía CLI (alternativa)
firebase apps:sdkconfig ios > ios-config.json
```

---

## 🤖 Paso 2: Crear App Android

### 2.1 En Firebase Console

1. En el mismo proyecto, click en **Android** (o "Add app")
2. Completa el formulario:
   ```
   Android package name: com.vecinoalerta.vecino_alerta_app
   App nickname: Vecino Alerta Android
   Debug signing certificate SHA-1: (opcional - ver abajo)
   ```
3. Click **"Register app"**

### 2.2 Obtener SHA-1 (Opcional pero recomendado para Phone Auth)

```bash
cd /Users/imacpro/Developer/vecinoalerta/vecino-alerta-app/android

# Para debug keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Copia el SHA-1 que aparece y pégalo en Firebase Console
```

### 2.3 Descargar google-services.json

1. Click **"Download google-services.json"**
2. Guarda el archivo
3. **IMPORTANTE:** Colócalo en:
   ```
   /Users/imacpro/Developer/vecinoalerta/vecino-alerta-app/android/app/google-services.json
   ```

### 2.4 Verificar en Terminal

```bash
cd /Users/imacpro/Developer/vecinoalerta/vecino-alerta-app

# Verificar que el archivo existe
ls -la android/app/google-services.json

# Obtener configuración vía CLI (alternativa)
firebase apps:sdkconfig android > android-config.json
```

---

## ✅ Paso 3: Verificar Configuración

### 3.1 Verificar que los archivos NO están en Git

```bash
cd /Users/imacpro/Developer/vecinoalerta

# Estos comandos NO deben mostrar los archivos
git status | grep GoogleService-Info.plist
git status | grep google-services.json

# Si aparecen, el .gitignore está funcionando correctamente
```

### 3.2 Actualizar firebase_options.dart (Opcional)

Si prefieres usar FlutterFire CLI para regenerar automáticamente:

```bash
cd vecino-alerta-app

# Esto regenerará firebase_options.dart con las nuevas apps
flutterfire configure
```

**O manualmente**, edita `lib/firebase_options.dart` con los valores de:
- `firebase apps:sdkconfig ios`
- `firebase apps:sdkconfig android`

---

## 🔧 Paso 4: Habilitar Phone Authentication

### 4.1 En Firebase Console

1. Ve a **Authentication** → **Sign-in method**
2. Click en **Phone**
3. Click **Enable**
4. Agrega números de prueba (opcional):
   ```
   +1 650-555-3434 → Código: 123456
   ```
5. **Save**

### 4.2 Para iOS (Configuración adicional)

1. En Firebase Console → **Project Settings** → **iOS app**
2. Scroll hasta **App Check** (opcional pero recomendado)
3. Configura APNs (Apple Push Notification service):
   - Sube tu **APNs Authentication Key** (.p8)
   - O tu **APNs Certificate** (.p12)

---

## 📝 Checklist Final

- [ ] App iOS creada en Firebase Console
- [ ] `GoogleService-Info.plist` descargado y colocado en `ios/Runner/`
- [ ] App Android creada en Firebase Console
- [ ] `google-services.json` descargado y colocado en `android/app/`
- [ ] SHA-1 agregado (opcional)
- [ ] Phone Authentication habilitado
- [ ] Archivos NO están en Git (verificado con `git status`)
- [ ] `firebase_options.dart` actualizado (si es necesario)

---

## 🚀 Probar la Configuración

### iOS
```bash
cd vecino-alerta-app
flutter run -d ios
```

### Android
```bash
cd vecino-alerta-app
flutter run -d android
```

---

## ⚠️ Troubleshooting

### Error: "GoogleService-Info.plist not found"
- Verifica la ruta exacta: `ios/Runner/GoogleService-Info.plist`
- Asegúrate de que el archivo esté en el target de Xcode

### Error: "google-services.json not found"
- Verifica la ruta exacta: `android/app/google-services.json`
- Limpia el build: `flutter clean && flutter pub get`

### Error: Phone Auth no funciona
- Verifica que Phone Authentication esté habilitado en Firebase Console
- Para iOS: Configura APNs
- Para Android: Verifica SHA-1

---

## 📚 Referencias

- [Firebase iOS Setup](https://firebase.google.com/docs/ios/setup)
- [Firebase Android Setup](https://firebase.google.com/docs/android/setup)
- [FlutterFire CLI](https://firebase.flutter.dev/docs/cli/)

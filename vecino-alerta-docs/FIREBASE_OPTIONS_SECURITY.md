# Guía: Manejo Seguro de firebase_options.dart

## ✅ Problema Resuelto

**Situación:** El archivo `firebase_options.dart` contenía credenciales reales y estaba siendo trackeado por Git.

**Solución Aplicada:**
```bash
# 1. Removido del tracking de Git (pero mantiene el archivo local)
git rm --cached vecino-alerta-app/lib/firebase_options.dart

# 2. Commit del cambio
git commit -m "chore: remove firebase_options.dart from git tracking"
```

---

## 🔐 Estado Actual

### Archivo Local
- ✅ **Existe** en tu máquina: `vecino-alerta-app/lib/firebase_options.dart`
- ✅ **Tiene credenciales reales** (funciona para desarrollo)
- ✅ **NO se subirá a Git** (protegido por `.gitignore`)

### En Git
- ✅ **NO está trackeado** (ignorado)
- ✅ **Archivo `.example`** SÍ está en Git con placeholders
- ✅ **Documentación** en README para colaboradores

---

## 📋 Verificación

### Comprobar que está ignorado:
```bash
# Debe mostrar la regla de .gitignore que lo ignora
git check-ignore -v vecino-alerta-app/lib/firebase_options.dart

# Salida esperada:
# .gitignore:27:**/lib/firebase_options.dart
```

### Comprobar que NO aparece en git status:
```bash
git status | grep firebase_options.dart

# NO debe mostrar nada (vacío = correcto)
```

---

## 👥 Workflow para Colaboradores

Cuando alguien clone el repositorio:

### 1. Clonar el repo
```bash
git clone https://github.com/tu-usuario/vecinoalerta.git
cd vecinoalerta
```

### 2. Copiar el archivo example
```bash
cd vecino-alerta-app/lib
cp firebase_options.example.dart firebase_options.dart
```

### 3. Obtener credenciales de Firebase

**Opción A: Usar Firebase CLI**
```bash
# Para Web
firebase apps:sdkconfig web --project vecinoalerta-2e0de

# Para Android
firebase apps:sdkconfig android --project vecinoalerta-2e0de

# Para iOS
firebase apps:sdkconfig ios --project vecinoalerta-2e0de
```

**Opción B: Usar FlutterFire CLI (Recomendado)**
```bash
cd vecino-alerta-app
flutterfire configure
```

### 4. Actualizar firebase_options.dart
Reemplazar los placeholders `YOUR_*` con las credenciales reales obtenidas.

---

## 🚨 Importante

### ❌ NUNCA hagas esto:
```bash
# NO fuerces agregar el archivo
git add -f vecino-alerta-app/lib/firebase_options.dart

# NO lo remuevas del .gitignore
```

### ✅ SIEMPRE verifica antes de push:
```bash
# Ver qué archivos se van a subir
git status

# firebase_options.dart NO debe aparecer
# Si aparece, DETENTE y revisa el .gitignore
```

---

## 📁 Archivos Relacionados

### En el Repositorio (Git)
- ✅ `vecino-alerta-app/lib/firebase_options.example.dart` - Template con placeholders
- ✅ `.gitignore` - Regla que excluye `firebase_options.dart`
- ✅ `README.md` - Instrucciones de configuración

### Solo Local (NO en Git)
- ✅ `vecino-alerta-app/lib/firebase_options.dart` - Credenciales reales
- ✅ `vecino-alerta-app/android/app/google-services.json`
- ✅ `vecino-alerta-app/ios/Runner/GoogleService-Info.plist`

---

## 🎯 Resumen

**Estado:** ✅ Configuración Segura

- El archivo con credenciales reales existe localmente
- Git lo ignora correctamente
- Los colaboradores tienen instrucciones claras
- El proyecto es seguro para Open Source

**Puedes hacer `git push` sin preocuparte.** 🚀

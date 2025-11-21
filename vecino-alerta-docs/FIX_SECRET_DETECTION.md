# Solución: Push Bloqueado por Secretos Detectados

## 🔴 Problema
GitHub ha detectado credenciales sensibles en el historial de commits:
- `vecino-alerta-backend/functions/serviceAccountKey.json`

## ✅ Solución

### Opción 1: Limpiar Historial con BFG Repo-Cleaner (Recomendado)

```bash
# 1. Instalar BFG (si no lo tienes)
brew install bfg

# 2. Hacer backup del repo
cd /Users/imacpro/Developer
cp -r vecinoalerta vecinoalerta-backup

# 3. Limpiar el archivo del historial
cd vecinoalerta
bfg --delete-files serviceAccountKey.json

# 4. Limpiar referencias
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push (CUIDADO: reescribe historial)
git push origin main --force
```

### Opción 2: Revertir Commit y Recrear (Más Simple)

```bash
# 1. Ver el commit problemático
git log --oneline -5

# 2. Hacer soft reset al commit anterior al que tiene el secreto
git reset --soft HEAD~1

# 3. Verificar que los archivos sensibles NO están en staging
git status

# 4. Crear nuevo commit limpio
git add .
git commit -m "chore: update project (credentials removed)"

# 5. Push normal
git push origin main
```

### Opción 3: Bypass (NO RECOMENDADO para producción)

Si este es un repositorio de desarrollo/prueba:

```bash
# Usar el botón "Bypass" en la interfaz de GitHub
# O configurar:
git push --no-verify
```

## ⚠️ Importante

1. **NUNCA** hagas push de:
   - `serviceAccountKey.json`
   - `google-services.json`
   - `GoogleService-Info.plist`
   - Archivos `.env` con credenciales reales

2. **Después de limpiar**, verifica:
   ```bash
   git log --all --full-history -- "*serviceAccountKey*"
   ```
   Debe retornar vacío.

3. **Rotar credenciales**: Si las credenciales ya fueron pusheadas, considera rotarlas en Firebase Console.

## 📝 Prevención

El `.gitignore` ya está configurado correctamente. Este problema solo ocurre si:
- Hubo commits anteriores antes de configurar `.gitignore`
- Se usó `git add -f` (force)

## 🎯 Recomendación

**Usa Opción 2** (Revertir y recrear) si:
- Es tu primer push
- No hay colaboradores que hayan hecho pull
- Quieres una solución rápida y segura

# Guía: Habilitar Email/Password Authentication en Firebase

## 📋 Pasos para Habilitar Email Auth

### 1. Acceder a Firebase Console

**URL Directa:**
```
https://console.firebase.google.com/project/vecinoalerta-2e0de/authentication/providers
```

O navega manualmente:
1. Ve a https://console.firebase.google.com
2. Click en el proyecto **vecinoalerta-2e0de**
3. En el menú lateral, click en **Authentication**
4. Click en la pestaña **Sign-in method**

---

### 2. Habilitar Email/Password

1. **Busca "Email/Password"** en la lista de proveedores
2. **Click** en la fila de "Email/Password"
3. Se abrirá un modal/panel lateral
4. **Toggle ON** el switch "Enable"
5. **Opcional:** Deja "Email link (passwordless sign-in)" deshabilitado por ahora
6. **Click "Save"**

---

### 3. Verificar que está Habilitado

Deberías ver:
- ✅ "Email/Password" con estado **Enabled**
- ✅ Ícono verde o checkmark al lado

---

## 🖼️ Referencia Visual

### Antes (Deshabilitado)
```
Email/Password    [Disabled]    [Configure →]
```

### Después (Habilitado)
```
Email/Password    [Enabled ✓]   [Edit]
```

---

## ⚙️ Configuración Opcional

### Email Templates (Recomendado)

Después de habilitar, puedes personalizar los emails:

1. En Authentication, click en **Templates**
2. Personaliza estos templates:
   - **Password reset** - Email de recuperación
   - **Email address verification** - Verificación de email
   - **Email address change** - Cambio de email

**Campos editables:**
- Sender name (ej: "Vecino Alerta")
- Subject line
- Email body (HTML)

---

## 🧪 Probar la Configuración

### Opción 1: Desde la App (Recomendado)

1. Asegúrate de que la app esté corriendo:
   ```bash
   cd vecino-alerta-app
   flutter run -d chrome
   ```

2. En el navegador (http://localhost:8080):
   - Ingresa email: `test@example.com`
   - Ingresa password: `password123`
   - Click "Registrarse"

3. **Resultado esperado:**
   - ✅ Usuario creado exitosamente
   - ✅ Redirect a /home
   - ✅ Usuario visible en Firebase Console → Authentication → Users

### Opción 2: Desde Firebase Console

1. Ve a **Authentication** → **Users**
2. Click **Add user**
3. Ingresa:
   - Email: `admin@vecinoalerta.com`
   - Password: `Admin123!`
4. Click **Add user**

---

## ✅ Checklist de Verificación

- [ ] Email/Password está **Enabled** en Sign-in method
- [ ] Puedes ver "Email/Password" con estado verde/enabled
- [ ] (Opcional) Templates de email personalizados
- [ ] Probaste crear un usuario desde la app
- [ ] Usuario aparece en Authentication → Users

---

## 🚨 Troubleshooting

### Error: "Email/Password is not enabled"
**Solución:** Verifica que el toggle esté ON y hayas guardado los cambios.

### Error: "Invalid email"
**Solución:** Asegúrate de usar un formato válido (ej: `user@domain.com`)

### Error: "Weak password"
**Solución:** Usa al menos 6 caracteres en la contraseña.

### No veo el usuario en Firebase Console
**Solución:** 
1. Refresca la página
2. Verifica que estés en el proyecto correcto (`vecinoalerta-2e0de`)
3. Revisa la consola del navegador por errores

---

## 📸 Screenshots Esperados

### 1. Sign-in Method (Habilitado)
Deberías ver algo como:
```
┌─────────────────────────────────────────┐
│ Sign-in providers                       │
├─────────────────────────────────────────┤
│ Email/Password    [Enabled ✓]    Edit  │
│ Google            [Disabled]      Add   │
│ Phone             [Disabled]      Add   │
└─────────────────────────────────────────┘
```

### 2. Users Tab (Después de crear usuario)
```
┌─────────────────────────────────────────────────────┐
│ Users                                               │
├─────────────────────────────────────────────────────┤
│ test@example.com    Email    Created: Just now     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Próximo Paso

Una vez habilitado Email/Password:

1. **Probar registro** desde la app
2. **Probar login** con el usuario creado
3. **Probar recuperación** de contraseña
4. **Verificar** que todo funciona correctamente

---

## 💡 Notas Importantes

- ✅ Email/Password es **GRATIS** ilimitado
- ✅ No requiere configuración adicional (SHA-1, APNs, etc.)
- ✅ Funciona en web, iOS, Android sin cambios
- ⚠️ Los usuarios deben verificar su email (opcional pero recomendado)
- ⚠️ Firebase tiene rate limiting para prevenir abuso

---

¿Necesitas ayuda con algún paso específico?

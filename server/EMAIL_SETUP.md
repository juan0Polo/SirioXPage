# Configuración de Email

## Configuración de Gmail SMTP

Para enviar notificaciones por email, necesitas configurar una contraseña de aplicación de Gmail:

### 1. Activar la verificación en dos pasos
1. Ve a [Google Account](https://myaccount.google.com/)
2. Ve a "Seguridad" en el menú lateral
3. Activa "Verificación en dos pasos"

### 2. Generar una contraseña de aplicación
1. Ve a [App Passwords](https://myaccount.google.com/apppasswords)
2. Selecciona "Correo" como aplicación
3. Selecciona "Otro" como dispositivo y escribe "SIRIO X"
4. Copia la contraseña generada (16 caracteres sin espacios)

### 3. Configurar variables de entorno
Actualiza tu archivo `.env` con:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
EMAIL_FROM=tu-email@gmail.com
EMAIL_FROM_NAME=SIRIO X
```

### 4. Probar el envío
Usa el endpoint de prueba:
```bash
curl -X POST http://localhost:3001/api/contactos/test-email \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"to": "destinatario@example.com"}'
```

## Notificaciones de Contacto

Cuando alguien envía un formulario de contacto:
1. Se guarda en la base de datos
2. Se envían emails a todas las direcciones activas en `notificaciones_contacto`

Para gestionar las direcciones de notificación, ve al portal administrativo > Notificaciones.
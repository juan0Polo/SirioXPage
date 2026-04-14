import 'dotenv/config';
import { sendEmail } from '../src/email';

async function testEmail() {
  try {
    console.log('🔍 Probando configuración de email...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

    if (process.env.SMTP_PASS === 'z1223334444') {
      console.log('❌ ERROR: La contraseña SMTP no está configurada correctamente.');
      console.log('📝 Instrucciones:');
      console.log('1. Ve a https://myaccount.google.com/apppasswords');
      console.log('2. Genera una contraseña de aplicación para "SIRIO X"');
      console.log('3. Actualiza SMTP_PASS en el archivo .env');
      console.log('4. Reinicia el servidor');
      return;
    }

    console.log('📧 Enviando email de prueba...');
    await sendEmail({
      to: process.env.SMTP_USER!, // Enviar a la misma cuenta para probar
      subject: 'Prueba de SIRIO X',
      html: '<h1>¡Email de prueba exitoso!</h1><p>La configuración SMTP funciona correctamente.</p>',
      text: 'Email de prueba exitoso! La configuración SMTP funciona correctamente.'
    });

    console.log('✅ Email enviado exitosamente!');
    console.log('📬 Revisa tu bandeja de entrada.');

  } catch (error: any) {
    console.error('❌ Error al enviar email:', error.message);
    console.log('🔧 Posibles soluciones:');
    console.log('1. Verifica que la contraseña de aplicación sea correcta');
    console.log('2. Asegúrate de que la verificación en 2 pasos esté activada');
    console.log('3. Revisa que el puerto 587 no esté bloqueado');
  }
}

testEmail();
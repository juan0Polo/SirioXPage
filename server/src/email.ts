import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendContactNotification(contactData: {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
}, recipientEmail: string): Promise<void> {
  const subject = '🔔 Nuevo mensaje de contacto - SIRIO X';
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo mensaje de contacto</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            🔔 SIRIO X
          </h1>
          <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
            Nuevo mensaje de contacto recibido
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">

          <!-- Alert Banner -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <div style="display: flex; align-items: center;">
              <span style="font-size: 24px; margin-right: 15px;">📬</span>
              <div>
                <h3 style="margin: 0; color: #92400e; font-size: 18px; font-weight: 600;">
                  Mensaje de Contacto
                </h3>
                <p style="margin: 5px 0 0 0; color: #78350f; font-size: 14px;">
                  Se ha recibido un nuevo mensaje a través del formulario de contacto
                </p>
              </div>
            </div>
          </div>

          <!-- Contact Information Cards -->
          <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px;">

            <!-- Name -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
              <div style="display: flex; align-items: center;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: white; font-size: 18px;">👤</span>
                </div>
                <div>
                  <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    Nombre Completo
                  </p>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 600;">
                    ${contactData.nombre}
                  </p>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
              <div style="display: flex; align-items: center;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: white; font-size: 18px;">✉️</span>
                </div>
                <div>
                  <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    Correo Electrónico
                  </p>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 600;">
                    ${contactData.email}
                  </p>
                </div>
              </div>
            </div>

            <!-- Phone (if provided) -->
            ${contactData.telefono ? `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
              <div style="display: flex; align-items: center;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: white; font-size: 18px;">📞</span>
                </div>
                <div>
                  <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    Teléfono
                  </p>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 600;">
                    ${contactData.telefono}
                  </p>
                </div>
              </div>
            </div>
            ` : ''}

          </div>

          <!-- Message Section -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <div style="display: flex; align-items: flex-start;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                <span style="color: white; font-size: 18px;">💬</span>
              </div>
              <div style="flex: 1;">
                <p style="margin: 0 0 15px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Mensaje del Usuario
                </p>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-line;">
                  ${contactData.mensaje.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="mailto:${contactData.email}"
               style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-right: 10px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);">
              📧 Responder al Usuario
            </a>
            <a href="tel:${contactData.telefono || ''}"
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);">
              📞 Llamar
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="background: #1e293b; color: #ffffff; padding: 30px; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">SIRIO X</h3>
            <p style="margin: 0; color: #cbd5e1; font-size: 14px;">
              Tecnología e Innovación para el Desarrollo Humano
            </p>
          </div>

          <div style="border-top: 1px solid #334155; padding-top: 20px; margin-top: 20px;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
              Este es un mensaje automático generado desde el formulario de contacto de nuestro sitio web.<br>
              Por favor, no responda directamente a este correo.
            </p>
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 11px;">
              © ${new Date().getFullYear()} SIRIO X. Todos los derechos reservados.
            </p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: recipientEmail,
    subject,
    html,
    text: `
🔔 NUEVO MENSAJE DE CONTACTO - SIRIO X

INFORMACIÓN DEL CONTACTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nombre: ${contactData.nombre}
✉️ Email: ${contactData.email}
${contactData.telefono ? `📞 Teléfono: ${contactData.telefono}` : ''}

💬 MENSAJE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${contactData.mensaje}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Este es un mensaje automático de SIRIO X
Fecha: ${new Date().toLocaleString('es-ES')}
    `.trim(),
  });
}
import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { sendEmail } from '../email';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RecipientPayload = {
  email: string;
  nombre: string;
  datos?: Record<string, string>;
};

type CampaignStatus = 'pendiente' | 'en_progreso' | 'completado' | 'error';

function renderTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_match, key) => {
    return values[key.toLowerCase()] ?? '';
  });
}

// function buildHtmlMessage(body: string) {
//   return `
//     <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
//       <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);">
//         <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 28px 32px; color: #ffffff;">
//           <h1 style="margin: 0; font-size: 24px; line-height: 1.2;">Propuesta de Servicios</h1>
//           <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Esta es una propuesta personalizada desde el portal administrativo de SIRIO X.</p>
//         </div>
//         <div style="padding: 32px; color: #111827; font-size: 15px; line-height: 1.8;">
//           ${body.replace(/\n/g, '<br>')}
//         </div>
//         <div style="background: #f1f5f9; padding: 20px 32px; color: #475569; font-size: 13px; border-top: 1px solid #e2e8f0;">
//           <p style="margin: 0;">Este correo fue enviado automáticamente desde SIRIO X.</p>
//         </div>
//       </div>
//     </div>
//   `;
// }

function buildHtmlMessage(body: string, nombreCliente?: string) {
  const greeting = nombreCliente
    ? `Estimado/a ${nombreCliente},`
    : 'Estimado/a cliente,';

  return `
    <div style="background:#f0f4f8;padding:32px 16px;font-family:Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:4px;overflow:hidden;border:1px solid #d0dce8;">

        <!-- Header -->
        <div style="background:#071526;padding:28px 40px 0 40px;">
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:24px;border-bottom:1px solid #1a3050;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;background:#3772A6;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                <div style="width:10px;height:10px;background:#6DB4F2;border-radius:50%;"></div>
              </div>
              <span style="color:#6DB4F2;font-size:18px;font-weight:700;letter-spacing:0.08em;">SIRIO X</span>
            </div>
            <span style="color:#3772A6;font-size:12px;letter-spacing:0.06em;">TECNOLOGÍA &middot; INNOVACIÓN</span>
          </div>
          <div style="padding:28px 0 32px 0;">
            <p style="margin:0 0 8px 0;color:#3772A6;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">Propuesta de Servicios</p>
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.2;">${greeting}</h1>
          </div>
        </div>

        <!-- Accent bar -->
        <div style="height:4px;background:linear-gradient(90deg,#153259 0%,#3772A6 50%,#6DB4F2 100%);"></div>

        <!-- Body -->
        <div style="padding:36px 40px;">
          <div style="color:#1a2a3a;font-size:15px;line-height:1.8;margin-bottom:24px;">
            ${body.replace(/\n/g, '<br>')}
          </div>
          <div style="background:#f4f8fc;border-left:3px solid #3772A6;border-radius:0 4px 4px 0;padding:16px 20px;margin-bottom:28px;">
            <p style="margin:0;color:#153259;font-size:13px;line-height:1.7;">
              Nuestro equipo estará disponible para resolver cualquier consulta y acompañarle en cada etapa del proceso.
            </p>
          </div>
          <div style="text-align:center;margin:32px 0;">
            <a href="https://wa.me/573248332777" target="_blank" style="display:inline-block;text-decoration:none;">
              <div style="background:#0D2340;padding:14px 36px;border-radius:3px;display:inline-flex;align-items:center;gap:10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#6DB4F2">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span style="color:#6DB4F2;font-size:14px;font-weight:700;letter-spacing:0.06em;">CONTACTAR A UN ASESOR</span>
              </div>
            </a>
          </div>
        </div>

        <!-- Divider -->
        <div style="margin:0 40px;border-top:1px solid #e2eaf2;"></div>

        <!-- Footer -->
        <div style="background:#071526;padding:24px 40px;">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
            <div>
              <span style="color:#6DB4F2;font-size:13px;font-weight:700;letter-spacing:0.08em;">SIRIO X</span>
              <p style="margin:4px 0 0 0;color:#3772A6;font-size:11px;">&copy; ${new Date().getFullYear()} Sirio X. Todos los derechos reservados.</p>
            </div>
            <div style="text-align:right;">
              <p style="margin:0;color:#3772A6;font-size:11px;line-height:1.8;">Este correo fue enviado desde el portal administrativo de SIRIO X.</p>
              <p style="margin:0;color:#1a3050;font-size:11px;">Si no solicitó esta comunicación, por favor ignórelo.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

router.get('/', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, asunto, estado, total_destinatarios, enviados, fallidos, created_at, updated_at
       FROM campanas_email
       ORDER BY created_at DESC
       LIMIT 30`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener campañas de email:', err);
    return res.status(500).json({ error: 'Error al obtener campañas' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { nombre, asunto, contenido, destinatarios } = req.body;

    if (!nombre || !asunto || !contenido || !Array.isArray(destinatarios) || destinatarios.length === 0) {
      return res.status(400).json({ error: 'Nombre, asunto, contenido y destinatarios son obligatorios' });
    }

    const validRecipients: RecipientPayload[] = [];
    const invalidEmails: string[] = [];

    for (const raw of destinatarios) {
      const email = String(raw.email || '').trim().toLowerCase();
      const nombreCliente = String(raw.nombre || '').trim();
      if (!email || !nombreCliente || !EMAIL_REGEX.test(email)) {
        invalidEmails.push(email || '(correo vacío)');
        continue;
      }
      validRecipients.push({
        email,
        nombre: nombreCliente,
        datos: raw.datos || {},
      });
    }

    if (validRecipients.length === 0) {
      return res.status(400).json({ error: 'No hay destinatarios válidos en el archivo' });
    }

    const campaignResult = await pool.query(
      `INSERT INTO campanas_email (nombre, asunto, contenido, estado, total_destinatarios, enviados, fallidos, created_by)
       VALUES ($1, $2, $3, 'en_progreso', $4, 0, 0, $5)
       RETURNING *`,
      [nombre, asunto, contenido, validRecipients.length, req.userId || null]
    );

    const campaign = campaignResult.rows[0];
    const insertedRecipients: { id: string; email: string; nombre: string; datos?: Record<string, string> }[] = [];

    for (const recipient of validRecipients) {
      const result = await pool.query(
        `INSERT INTO campana_destinatarios (campana_id, email, nombre, datos, estado)
         VALUES ($1, $2, $3, $4, 'pendiente') RETURNING id`,
        [campaign.id, recipient.email, recipient.nombre, recipient.datos || {}]
      );
      insertedRecipients.push({ id: result.rows[0].id, ...recipient });
    }

    let enviados = 0;
    let fallidos = 0;
    const logs: string[] = [];

    for (const recipient of insertedRecipients) {
      const templateValues = {
        email: recipient.email,
        nombre: recipient.nombre,
        ...Object.fromEntries(Object.entries(recipient.datos || {}).map(([key, value]) => [key.toLowerCase(), value]))
      };
      const personalizedSubject = renderTemplate(asunto, templateValues);
      const personalizedContent = renderTemplate(contenido, templateValues);
      // const html = buildHtmlMessage(personalizedContent);
      const html = buildHtmlMessage(personalizedContent, recipient.nombre);
      const text = `Hola ${recipient.nombre},\n\n${personalizedContent.replace(/<br>/g, '\n')}\n\nEste mensaje fue enviado desde SIRIO X.`;

      try {
        await sendEmail({
          to: recipient.email,
          subject: personalizedSubject,
          html,
          text,
        });

        await pool.query(
          `UPDATE campana_destinatarios SET estado='enviado', enviado_en=NOW(), updated_at=NOW() WHERE id = $1`,
          [recipient.id]
        );
        enviados += 1;
        logs.push(`Enviado a ${recipient.email}`);
      } catch (error: any) {
        await pool.query(
          `UPDATE campana_destinatarios SET estado='error', error_mensaje=$1, updated_at=NOW() WHERE id = $2`,
          [String(error?.message || 'Error al enviar'), recipient.id]
        );
        fallidos += 1;
        logs.push(`Error en ${recipient.email}: ${String(error?.message || 'Error desconocido')}`);
      }
    }

    const finalStatus: CampaignStatus = fallidos === 0 ? 'completado' : 'error';
    await pool.query(
      `UPDATE campanas_email SET estado=$1, enviados=$2, fallidos=$3, updated_at=NOW() WHERE id = $4`,
      [finalStatus, enviados, fallidos, campaign.id]
    );

    return res.status(201).json({
      campaign: {
        ...campaign,
        enviado: enviados,
        fallidos,
        estado: finalStatus,
      },
      invalidEmails,
      logs,
    });
  } catch (err) {
    console.error('Error creando campaña de email:', err);
    return res.status(500).json({ error: 'Error al crear la campaña' });
  }
});

export default router;

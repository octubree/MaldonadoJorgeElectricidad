const { Resend } = require('resend');

// Asegúrate de que las variables de entorno están disponibles
const resendApiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.TO_EMAIL;

// Inicializa Resend solo si la API key está presente
const resend = resendApiKey ? new Resend(resendApiKey) : null;

module.exports = async (req, res) => {
  // Permitir solicitudes POST solamente
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Verificar que Resend esté configurado
  if (!resend || !toEmail) {
    console.error('Error: Variables de entorno RESEND_API_KEY o TO_EMAIL no están configuradas.');
    return res.status(500).json({ success: false, error: 'Error de configuración del servidor.' });
  }

  try {
    // Vercel parsea automáticamente el body cuando el Content-Type es application/json
    const { name, subject, message, contact_preference, whatsapp_country, whatsapp_number, email } = req.body;

    // --- Construcción del cuerpo del email en HTML para mejor formato ---
    let emailBody = `
      <p>Has recibido un nuevo mensaje desde el formulario de tu página web.</p>
      <hr>
      <p><strong>Nombre:</strong> ${name || 'No proporcionado'}</p>
    `;

    // --- Preferencias de contacto ---
    let preferences = Array.isArray(contact_preference) ? contact_preference.join(', ') : contact_preference;
    emailBody += `<p><strong>Preferencia de Contacto:</strong> ${preferences || 'No especificada'}</p>`;

    if (preferences && preferences.includes('whatsapp') && whatsapp_number) {
      const countryLabel = whatsapp_country === 'ar' ? 'Argentina' : 'Uruguay';
      emailBody += `<p><strong>Número WhatsApp (${countryLabel}):</strong> ${whatsapp_number}</p>`;
    }

    if (preferences && preferences.includes('email') && email) {
      emailBody += `<p><strong>Email de Contacto:</strong> ${email}</p>`;
    }

    emailBody += `<hr>`;

    // --- Mensaje del usuario ---
    emailBody += `<h3>Asunto: ${subject || 'Sin asunto'}</h3>`;
    emailBody += `<div><strong>Mensaje:</strong></div>`;
    emailBody += `<div style="padding: 10px; border: 1px solid #eee; border-radius: 5px; background-color: #f9f9f9;">
      <p style="margin: 0;">${message.replace(/\n/g, '<br>') || 'No hay mensaje.'}</p>
    </div>`;

    // --- Envío del correo con Resend ---
    const { data, error } = await resend.emails.send({
      from: 'web@jorge-electricidad.net', // Debe ser un dominio verificado en Resend
      to: [toEmail],
      subject: `Nuevo Mensaje de la Web: ${subject || name}`,
      html: emailBody,
    });

    if (error) {
      console.error('Error al enviar el email:', error);
      return res.status(400).json({ success: false, error: error.message || 'Error al enviar el mensaje.' });
    }

    // Si todo fue bien, devuelve una respuesta JSON de éxito
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error inesperado en el servidor:', error);
    return res.status(500).json({ success: false, error: 'Ocurrió un error inesperado.' });
  }
};
/**
 * Plantilla de Cloudflare Worker para iLoveFree.
 * Esta infraestructura ha sido preparada para la escalabilidad futura.
 * Actualmente la plataforma es 100% Client-Side, pero si en el futuro deseas
 * incorporar protección AES-256 compleja o procesamiento visual 1:1, puedes subir este Worker.
 *
 * Despliegue:
 * npx wrangler deploy backend/worker.js --name ilovefree-backend
 */

export default {
  async fetch(request, env, ctx) {
    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST') {
      try {
        const url = new URL(request.url);
        
        // --- ROUTE: Protect PDF (AES Encryption) ---
        if (url.pathname === '/api/protect-pdf') {
          // Lógica futura: Recibir formData con el PDF y la contraseña
          // Encriptar usando qpdf-wasm o pdf-lib avanzado
          // Retornar archivo encriptado
          return new Response(JSON.stringify({ success: true, message: "Endpoint de Encriptación listo para integración." }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        
        return new Response("Ruta no encontrada", { status: 404, headers: corsHeaders });
        
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        });
      }
    }

    return new Response("iLoveFree API Gateway Operativo.", { status: 200, headers: corsHeaders });
  },
};

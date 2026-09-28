export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const N8N_CHAT_WEBHOOK_URL =
    process.env.N8N_CHAT_WEBHOOK_URL ||
    'https://navyadwarapureddi.app.n8n.cloud/webhook/906a3206-cab7-47f8-a0c6-7e62457927ad/chat';

  try {
    const { chatInput, sessionId, message } = req.body || {};
    const input = chatInput || message || '';

    const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: input,
        message: input,
        sessionId: sessionId || 'patron-session',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `n8n webhook returned status ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Error in n8n-chat handler:', error);
    return res.status(500).json({
      error: 'Failed to communicate with n8n chatbot',
      message: error?.message || 'Unknown error',
    });
  }
}

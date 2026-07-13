exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { name, email, phone, area, source, timestamp } = JSON.parse(event.body || '{}');
  if (!email || !email.includes('@')) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) };
  }
  if (!process.env.GOOGLE_SHEETS_URL) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, warning: 'Sheets not configured' }) };
  }

  try {
    await fetch(process.env.GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || 'Not provided',
        email: email.toLowerCase().trim(),
        phone: phone || 'Not provided',
        area: area || 'Not provided',
        timestamp: timestamp || new Date().toISOString(),
        source: source || 'Bradenton AI Chatbot'
      })
    });
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, warning: 'Lead may not have saved' }) };
  }
};

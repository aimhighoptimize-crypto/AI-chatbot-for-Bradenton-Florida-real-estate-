export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email, phone, area, timestamp } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  if (!process.env.GOOGLE_SHEETS_URL) {
    return res.status(200).json({ ok: true, warning: 'Sheets not configured' });
  }
  try {
    const response = await fetch(process.env.GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || 'Not provided',
        email: email.toLowerCase().trim(),
        phone: phone || 'Not provided',
        area: area || 'Not provided',
        timestamp: timestamp || new Date().toISOString(),
        source: 'Bradenton AI Chatbot'
      }),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(200).json({ ok: true, warning: 'Lead may not have saved' });
  }
}

import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Missing content in request body' });
  }

  try {
    // Setup openai with your secret key from environment variable
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, 
      // optionally org/project...
    });

    // Call chat completion with the "gpt-4o-mini" model
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content }],
      temperature: 0.7
    });

    // Extract the text from the response
    const message = response.choices?.[0]?.message?.content || 'No plan returned';
    return res.status(200).json({ plan: message });
  } catch (error) {
    console.error('Error calling gpt-4o-mini:', error);
    return res.status(500).json({ error: 'Error generating plan', details: error.message });
  }
}

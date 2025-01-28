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
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const plan = response.choices?.[0]?.message?.content || 'No plan returned';

    return res.status(200).json({ plan });
  } catch (error) {
    console.error('Error calling gpt-4o-mini:', error);
    return res.status(500).json({
      error: 'Error generating plan',
      details: error.message
    });
  }
}

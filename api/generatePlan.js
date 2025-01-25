// api/generatePlan.js
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
    // Instantiate the new-style OpenAI client (v4.x+)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // optionally: organization: 'org-XYZ', project: 'proj-XYZ'
    });

    // Call the Chat Completions API with gpt-4o-mini
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content }
      ],
      temperature: 0.7
    });

    // Extract the assistant's text from the response
    const plan = response.choices?.[0]?.message?.content || 'No plan returned';

    // Return it to the front end
    return res.status(200).json({ plan });
  } catch (error) {
    console.error('Error calling gpt-4o-mini:', error);
    return res.status(500).json({
      error: 'Error generating plan',
      details: error.message
    });
  }
}

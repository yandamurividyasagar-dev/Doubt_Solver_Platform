const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const TEXT_MODEL = 'llama-3.3-70b-versatile';
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

const TUTOR_SYSTEM_PROMPT = `You are an expert AI tutor helping students from grades 8-12 and college level understand concepts.

Your approach:
- Break down complex concepts into simple, easy-to-understand steps
- Use analogies and real-world examples relevant to students
- Provide step-by-step solutions for math/science problems, showing all working steps
- If solving math, use proper notation and explain each step
- Be encouraging and patient
- End answers with a brief summary or key takeaway
- Format responses with clear headings, bullet points, and numbered steps where appropriate
- Use markdown formatting for better readability`;

// Local subject detection (zero API calls)
const detectSubject = (text) => {
  const t = text.toLowerCase();
  if (/\b(equation|algebra|calculus|geometry|integral|derivative|matrix|theorem|math|solve|calculate)\b/.test(t)) return 'Mathematics';
  if (/\b(force|velocity|acceleration|momentum|energy|gravity|newton|circuit|quantum|physics)\b/.test(t)) return 'Physics';
  if (/\b(atom|molecule|reaction|element|compound|acid|base|chemistry|valence)\b/.test(t)) return 'Chemistry';
  if (/\b(cell|dna|rna|protein|photosynthesis|evolution|biology|genetics)\b/.test(t)) return 'Biology';
  if (/\b(history|war|revolution|empire|civilization|ancient|medieval)\b/.test(t)) return 'History';
  if (/\b(program|code|algorithm|function|loop|array|html|javascript|python|computer)\b/.test(t)) return 'Computer Science';
  if (/\b(grammar|essay|poem|novel|literature|verb|noun|english)\b/.test(t)) return 'English';
  return 'General';
};

// Text Doubt → Groq LLaMA 3.3 70B
const solveTextDoubt = async (question, subject = 'General', chatHistory = []) => {
  const messages = [
    { role: 'system', content: TUTOR_SYSTEM_PROMPT },
    ...chatHistory.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })),
    {
      role: 'user',
      content: subject !== 'General' ? `[Subject: ${subject}]\n\n${question}` : question,
    },
  ];

  const response = await groq.chat.completions.create({
    model: TEXT_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 2048,
  });

  return response.choices[0].message.content;
};

// Image Doubt → Groq Vision (LLaMA 4 Scout)
const solveImageDoubt = async (imagePath, question = '', subject = 'General') => {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const ext = path.extname(imagePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp',
  };
  const mimeType = mimeTypes[ext] || 'image/jpeg';

  const textPrompt = question
    ? `[Subject: ${subject}]\n\n${question}\n\nAnalyze the image and answer the question above step by step.`
    : `[Subject: ${subject}]\n\nAnalyze this image carefully. If it contains a problem or question, solve it step by step.`;

  const response = await groq.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      { role: 'system', content: TUTOR_SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: textPrompt },
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64Image}` },
          },
        ],
      },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  return response.choices[0].message.content;
};

// Voice Doubt → reuse text solver after transcription
const solveVoiceDoubt = async (transcript, subject = 'General', chatHistory = []) => {
  return await solveTextDoubt(`[Voice Question]: ${transcript}`, subject, chatHistory);
};

module.exports = { solveTextDoubt, solveImageDoubt, solveVoiceDoubt, detectSubject };
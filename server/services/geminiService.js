const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const TEXT_MODEL = 'openai/gpt-oss-120b';
const VISION_MODEL = 'qwen/qwen3.8-27b';

const TUTOR_SYSTEM_PROMPT = `You are an expert mentor for Indian competitive exam aspirants preparing for GATE, IIT JAM, and government exams (SSC, Banking, Railways, UPSC, and State PSCs).

Your approach:
- Solve every problem the way it would actually appear in the exam: show the complete step-by-step method, not just the final answer.
- Name the formula, theorem, or standard result being used, in a form the student could put on a quick-revision sheet.
- If the question is objective-type, identify whether it reads like an MCQ, an MSQ (multiple correct options), or a Numerical Answer Type (NAT) question, and answer accordingly. For MCQ/MSQ, briefly note why the other options are wrong, since option elimination is a core exam skill — not just why the right one is right.
- Point out common traps tied to the concept (sign errors, unit mismatches, edge cases, rounding) since these cost marks under negative marking.
- Favor the fastest correct method over the most exhaustive one — these students are working against a clock, not writing a thesis.
- Use proper mathematical notation and markdown formatting (headings, bold, bullet points, numbered steps) for clarity.
- Be encouraging, but talk to the student as a serious, exam-focused adult, not a school child.
- End with a one-line takeaway they could use for quick revision the night before the exam.`;

// Local subject detection (zero API calls)
const detectSubject = (text) => {
  const t = text.toLowerCase();
  if (/\b(program|code|algorithm|data structure|operating system|dbms|sql|compiler|network|tcp|computer organization)\b/.test(t)) return 'Computer Science & IT';
  if (/\b(circuit|transistor|amplifier|signal|modulation|semiconductor|digital logic|communication system)\b/.test(t)) return 'Electronics & Communication';
  if (/\b(voltage|current|power system|motor|generator|transformer|control system)\b/.test(t)) return 'Electrical Engineering';
  if (/\b(thermodynamics|fluid mechanics|machine design|manufacturing|strength of materials|heat transfer)\b/.test(t)) return 'Mechanical Engineering';
  if (/\b(concrete|structural|surveying|geotechnical|highway|environmental engineering|steel structure)\b/.test(t)) return 'Civil Engineering';
  if (/\b(matrix|eigenvalue|laplace|fourier|differential equation|probability|linear algebra|numerical method)\b/.test(t)) return 'Engineering Mathematics';
  if (/\b(percentage|profit and loss|time and work|ratio|average|permutation|combination|simple interest)\b/.test(t)) return 'Quantitative Aptitude';
  if (/\b(syllogism|blood relation|seating arrangement|coding-decoding|puzzle|direction sense|series completion)\b/.test(t)) return 'Reasoning & Logical Ability';
  if (/\b(current affairs|budget|scheme|committee|award|summit|static gk|census)\b/.test(t)) return 'General Awareness';
  if (/\b(equation|algebra|calculus|geometry|integral|derivative|theorem|solve|calculate)\b/.test(t)) return 'Mathematics';
  if (/\b(force|velocity|acceleration|momentum|energy|gravity|newton|quantum|optics|thermodynamics)\b/.test(t)) return 'Physics';
  if (/\b(atom|molecule|reaction|element|compound|acid|base|valence|organic|inorganic)\b/.test(t)) return 'Chemistry';
  if (/\b(grammar|synonym|antonym|comprehension|idiom|sentence correction|spotting error)\b/.test(t)) return 'English Language';
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
const { AssemblyAI } = require('assemblyai');

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

const transcribeAudio = async (audioFilePath) => {
  try {
    const transcript = await client.transcripts.transcribe({
      audio: audioFilePath,
      language_detection: true,
      punctuate: true,
      format_text: true,
    });

    if (transcript.status === 'error') {
      throw new Error(`Transcription failed: ${transcript.error}`);
    }

    if (!transcript.text || transcript.text.trim() === '') {
      throw new Error('No speech detected in the audio. Please speak clearly and try again.');
    }

    return transcript.text;
  } catch (error) {
    if (error.message.includes('No speech detected')) throw error;
    throw new Error(`Speech-to-text failed: ${error.message}`);
  }
};

const isSpeechServiceAvailable = () => {
  return !!(process.env.ASSEMBLYAI_API_KEY && process.env.ASSEMBLYAI_API_KEY !== 'your_assemblyai_api_key_here');
};

module.exports = { transcribeAudio, isSpeechServiceAvailable };
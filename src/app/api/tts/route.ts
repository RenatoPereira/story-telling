import { NextResponse } from "next/server";

type TtsRequestBody = {
  text?: string;
  voice?: string;
};

export async function POST(request: Request) {
  const { text, voice } = (await request.json()) as TtsRequestBody;

  if (!text || typeof text !== "string") {
    return NextResponse.json(
      { error: "Campo 'text' e obrigatorio." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY nao configurada." },
      { status: 500 },
    );
  }

  const model = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
  const selectedVoice = voice ?? process.env.OPENAI_TTS_VOICE ?? "alloy";

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: text,
      voice: selectedVoice,
      format: "mp3",
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json(
      { error: "Falha no provedor de TTS.", details },
      { status: 502 },
    );
  }

  const audioBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString("base64");

  return NextResponse.json({ audioBase64: base64Audio, mimeType: "audio/mpeg" });
}

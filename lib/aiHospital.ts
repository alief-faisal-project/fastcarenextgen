import OpenAI from "openai";

export interface HospitalAIResult {
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  website: string;
  description: string;
  type: string;
  emergency: boolean;
}

const cache = new Map<string, { data: HospitalAIResult; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function isCacheValid(entry?: { timestamp: number }) {
  return entry && Date.now() - entry.timestamp < CACHE_TTL;
}

function emptyResult(): HospitalAIResult {
  return {
    name: "",
    address: "",
    city: "",
    province: "",
    phone: "",
    website: "",
    description: "",
    type: "",
    emergency: false,
  };
}

function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : "{}";
}

function parseEmergency(val: any): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    return ["true", "yes", "1", "iya", "ada"].includes(val.toLowerCase());
  }
  return false;
}

export async function fetchHospitalAI(name: string): Promise<HospitalAIResult> {
  const cached = cache.get(name);
  if (isCacheValid(cached)) {
    return cached!.data;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY tidak ditemukan");
    return emptyResult();
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
Kembalikan HANYA JSON VALID tanpa teks tambahan.

Jangan gunakan markdown.
Jangan gunakan \`\`\`.
Jangan beri penjelasan.

Format:
{
  "name": "",
  "address": "",
  "city": "",
  "province": "",
  "phone": "",
  "website": "",
  "description": "",
  "type": "",
  "emergency": false
}

Rumah sakit: "${name}"

Isi dengan data realistis di Indonesia. Jika tidak yakin, isi "".
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Kamu adalah API JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const rawText = response.choices[0]?.message?.content || "{}";
    console.log("RAW AI:", rawText);

    let parsed: any;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      try {
        parsed = JSON.parse(extractJson(rawText));
      } catch {
        return emptyResult();
      }
    }

    const result: HospitalAIResult = {
      name: parsed.name || "",
      address: parsed.address || "",
      city: parsed.city || "",
      province: parsed.province || "",
      phone: parsed.phone || "",
      website: parsed.website || "",
      description: parsed.description || "",
      type: parsed.type || "",
      emergency: parseEmergency(parsed.emergency),
    };

    // cache kalau ada isi
    if (result.name || result.address) {
      cache.set(name, { data: result, timestamp: Date.now() });
    }

    return result;
  } catch (error) {
    console.error("AI ERROR:", error);
    return emptyResult();
  }
}

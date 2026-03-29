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

const cache = new Map<string, {data: HospitalAIResult; timestamp: number}>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid(entry: {timestamp: number} | undefined): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL;
}

function parseEmergency(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return ['true', 'yes', '1', 'iya', 'ada', 'yes'].includes(lower);
  }
  if (typeof value === 'number') return value === 1;
  return false;
}

function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : '{}';
}

function emptyResult(): HospitalAIResult {
  return {
    name: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    website: '',
    description: '',
    type: '',
    emergency: false,
  };
}

export async function fetchHospitalAI(name: string): Promise<HospitalAIResult> {
  // Check cache first
  const cached = cache.get(name);
  if (isCacheValid(cached)) {
    console.log(`[AIHospital] Cache hit for "${name}"`);
    return cached!.data;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.log('[AIHospital] No OPENAI_API_KEY, returning empty');
    return emptyResult();
  }

  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `Respond ONLY with valid JSON object matching this exact schema. NO other text, no markdown, no explanations, no \`\`\`.

{\\"name\\": \\"string\\", \\"address\\": \\"string\\", \\"city\\": \\"string\\", \\"province\\": \\"string\\", \\"phone\\": \\"string\\", \\"website\`: \\"string\\", \\"description\\": \\"string\\", \\"type\\": \\"string\\", \\"emergency\\": \\"boolean\\"}

Rumah sakit: ${name}

Fill with real Indonesian hospital data or empty strings. emergency: true if has IGD/UGD.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a JSON API. Respond with ONLY valid JSON. No other text."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" } as const,
    });

    const rawText = response.choices[0]?.message?.content || '{}';
    console.log(`[AIHospital] Raw response for "${name}":`, rawText);

    // Try direct parse
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      // Regex extract fallback
      const extracted = extractJson(rawText);
      console.log(`[AIHospital] Regex extracted:`, extracted);
      parsed = JSON.parse(extracted) as Record<string, unknown>;
    }

    // Normalize to exact interface
    const result: HospitalAIResult = {
      name: (parsed.name || '') + '',
      address: (parsed.address || '') + '',
      city: (parsed.city || '') + '',
      province: (parsed.province || '') + '',
      phone: (parsed.phone || '') + '',
      website: (parsed.website || '') + '',
      description: (parsed.description || '') + '',
      type: (parsed.type || '') + '',
      emergency: parseEmergency(parsed.emergency),
    };

    // Cache valid non-empty results
    if (result.name || result.address || result.phone) {
      cache.set(name, { data: result, timestamp: Date.now() });
    }

    console.log(`[AIHospital] Parsed result for "${name}":`, result);
    return result;

  } catch (error) {
    console.error(`[AIHospital] Error for "${name}":`, error);
    return emptyResult();
  }
}


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
  facilities?: string;
  latitude?: number;
  longitude?: number;
}

const cache = new Map<string, { data: HospitalAIResult; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function isCacheValid(entry?: { timestamp: number }): boolean {
  return entry ? Date.now() - entry.timestamp < CACHE_TTL : false;
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
    facilities: "",
    latitude: undefined,
    longitude: undefined,
  };
}

function extractJsonString(text: string): string {
  const regex = /\{[\s\S]*\}/;
  const jsonMatch = regex.exec(text);
  return jsonMatch ? jsonMatch[0] : "{}";
}

function parseEmergency(val: unknown): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    return ["true", "yes", "1", "iya", "ada", "ya"].includes(
      val.toLowerCase().trim(),
    );
  }
  return false;
}

function safeTryParse(jsonStr: string): Record<string, unknown> | null {
  try {
    return JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function fetchHospitalAI(name: string): Promise<HospitalAIResult> {
  const cacheKey = name.toLowerCase().trim();
  const cached = cache.get(cacheKey);

  if (isCacheValid(cached)) {
    console.log(`[AI CACHE HIT] ${name}`);
    return cached!.data;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn("[AI] OPENAI_API_KEY tidak ditemukan");
    return emptyResult();
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `RESPOND ONLY WITH VALID JSON. NO EXPLANATION. NO MARKDOWN. NO CODE BLOCKS.

You are an expert Indonesian hospital database API. Return COMPLETE and DETAILED information about Indonesian hospitals.

CRITICAL: Fill ALL fields with accurate, realistic data. Do NOT leave empty fields unless absolutely necessary.

Return exactly this structure:
{
  "name": "string - exact hospital name",
  "address": "string - complete street address with details (e.g. Jl. Ahmad Yani No. 123, Kelurahan Karawaci, Kecamatan Serpong)",
  "city": "string - city name exactly as written (e.g. Kota Serang, Kota Tangerang, Kab. Tangerang)",
  "province": "string - province (e.g. Banten, Jawa Barat)",
  "phone": "string - main phone number with area code (e.g. +62-21-1234567 or 021-1234567)",
  "website": "string - hospital website URL or domain (e.g. https://www.hospitalname.com or hospitalname.com)",
  "description": "string - 2-3 sentences description of hospital services and reputation",
  "type": "string - type (RS Umum, RS Swasta, RS Khusus Mata, RS Jiwa, RS Ibu & Anak, Klinik, dll)",
  "emergency": boolean - true if has 24-hour emergency services (IGD 24 Jam)",
  "facilities": "string - comma-separated list of facilities (e.g. IGD 24 Jam, ICU, Laboratorium, CT Scan, MRI, Rawat Inap, Farmasi, Apotek, Kamar Operasi, Hemodialisa)",
  "latitude": "number - GPS latitude coordinate (e.g. -6.267593)",
  "longitude": "number - GPS longitude coordinate (e.g. 106.767475)"
}

IMPORTANT INSTRUCTIONS:
1. ALWAYS include complete address with street name and number
2. ALWAYS include 3-5+ facilities based on hospital type
3. ALWAYS include accurate GPS coordinates if known
4. ALWAYS use realistic phone format with area codes
5. For major hospitals, include website if you know it
6. For description, mention hospital specialties and services
7. If hospital is famous/known: provide actual information
8. If hospital is less known: provide REALISTIC generic information

Hospital/Clinic Name: "${name}"

Examples of proper output:
{
  "name": "Siloam Hospitals Lippo Karawaci",
  "address": "Jl. Raya Benda No. 1-3, Kelurahan Karawaci, Kecamatan Serpong, Kota Tangerang",
  "city": "Kota Tangerang",
  "province": "Banten",
  "phone": "+62-21-5322222",
  "website": "siloamhospitals.com",
  "description": "Rumah sakit swasta modern terkemuka dengan fasilitas lengkap dan tenaga medis profesional. Melayani berbagai spesialisasi dan konsultasi kesehatan.",
  "type": "RS Swasta",
  "emergency": true,
  "facilities": "IGD 24 Jam, ICU, Laboratorium, CT Scan, Ultrasonografi, Kamar Operasi, Farmasi, Apotek, Rawat Inap",
  "latitude": -6.267593,
  "longitude": 106.767475
}

CRITICAL: Return COMPLETE JSON with ALL fields filled. NO partial responses.`;

  try {
    console.log(`[AI] Querying for: ${name}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a JSON API. Return only valid JSON responses without any additional text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const rawText = response.choices[0]?.message?.content || "{}";
    console.log(`[AI RAW] ${name}: ${rawText.substring(0, 200)}...`);

    let parsed: Record<string, unknown> | null = null;

    // Try 1: Direct JSON.parse
    parsed = safeTryParse(rawText);

    // Try 2: Extract JSON with regex
    if (!parsed) {
      const extractedJson = extractJsonString(rawText);
      parsed = safeTryParse(extractedJson);
    }

    // Try 3: Failed completely
    if (!parsed) {
      console.warn(`[AI] Failed to parse JSON for: ${name}`);
      return emptyResult();
    }

    const result: HospitalAIResult = {
      name: typeof parsed.name === "string" ? parsed.name : "",
      address: typeof parsed.address === "string" ? parsed.address : "",
      city: typeof parsed.city === "string" ? parsed.city : "",
      province: typeof parsed.province === "string" ? parsed.province : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      website: typeof parsed.website === "string" ? parsed.website : "",
      description:
        typeof parsed.description === "string" ? parsed.description : "",
      type: typeof parsed.type === "string" ? parsed.type : "",
      emergency: parseEmergency(parsed.emergency),
      facilities:
        typeof parsed.facilities === "string" ? parsed.facilities : "",
      latitude:
        typeof parsed.latitude === "number" ? parsed.latitude : undefined,
      longitude:
        typeof parsed.longitude === "number" ? parsed.longitude : undefined,
    };

    // Cache if ada data
    if (result.name || result.address) {
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
    }

    return result;
  } catch (error) {
    console.error("[AI ERROR]:", error);
    return emptyResult();
  }
}

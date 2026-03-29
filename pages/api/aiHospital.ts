import type { NextApiRequest, NextApiResponse } from "next";
import { fetchHospitalAI } from "@/lib/aiHospital";

export interface HospitalAIResponse {
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  website: string;
  description: string;
  type: string;
  emergency: boolean;
  image: string;
  facilities?: string;
  latitude?: number;
  longitude?: number;
}

function emptyResponse(): HospitalAIResponse {
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
    image: "",
    facilities: "",
    latitude: undefined,
    longitude: undefined,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HospitalAIResponse | { error: string }>,
): Promise<void> {
  // Method check
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";

  // Jika kosong → tetap return aman
  if (!name) {
    res.status(400).json({ error: "Name query parameter is required" });
    return;
  }

  let aiResult;

  try {
    aiResult = await fetchHospitalAI(name);
  } catch (e) {
    console.error("[API] AI fetch error:", e);
    aiResult = emptyResponse();
  }

  const resultName =
    typeof aiResult?.name === "string" && aiResult.name ? aiResult.name : name;

  const response: HospitalAIResponse = {
    name: resultName,
    address: typeof aiResult?.address === "string" ? aiResult.address : "",
    city: typeof aiResult?.city === "string" ? aiResult.city : "",
    province: typeof aiResult?.province === "string" ? aiResult.province : "",
    phone: typeof aiResult?.phone === "string" ? aiResult.phone : "",
    website: typeof aiResult?.website === "string" ? aiResult.website : "",
    description:
      typeof aiResult?.description === "string" ? aiResult.description : "",
    type: typeof aiResult?.type === "string" ? aiResult.type : "",
    emergency: Boolean(aiResult?.emergency ?? false),
    image: "",
    facilities:
      typeof aiResult?.facilities === "string" ? aiResult.facilities : "",
    latitude:
      typeof aiResult?.latitude === "number" ? aiResult.latitude : undefined,
    longitude:
      typeof aiResult?.longitude === "number" ? aiResult.longitude : undefined,
  };

  res.status(200).json(response);
}

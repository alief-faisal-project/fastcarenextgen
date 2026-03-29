import type { NextApiRequest, NextApiResponse } from "next";
import { fetchHospitalAI, HospitalAIResult } from "@/lib/aiHospital";

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
  image: string; // Always empty, never from AI
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HospitalAIResponse | { error: string }>
) {
  // Only GET method
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate name query
  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
  if (!name) {
    // Always return 200 with empty data structure
    return res.status(200).json({
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
    });
  }

  // Fetch from AI (always succeeds, returns empty on failure)
  const aiResult = await fetchHospitalAI(name);

  // Normalize response - image ALWAYS empty
  const response: HospitalAIResponse = {
    name: aiResult.name,
    address: aiResult.address,
    city: aiResult.city,
    province: aiResult.province,
    phone: aiResult.phone,
    website: aiResult.website,
    description: aiResult.description,
    type: aiResult.type,
    emergency: aiResult.emergency,
    image: "", // CRITICAL: Always empty, ignore any AI image
  };

  // ALWAYS 200, even if empty data
  res.status(200).json(response);
}


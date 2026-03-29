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
  image: string; // selalu manual
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
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HospitalAIResponse | { error: string }>,
) {
  // Method check
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";

  // Jika kosong → tetap return aman
  if (!name) {
    return res.status(200).json(emptyResponse());
  }

  let aiResult;

  try {
    aiResult = await fetchHospitalAI(name);
  } catch (e) {
    console.error("API ERROR:", e);
    aiResult = {};
  }

  const response: HospitalAIResponse = {
    name: aiResult?.name || name,
    address: aiResult?.address || "",
    city: aiResult?.city || "",
    province: aiResult?.province || "",
    phone: aiResult?.phone || "",
    website: aiResult?.website || "",
    description: aiResult?.description || "",
    type: aiResult?.type || "",
    emergency: aiResult?.emergency ?? false,
    image: "", // WAJIB kosong
  };

  return res.status(200).json(response);
}

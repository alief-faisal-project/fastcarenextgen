/**
 * Security utilities for input validation and sanitization
 */

// 1. Definisikan semua fungsi pembantu terlebih dahulu
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeHtml = (input: string): string => {
  if (!input) return "";
  if (typeof window === "undefined") return input.replace(/<[^>]*>?/gm, "");
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return "";
  return input.trim().replace(/\s+/g, " ").substring(0, 1000);
};

// 2. Sekarang fungsi validateHospitalData bisa mengenali semua fungsi di atas
export const validateHospitalData = (data: Record<string, unknown>) => {
  const errors: string[] = [];

  const name = String(data.name || "").trim();
  const address = String(data.address || "").trim();
  const phone = String(data.phone || "").trim();
  const image = String(data.image || "").trim();
  const email = String(data.email || "").trim();

  if (!name) errors.push("Nama rumah sakit harus diisi");
  if (!address) errors.push("Alamat harus diisi");

  // Sekarang isValidPhoneNumber pasti ditemukan!
  if (!phone || !isValidPhoneNumber(phone)) {
    errors.push("Nomor telepon tidak valid");
  }

  if (!data.city) errors.push("Kota harus dipilih");

  // Sekarang isValidUrl pasti ditemukan!
  if (!image || !isValidUrl(image)) {
    errors.push("URL gambar tidak valid");
  }

  if (email && !isValidEmail(email)) {
    errors.push("Format email tidak valid");
  }

  return { valid: errors.length === 0, errors };
};

// ... RateLimiter tetap di bawah

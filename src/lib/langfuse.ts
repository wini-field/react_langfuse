import { Langfuse } from "langfuse";

export const publicKey = import.meta.env.VITE_LANGFUSE_PUBLIC_KEY;
export const secretKey = import.meta.env.VITE_LANGFUSE_SECRET_KEY;
export const baseUrl = import.meta.env.VITE_LANGFUSE_BASE_URL;

if (!publicKey || !secretKey) {
  console.error("Langfuse environment variables are not set. Please check your .env file.");
}

// Langfuse SDK 인스턴스 (기존과 동일)
export const langfuse = new Langfuse({
  publicKey,
  secretKey,
  baseUrl,
});
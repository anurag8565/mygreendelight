/**
 * 🛡️ NoSQL Injection & Payload Sanitization Utility
 * Recursively removes MongoDB operator keys (keys starting with '$' or containing '.')
 * to prevent NoSQL injection attacks.
 */
export function sanitizeInput<T = any>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    // Return sanitized string without raw null bytes
    return obj.replace(/\0/g, "") as any;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeInput(item)) as any;
  }

  if (typeof obj === "object") {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Strip keys starting with '$' (e.g. '$gt', '$ne', '$where') or containing '.'
      if (!key.startsWith("$") && !key.includes(".")) {
        cleanObj[key] = sanitizeInput(value);
      }
    }
    return cleanObj as any;
  }

  return obj;
}

/**
 * 🛡️ Escapes special regular expression characters to prevent ReDoS & regex injection
 */
export function escapeRegex(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

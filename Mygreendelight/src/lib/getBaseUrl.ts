export function getBaseUrl(): string {
  if (process.env.NODE_ENV === "production") {
    if (process.env.NEXT_URL && !process.env.NEXT_URL.includes("localhost")) {
      return process.env.NEXT_URL.replace(/\/+$/, "");
    }
    return "https://subziquick.in";
  }
  return (process.env.NEXT_URL || "http://localhost:3000").replace(/\/+$/, "");
}

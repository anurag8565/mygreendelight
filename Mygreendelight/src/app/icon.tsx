import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 38,
          background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          color: "white",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        🌿
      </div>
    ),
    {
      ...size,
    }
  );
}

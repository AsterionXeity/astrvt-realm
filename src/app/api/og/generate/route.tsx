import { ImageResponse } from "next/og";
import { baseURL, person } from "@/resources";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

async function loadGoogleFont(font: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${font}`;
    const cssRes = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (resource && resource[1]) {
      const response = await fetch(resource[1]);
      if (response.ok) {
        return await response.arrayBuffer();
      }
    }
  } catch (err) {
    console.warn("Falling back to system font for OG image:", err);
  }
  return null;
}

async function getAvatarBase64(): Promise<string> {
  try {
    const avatarPath = path.join(
      process.cwd(),
      "public",
      "images",
      "gallery",
      "asterion-portrait-smile.png"
    );
    const buffer = await fs.readFile(avatarPath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (e) {
    console.warn("Could not read local avatar, falling back to URL:", e);
    return `${baseURL.replace(/\/$/, "")}${person.avatar}`;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawTitle = url.searchParams.get("title");
  const isLive =
    url.searchParams.get("live") === "true" ||
    (rawTitle ? rawTitle.includes("🔴") || rawTitle.toUpperCase().includes("LIVE") : false);
  const platform = url.searchParams.get("platform") || "Twitch";
  const streamTitle = url.searchParams.get("streamTitle");
  const subtitleParam = url.searchParams.get("subtitle");

  let displayName = person.name; // "Asterion Voidcaller"
  if (
    rawTitle &&
    !rawTitle.toLowerCase().includes("asterion voidcaller") &&
    !rawTitle.toLowerCase().includes("portfolio") &&
    !rawTitle.toLowerCase().includes("vtuber realm")
  ) {
    displayName = rawTitle;
  }

  const avatarSrc = await getAvatarBase64();
  const fontData = await loadGoogleFont("Geist:wght@700");

  const fontsConfig: Array<{ name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 700 }> =
    fontData
      ? [
          {
            name: "Geist",
            data: fontData,
            style: "normal",
            weight: 700,
          },
        ]
      : [];

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "48px 56px",
        backgroundColor: "#07060d",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(139, 92, 246, 0.4) 0%, rgba(91, 33, 182, 0.18) 40%, transparent 70%), radial-gradient(circle at 12% 88%, rgba(245, 158, 11, 0.28) 0%, rgba(180, 83, 9, 0.1) 40%, transparent 65%)",
        color: "#ffffff",
        fontFamily: "Geist, system-ui, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      {/* Decorative Border Frame */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          bottom: "20px",
          border: isLive
            ? "1px solid rgba(239, 68, 68, 0.4)"
            : "1px solid rgba(168, 85, 247, 0.28)",
          borderRadius: "24px",
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 10,
        }}
      >
        {isLive ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(239, 68, 68, 0.22)",
              border: "1.5px solid rgba(239, 68, 68, 0.8)",
              boxShadow: "0 0 24px rgba(239, 68, 68, 0.5)",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#ef4444",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              LIVE ON {platform.toUpperCase()}
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(139, 92, 246, 0.2)",
              border: "1.5px solid rgba(168, 85, 247, 0.5)",
            }}
          >
            <span style={{ fontSize: "18px", color: "#fbbf24" }}>✦</span>
            <span
              style={{
                fontSize: "17px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#e9d5ff",
                textTransform: "uppercase",
              }}
            >
              Astral Elf VTuber Realm
            </span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 18px",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            astrvt-realm.vercel.app
          </span>
        </div>
      </div>

      {/* Center Body */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "42px",
          width: "100%",
          margin: "auto 0",
          zIndex: 10,
        }}
      >
        {/* Avatar with dynamic glow */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "172px",
            height: "172px",
            borderRadius: "9999px",
            padding: "6px",
            background: isLive
              ? "linear-gradient(135deg, #ef4444, #f59e0b)"
              : "linear-gradient(135deg, #f59e0b, #9333ea, #38bdf8)",
            boxShadow: isLive
              ? "0 0 40px rgba(239, 68, 68, 0.5)"
              : "0 0 40px rgba(147, 51, 234, 0.45)",
          }}
        >
          <img
            src={avatarSrc}
            alt="Asterion Voidcaller"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "9999px",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Text / Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#fbbf24",
              textTransform: "uppercase",
            }}
          >
            {isLive ? "Broadcasting Live" : "Official VTuber Socials"}
          </span>

          <span
            style={{
              fontSize: "58px",
              fontWeight: 900,
              lineHeight: "1.05",
              letterSpacing: "-0.02em",
              color: "#ffffff",
              textShadow: "0 4px 24px rgba(0, 0, 0, 0.85)",
            }}
          >
            {displayName}
          </span>

          {isLive && streamTitle ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 18px",
                borderRadius: "12px",
                backgroundColor: "rgba(139, 92, 246, 0.25)",
                border: "1px solid rgba(168, 85, 247, 0.45)",
                maxWidth: "760px",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#f3e8ff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                🎮 {streamTitle}
              </span>
            </div>
          ) : (
            <span
              style={{
                fontSize: "22px",
                fontWeight: 500,
                lineHeight: "1.4",
                color: "rgba(255, 255, 255, 0.82)",
                maxWidth: "780px",
              }}
            >
              {subtitleParam ||
                "Astral Elf lost in the cosmic abyss — streams, music, dev, and community hub."}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer Socials */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingTop: "20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 15px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 0, 0, 0.16)",
              border: "1px solid rgba(255, 0, 0, 0.35)",
              color: "#fca5a5",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            <span>YouTube</span>
            <span style={{ color: "rgba(255, 255, 255, 0.55)" }}>@AsterionVT</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 15px",
              borderRadius: "8px",
              backgroundColor: "rgba(145, 70, 255, 0.2)",
              border: "1px solid rgba(145, 70, 255, 0.4)",
              color: "#d8b4fe",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            <span>Twitch</span>
            <span style={{ color: "rgba(255, 255, 255, 0.55)" }}>asterionvt</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 15px",
              borderRadius: "8px",
              backgroundColor: "rgba(56, 189, 248, 0.16)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              color: "#7dd3fc",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            <span>Bluesky</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 15px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            <span>Discord Realm</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: "#fbbf24",
              letterSpacing: "0.06em",
            }}
          >
            ✦ VOIDCALLER REALM
          </span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      ...(fontsConfig.length > 0 ? { fonts: fontsConfig } : {}),
    }
  );
}

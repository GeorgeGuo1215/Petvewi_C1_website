import { NextResponse } from "next/server";
import { isSupportedLanguage } from "@/i18n/config";

const MAX_REQUEST_BYTES = 16_384;
const MAX_FIELD_LENGTH = 256;

type ApplicationPayload = {
  name: string;
  wechat: string;
  email: string;
  website: string;
  lang: string;
  color: string;
  plan: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(record: Record<string, unknown>, key: keyof ApplicationPayload) {
  const value = record[key];
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

function parsePayload(value: unknown): ApplicationPayload | null {
  if (!isRecord(value)) return null;

  const payload: ApplicationPayload = {
    name: readText(value, "name"),
    wechat: readText(value, "wechat"),
    email: readText(value, "email"),
    website: readText(value, "website"),
    lang: readText(value, "lang"),
    color: readText(value, "color"),
    plan: readText(value, "plan"),
  };

  if (!payload.name || !payload.wechat || !payload.color || !payload.plan || !isSupportedLanguage(payload.lang)) return null;
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return null;
  return payload;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ message: "Request payload is too large." }, { status: 413 });
  }

  const requestBody = await request.json().catch(() => null);
  if (isRecord(requestBody) && readText(requestBody, "website")) {
    return NextResponse.json({ accepted: true }, { status: 201 });
  }

  const payload = parsePayload(requestBody);
  if (!payload) return NextResponse.json({ message: "Invalid application data." }, { status: 400 });

  const webhookUrl = process.env.BETA_APPLICATION_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ message: "Application receiver is not configured." }, { status: 503 });
  }

  const token = process.env.BETA_APPLICATION_WEBHOOK_TOKEN;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        type: "pethealthai.beta-application",
        submittedAt: new Date().toISOString(),
        application: {
          name: payload.name,
          wechat: payload.wechat,
          email: payload.email || null,
          language: payload.lang,
          color: payload.color,
          plan: payload.plan,
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Application receiver rejected the request." }, { status: 502 });
    }

    return NextResponse.json({ accepted: true }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Application receiver is unavailable." }, { status: 502 });
  }
}

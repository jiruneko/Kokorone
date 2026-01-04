import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SELF_HARM_KEYWORDS: readonly string[] = [
  "死にたい",
  "消えたい",
  "自殺",
  "生きていたくない",
  "いなくなりたい",
  "終わりにしたい",
];

function hasSelfHarmIntent(text: string): boolean {
  return SELF_HARM_KEYWORDS.some((k) => text.includes(k));
}

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) throw new Error(`Missing env: ${name}`);
  return v.trim();
}

type ChatRequestBody = { message: string };

function isChatRequestBody(x: unknown): x is ChatRequestBody {
  if (typeof x !== "object" || x === null) return false;
  const rec = x as Record<string, unknown>;
  return typeof rec.message === "string";
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    if (!isChatRequestBody(body) || body.message.trim().length === 0) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const message = body.message.trim();
    const isSelfHarm = hasSelfHarmIntent(message);

    const endpoint = getEnv("AZURE_OPENAI_ENDPOINT");
    const deployment = getEnv("AZURE_OPENAI_DEPLOYMENT");
    const apiKey = getEnv("AZURE_OPENAI_API_KEY");
    const apiVersion = getEnv("AZURE_OPENAI_API_VERSION");

    // Azure OpenAI の正しいURL（deployment + api-version）
    const url =
      `${endpoint}/openai/deployments/${encodeURIComponent(deployment)}` +
      `/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;

    // Self-harm 分岐（B）：まず安全文面を返して、以降は必要ならエスカレーション
    if (isSelfHarm) {
      return NextResponse.json({
        reply:
          "つらい気持ちをここで話してくれてありがとうございます。あなたの安全がいちばん大切です。\n" +
          "今この瞬間に「自分を傷つけてしまいそう」または「危ないかも」と感じていますか？\n\n" +
          "もし危険が差し迫っているなら、今いる地域の緊急番号（日本なら 110 / 119）に連絡するか、近くの人に助けを求めてください。\n" +
          "危険が差し迫っていない場合でも、信頼できる人や医療・相談窓口につながることを一緒に考えられます。\n\n" +
          "いまは一人ですか？ それとも誰か近くにいますか？",
      });
    }

    const azureRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "あなたは「Kokorone」。人の心に寄り添う、穏やかで否定しない対話者です。医療行為・診断・治療の断定はしません。日本語で落ち着いた口調で話します。",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const raw = await azureRes.text();

    // ここが原因特定の鍵：Azureのステータスと本文（最初の500文字）をログ
    console.log("AZURE_STATUS:", azureRes.status);
    console.log("AZURE_BODY_HEAD:", raw.slice(0, 500));

    if (!azureRes.ok) {
      return NextResponse.json(
        {
          reply:
            "ごめんなさい、いま接続が不安定みたいです。少しだけ時間を置いて、もう一度送ってみてください。",
          status: azureRes.status,
        },
        { status: 500 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { reply: "サーバ応答の解析に失敗しました。", detail: raw.slice(0, 200) },
        { status: 500 }
      );
    }

    const data = parsed as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ reply: reply.length > 0 ? reply : "……" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("CHAT_API_ERROR:", msg);
    return NextResponse.json(
      { reply: "エラーが発生しました。少し時間を置いてからもう一度試してください。", error: msg },
      { status: 500 }
    );
  }
}

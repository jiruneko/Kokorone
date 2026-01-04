"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "こんにちは。Kokoroneです。\n無理にうまく話そうとしなくて大丈夫。\n今いちばん重たい気持ちは、どんな感じですか？",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data?.reply ??
            "ごめんなさい、うまく言葉を返せませんでした。",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "通信エラーが起きました。少し時間を置いてから、また話しかけてください。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#ffffff",
        padding: "24px 12px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ロゴ（中央） */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Image
            src="/Kokorone.png"
            alt="Kokorone"
            width={160}
            height={160}
            priority
            style={{ opacity: 0.95 }}
          />
        </div>

        <h1
          style={{
            textAlign: "center",
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          Kokorone
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "#666",
            marginBottom: 20,
          }}
        >
          無理に前向きにならなくて大丈夫。
          <br />
          思ったことを、そのまま書いてください。
        </p>

        {/* チャット履歴 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 4px",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background:
                    msg.role === "user" ? "#222" : "#f3f3f3",
                  color:
                    msg.role === "user" ? "#fff" : "#000",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  fontSize: 14,
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
              Kokorone が考えています…
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* 入力エリア（Enterでは送信されない） */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="いまの気持ちを入力してください"
            rows={3}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              resize: "vertical",
              fontSize: 14,
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "0 16px",
              borderRadius: 8,
              border: "none",
              background: loading ? "#ccc" : "#222",
              color: "#fff",
              cursor: loading ? "default" : "pointer",
              fontSize: 14,
            }}
          >
            送信
          </button>
        </div>
      </div>
    </main>
  );
}

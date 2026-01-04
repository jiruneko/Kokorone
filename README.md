# Kokorone🌱

A Safety-First AI Companion for Emotional Support

Kokorone is a lightweight, safety-focused AI chat application designed to listen, not judge, and to prioritize user well-being above all else.

This project demonstrates how to build a production-ready AI application with careful attention to mental-health safety, prompt design, and secure cloud deployment.

✨ Concept

Many AI chat apps focus on speed or intelligence.
Kokorone focuses on safety, calmness, and trust.

No diagnoses

No medical claims

No encouragement of harmful behavior

Always empathetic, always grounded

This makes Kokorone suitable as:

a prototype for mental-health–adjacent services

a portfolio project for safety-critical AI systems

a foundation for ethical conversational AI

🛡️ Safety-First Design

Kokorone is explicitly designed to handle sensitive input responsibly.

Core safety principles:

Empathetic but non-directive responses

Self-harm detection branch (keyword-based, extendable)

No disclosure of internal system instructions

Encouragement of external support when risk is detected

Calm, Japanese-language responses by default

This project intentionally avoids “therapy claims” and focuses on safe conversational support.

🧠 Architecture Overview
Frontend

Next.js 16 (App Router)

Client-side chat UI

Message history preserved for continuous conversation

Explicit send button (no accidental Enter submission)

Backend (API Layer)

Next.js API Routes

Secure server-side calls to Azure OpenAI

Safety-aware system prompt

Structured error handling

AI / Cloud

Azure OpenAI Service

Chat Completions API

Environment variables managed securely (no secrets in repo)

🧰 Tech Stack

TypeScript

Next.js 16

Azure OpenAI

Vercel (deployment)

Prisma + PostgreSQL (optional backend logging / extensible)

🚀 Live Demo

👉 Deployed on Vercel
(URL intentionally omitted here – add your Vercel URL)

📸 UI Snapshot

Minimal, calm interface

Centered branding (Kokorone.png)

Focus on text and emotional clarity

No dark patterns, no pressure

🔐 Security & Best Practices

Environment variables never committed

API keys managed via cloud provider

Server-only AI access (no client exposure)

Incident-response aware development process

🧩 Why This Project Matters

This repository demonstrates:

How to build AI products responsibly

How to integrate cloud AI services safely

How to design systems that respect human vulnerability

It is intentionally simple — because trust is built through restraint, not excess features.

📬 Author

Built by an independent full-stack developer with experience in:

AI systems

Cloud infrastructure

Ethical product design

Available for:

AI integration projects

Safety-critical applications

International / remote development work

⚠️ Disclaimer

Kokorone is not a medical device and does not provide diagnosis or treatment.
It is a technical and ethical demonstration project.

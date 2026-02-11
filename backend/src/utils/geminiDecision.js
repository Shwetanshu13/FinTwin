import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../conf/index.js";

function isEnabled() {
    if (!config.geminiEnabled) return false;
    if (!config.geminiApiKey) return false;
    return true;
}

function safeJson(value, maxChars = 8000) {
    const raw = JSON.stringify(value ?? null);
    if (raw.length <= maxChars) return raw;
    return raw.slice(0, maxChars) + "…";
}

function buildPrompt({ kind, requestPayload, engineResult }) {
    return [
        "You are FinTwin's AI decision assistant.",
        "The user is asking for a decision statement based strictly on the computed financial results.",
        "Output MUST be valid JSON and nothing else.",
        "Do NOT provide personalized investment advice. Keep it informational.",
        "If data is insufficient, say so clearly.",
        "",
        "Return JSON with this shape:",
        '{"decisionStatement": string, "keyPoints": string[]}',
        "",
        `Scenario: ${kind}`,
        "Inputs (request payload):",
        safeJson(requestPayload),
        "Computed (engine/controller result):",
        safeJson(engineResult),
        "",
        "Decision statement requirements:",
        "- One or two sentences max.",
        "- Start with 'Decision:'.",
        "- Reference affordability/runway/net savings when available.",
        "Key points requirements:",
        "- 2 to 4 short bullets as strings.",
    ].join("\n");
}

function extractJson(text) {
    const trimmed = String(text ?? "").trim();
    if (!trimmed) throw new Error("EMPTY_AI_RESPONSE");

    // Allow models that wrap JSON in ```json fences.
    const fenceMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/i);
    const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

    return JSON.parse(candidate);
}

export async function getDecisionStatement({ kind, requestPayload, engineResult }) {
    if (!isEnabled()) return null;

    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: config.geminiModel });

    const prompt = buildPrompt({ kind, requestPayload, engineResult });
    const response = await model.generateContent(prompt);
    const text = response?.response?.text?.() ?? "";

    const parsed = extractJson(text);
    const decisionStatement = typeof parsed?.decisionStatement === "string" ? parsed.decisionStatement : null;
    const keyPoints = Array.isArray(parsed?.keyPoints)
        ? parsed.keyPoints.filter((x) => typeof x === "string").slice(0, 6)
        : [];

    if (!decisionStatement) throw new Error("INVALID_AI_RESPONSE");

    return {
        decisionStatement,
        keyPoints,
        model: config.geminiModel,
    };
}

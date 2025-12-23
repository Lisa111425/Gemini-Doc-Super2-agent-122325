import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language, AnalysisConfig } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generateDeepSummary(content: string, config: AnalysisConfig): Promise<string> {
    const modelId = config.model || 'gemini-3-flash-preview';
    
    // Construct Prompt
    const langInstruction = config.language === Language.TRADITIONAL_CHINESE 
      ? "OUTPUT IN TRADITIONAL CHINESE (繁體中文)." 
      : "OUTPUT IN ENGLISH.";

    const prompt = `
      ${langInstruction}
      You are an elite strategic auditor and document intelligence agent.
      
      TASK: Create a comprehensive "Masterpiece" audit report of the following document content.
      The report must be between 2000 and 3000 words.
      
      STRUCTURE:
      1. Executive Summary
      2. Comprehensive Detailed Analysis (Deep Dive)
      3. Strategic SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
      4. Risk Assessment & Mitigation
      5. Key Entities & Technical Data
      6. Conclusion & Forward-Looking Statements
      
      FORMAT: Markdown. Use bolding for emphasis. Use tables for data.
      
      CONTENT TO ANALYZE:
      ${content.substring(0, 100000)} ... [truncated if too long]
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
           maxOutputTokens: 8192, 
        }
      });
      return response.text || "No summary generated.";
    } catch (error: any) {
      console.error("Gemini Summary Error:", error);
      return `Error generating summary: ${error.message}`;
    }
  }

  async chatWithContext(
    query: string, 
    context: string, 
    history: {role: string, content: string}[],
    config: AnalysisConfig
  ): Promise<string> {
     const modelId = config.model || 'gemini-3-flash-preview';
     
     const systemInstruction = `
       You are AuditFlow AI, a helpful assistant. 
       Answer the user's question based STRICTLY on the provided Context.
       If the answer is not in the context, say so.
       Current Language: ${config.language === Language.TRADITIONAL_CHINESE ? "Traditional Chinese" : "English"}.
     `;

     const chat = this.ai.chats.create({
        model: modelId,
        config: {
            systemInstruction: systemInstruction,
        },
        history: [
            {
                role: 'user',
                parts: [{ text: `CONTEXT DOCUMENTS:\n${context.substring(0, 50000)}` }]
            },
            {
                role: 'model',
                parts: [{ text: "I have acknowledged the context. I am ready to answer questions about it." }]
            },
            ...history.map(h => ({
                role: h.role,
                parts: [{ text: h.content }]
            }))
        ]
     });

     const result = await chat.sendMessage({ message: query });
     return result.text || "I could not generate a response.";
  }

  async smartReplace(template: string, data: string, instruction: string, config: AnalysisConfig): Promise<string> {
      const modelId = config.model || 'gemini-3-flash-preview';
      const prompt = `
        SYSTEM: You are a document automation engine.
        TASK: Replace placeholders in the TEMPLATE using the DATA SOURCE.
        USER INSTRUCTION: ${instruction}
        LANGUAGE: ${config.language === Language.TRADITIONAL_CHINESE ? "Traditional Chinese" : "English"}

        TEMPLATE:
        ${template}

        DATA SOURCE:
        ${data}

        OUTPUT: Return only the filled document text.
      `;

      const response = await this.ai.models.generateContent({
          model: modelId,
          contents: prompt
      });
      return response.text || "Failed to process smart replace.";
  }

  async transformNote(content: string, config: AnalysisConfig): Promise<string> {
    const modelId = config.model || 'gemini-3-flash-preview';
    const lang = config.language === Language.TRADITIONAL_CHINESE ? "Traditional Chinese" : "English";
    
    const prompt = `
      You are an expert personal knowledge manager.
      TASK: Take the raw, chaotic input text below and transform it into a highly organized, beautiful Markdown note.
      LANGUAGE: Output strictly in ${lang}.
      
      GUIDELINES:
      - Use clear Headers (#, ##).
      - Use Bullet points for lists.
      - Bold key terms.
      - Fix grammar and flow.
      - Maintain the original meaning but make it professional and readable.
      
      RAW INPUT:
      ${content}
    `;

    const response = await this.ai.models.generateContent({
        model: modelId,
        contents: prompt
    });
    return response.text || "Failed to transform note.";
  }

  async runMagic(note: string, magicType: string, config: AnalysisConfig): Promise<string> {
      const modelId = config.model || 'gemini-3-flash-preview';
      const lang = config.language === Language.TRADITIONAL_CHINESE ? "Traditional Chinese" : "English";

      let instruction = "";
      switch (magicType) {
          case 'format':
              instruction = "Reformat this note to be cleaner, using better markdown structure (tables, lists, headers).";
              break;
          case 'grammar':
              instruction = "Fix all grammar, spelling, and punctuation errors. Elevate the tone to professional business class.";
              break;
          case 'action':
              instruction = "Extract a checklist of 'Action Items' or 'To-Dos' from this note. Append them to the bottom.";
              break;
          case 'summary':
              instruction = "Add a 'TL;DR' Executive Summary section at the very top of the note.";
              break;
          case 'expand':
              instruction = "Expand on the key bullet points with more detail and context where applicable.";
              break;
          default:
              instruction = "Improve this note.";
      }

      const prompt = `
        SYSTEM: You are an AI Text Editor.
        ACTION: ${instruction}
        LANGUAGE: ${lang}
        
        CURRENT NOTE:
        ${note}
        
        OUTPUT: Return the fully updated Markdown note.
      `;

      const response = await this.ai.models.generateContent({
          model: modelId,
          contents: prompt
      });
      return response.text || "Magic failed.";
  }
}
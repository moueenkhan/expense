
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, InsightReport, Currency } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialInsights = async (transactions: Transaction[], aedToPkr: number): Promise<InsightReport | null> => {
  try {
    const transactionContext = transactions.map(t => {
      const amountInAED = t.currency === Currency.AED ? t.amount : t.amount / aedToPkr;
      const amountInPKR = t.currency === Currency.PKR ? t.amount : t.amount * aedToPkr;
      return `${t.date}: ${t.type === 'expense' ? '-' : '+'}${t.currency} ${t.amount} (Approx: ${t.currency === Currency.AED ? 'PKR ' + amountInPKR.toFixed(0) : 'AED ' + amountInAED.toFixed(2)}) - ${t.category}: ${t.description}`;
    }).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following dual-currency (AED and PKR) transaction history. 
      The current exchange rate is 1 AED = ${aedToPkr} PKR.
      Provide financial insights. Help the user understand their spending patterns in both currencies if relevant.
      
      Transactions:
      ${transactionContext}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A high-level summary of the spending habits." },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable recommendations to improve financial health."
            },
            savingTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Specific tips on how to save money based on categories."
            }
          },
          required: ["summary", "recommendations", "savingTips"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as InsightReport;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};

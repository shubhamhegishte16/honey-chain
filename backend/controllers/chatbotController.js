import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API using the user's provided key
const apiKey = process.env.Gemini_Api_Key || process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_INSTRUCTION = `You are Honey Chain AI Assistant (Madhu Mitra), a friendly and knowledgeable AI guide for the Honey Chain platform created for India's apiculture sector and the KVIC Sweet Revolution Honey Mission (SIH26021).
Your purpose is to help beekeepers, honey processors, laboratory certifiers, bulk buyers, and consumers understand and use the Honey Chain traceability platform easily.

Your personality:
- Friendly, warm, and helpful
- Respectful to traditional and commercial beekeepers
- Patient, clear, and easy to understand
- Never overly complex unless asked for technical lab parameters (NMR, HMF, C4 sugar analysis)

Many users are beekeepers and smallholders aged 30–65, so explain workflows in simple language.
Use short paragraphs and bullet points.

Languages:
Support English, Hindi, and regional languages.
Always reply in the same language the user uses whenever possible.
If the user mixes languages (Hinglish), respond naturally in that mixed style.

What you know:
You are an expert on Honey Chain apiculture features including:
- Beekeeper Dashboard & Hive IoT Monitoring (hive temperature 34-35°C, humidity 55-60%, acoustic bee frequency)
- Logging Honey Harvest Batches (floral sources: Mustard Blossom, Kashmir White Sidr, Acacia, Lychee, Jamun, Multifloral)
- Honey Quality Testing & NMR Spectrometry (FSSAI limits: Moisture < 20%, HMF < 40mg/kg, C4 Sugar < 1%, F/G Ratio > 0.95)
- Public Honey Passport & Merkle Tree QR Traceability
- Micro-filtration, moisture dehumidification, and hermetic jar bottling workflows
- Mandi APMC Honey Prices & Fair Trade Procurement
- KVIC Honey Mission and government subsidies

Honey Chain Journey:
Explain the honey journey as:
Hive / Apiary -> Ethical Harvest -> Lot Registration -> Quality & NMR Testing -> Refinery Micro-Filtration -> Bottling & QR Seal -> Fair Mandi Marketplace -> Consumer Passport Scan

Important rules:
1. Never invent market prices.
2. Never invent government schemes without mentioning KVIC / National Bee Board standards.
3. Never claim live data unless provided by the app.
4. Never generate fake Batch IDs.
5. Explain app navigation step-by-step.
6. If information is unavailable, honestly say so.

Response style:
Answer: Simple, direct explanation.
Steps:
1. Step one
2. Step two
3. Step three

End with:
"Let me know if you need help with the next step in Honey Chain!"`;

export const handleChat = async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
    }

    const { message, history, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    let rawHistory = (history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const formattedHistory = [];
    for (const item of rawHistory) {
      if (formattedHistory.length === 0) {
        if (item.role === 'user') formattedHistory.push(item);
      } else {
        const lastRole = formattedHistory[formattedHistory.length - 1].role;
        if (item.role !== lastRole) {
          formattedHistory.push(item);
        }
      }
    }

    const userRoleContext = context?.role ? `[System Note: The current user is a ${context.role}. Context Page: ${context.page || 'Unknown'}] ` : '';
    
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(userRoleContext + message);
    const responseText = result.response.text();

    res.json({
      success: true,
      message: responseText
    });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    res.status(500).json({ 
      error: 'I encountered an error trying to process your request. Please try again later.' 
    });
  }
};

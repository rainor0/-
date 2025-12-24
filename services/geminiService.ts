
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTrigExplanation = async (angle: number): Promise<string> => {
  const prompt = `به عنوان یک دبیر فیزیک، زاویه ${angle} درجه را در دایره مثلثاتی تحلیل کن. 
  ۱. مؤلفه‌های سینوس و کسینوس (تجزیه بردار) را توضیح بده.
  ۲. بگو در مسائل نیرو یا حرکت فیزیک دهم، این زاویه چه اهمیتی دارد؟
  ۳. علامت تانژانت و کتانژانت را در این ربع مشخص کن.
  کوتاه، علمی و به زبان فارسی برای دانش‌آموز دهم توضیح بده.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.6,
        topP: 0.9,
      }
    });
    return response.text || "متأسفانه پاسخی دریافت نشد.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "خطا در برقراری ارتباط با هوش مصنوعی.";
  }
};

export const getConceptExplanation = async (concept: string): Promise<string> => {
  const prompt = `مفهوم "${concept}" را در فیزیک دهم و مثلثات به زبان ساده توضیح بده.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "پاسخی یافت نشد.";
  } catch (error) {
    return "خطا در دریافت اطلاعات.";
  }
};

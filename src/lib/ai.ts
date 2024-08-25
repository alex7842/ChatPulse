import fireworks from "@/lib/fireworks";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


export const generateSummary = async (fileUrl: string, maxPagesAllowed: number) => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const loader = new PDFLoader(blob);
  
    const pageLevelDocs = await loader.load();
    const pageCount = pageLevelDocs.length;
  
    if (pageCount > maxPagesAllowed) {
      throw new Error(`Document can have at max ${maxPagesAllowed} pages. Upgrade to use larger documents.`);
    }
  
    const fullText = pageLevelDocs.map(doc => doc.pageContent).join(' ');
  
    const res = await fireworks.chat.completions.create({
      model: "accounts/fireworks/models/mixtral-8x7b-instruct",
      max_tokens: 2048,
      messages: [
        {
            role: "system",
            content: "You are an AI assistant that only provides the top 6 keywords from documents, formatted as an array without any additional explanation.",
        },
        {
            role: "user",
            content: `Give me only the top 6 keywords for the following text:\n\n${fullText}\n\nReturn the keywords as an array:`,
        },
    ]
    
    
      
    });
    const summary = res.choices[0]?.message.content?.trim();

    // Remove square brackets and split the string by commas
    const keywordsArray = summary ? summary.replace(/^\[|\]$/g, '').split(',').map(s => s.trim()) : [];
    
    const keywordsString = keywordsArray.join(', ');
    
    
    console.log("in ai",keywordsString);
    return keywordsString;
  };
  
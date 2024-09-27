import { env } from "@/env.mjs";
import { getPineconeClient } from "@/lib/pinecone";
import { prisma } from "@/server/db";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { PineconeStore } from "@langchain/pinecone";

export const vectoriseDocument = async (
  fileUrl: string,
  newFileId: string,
  maxPagesAllowed: number,
) => {
  
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const loader = new PDFLoader(blob);

  const pageLevelDocs = await loader.load();
  const pageCount = pageLevelDocs.length;
  // if (pageLevelDocs.every(doc => !doc.pageContent.trim())) {
  //   throw new Error("PDF has no readable content.");
  // }

  if (pageCount > maxPagesAllowed) {
    throw new Error(
      `Document to be vectorised can have at max ${maxPagesAllowed} pages. Upgrade to use larger documents.`,
    );
  }

  const pinecone = getPineconeClient();
  const pineconeIndex = (await pinecone).Index("docxpert");

  const combinedData = pageLevelDocs.map((document) => {
    return {
      ...document,
      metadata: {
        fileId: newFileId,
      },
      dataset: "pdf",
    };
  });

  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: env.HUGGINGFACE_API_KEY,
  });

  await PineconeStore.fromDocuments(combinedData, embeddings, {
    pineconeIndex,
  });

  await prisma.document.update({
    where: {
      id: newFileId,
    },
    data: {
      isVectorised: true,
    },
  });
};
import { createRouteHandler } from "uploadthing/next-legacy";

import { docUploader } from "@/server/uploadthing";
export const runtime = 'edge';

const handler = createRouteHandler({
  router: docUploader,
});

export default handler;

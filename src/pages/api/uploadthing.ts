import { createRouteHandler } from "uploadthing/next-legacy";

import { docUploader } from "@/server/uploadthing";

const handler = createRouteHandler({
  router: docUploader,
});

export default handler;

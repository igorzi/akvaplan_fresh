import { HandlerContext, Handlers } from "$fresh/server.ts";
export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const { cloudinary } = ctx.params;
    const url = new URL(
      // pdf => `https://resources.mynewsdesk.com/image/upload/f_pdf/${cloudinary}`,
      // download => `https://resources.mynewsdesk.com/image/upload/fl_attachment/${cloudinary}`,
      `https://resources.mynewsdesk.com/image/upload/${cloudinary}`,
    );
    const { body, headers, status } = await fetch(url);
    return new Response(body, { status, headers });
  },
};

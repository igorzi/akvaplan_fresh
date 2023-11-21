import { HandlerContext, Handlers } from "$fresh/server.ts";
export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const { cloudinary } = ctx.params;
    const url = new URL(
      `https://resources.mynewsdesk.com/image/upload/${cloudinary}`,
    );
    const { body, headers, status } = await fetch(url);
    return new Response(body, { status, headers });
  },
};

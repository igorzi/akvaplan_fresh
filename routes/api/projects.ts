import { latestProjects } from "akvaplan_fresh/services/projects.ts";
import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: HandlerContext) {
    return Response.json(await latestProjects());
  },
};

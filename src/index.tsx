import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/": index,
    "/assets/:name": async (req) => {
      const file = Bun.file(`public/${req.params.name}`)
      return new Response(file);
    },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);

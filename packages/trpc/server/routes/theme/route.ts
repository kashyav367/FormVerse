import { publicProcedure, router } from "../../trpc";
import { themeService } from "../../services";

export const themeRouter = router({
  listThemes: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/themes",
        tags: ["Themes"],
        summary: "List all preset and custom form design themes",
      },
    })
    .query(async () => {
      return await themeService.listThemes();
    }),
});

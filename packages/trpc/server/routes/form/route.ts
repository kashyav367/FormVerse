import {
  authenticatedProcedure,
  router,
} from "../../trpc";

import { generatePath } from "../../utils/path-generator";

import {
  createFormInputModel,
  createFormOutputModel,
  listFormOutputModel,
} from "./model";

import { formService } from "../../services";

import { z } from "zod";

const TAGS = ["Forms"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;

      return await formService.createForm({
        title,
        description,
        createdBy: ctx.user.id,
      });
    }),

  listForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listForm"),
        tags: TAGS,
      },
    })
    .input(z.undefined())
    .output(listFormOutputModel)
    .query(async ({ ctx }) => {
      const forms =  await formService.listFormByUserId({
        userId: ctx.user.id,
      });
      return forms;
    }),
});
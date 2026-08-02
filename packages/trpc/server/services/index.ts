import { UserService } from "@repo/services/user";
import formService from "@repo/services/form";
import formFieldService from "@repo/services/form-field";
import formSubmissionService from "@repo/services/form-submission";
import analyticsService from "@repo/services/analytics";
import exportService from "@repo/services/export";
import themeService from "@repo/services/theme";

export const userService = new UserService();

export {
  formService,
  formFieldService,
  formSubmissionService,
  analyticsService,
  exportService,
  themeService,
};

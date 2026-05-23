import { UserService } from "@repo/services/user";
import formService from "@repo/services/form";
import formFieldService from "@repo/services/form-field";
import formSubmissionService from "@repo/services/form-submission";


export const userService =
new UserService();

export {
  formService,
  formFieldService,
  formSubmissionService,
};




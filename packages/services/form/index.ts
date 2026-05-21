import db, { eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import {
 type CreatorFormInputType,
      createFormInput
} from "./model";

class FormService {
  public async createForm(payload: CreatorFormInputType) {
    const { title, description, createdBy } = await createFormInput.parseAsync(payload);

    const result = await db.insert(formsTable).values({ title, description, createdBy }).returning({
      id: formsTable.id,
    });

    if (!result || result.length === 0 || !result[0]?.id)
      throw new Error(`Something went wrong while creating the form`);

    return {
      id: result[0].id,
    };
  }
} 
export default FormService;
import TextbookSet from "../../models/textbookSetModel";
import * as factory from "./handlerFactory";

const Model = TextbookSet;
const key = "textbookSet";

/** `GET` - Gets all textbook sets */
export const getAllTextbookSets = factory.getAll(Model, `${key}s`);
/** `GET` - Gets a single textbook set */
export const getOneTextbookSet = factory.getOne(Model, key);
/** `POST` - Creates a single textbook set */
export const createTextbookSet = factory.createOne(Model, key);
/** `PATCH` - Updates a single textbook set */
export const updateTextbookSet = factory.updateOne(Model, key);
/** `DELETE` - Deletes textbook set */
export const deleteTextbookSet = factory.deleteOne(Model, key);

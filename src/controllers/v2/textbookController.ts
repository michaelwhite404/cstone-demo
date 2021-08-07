import Textbook from "../../models/textbookModel";
import * as factory from "./handlerFactory";

const Model = Textbook;
const key = "textbook";

/** `GET` - Gets all textbooks */
export const getAllTextbooks = factory.getAll(Model, `${key}s`);
/** `GET` - Gets a single textbook */
export const getOneTextbook = factory.getOneById(Model, key);
/** `POST` - Creates a single textbook */
export const createTextbook = factory.createOne(Model, key);
/** `PATCH` - Updates a single textbook */
export const updateTextbook = factory.updateOne(Model, key);
/** `DELETE` - Deletes textbook */
export const deleteTextbook = factory.deleteOne(Model, "Textbook");

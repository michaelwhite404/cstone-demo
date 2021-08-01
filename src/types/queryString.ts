import { ParsedQs } from "qs";

export default interface ParsedQueryString extends ParsedQs {
  sort?: string;
  page?: string;
  limit?: string;
  fields?: string;
}

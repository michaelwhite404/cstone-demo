import { admin_directory_v1 } from "googleapis";

export interface GroupModel extends admin_directory_v1.Schema$Group {
  members?: admin_directory_v1.Schema$Member[];
}

import { AftercareAttendanceEntryModel } from "@@types/models";
import { AftercareAttendanceEntry } from "@models";
import { chat } from "@utils";

class AftercareEvent {
  async signOut(entry: AftercareAttendanceEntryModel) {
    const arrRes = await AftercareAttendanceEntry.aggregate([
      {
        $match: {
          signOutDate: { $gt: new Date("2022-05-03T13:20:57.010+00:00") },
          student: entry.student._id,
          dropIn: true,
        },
      },
      { $count: "dropIns" },
    ]);

    const dropIns: number | undefined = arrRes[0]?.dropIns;
    if (dropIns) {
      await chat.spaces.messages.create({
        parent: "spaces/xDMtAEAAAAE",
        requestBody: {
          cards: [
            {
              header: {
                title: "Lions Den",
                subtitle: '<font color="#b0b0b0">Drop In Update</font>',
                imageUrl: "https://i.ibb.co/Msb2RDD/Lion-Light-Blue.png",
              },
              sections: [
                {
                  widgets: [
                    {
                      keyValue: {
                        topLabel: "Student",
                        content: entry.student.fullName,
                      },
                    },
                    {
                      keyValue: {
                        topLabel: "Drop Ins",
                        content: `${dropIns}`,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      });
    }
  }
}

export const aftercareEvent = new AftercareEvent();

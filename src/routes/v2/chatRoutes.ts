import { AftercareAttendanceEntry } from "@models";
import { io } from "@server";
import { catchAsync } from "@utils";
import { chat } from "@utils";
import { Router } from "express";

const chatRouter = Router();

chatRouter.get(
  "/",
  catchAsync(async (req, res, next) => {
    const response = await chat.spaces.messages.create({
      parent: "spaces/xDMtAEAAAAE",
      requestBody: {
        text: "Another Test",
        // cards: [
        //   {
        //     header: {
        //       title: "Pizza Bot Customer Support",
        //       subtitle: "pizzabot@example.com",
        //       imageUrl: "https://goo.gl/aeDtrS",
        //     },
        //     sections: [
        //       {
        //         widgets: [
        //           {
        //             keyValue: {
        //               topLabel: "Order No.",
        //               content: "12345",
        //             },
        //           },
        //           {
        //             keyValue: {
        //               topLabel: "Status",
        //               content: "In Delivery",
        //             },
        //           },
        //         ],
        //       },
        //       {
        //         header: "Location",
        //         widgets: [
        //           {
        //             image: {
        //               imageUrl: "https://maps.googleapis.com,/...",
        //             },
        //           },
        //         ],
        //       },
        //       {
        //         widgets: [
        //           {
        //             buttons: [
        //               {
        //                 textButton: {
        //                   text: "OPEN ORDER",
        //                   onClick: {
        //                     openLink: {
        //                       url: "https://example.com/orders/...",
        //                     },
        //                   },
        //                 },
        //               },
        //             ],
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // ],
      },
    });
    res.sendJson(200, response.data);
  })
);

chatRouter.get(
  "/test",
  catchAsync(async (req, res, next) => {
    const dropIns: number | undefined = 2;
    if (dropIns) {
      await chat.spaces.messages.create({
        parent: "spaces/xDMtAEAAAAE",
        requestBody: {
          text: `Claire Washington now has ${dropIns} drop ins.`,
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
                        content: "Claire Washington",
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
    res.sendJson(200, { hello: "world" });
  })
);

export default chatRouter;

chatRouter.get(
  "/test2",
  catchAsync(async (req, res, next) => {
    const response = await chat.spaces.messages.update({
      name: "spaces/xDMtAEAAAAE/messages/cC-1IpyA3ME.cC-1IpyA3ME",
      updateMask: "cards",
      requestBody: {
        cards: [
          {
            header: {
              title: "Reimbursement Request",
              subtitle: "Lab Equiptment",
              imageUrl: "https://i.ibb.co/qMHwLwK/Reimbursement-Blue.png",
            },
            sections: [
              {
                widgets: [
                  {
                    keyValue: {
                      topLabel: "Payee Name",
                      content: "Fake User",
                    },
                  },
                  {
                    keyValue: {
                      topLabel: "Purchase Date",
                      content: "09/08/2022",
                    },
                  },
                  {
                    keyValue: {
                      topLabel: "Amount",
                      content: "$45.00",
                    },
                  },
                  {
                    keyValue: {
                      topLabel: "Status",
                      content: "Approved",
                    },
                  },
                ],
              },
              {
                widgets: [
                  {
                    buttons: [
                      {
                        textButton: {
                          text: "OPEN IN APP",
                          onClick: {
                            openLink: {
                              url: "http://localhost:3000/requests/reimbursements",
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    res.status(200).json({
      data: response,
    });
  })
);

chatRouter.get(
  "/test3",
  catchAsync(async (req, res, next) => {
    const sockets = await io.fetchSockets();
    const me = sockets.find(
      (socket) => socket.data?.user?.email === "mwhite1@cornerstone-schools.org"
    );
    console.log(me?.data);
    res.send("DONE");
  })
);

chatRouter.get(
  "/test4",
  catchAsync(async (req, res, next) => {
    const response = await chat.spaces.list();
    res.sendJson(200, response.data.spaces);
  })
);

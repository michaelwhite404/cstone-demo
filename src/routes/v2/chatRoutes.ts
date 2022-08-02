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

export default chatRouter;

import { Router } from "express";
import PDFPrinter from "pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts.js";
import fs from "fs";

const router = Router();

router.get("/device-logs", (req, res, next) => {
  var fonts = {
    Roboto: {
      normal: Buffer.from(vfsFonts.pdfMake.vfs["Roboto-Regular.ttf"], "base64"),
    },
  };

  // res.writeHead(200, {
  //   "Content-Type": "application/pdf",
  //   "Content-Disposition": "attachment;filename=myFile.pdf",
  // });

  const pdfPrinter = new PDFPrinter(fonts);
  const doc = pdfPrinter.createPdfKitDocument({ content: "Michael White is my name" });
  // doc.on("data", (chunk) => stream.write(chunk));
  // doc.on("end", () => stream.end);
  doc.end();
  res.header("Content-Type", "application/pdf");
  res.header("Content-Disposition", "inline;filename=myFile.pdf");
  doc.pipe(res);
  // res.status(200).end();
});

export default router;

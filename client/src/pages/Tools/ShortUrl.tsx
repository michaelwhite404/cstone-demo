import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Checkbox, Label } from "@blueprintjs/core";
import { nanoid } from "nanoid";
import { useDocTitle, useToasterContext } from "../../hooks";
import LabeledInput from "../../components/Inputs/LabeledInput";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { APIError, APIShortUrlResponse } from "../../types/apiResponses";
import { ShortUrlModel } from "../../../../src/types/models";
import QRCode from "../../components/QRCode";

export default function ShortUrl() {
  useDocTitle("Short URL | Tools | Cornerstone App");
  const { showToaster } = useToasterContext();
  const [newLink, setNewLink] = useState({
    full: "",
    short: "",
    autogenerate: false,
  });
  const [shortLinks, setShortLinks] = useState<ShortUrlModel[]>([]);

  useEffect(() => {
    const getLinks = async () => {
      const res = await axios.get("/api/v2/short");
      setShortLinks(res.data.data.shortUrls);
    };

    getLinks();
  }, []);

  const clear = () =>
    setNewLink({
      full: "",
      short: newLink.autogenerate ? nanoid(8) : "",
      autogenerate: newLink.autogenerate,
    });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setNewLink({ ...newLink, [e.target.name]: e.target.value });

  const toggleCheckbox: React.FormEventHandler<HTMLInputElement> = (e) => {
    newLink.autogenerate
      ? setNewLink({ full: newLink.full, short: "", autogenerate: false })
      : setNewLink({ full: newLink.full, short: nanoid(8), autogenerate: true });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post<APIShortUrlResponse>("/api/v2/short", {
        full: newLink.full,
        short: newLink.short,
      });
      showToaster("Short link created", "success");
      setShortLinks([res.data.data.shortUrl, ...shortLinks]);
      clear();
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const submittable = newLink.full.length > 0 && newLink.short.length > 0;

  const downloadQr = (link: ShortUrlModel) => {
    const svg = document.getElementById(link._id);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${link.short}_qr`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Short URL</h1>
        <p>Create short links with Cornerstone branding</p>
      </div>
      <div className="flex align-center space-between">
        <div style={{ width: "40%" }}>
          <LabeledInput
            label="Full URL"
            name="full"
            value={newLink.full}
            onChange={handleChange}
            placeholder="https://your-full-link.com/example-ending"
            fill
          />
        </div>
        <div style={{ width: "40%" }}>
          <LabeledInput
            label="Short Ending"
            name="short"
            value={newLink.short}
            onChange={handleChange}
            disabled={newLink.autogenerate}
            fill
          />
        </div>
        <PrimaryButton text="+ Add Short Link" onClick={handleSubmit} disabled={!submittable} />
      </div>
      <div>
        <Label>
          Short Link: cstonedc.org/<span style={{ color: "dodgerblue" }}>{newLink.short}</span>
        </Label>
        <Checkbox
          style={{ userSelect: "none" }}
          checked={newLink.autogenerate}
          onChange={toggleCheckbox}
        >
          Auto-generate short link
        </Checkbox>
      </div>
      <div>
        {shortLinks.map((link) => (
          <div key={link._id} className="flex space-between py-5">
            <div>{link.full}</div>
            <div>cstonedc.org/{link.short}</div>
            <div>
              <QRCode size={125} value={`cstonedc.org/${link.short}?refer_method=qr`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

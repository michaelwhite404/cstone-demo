import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Checkbox, Label } from "@blueprintjs/core";
import { nanoid } from "nanoid";
import { useDocTitle, useToasterContext } from "../../hooks";
import LabeledInput from "../../components/Inputs/LabeledInput";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { APIError, APIShortUrlResponse } from "../../types/apiResponses";

export default function ShortUrl() {
  useDocTitle("Short URL | Tools | Cornerstone App");
  const { showToaster } = useToasterContext();
  const [link, setLink] = useState({
    full: "",
    short: "",
    autogenerate: false,
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setLink({ ...link, [e.target.name]: e.target.value });

  const toggleCheckbox: React.FormEventHandler<HTMLInputElement> = (e) => {
    link.autogenerate
      ? setLink({ full: link.full, short: "", autogenerate: false })
      : setLink({ full: link.full, short: nanoid(8), autogenerate: true });
  };

  const handleSubmit = async () => {
    try {
      /* const res =  */ await axios.post<APIShortUrlResponse>("/api/v2/short", {
        full: link.full,
        short: link.short,
      });
      showToaster("Short link created", "success");
      // res.data.data.shortUrl
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
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
            value={link.full}
            onChange={handleChange}
            placeholder="https://your-full-link.com/example-ending"
            fill
          />
        </div>
        <div style={{ width: "40%" }}>
          <LabeledInput
            label="Short Ending"
            name="short"
            value={link.short}
            onChange={handleChange}
            disabled={link.autogenerate}
            fill
          />
        </div>
        <PrimaryButton text="+ Add Short Link" onClick={handleSubmit} />
      </div>
      <div>
        <Label>
          Short Link: cstonedc.org/<span style={{ color: "dodgerblue" }}>{link.short}</span>
        </Label>
        <Checkbox
          style={{ userSelect: "none" }}
          checked={link.autogenerate}
          onChange={toggleCheckbox}
        >
          Auto-generate short link
        </Checkbox>
      </div>
    </div>
  );
}

import { PaperClipIcon, XIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

interface CustomFile extends File {
  preview: string;
}

export default function Dropzone() {
  const [files, setFiles] = useState<CustomFile[]>([]);
  const { getRootProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    maxFiles: 2,
  });

  const deleteFile = (file: CustomFile) =>
    setFiles(files.filter((f) => f.preview !== file.preview));

  const images = files.map((file) => (
    <div className="relative mr-5 h-48" key={file.preview}>
      <button
        className="absolute rounded-full bg-red-400 -top-3 -right-3 p-1.5"
        onClick={() => deleteFile(file)}
      >
        <XIcon className="h-3 w-3 text-white" />
      </button>
      <img key={file.name} src={file.preview} alt="img" className="h-48" />
    </div>
  ));

  return (
    <div>
      <div
        {...getRootProps({
          className:
            "dropzone cursor-pointer select-none flex flex-col items-center pointer border-2 border-gray-200 border-dashed rounded-lg p-12 text-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        })}
      >
        <PaperClipIcon className="h-12 w-12 mb-2" />
        <div className="font-semibold">Drag your document or file here</div>
        <p>or click to browse for a file</p>
      </div>
      <div>
        {/* <h4>Files</h4> */}
        <div className="flex">{images}</div>
      </div>
    </div>
  );
}

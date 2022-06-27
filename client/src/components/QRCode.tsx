import React from "react";

export default function QRCode(props: QRCodeProps) {
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?data=cstonedc.org/${props.value}?refer_method=qr&size=1000x1000&margin=0`}
      alt={props.value}
      width={props.size}
    />
  );
}

interface QRCodeProps {
  size: number;
  value: string;
}

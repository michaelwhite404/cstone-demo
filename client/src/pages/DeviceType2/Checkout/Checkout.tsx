import { ReactNode } from "react";
import CheckoutBox from "./CheckoutBox";
import "./Checkout.sass";

function Checkout({ children }: { children: ReactNode }) {
  return <div className="device-checkout-container">{children}</div>;
}

Checkout.Box = CheckoutBox;

export default Checkout;

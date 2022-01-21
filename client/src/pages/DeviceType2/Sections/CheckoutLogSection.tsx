import DevicePane from "../DevicePane";
import CheckoutLog from "../CheckoutLog";
import { CheckoutLogModel } from "../../../../../src/types/models/checkoutLogTypes";

export default function CheckoutLogSection({ checkouts }: { checkouts: CheckoutLogModel[] }) {
  return (
    <DevicePane heading="Check Out History">
      <CheckoutLog length={checkouts.length}>
        {checkouts.length
          ? checkouts.map((checkout) => <CheckoutLog.Row checkout={checkout} />)
          : "There is no data to display"}
      </CheckoutLog>
    </DevicePane>
  );
}

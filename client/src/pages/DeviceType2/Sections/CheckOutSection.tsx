import React, { useEffect } from "react";
import { Button } from "@blueprintjs/core";
import { useClasses, useToasterContext } from "../../../hooks";
import DevicePane from "../DevicePane";
import capitalize from "capitalize";
import { DeviceModel } from "../../../../../src/types/models/deviceTypes";
import Checkout from "../Checkout";
import { Skeleton } from "@mui/material";

interface CheckOutSectionProps {
  device?: DeviceModel;
  showData: boolean;
  checkoutDevice: (studentId: string) => Promise<DeviceModel>;
  /** A function to run directly after a checkout request is successful. The updated device is
   * passed in as a parameter
   */
  onCheckoutSuccess?: (updatedDevice: DeviceModel) => void;
}

export default function CheckOutSection({
  device,
  showData,
  checkoutDevice,
  onCheckoutSuccess,
}: CheckOutSectionProps) {
  const { GradeSelect, StudentSelect, studentPicked, reset } = useClasses();
  const { showToaster } = useToasterContext();

  const handleCheckout = () => {
    checkoutDevice(studentPicked)
      .then((updatedDevice) => {
        showToaster(`${updatedDevice.name} checked out successfully!`, "success");
        onCheckoutSuccess && onCheckoutSuccess(updatedDevice);
      })
      .catch((err) => {
        showToaster(err.message, "danger");
      });
  };

  useEffect(reset, [reset, showData]);

  return (
    <DevicePane heading="Check Out">
      <Checkout>
        {showData ? (
          <Checkout.Box>
            <span style={{ fontWeight: 500, marginBottom: "6px" }}>Grade</span>
            <GradeSelect />
          </Checkout.Box>
        ) : (
          <Checkout.Skeleton />
        )}
        {showData ? (
          <Checkout.Box>
            <span style={{ fontWeight: 500, marginBottom: "6px" }}>Student</span>
            <StudentSelect />
          </Checkout.Box>
        ) : (
          <Checkout.Skeleton />
        )}
        {showData ? (
          <Checkout.Box className="button">
            <Button
              intent="primary"
              disabled={studentPicked === "-1"}
              onClick={handleCheckout}
              fill
            >
              Check Out {capitalize(device?.deviceType || "")}
            </Button>
          </Checkout.Box>
        ) : (
          <Checkout.Box className="button">
            <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: "5px" }}>
              <Button text="Check Out Device" />
            </Skeleton>
          </Checkout.Box>
        )}
      </Checkout>
    </DevicePane>
  );
}

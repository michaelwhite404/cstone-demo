import { Icon } from "@blueprintjs/core";
import { IconButton } from "@mui/material";
import DeviceErrorStatusBadge from "../../../components/Badges/DeviceErrorStatusBadge";

export default function ErrorLogRow() {
  return (
    <div className="device-checkout-history-row">
      <div>
        <div className="dchr-top">
          <div className="student-name">Broken Screen</div>
          <DeviceErrorStatusBadge status="Fixed" />
        </div>
        <div className="dchr-bottom">
          <div>
            <div style={{ marginBottom: 5 }}>
              <Icon icon="warning-sign" style={{ marginRight: 10 }} />
              11/10/2020
            </div>
            <div style={{ alignSelf: "center" }}>
              <Icon icon="horizontal-bar-chart-desc" style={{ marginRight: 10 }} />
              The screen is absolutely shattered
            </div>
          </div>
          <div>
            <IconButton>
              <Icon icon="chevron-down" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Icon } from "@blueprintjs/core";
import { IconButton } from "@mui/material";
import { ErrorLogModel } from "../../../../../src/types/models/errorLogTypes";
import DeviceErrorStatusBadge from "../../../components/Badges/DeviceErrorStatusBadge";

export default function ErrorLogRow({ error }: { error: ErrorLogModel }) {
  return (
    <div className="device-checkout-history-row">
      <div>
        <div className="dchr-top">
          <div className="student-name">{error.title}</div>
          <DeviceErrorStatusBadge status={error.status} />
        </div>
        <div className="dchr-bottom">
          <div>
            <div style={{ marginBottom: 5 }}>
              <Icon icon="warning-sign" style={{ marginRight: 10 }} />
              {new Date(error.createdAt).toLocaleDateString()}
            </div>
            <div style={{ alignSelf: "center" }}>
              <Icon icon="horizontal-bar-chart-desc" style={{ marginRight: 10 }} />
              {error.description}
            </div>
          </div>
          <div style={{ alignSelf: "center" }}>
            <IconButton>
              <Icon icon="chevron-down" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

import { PanelActions } from "@blueprintjs/core/lib/esm/components/panel-stack2/panelTypes";

export default function AddBookPanel(props: PanelActions) {
  return (
    <div>
      Add Book
      <button onClick={props.closePanel}>Close Panel</button>
    </div>
  );
}

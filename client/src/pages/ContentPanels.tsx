import { Panel, PanelStack2 } from "@blueprintjs/core";
import React, { useEffect } from "react";
import { TextbookSetModel } from "../../../src/types/models/textbookSetTypes";
import TextbooksTestContent from "./TextbooksTestContent";

export default function ContentPanels({ textbook }: { textbook: TextbookSetModel }) {
  //--- PANEL STATES ---//
  const initialPanel: Panel<{ textbook: TextbookSetModel }> = {
    props: {
      textbook,
    },
    renderPanel: TextbooksTestContent,
    title: "Panel 1",
  };
  const [currentPanelStack, setCurrentPanelStack] = React.useState<Array<Panel<any>>>([
    initialPanel,
  ]);
  //--- END PANEL STATES ---//
  const addToPanelStack = React.useCallback(
    (newPanel: Panel<any>) => setCurrentPanelStack((stack) => [...stack, newPanel]),
    []
  );
  const removeFromPanelStack = React.useCallback(
    () => setCurrentPanelStack((stack) => stack.slice(0, -1)),
    []
  );

  useEffect(() => {
    setCurrentPanelStack([initialPanel]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textbook._id]);

  return (
    <PanelStack2
      renderActivePanelOnly={true}
      stack={currentPanelStack}
      showPanelHeader={false}
      onOpen={addToPanelStack}
      onClose={removeFromPanelStack}
      className="custom-panel-stack"
    />
  );
}

import * as React from "react";
import {Dataset} from "./Dataset";

type GuiParams = {
    datasets: Dataset[],
    setDatasets: (datasets: Dataset[]) => void
};

export function Gui(params:GuiParams) {
    const {datasets, setDatasets} = params;
    return <div style={{pointerEvents: "none", gridColumn: 1, gridRow: 1}}>
        111
    </div>
}
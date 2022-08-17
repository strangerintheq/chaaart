import * as React from "react";
import {Dataset} from "./Dataset";

export function Gui(
    {datasets, setDatasets}:{datasets:Dataset[], setDatasets: (datasets:Dataset[]) => void}
) {
    return <div style={{pointerEvents: "none", gridColumn: 1, gridRow: 1}}>
        111
    </div>
}
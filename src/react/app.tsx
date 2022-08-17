import * as React from "react";
import {useState} from "react";
import {Renderer} from "./renderer";
import {Gui} from "./gui";
import {Dataset} from "./Dataset";
import {randomDataset} from "./randomDataset";

export function App() {
    const [datasets, setDatasets] = useState<Dataset[]>([randomDataset()])
    return <div style={{
        display: "grid",
        gridTemplateColumns: '100vw',
        gridTemplateRows: '100vh',
        height: '100vh'
    }}>
        <Renderer
            datasets={datasets}
        />
        <Gui
            datasets={datasets}
            setDatasets={setDatasets}
        />
    </div>
}
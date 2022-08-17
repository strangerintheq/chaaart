import * as React from "react";
import {useState} from "react";
import {Renderer} from "./renderer";
import {Gui} from "./gui";
import {Dataset} from "./Dataset";
import {randomDataset} from "./randomDataset";

const style = {
    display: "grid",
    gridTemplateColumns: '100vw',
    gridTemplateRows: '100vh',
    height: '100vh'
};

export function App() {
    const [datasets, setDatasets] = useState<Dataset[]>([randomDataset()])
    return <div style={style}>
        <Renderer datasets={datasets}/>
        <Gui datasets={datasets} setDatasets={setDatasets}/>
    </div>
}
import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import * as React from "react";
import {Dataset} from "./Dataset";
import {CameraPosition} from "./cameraPosition";
import {DatasetRenderer} from "./datasetRenderer";

type RendererParams = {
    datasets: Dataset[]
};

export function Renderer(params: RendererParams) {
    const {datasets} = params;
    return <Canvas style={{gridColumn: 1, gridRow: 1}}>
        <axesHelper scale={10} />
        <CameraPosition x={10} y={10} z={10} />
        <OrbitControls dampingFactor={1} />
        <gridHelper/>
        {datasets.map((dataset, i) => {
            return <DatasetRenderer dataset={dataset} key={i} />;
        })}
    </Canvas>
}


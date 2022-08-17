import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import * as React from "react";
import {Dataset} from "./Dataset";
import {Points} from "./points";
import {CameraPosition} from "./cameraPosition";
import {Vectors} from "./vectors";

export function Renderer({datasets}:{datasets:Dataset[]}) {
    return <Canvas style={{gridColumn: 1, gridRow: 1}}>
        <axesHelper scale={10}/>
        <CameraPosition x={10} y={10} z={10}/>
        <OrbitControls dampingFactor={1} />
        <gridHelper/>
        {datasets.map((dataset, i) => {
            return <>
                <Points positions={dataset.positions} />
                <Vectors positions={dataset.positions} directions={dataset.directions}/>
            </>;
        })}
    </Canvas>
}


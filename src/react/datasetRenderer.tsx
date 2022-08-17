import * as React from "react";
import {Points} from "./points";
import {Vector3} from "three";
import {Vectors} from "./vectors";
import {Dataset} from "./Dataset";

export function DatasetRenderer({dataset}:{dataset:Dataset}){
    return <>

        <Points
            color={'red'}
            positions={dataset.positions}
        />

        <Points
            color={'blue'}
            positions={dataset.positions.map((p, i) => new Vector3(
                p.x + dataset.directions[i].x,
                p.y + dataset.directions[i].y,
                p.z + dataset.directions[i].z
            ))}
        />

        <Vectors
            positions={dataset.positions}
            directions={dataset.directions}
            color={'green'}
        />
    </>
}
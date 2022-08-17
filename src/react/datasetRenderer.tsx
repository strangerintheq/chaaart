import * as React from "react";
import {Points} from "./points";
import {Vectors} from "./vectors";
import {Dataset} from "./Dataset";

export function DatasetRenderer({dataset}:{dataset:Dataset}){
    return <>

        <Points
            color={'red'}
            positions={dataset.positions}
        />

        <Vectors
            positions={dataset.positions}
            directions={dataset.directions}
            color={'green'}
        />
    </>
}
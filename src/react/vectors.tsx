import {BoxBufferGeometry, MeshBasicMaterial, MeshLambertMaterial, Object3D, Vector3} from "three";
import * as React from "react";
import {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";

const boxesGeometry = new BoxBufferGeometry(0.05, 0.05, 0.05);

type VectorsParams = {
    positions: Vector3[],
    directions: Vector3[],
    color: string
};

export function Vectors(params: VectorsParams) {

    const {positions, directions,color} = params;

    const material = new MeshBasicMaterial({color: color});

    const ref = useRef();

    useEffect(() => {
        const temp = new Object3D();
        positions.forEach((position, i) => {
            temp.position.set(
                position.x+directions[i].x/2,
                position.y+directions[i].y/2,
                position.z+directions[i].z/2,
            );
            temp.updateMatrix();
            //@ts-ignore
            ref.current.setMatrixAt(i, temp.matrix);
        })
    }, [positions])

    return <instancedMesh
        ref={ref}
        args={[boxesGeometry, material, positions.length]}
    />;
}
import {BoxBufferGeometry, MeshBasicMaterial, MeshLambertMaterial, Object3D, Vector3} from "three";
import * as React from "react";
import {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";

const boxesGeometry = new BoxBufferGeometry();

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
        const temp1 = new Object3D();
        const dir = new Vector3();
        positions.forEach((position, i) => {

            temp1.position.set(
                position.x+directions[i].x/2,
                position.y+directions[i].y/2,
                position.z+directions[i].z/2,
            );
            temp1.scale.set(0.01,0.01, directions[i].length())
            temp1.lookAt(dir.set(
                position.x+directions[i].x,
                position.y+directions[i].y,
                position.z+directions[i].z
            ))
            temp1.updateMatrix();
            //@ts-ignore
            ref.current.setMatrixAt(i, temp1.matrix);
        })
    }, [positions])

    return <instancedMesh
        ref={ref}
        args={[boxesGeometry, material, positions.length]}
    />;
}
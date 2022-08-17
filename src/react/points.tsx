import {BoxBufferGeometry, MeshBasicMaterial, MeshLambertMaterial, Object3D, Vector3} from "three";
import * as React from "react";
import {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";

const boxesGeometry = new BoxBufferGeometry(0.1, 0.1, 0.1);

export function Points({positions}:{positions: Vector3[]}) {

    const material = new MeshBasicMaterial({color: "red"});

    const ref = useRef();

    useEffect(() => {
        const temp = new Object3D();
        positions.forEach((position, i) => {
            temp.position.copy(position);
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
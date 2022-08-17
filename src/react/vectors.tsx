import {BoxBufferGeometry, MeshBasicMaterial, MeshLambertMaterial, Object3D, Vector3} from "three";
import * as React from "react";
import {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";

const boxesGeometry = new BoxBufferGeometry(0.05, 0.05, 0.05);

export function Vectors({positions, directions}:{positions: Vector3[], directions:Vector3[]}) {

    const material = new MeshBasicMaterial({color: "blue"});

    const ref = useRef();

    useEffect(() => {
        const temp = new Object3D();
        positions.forEach((position, i) => {
            temp.position.set(
                position.x+directions[i].x,
                position.y+directions[i].y,
                position.z+directions[i].z,
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
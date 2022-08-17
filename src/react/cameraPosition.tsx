import {useThree} from "@react-three/fiber";
import {Vector3} from "three";

export function CameraPosition({x, y, z}: Vector3) {
    useThree(three => three.camera.position.set(x, y, z));
    return null
}
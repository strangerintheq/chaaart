import {useThree} from "@react-three/fiber";

export function CameraPosition({x, y, z}) {
    useThree(three => three.camera.position.set(x, y, z));
    return null
}
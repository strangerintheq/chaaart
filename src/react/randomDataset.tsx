import {Dataset} from "./Dataset";
import {Vector3} from "three";

const rnd = (x = 1) => Math.random() * x - 0.5 * x

export function randomDataset(): Dataset {
    const entries = [...Array(100)];
    return {
        positions: entries.map(() => new Vector3(rnd(10), rnd(10), rnd(10))),
        directions: entries.map(() => new Vector3(rnd(),rnd(),rnd()))
    };
}
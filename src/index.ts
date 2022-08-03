import {
    AxesHelper,
    BufferAttribute,
    BufferGeometry,
    Color,
    Float32BufferAttribute, GridHelper, LineBasicMaterial, LineSegments,
    Object3D,
    PerspectiveCamera,
    Points,
    PointsMaterial, Raycaster,
    Scene, Shader,
    WebGLRenderer
} from "three";

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const colors = [
    "#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd",
    "#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"
]

const datasets = document.querySelector('#datasets');
const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

const tMin = {value:0}
const tMax = {value:600}

const renderer = new WebGLRenderer({
    canvas,
    antialias: true
})

const scene = new Scene();
const pointsObj= new Object3D();
const linesObj= new Object3D();
scene.add(pointsObj)
scene.add(linesObj)
scene.background = new Color().set('#fff')
scene.add(new GridHelper(50,5))

const camera = new PerspectiveCamera()
camera.position.set(30,30,30)
camera.lookAt(scene.position)

new OrbitControls(camera, canvas)
    .addEventListener('change', render);

const axesHelper = new AxesHelper(30);
axesHelper.scale.z = -1
axesHelper.setColors(
    new Color(1,0,0),
    new Color(0,0,1),
    new Color(0,1,0)
)
scene.add(axesHelper)

document.querySelector('#file')
    .addEventListener('change',  processFile)

canvas.addEventListener('click', ({clientX:x, clientY:y}) => {
    const coords = {
        x:x/innerWidth*2-1,
        y:y/innerHeight*2-1
    };
    console.log(coords)
})

addSlider('#timeline-tMax', v => tMax.value = v)
addSlider('#timeline-tMin', v => tMin.value = v)

resize()

addEventListener('resize', resize)

function render() {
    renderer.render(scene, camera)
}

function resize() {
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight)
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    render()
}

function addSlider(selector, f){
    let timeline = document.querySelector(selector) as HTMLInputElement;
    timeline.addEventListener('input', () => {
        f(+timeline.value)
        render();
    });
}

function processFile(event){
    const reader = new FileReader();
    reader.onload = (e:any) => addData(e.target.result, event.target.files[0].name);
    reader.readAsText(event.target.files[0]);
}

function addData(data: string, file:string) {
    data = data.substr(0, data.length-2) + ']'
    const object3d = new Object3D()
    const dataArray = JSON.parse(data);
    const fields = ['p', 'a', 'v', 'v1', 'v2', 'v3']
    dataArray.forEach(p => fields.forEach(f => p[f] = convertPoint(p[f])))
    const color = colors[Math.floor(colors.length*Math.random())]
    const add = (object) => object3d.add(object) && object
    const p =  add(createPointsCloud(dataArray.map(p => ({...p.p, t:p.t})), color, 0.3));
    const t =  add(createTrajectory(dataArray.map(p => ({...p.p, t:p.t})), color));
    const a =  add(createPointsCloud(dataArray.map(p => ({...p.a, t:p.t})), '#0000ff', 0.5));
    const v1 = add(createVectors(dataArray.map(p => ({p0:p.p, p1:p.v1, t:p.t})), '#0000ff', 1));
    const v2 = add(createVectors(dataArray.map(p => ({p0:p.p, p1:p.v2, t:p.t})), '#00ff00', 1));
    const v3 = add(createVectors(dataArray.map(p => ({p0:p.p, p1:p.v3, t:p.t})), '#ff0000' ,1));
    const v =  add(createVectors(dataArray.map(p => ({p0:p.p, p1:p.v,  t:p.t})), '#ff00ff', 1));
    datasets.append(createDatasetControls())
    pointsObj.add(object3d)

    render()

    function createDatasetControls() {
        const datasetControls = document.createElement('div')
        datasetControls.innerHTML = `
            <input type="checkbox" checked class="cb-visibility">
            <input type="color" class="input-color" value="${color}">
            <input type="checkbox" checked  class="cb-v1">
            <input type="checkbox" checked  class="cb-v2">
            <input type="checkbox" checked  class="cb-v3">
            <input type="checkbox" checked  class="cb-v">
            <span>${file}</div>
        `
        let colorControl = datasetControls.querySelector('input[type="color"]') as HTMLInputElement;
        colorControl.addEventListener('input', () => {
            p.material.color.set(colorControl.value)
            t.material.color.set(colorControl.value)
            render()
        })

        addCheckbox('cb-visibility', x => object3d.visible = x)
        addCheckbox('cb-v1', x => v1.visible = x)
        addCheckbox('cb-v2', x => v2.visible = x)
        addCheckbox('cb-v3', x => v3.visible = x)
        addCheckbox('cb-v', x => v.visible = x)

        return datasetControls

        function addCheckbox(className, f: (v: boolean) => void ){
            let visibilityControl = datasetControls.querySelector('.' + className) as HTMLInputElement;
            visibilityControl.addEventListener('change', () => {
                f(visibilityControl.checked)
                render()
            })
        }
    }
}

function patchShader(shader: Shader) {
    shader.uniforms.tMin = tMin
    shader.uniforms.tMax = tMax
    const common = '#include <common>';
    const targetCode1 = '#include <fog_vertex>';
    shader.vertexShader = shader.vertexShader
        .split(common).join(`
                uniform float tMax;
                uniform float tMin;
                varying float skip;
                attribute float t;
                ${common}
            `)
        .split(targetCode1)
        .join(`
                 if (t > tMax || t < tMin) 
                    skip = 1.;
                ${targetCode1}
            `)
    const targetCode2 = '#include <clipping_planes_fragment>';
    shader.fragmentShader = shader.fragmentShader
        .split(common).join(`
                varying float skip;
                ${common}
            `)
        .split(targetCode2).join(`
                if (skip > 0.) 
                    discard;
                ${targetCode2}
            `)
}

function createPointsCloud(data, color, r) {
    const times = data.map(p => p.t);
    const positions = data.map(p => [p.x, p.y, p.z]).flat()
    const geometry = new BufferGeometry();
    geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 't', new Float32BufferAttribute( times, 1 ) );
    geometry.computeBoundingSphere();
    const material = new PointsMaterial( {
        size: r,
        color: new Color().set(color)
    } );
    material.onBeforeCompile = patchShader
    return new Points( geometry, material );
}

function createVectors(data: {p0, p1, t}[], colorHex, multiplier){
    const material = new LineBasicMaterial({
        color: new Color().set(colorHex)
    });
    material.onBeforeCompile = patchShader
    const s = 6;
    const positions = new Float32Array(data.length * s);
    for (let i = 0; i < data.length; i++) {
        const v = data[i]
        positions[i * s] = v.p0.x;
        positions[i * s + 1] = v.p0.y;
        positions[i * s + 2] = v.p0.z;
        positions[i * s + 3] = v.p0.x + v.p1.x*multiplier;
        positions[i * s + 4] = v.p0.y + v.p1.y*multiplier;
        positions[i * s + 5] = v.p0.z + v.p1.z*multiplier;
    }
    const times = data.map(p => [p.t,p.t]).flat();
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute( 't', new Float32BufferAttribute( times, 1 ) );

    return  new LineSegments(geometry, material);

}

function createTrajectory(data: {x,y,z, t}[], colorHex){
    const material = new LineBasicMaterial({
        color: new Color().set(colorHex)
    });
    material.onBeforeCompile = patchShader
    const s = 6;
    const positions = new Float32Array(data.length * s);
    for (let i = 0; i < data.length-1; i++) {
        const v1 = data[i]
        const v2 = data[i+1]
        positions[i * s] = v1.x;
        positions[i * s + 1] = v1.y;
        positions[i * s + 2] = v1.z;
        positions[i * s + 3] = v2.x;
        positions[i * s + 4] = v2.y;
        positions[i * s + 5] = v2.z;
    }
    const times = data.map(p => [p.t, p.t]).flat();
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute( 't', new Float32BufferAttribute( times, 1 ) );

    return  new LineSegments(geometry, material);

}

function convertPoint(p){
    return {
        x: p.x,
        y: p.z,
        z: -p.y
    }
}
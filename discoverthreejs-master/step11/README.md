# Organizing Your Scenes

## Introducing `SphereBufferGeometry`

The `SphereBufferGeometry` geometry constructor takes up to seven parameters, all optional. We’ll focus on the first three here:

<div align="right">Creating a SphereBufferGeometry</div>

```js
import { SphereBufferGeometry } from "three";

const radius = 0.25;
const widthSegments = 16;
const heightSegments = 16;

const geometry = new SphereBufferGeometry(
  radius,
  widthSegments,
  heightSegments
);
```

## Adding Many Objects to the Scene

<div align="right">Adding lots of sphere to the scene, one by one</div>

```js
const sphere1 = new Mesh(geometry, material);
const sphere2 = new Mesh(geometry, material);
const sphere3 = new Mesh(geometry, material);
// ...
const sphere20 = new Mesh(geometry, material);
const sphere21 = new Mesh(geometry, material);

scene.add(sphere1);
scene.add(sphere2);
scene.add(sphere3);
// ...
scene.add(sphere20);
scene.add(sphere21);
```

Kind of tedious, don’t you think? This is the perfect time to use a loop:

<div align="right">Creating many spheres in a loop</div>

```js
for (let i = 0; i < 21; i++) {
    const sphere = new Mesh(geometry, material);
    scene.add(sphere);
}
```

## The `Group` Object

![image](<https://discoverthreejs.com/images/first-steps/scene_tree.svg>)

```text
A Group in the Scene Graph
```

### Working with Groups

<div align="right">Adding the spheres to a group instead of the scene allows us to manipulate them as a unit</div>

```js
const scene = new Scene();
const group = new Group();
scene.add(group);

for (let i = 0; i < 21; i++) {
    const sphere = new Mesh(geometry, material);
    group.add(sphere);
}
```

### The .clone Method

<div align="right">Cloned objects have the same transform as the original object</div>

```js
const mesh = new Mesh(geometry, material);
mesh.position.set(1, 1, 1);
mesh.rotation.set(0.5, 0.5, 0.5);
mesh.scale.set(2, 2, 2);

const clonedMesh = mesh.clone();
// clonedMesh.position === (1, 1, 1)
// clonedMesh.rotation === (0.5, 0.5, 0.5)
// clonedMesh.scale === (2, 2, 2)
```

## Create the meshGroup.ts Module

### Create the Prototype Sphere

<div align="right">meshGroup.ts: create the prototype mesh</div>

```ts
const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);
```

Add this loop to `createMeshGroup` to create the twenty new spheres:

<div align="right">meshGroup.ts: create twenty cloned spheres</div>

```ts
const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);

// create twenty clones of the protoSphere
// and add each to the group
for (let i = 0; i < 1; i += 0.1) {
    const sphere = protoSphere.clone();

    group.add(sphere);
}
```

### Position the Cloned Spheres in a Circle

<div align="right">meshGroup.ts: position the cloned meshes around a circle</div>

```ts
const protoSphere = new Mesh(geometry, material);

// add the sphere to the group
group.add(protoSphere);

// create twenty clones of the protoSphere
// and add each to the group
for (let i = 0; i < 1; i += 0.1) {
    const sphere = protoSphere.clone();

    // position the spheres on around a circle
    sphere.position.x = Math.cos(2 * Math.PI * i);
    sphere.position.y = Math.sin(2 * Math.PI * i);

    group.add(sphere);
}
```

### Spin the Wheel

<div align="right">meshGroup.ts: animate the group</div>

```ts
const radiansPerSecond = MathUtils.degToRad(30);

// each frame, rotate the entire group of spheres
(group as any).tick = (delta: number) => {
    group.rotation.z -= delta * radiansPerSecond;
};
```

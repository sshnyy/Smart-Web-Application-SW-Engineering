# Transformations, Coordinate Systems, and the Scene Graph

## Translation, Rotation, and Scaling: the Three Fundamental Transformations

<div align="right">Our First Scene: index.ts</div>

```ts
camera.position.set(0, 0, 10);
```

<div align="right">Physically Based Rendering: lights.ts</div>

```ts
light.position.set(10, 10, 10);
```

<div align="right">Physically Based Rendering: cube.ts</div>

```ts
cube.rotation.set(-0.5, -0.1, 0.8);
```

## The Scene Graph

<div align="right">The scene.add method</div>

```ts
scene.add(mesh);
```

![image](<https://discoverthreejs.com/images/first-steps/scene_graph.svg>)

```text
The scene graph
```

The scene is the top-level parent. The scene in the figure above has three children: one light and two meshes. One of the meshes also has two children. However, every object (except the top-level scene) has exactly one parent.

## Coordinate Systems: World Space and Local Space

3D space is described using a 3D Cartesian coordinate system.

![image](<https://discoverthreejs.com/images/first-steps/coordinate_system_simple.svg>)

```text
A 3D Cartesian coordinate system
```

### World Space

![image](<https://discoverthreejs.com/images/first-steps/coordinate_system.svg>)

```text
Our scene defines world space
```

![image](<https://discoverthreejs.com/images/first-steps/world_space_scene_graph.svg>)

```text
Objects added to the scene live within world space
```

```js
// add a cube to our scene
scene.add(cube);

// move the cube relative to world space
cube.position.x = 5;
```

### Local Space

![image](<https://discoverthreejs.com/images/first-steps/chessboard.svg>)

```text
The board is world space in a game of chess
```

![image](<https://discoverthreejs.com/images/first-steps/knight.svg>)

```text
The local space of a chess piece
```

When we create a 2×2×2 `BoxGeometry`, and then create a mesh using the geometry, the size of the geometry is two units along each side *in the mesh’s local space*:

<div align="right">Geometry is described in the mesh’s local space</div>

```js
const geometry = new BoxGeometry(2, 2, 2);

const mesh = new Mesh(geometry, material);
```

## Working with the Scene Graph

![image](<https://discoverthreejs.com/images/first-steps/local_space_scene_graph.svg>)

```text
The scene graph is a series of embedded
coordinate systems, with world space at the top
```

### What We See is World Space

```js
// A starts at (0,0,0) in world space
scene.add(meshA);

// B starts at (0,0,0) in A's local space
meshA.add(meshB);

meshA.position.x = 5;

meshB.position.x = 3;
```

We moved A five units to the right along the X-axis, so its final position is x=5,y=0,z=0, or (5,0,0).

Since, B is a child of A, this means it now starts at (5,0,0) relative to world space. Next, we moved B three units along the X-axis relative to A, so the final position of B on the X-axis is 5+3=8. This gives us the final position of B in world space: (8,0,0).

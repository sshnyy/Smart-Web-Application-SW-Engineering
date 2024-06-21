# Load 3D Models in glTF Format

## The Best Way to Send 3D Assets Over the Web: glTF

Recently, a newcomer called glTF(GL Transmission Format) has become the de facto standard format for exchanging 3D assets on the web.

## The GLTFLoader Plugin

To load glTF files, first, you need to add the `GLTFLoader` plugin to your app. This works the same way as adding the `OrbitControls` plugin.

<div align="right">Import and create an instance of the GLTFLoader</div>

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
```

### The `.loadAsync` Methods

<div align="right">GLTFLoader.loadAsync</div>

```js
const loader = new GLTFLoader();

const loadedData = await loader.loadAsync('path/to/yourModel.glb');
```

## Data Returned by the GLTFLoader

<div align="right">Data return by the GLTFLoader</div>

```js
{
    animations: [AnimationClip]
    asset: {generator: "Khronos Blender glTF 2.0 I/O", version: "2.0"}
    cameras: []
    parser: GLTFParser {json: {…}, extensions: {…}, options: {…}, cache: {…}, primitiveCache: {…}, …}
    scene: Scene {uuid: "1CF93318-696B-4411-B672-4C12C46DF7E1", name: "Scene", type: "Scene", parent: null, children: Array(0), …}
    scenes: [Scene]
    userData: {}
    **proto**: Object
}
```

Usually, all you need is **`.animations`**, **`.cameras`**, and **`.scene`** (not `.scenes`!) and you can safely ignore everything else.

## Extract the Mesh from the Loaded Data

Look at the loaded data in the console again, and expand the `gltfData.scene`. This a **Group**, and any meshes that are in the file will be **children of the group**. These can be accessed using the `group.children` array. If you look inside there, you’ll see that `glTF.scene.children` has only one object inside it, so that must be our parrot model.

<div align="right">setupModel.ts: extract the model from the loaded data</div>

```ts
function setupModel(data: GLTF) {
    const model = data.scene.children[0];

    return model;
}
```

### Add the Mesh to the Scene

Over in World, loadBirds now returns the parrot mesh and you can add it to the scene:

<div align="right">World.ts: add the mesh to the scene</div>

```ts
async init() {
    // asynchronous setup here
    // load bird models
    const { parrot, flamingo, stork } = await loadBirds();

    this.scene.add(parrot, flamingo, stork);
}
```

Great! Well…

![image](./img/birds.gif)

### Move the Birds into Position

<div align="right">birds.ts: move the birds into position</div>

```ts
const parrot = setupModel(parrotData);
parrot.position.set(0, 0, 2.5);

const flamingo = setupModel(flamingoData);
flamingo.position.set(7.5, 0, -10);

const stork = setupModel(storkData);
stork.position.set(0, -2.5, -10);
```

### Center the Camera on the Parrot

The very last thing we’ll do is **adjust the `OrbitControls` target**. Currently, this is in its default position, the center of the scene. Now that we have moved the birds into formation, this ends up being somewhere around the tail of the parrot. It would look better if the camera focused on the center of the bird rather than its tail.

<div align="right">World.ts: target the parrot with the camera</div>

```ts
async init() {
  const { parrot, flamingo, stork } = await loadBirds();

  // move the target to the center of the front bird
  controls.target.copy(parrot.position);

  scene.add(parrot, flamingo, stork);
}
```

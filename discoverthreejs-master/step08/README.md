# A Brief Introduction to Texture Mapping

When we create a mesh, such as our humble cube, we pass in two components: a geometry and a material.

<div align="right">A mesh requires two sub-components: a geometry and a material</div>

```js
const mesh = new Mesh(geometry, material);
```

The geometry defines the mesh’s shape, and the material defines various surface properties of the mesh, in particular, how it reacts to light.

![image](<https://discoverthreejs.com/images//first-steps/concrete-cube.jpg>)

```text
A cube made from concrete.
```

This is where **texture mapping** comes in. In the simplest possible terms, texture mapping means taking an image and stretching it over the surface of a 3D object. We refer to an image used in this manner as a **texture**, and we can use textures to represent material properties like color, roughness, and opacity.

![image](<https://discoverthreejs.com/images/first-steps/uv-test-bw.jpg>)

```text
A test texture with the UV coordinates
explicitly written onto the texture.
```

(0.5,0.5) ⟶ (0,0,0)

## Types of Texture

You can use any image format that your browser supports, such as PNG, JPG, GIF, BMP, in the same way. This is the most common and simplest type of texture we will encounter: data stored in simple 2D image files.

## The `Texture` Class

The `Texture` class is a wrapper around an **HTML image element** with some extra settings related to being used as a texture instead of a normal image. We can access the original image under `image.texture`.

### Loading a Texture

We’ll use the three.js TextureLoader class to load textures, so add `TextureLoader` to the list of imports at the top of **cube.ts**:

<div align="right">cube.ts: import the TextureLoader</div>

```ts
import {
    BoxGeometry,
    MathUtils,
    Mesh,
    MeshStandardMaterial,
    TextureLoader
} from 'three';
```

### Move Material Set up into a Separate Function

To prevent the `createCube` function from growing too large, let’s move material creation into a new function.

Next, create a new `TextureLoader` instance at the top of the new `createMaterial` function.

The `TextureLoader.load` method can load textures in any standard image format, such as PNG, JPEG, GIF, BMP, and so on. Here, we’ll load the **uv-test-bw.png** file from the **assets/textures** folder.

<div align="right">cube.ts: Move material setup into a new function</div>

```ts
function createMaterial() {
    // create a texture loader.
    const textureLoader = new TextureLoader();

    // load a texture
    const texture = textureLoader.load(
        'assets/textures/uv-test-bw.png',
    );

    // create a "standard" material using
    // the texture we just loaded as a color map
    const material = new MeshStandardMaterial({ map: texture });

    return material;
}
```

Now, your scene will update and you should see the texture mapped onto each of the cube’s six faces.

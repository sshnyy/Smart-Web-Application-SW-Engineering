# Ambient Lighting: Illumination from Every Direction

As soon as we rotate the camera to see another direction, we find that **any faces of the cube that point away from the direction of the light rays don’t receive any light at all!**

![image](<https://discoverthreejs.com/images/first-steps/directional_light.svg>)

```text
Any faces of the cube not in the path of the light rays don’t receive any light at all
```

## Lighting in the Real World

In the real world, an infinite number of light rays reflect and bounce an infinite number of times from all the objects in a scene, gradually fading and changing color with each bounce until finally, they reach our eyes or cameras.

![image](<https://discoverthreejs.com/images/first-steps/light_study.jpg>)

## Simulating Lighting in Real-Time

Creating high-quality lighting using three.js is a matter of choosing a combination of these techniques to create a complete lighting setup. In three.js, the light classes are divided into two categories to match the two categories of lighting:

1. **Direct lights**, which simulate direct lighting.
2. **Ambient lights**, which are a cheap and somewhat believable way of faking indirect lighting.

## A Brief Overview of Lighting Techniques

### The Fast and Easy Solution: Ambient Lighting

**Ambient lighting** is a method of faking indirect lighting which is both fast and easy to set up while still giving reasonable results. There are two ambient light classes available in the three.js core:

- **The `AmbientLight` adds a constant amount of light to every object from all directions.**
- **The `HemisphereLight` fades between a sky color and a ground color and can be used to simulate many common lighting scenarios.**

## The `AmbientLight`

The `AmbientLight` is the cheapest way of faking indirect lighting in three.js. This type of light adds a constant amount of light from every direction to every object in the scene

### Add an `AmbientLight` to the Scene

As with the DirectionalLight, pass the .color and .intensity parameters to the constructor:

<div align="right">lights.ts: create an AmbientLight</div>

```ts
function createLights() {
    const ambientLight = new AmbientLight('white', 0.5);

    // Create a directional light
    const mainLight = new DirectionalLight('white', 10);

    mainLight.position.set(10, 10, 10);

    return { ambientLight, mainLight };
}
```

Over in World, the createLights function now returns two lights. Add both of them to the scene.

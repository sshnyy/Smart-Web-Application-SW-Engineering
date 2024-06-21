# The three.js Animation System

**The animation system uses keyframes to define animations**. To create an animation, we set keyframes at particular points in time, and then the animation system fills in the gaps for us using a process known as **tweening**.

## The Animation System: Creating Animations

There are three elements involved in creating animations: keyframes, `KeyframeTrack`, and `AnimationClip`.

### 1. Keyframes

The lowest conceptual level in the animation system is a **keyframe**. Each keyframe consists of three pieces of information: a ***time***, a ***property***, and a ***value***, for example:

- At 0 seconds .position is (0,0,0).
- At 3 seconds .scale is (1,1,1).
- At 12 seconds .material.color is red.

These three keyframes each describe the value of some property at a specific time. **Keyframes don’t specify any particular object**, though.

To create an animation, we need at least two keyframes.

### 2. `KeyframeTrack`

<div align="right">Creating a number keyframe track representing opacity, with five keyframes</div>

```js
import { NumberKeyframeTrack } from "three";

const times = [0, 1, 2, 3, 4];
const values = [0, 1, 0, 1, 0];

const opacityKF = new NumberKeyframeTrack(".material.opacity", times, values);
```

<div align="right">Creating a vector keyframe track representing positions, with three keyframes</div>

```js
import { VectorKeyframeTrack } from "three";

const times = [0, 3, 6];
const values = [0, 0, 0, 2, 2, 2, 0, 0, 0];

const positionKF = new VectorKeyframeTrack(".position", times, values);
```

### 3. `AnimationClip`

These tracks come together to create the animation, which we call an **animation clip**. An animation clip, then, is a collection of any number of keyframes attached to a single object, and the class representing clips is `AnimationClip`.

<div align="right">A clip that animates both position and opacity</div>

```js
import { AnimationClip, NumberKeyframeTrack, VectorKeyframeTrack } from "three";

const positionKF = new VectorKeyframeTrack(
  ".position",
  [0, 3, 6],
  [0, 0, 0, 2, 2, 2, 0, 0, 0]
);

const opacityKF = new NumberKeyframeTrack(
  ".material.opacity",
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 0, 1, 0, 1, 0]
);

const moveBlinkClip = new AnimationClip("move-n-blink", -1, [
  positionKF,
  opacityKF,
]);
```

The `AnimationClip` is *still* not attached to any particular object. We’ll have to wait for the `AnimationAction` below for that.

## The Animation System: Playback and Control

The next step is to attach this clip to an object and then play it. This brings us to the final two components of the animation system. First, the `AnimationMixer` allows us to turn a static object into an animated object, and finally, the `AnimationAction` connects a clip to the object and allows us to control it using actions such as play, pause, loop, reset, and so on.

### 4. `AnimationMixer`

<div align="right">Each AnimationMixer controls the animation of one object</div>

```js
import { Mesh, AnimationMixer } from 'three';

// create a normal, static mesh
const mesh = new Mesh();

// turn it into an animated mesh by connecting it to a mixer
const mixer = new AnimationMixer(mesh);
```

### 5. `AnimationAction`

The final piece of the puzzle, the `AnimationAction` connects an animated object to an animation clip. The `AnimationAction` class is also where the controls such as pause, play, loop, and reset are located.

<div align="right">Create an AnimationAction using .clipAction</div>

```js
import { AnimationClip, AnimationMixer } from "three";

const moveBlinkClip = new AnimationClip("move-n-blink", -1, [
  positionKF,
  opacityKF,
]);

const mixer = new AnimationMixer(mesh);
const action = mixer.clipAction(moveBlinkClip);
```

We then immediately set the action’s state to playing:

<div align="right">Create an and then set its state to playing</div>

```js
const mixer = new AnimationMixer(humanModel);

const action = mixer.clipAction(walkClip);

// immediately set the animation to play
action.play();

// later, you can stop the action
action.stop();
```

Note that, although we called `.play`, the animation will not start yet.

### Update the Animation in the Loop

There is just one thing left to do before any animations can play. We need to update the animated object in the animation loop.

<div align="right">We need to update the mixer by delta every frame
</div>

```js
const mixer = new AnimationMixer(mesh);
const clock = new Clock();

// you must do this every frame
const delta = clock.getDelta();
mixer.update(delta);
```

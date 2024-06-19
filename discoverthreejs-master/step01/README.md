# The Structure of a three.js App

## Adding a three.js Scene to the Page

<div align="right">index.html</div>

```html
<body>
  <h1>Discoverthreejs.com - Nothing to see here yet :)</h1>

  <div id="scene-container">
    <!-- Our <canvas> will be inserted here -->
  </div>
</body>
```

<div align="right">main.css</div>

```css
#scene-container {
  /* tell our scene container to take up the full page */
  position: absolute;
  width: 100%;
  height: 100%;

  /*
    Set the container's background color to the same as the scene's
    background to prevent flashing on load
  */
  background-color: skyblue;
}
```

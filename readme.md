# PureJSCarousel
Pure JavaScript carousel plugin (touch enabled && responsive) 1.1. Demo: [http://ninjadev.pw/portfolio/pure-js-carousel/](http://ninjadev.pw/portfolio/pure-js-carousel/)

**Browser support**

Chrome    | IE    | Firefox    | Safari    | Opera    | iOS    | Android
:-------: | :---: | :--------: | :-------: | :------: | :----: | :--------:
+         | 9+    | +          | +         | +        | 4+     | 4.3+    

## Getting Started

### 1. Include PureJSCarousel files
```html
<!-- stylesheet -->
<link rel="stylesheet" href="path/to/pure-js-carousel.css">
<!-- js -->
<script src="path/to/pure-js-carousel.js"></script>
```

### 2. Set up your HTML
```html
<div class="your-selector-for-carousel">
  <div class="your-selector-for-carousel-slide"> Your Content </div>
  <div class="your-selector-for-carousel-slide"> Your Content </div>
  <div class="your-selector-for-carousel-slide"> Your Content </div>
  <div class="your-selector-for-carousel-slide"> Your Content </div>
  <div class="your-selector-for-carousel-slide"> Your Content </div>
  <div class="your-selector-for-carousel-slide"> Your Content </div>
  <div class="your-selector-for-carousel-slide"> Your Content </div>
  ...
</div>
```
### 3. Call the PureJSCarousel
```html
var yourVariable = new PureJSCarousel({
  carousel: '.your-selector-for-carousel',
  slide: '.your-selector-for-carousel-slide'
});
```
#### 3.1 Options
Option | Type | Default
------ | ---- | -------
carousel | string (CSS selector) | n/a
slide | string (CSS selector) | n/a
btnNext | string (CSS selector) | document.createElement('button')
btnPrev | string (CSS selector) | document.createElement('button')
oneByOne | boolean | false
speed | int | 1000
delay | int | 0
effect | string | 'linear'
autoplay | boolean | false
autoplayDelay | int | 1000
autoplayStartDelay | int | autoplayDelay
autoplayDirection | string | 'next'
infinite | boolean | false

#### 3.2 Methods
Go to next slide: yourVariable.goToNext();

Go to prev slide: yourVariable.goToPrev();

Go to slide: yourVariable.goTo(slideIndex);

Update carousel: yourVariable.update();

Disable carousel control: yourVariable.disableControl();

Enable carousel control: yourVariable.enableControl();

Destroy: yourVariable.destroy();

Start autoplay: yourVariable.startAutoplay(autoplayDirection);

Stop autoplay: yourVariable.stopAutoplay();

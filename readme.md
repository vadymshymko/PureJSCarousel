# pureJSCarousel
Pure JavaScript carousel plugin (touch enabled). Demo: [http://ninjadev.pw/pure-js-carousel/](http://ninjadev.pw/pure-js-carousel/)
> Tested on IE9+, Microsoft Edge, Chrome, Safari(5.1+), Firefox, Opera, Yandex browser, iOS 7, Android 4.4

## Getting Started

### 1. Include pureJSCarousel files
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
### 3. Call the pureJSCarousel
```html
var yourVariable = new PureJSCarousel({
  carousel: '.your-selector-for-carousel',
  slide: '.your-selector-for-carousel-slide'
});
```
#### 3.1 Settings
Option | Type | Default
------ | ---- | -------
carousel | string (CSS selector) |
slide | string (CSS selector) |
btnNext | string (CSS selector) | document.createElement('button')
btnPrev | string (CSS selector) | document.createElement('button')
oneByOne | boolean | false
speed | int | 1000
delay | int | 0
effect | string | 'linear'
autoplay | boolean | false |
autoplayDelay | int | 1000
autoplayStartDelay | int | autoplayDelay
autoplayDirection | string | 'next'
infinite | boolean | false

#### 4 Methods
Go to next slide: yourVariable.goToNext();

Go to prev slide: yourVariable.goToPrev();

Go to slide: yourVariable.goTo(slideIndex);

Disable carousel control: yourVariable.disableControl();

Enable carousel control: yourVariable.enableControl();

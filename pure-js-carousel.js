/*
 * Pure JavaScript carousel v 1.1
 * Author: Vadym Shymko
 * Author URI: http://ninjadev.pw/
 */

(function() {
  'use strict';

  window.PureJSCarousel = function(config) {
    var scope = this;

    scope.build = function() {
      scope.carousel            = document.querySelector(config.carousel);
      scope.carouselSlides      = scope.carousel.querySelectorAll(config.slide);
      scope.oneByOne            = config.oneByOne || false;
      scope.speed               = config.speed || 1000;
      scope.delay               = config.delay || 0;
      scope.effect              = config.effect || 'linear';
      scope.autoplay            = config.autoplay || false;
      scope.autoplayDelay       = config.autoplayDelay || 1000;
      scope.autoplayStartDelay  = config.autoplayStartDelay || scope.autoplayDelay;
      scope.autoplayDirection   = config.autoplayDirection || 'next';
      scope.infinite            = config.infinite || false;
      scope.carouselBtnNext     = scope.carousel.querySelector(config.btnNext) || false;
      scope.carouselBtnPrev     = scope.carousel.querySelector(config.btnPrev) || false;
      scope.slidesToShow        = Math.round(scope.carousel.offsetWidth / scope.carouselSlides[0].offsetWidth);
      scope.carouselList        = document.createElement('div');
      scope.carouselDotsList    = document.createElement('ul');
      scope.carouselDots        = [];
      scope.carouselDotBtns     = [];
      scope.activeIndex         = 0;
      scope.maxIndex            = 0;
      scope.autoplayScrollState = 0;
      scope.resize              = undefined;

      var i,
          dotsCount;

      scope.carousel.className  += ' pure-js-carousel';
      scope.carousel.style.width = (scope.carouselSlides[0].offsetWidth * scope.slidesToShow) + 'px';

      scope.carousel.insertBefore(scope.carouselList, scope.carouselSlides[0]);
      scope.carouselList.className = 'pure-js-carousel-list';
      if (scope.infinite === true) {
        scope.carouselList.style.marginLeft = - (scope.carouselSlides[0].offsetWidth * scope.carouselSlides.length) + 'px';
        scope.carouselList.style.width = (scope.carouselSlides[0].offsetWidth * scope.carouselSlides.length * 3) + 'px';
      } else {
        scope.carouselList.style.marginLeft = '0px';
        scope.carouselList.style.width = (scope.carouselSlides[0].offsetWidth * scope.carouselSlides.length) + 'px';
      }
      scope.carouselList.addEventListener('touchstart', touchStart);
      scope.carouselList.addEventListener('touchmove', touchMove);
      scope.carouselList.addEventListener('touchend', touchEnd);

      scope.carousel.insertBefore(scope.carouselDotsList, scope.carouselSlides[0]);
      scope.carouselDotsList.className = 'pure-js-carousel-dots';
      if (scope.oneByOne === true) {
        if (scope.infinite === true) {
          dotsCount = scope.carouselSlides.length;
        } else {
          dotsCount = ((scope.carouselList.offsetWidth - scope.carousel.offsetWidth) / scope.carouselSlides[0].offsetWidth) + 1;
        }
      } else {
        if (scope.infinite === true) {
          dotsCount = Math.ceil(scope.carouselList.offsetWidth / scope.carousel.offsetWidth / 3);
        } else {
          dotsCount = Math.ceil(scope.carouselList.offsetWidth / scope.carousel.offsetWidth);
        }
      }
      scope.maxIndex = dotsCount - 1;
      for (i = 0; i < dotsCount; i++) {
        var dot    = document.createElement('li'),
            dotBtn = document.createElement('button');
        scope.carouselDotsList.appendChild(dot);
        scope.carouselDots.push(dot);
        dot.className = 'pure-js-carousel-dot' + (i === 0 ? ' active' : '');
        dotBtn.className = 'pure-js-carousel-dot-btn';
        dotBtn.setAttribute('data-index', i);
        dotBtnClick(scope, dotBtn);
        scope.carouselDotBtns.push(dotBtn);
        dot.appendChild(dotBtn);
      }

      if (scope.carouselBtnPrev === false) {
        scope.carouselBtnPrev = document.createElement('button');
        scope.carousel.appendChild(scope.carouselBtnPrev);
      }
      scope.carouselBtnPrev.className += ' pure-js-carousel-btn pure-js-carousel-btn-prev';
      scope.carouselBtnPrev.type = 'button';
      scope.carouselBtnPrev.addEventListener('click', function() {
        scope.goToPrev();
      });
      if (scope.infinite === false) {
        scope.carouselBtnPrev.disabled = true;
      }
      if (scope.carouselBtnNext === false) {
        scope.carouselBtnNext = document.createElement('button');
        scope.carousel.appendChild(scope.carouselBtnNext);
      }
      scope.carouselBtnNext.className += ' pure-js-carousel-btn pure-js-carousel-btn-next';
      scope.carouselBtnNext.type = 'button';
      scope.carouselBtnNext.addEventListener('click', function() {
        scope.goToNext();
      });

      for (i = 0; i < scope.carouselSlides.length; i++) {
        scope.carouselSlides[i].className += ' pure-js-carousel-slide';
        scope.carouselList.appendChild(scope.carouselSlides[i]);
      }
      if (scope.infinite === true) {
        for (i = 0; i < scope.carouselSlides.length; i++) {
          scope.carouselList.appendChild(scope.carouselSlides[i].cloneNode(true));
        }
        for (i = 0; i < scope.carouselSlides.length; i++) {
          scope.carouselList.insertBefore(scope.carouselSlides[i].cloneNode(true), scope.carouselList.querySelector('.pure-js-carousel-slide')[i]);
        }
      }

      if (scope.autoplay === true) {
        scope.startAutoplay(scope.autoplayDirection);
      }
    };
    scope.reset = function() {
      var i;

      scope.carousel.className = scope.carousel.className.replace(' pure-js-carousel', '');
      scope.carousel.style.width = null;
      scope.carousel.removeChild(scope.carouselDotsList);

      if (config.btnNext) {
        scope.carouselBtnNext.className = scope.carouselBtnNext.className.replace(' pure-js-carousel-btn pure-js-carousel-btn-next', '');
      } else {
        scope.carousel.removeChild(scope.carouselBtnNext);
      }
      if (config.btnPrev) {
        scope.carouselBtnPrev.className = scope.carouselBtnPrev.className.replace(' pure-js-carousel-btn pure-js-carousel-btn-prev', '');
      } else {
        scope.carousel.removeChild(scope.carouselBtnPrev);
      }

      if (scope.infinite === true) {
        for (i = 0; i < scope.carouselSlides.length; i++) {
          scope.carouselList.removeChild(scope.carouselList.querySelector('.pure-js-carousel-slide'));
        }
        for (i = 0; i < scope.carouselSlides.length; i++) {
          scope.carouselList.removeChild(scope.carouselList.querySelectorAll('.pure-js-carousel-slide')[scope.carouselSlides.length]);
        }
      }
      for (i = 0; i < scope.carouselSlides.length; i++) {
        scope.carouselSlides[i].className = scope.carouselSlides[i].className.replace(' pure-js-carousel-slide', '');
        scope.carousel.insertBefore(scope.carouselSlides[i], scope.carouselList);
      }

      scope.carousel.removeChild(scope.carouselList);
    };
    scope.destroy = function() {
      scope.stopAutoplay();
      scope.reset();
      for (var property in scope) {
        if (scope.hasOwnProperty(property)) {
          delete scope[property];
        }
      }
    };
    scope.update = function() {
      scope.stopAutoplay();
      scope.reset();
      scope.build();
    };
    scope.enableControl = function() {
      var i;
      scope.carouselBtnNext.disabled = false;
      scope.carouselBtnPrev.disabled = false;
      for (i = 0; i < scope.carouselDotBtns.length; i++) {
        scope.carouselDotBtns[i].disabled = false;
      }
      scope.carouselDotBtns[scope.activeIndex].disabled = true;
      if (scope.infinite === false) {
        if (scope.activeIndex === scope.maxIndex) {
          scope.carouselBtnNext.disabled = true;
        }
        if (scope.activeIndex === 0) {
          scope.carouselBtnPrev.disabled = true;
        }
      }
      scope.carouselList.disabled = false;
      scope.carouselList.addEventListener('touchstart', touchStart);
      scope.carouselList.addEventListener('touchmove', touchMove);
      scope.carouselList.addEventListener('touchend', touchEnd);
    };
    scope.disableControl = function() {
      var i;
      scope.carouselBtnNext.disabled = true;
      scope.carouselBtnPrev.disabled = true;
      for (i = 0; i < scope.carouselDotBtns.length; i++) {
        scope.carouselDotBtns[i].disabled = true;
      }
      scope.carouselList.disabled = true;
      scope.carouselList.removeEventListener('touchstart', touchStart);
      scope.carouselList.removeEventListener('touchmove', touchMove);
      scope.carouselList.removeEventListener('touchend', touchEnd);
    };
    scope.addTransition = function() {
      if (scope.carouselList.style.transition !== 'undefined') {
        scope.carouselList.style.transition = 'margin-left ' + scope.speed + 'ms' + ' ' + scope.effect + ' ' + scope.delay + 'ms';
      }
    };
    scope.removeTransition = function() {
      if (scope.carouselList.style.transition !== 'undefined') {
        scope.carouselList.style.transition = null;
      }
    };
    scope.goTo = function(index) {
      var direction          = index > scope.activeIndex ? 'next' : 'prev',
          carouselListWidth  = scope.carouselList.offsetWidth / (scope.infinite === true ? 3 : 1),
          carouselSlideWidth = scope.carouselSlides[0].offsetWidth,
          carouselWidth      = scope.carousel.offsetWidth,
          blockWidth         = scope.oneByOne === true ? carouselSlideWidth : carouselWidth,
          minMargin          = (carouselWidth - (scope.carouselSlides.length * carouselSlideWidth)),
          maxMargin          = 0,
          currentMargin      = scope.infinite === true ? - carouselListWidth : Math.max(-blockWidth * scope.activeIndex, minMargin),
          scrollWidth        = Math.abs(blockWidth * (scope.activeIndex - index)),
          newMargin;

      if (scope.oneByOne === false && ((direction === 'next' && index === scope.maxIndex) || (direction === 'prev' && scope.activeIndex === scope.maxIndex))) {
        scrollWidth = scrollWidth + carouselListWidth - ((scope.maxIndex + 1) * blockWidth);
      }

      if (scope.infinite === true) {
        newMargin = direction === 'next' ? currentMargin - scrollWidth : currentMargin + scrollWidth;
      } else {
        newMargin = direction === 'next' ? Math.max(minMargin, currentMargin - scrollWidth) : Math.min(maxMargin, currentMargin + scrollWidth);
      }
      scope.scroll(newMargin, index, direction, scrollWidth / carouselSlideWidth);
    };
    scope.goToPrev = function() {
      var index;
      if (scope.carouselBtnPrev.disabled === false) {
        if (scope.infinite === true) {
          index = scope.activeIndex - 1 < 0 ? scope.maxIndex : scope.activeIndex - 1;
        } else {
          index = scope.activeIndex - 1;
        }
        scope.directionBtnClick('prev', index);
      }
    };
    scope.goToNext = function() {
      var index;
      if (scope.carouselBtnNext.disabled === false) {
        if (scope.infinite === true) {
          index = scope.activeIndex + 1 > scope.maxIndex ? 0 : scope.activeIndex + 1;
        } else {
          index = scope.activeIndex + 1;
        }
        scope.directionBtnClick('next', index);
      }
    };
    scope.directionBtnClick = function(direction, index) {
      var carouselListWidth  = scope.carouselList.offsetWidth / (scope.infinite === true ? 3 : 1),
          carouselSlideWidth = scope.carouselSlides[0].offsetWidth,
          carouselWidth      = scope.carousel.offsetWidth,
          blockWidth         = scope.oneByOne === true ? carouselSlideWidth : carouselWidth,
          minMargin          = (carouselWidth - (scope.carouselSlides.length * carouselSlideWidth)),
          maxMargin          = 0,
          currentMargin      = scope.infinite === true ? - carouselListWidth : Math.max(-blockWidth * scope.activeIndex, minMargin),
          scrollWidth        = blockWidth,
          index,
          newMargin;
      if (scope.oneByOne === false && ((direction === 'next' && index === scope.maxIndex) || (direction === 'prev' && scope.activeIndex === scope.maxIndex))) {
        scrollWidth = scrollWidth + carouselListWidth - ((scope.maxIndex + 1) * blockWidth);
      }
      if (scope.infinite === true) {
        newMargin = direction === 'next' ? currentMargin - scrollWidth : currentMargin + scrollWidth;
      } else {
        newMargin = direction === 'next' ? Math.max(minMargin, currentMargin - scrollWidth) : Math.min(maxMargin, currentMargin + scrollWidth);
      }
      scope.scroll(newMargin, index, direction, scrollWidth / carouselSlideWidth);
    };
    scope.setNewActiveIndex = function(index) {
      scope.carouselDots[scope.activeIndex].className = scope.carouselDots[scope.activeIndex].className.replace(' active', '');
      scope.activeIndex = index;
      scope.carouselDots[scope.activeIndex].className += ' active';
    };
    scope.startAutoplay = function(direction) {
      if (scope.autoplayScrollState === 0) {
        scope.autoplayScrollState = 1;
        scope.autoplayInterval = setInterval(function() {
          direction === 'next' ? scope.goToNext() : scope.goToPrev();
        }, scope.autoplayDelay);
      }
    };
    scope.stopAutoplay = function() {
      scope.autoplayScrollState = 0;
      clearInterval(scope.autoplayInterval);
    };
    scope.scroll = function(newMargin, index, direction, scrollSlidesCount) {
      scope.disableControl();
      scope.addTransition();
      scope.carouselList.style.marginLeft = newMargin + 'px';
      if (scope.carousel.style.transition === 'undefined') {
        scope.setNewActiveIndex(index);
        scrollEnd(direction, scrollSlidesCount);
      } else {
        setTimeout(function() {
          scope.setNewActiveIndex(index);
          scrollEnd(direction, scrollSlidesCount);
        }, scope.speed + scope.delay);
      }
    };

    window.addEventListener('resize', function() {
      clearTimeout(scope.resize);
      scope.resize = setTimeout(function() {
        scope.update();
      }, 250);
    });

    scope.build();

    function touchStart(event) {
      scope.startTouchX      = event.targetTouches[0].pageX;
      scope.startTouchMargin = parseInt(scope.carouselList.style.marginLeft);
    }
    function touchMove(event) {
      scope.activeTouchX                  = event.targetTouches[0].pageX;
      scope.carouselList.style.marginLeft = scope.startTouchMargin + (scope.activeTouchX - scope.startTouchX) + 'px';
    }
    function touchEnd() {
      var direction  = scope.activeTouchX - scope.startTouchX > 0 ? 'prev' : 'next',
          blockWidth = scope.oneByOne === true ? scope.carouselSlides[0].offsetWidth : scope.carousel.offsetWidth;
      if (Math.abs(scope.activeTouchX - scope.startTouchX) >= blockWidth / 2) {
        if (scope.infinite === true) {
          direction === 'next' ? scope.goToNext() : scope.goToPrev();
        } else {
          if ((direction === 'next' && scope.activeIndex < scope.maxIndex) || (direction === 'prev' && scope.activeIndex >  0)) {
            direction === 'next' ? scope.goToNext() : scope.goToPrev();
          } else {
            scope.addTransition();
            scope.carouselList.style.marginLeft = scope.startTouchMargin + 'px';
            if (scope.carousel.style.transition === 'undefined') {
              scope.removeTransition();
            } else {
              setTimeout(function() {
                scope.removeTransition();
              }, scope.speed + scope.delay);
            }
          }
        }
      } else {
        scope.addTransition();
        scope.carouselList.style.marginLeft = scope.startTouchMargin + 'px';
        if (scope.carousel.style.transition === 'undefined') {
          scope.removeTransition();
        } else {
          setTimeout(function() {
            scope.removeTransition();
          }, scope.speed + scope.delay);
        }
      }
    }
    function dotBtnClick(scope, btn) {
      btn.addEventListener('click', function() {
        scope.goTo(parseInt(btn.getAttribute('data-index')));
      });
    }
    function scrollEnd(direction, scrollSlidesCount) {
      scope.removeTransition();
      if (scope.infinite === true) {
        for (var i = 0; i < scrollSlidesCount; i++) {
          if (direction === 'next') {
            scope.carouselList.appendChild(scope.carouselList.children[0]);
          } else {
            scope.carouselList.insertBefore(scope.carouselList.lastElementChild, scope.carouselList.children[0]);
          }
        }
        scope.carouselList.style.marginLeft = - scope.carouselList.offsetWidth / 3 + 'px';
        scope.enableControl();
      } else {
        scope.enableControl();
        if (scope.activeIndex === 0) {
          scope.carouselBtnPrev.disabled = true;
        } else if (scope.activeIndex === scope.carouselDots.length - 1) {
          scope.carouselBtnNext.disabled = true;
        }
      }
    }
  };
})();

/*
 * Pure JavaScript carousel v 1.0
 * Author: Vadym Shymko
 * Author URI: http://ninjadev.pw/
 */

var PureJSCarousel = function(config) {
  var scope = this;

  scope.carousel           = document.querySelector(config.carousel);
  scope.carouselList       = document.createElement('div');
  scope.carouselSlides     = scope.carousel.querySelectorAll(config.slide);
  scope.carouselDotsList   = document.createElement('ul');
  scope.carouselBtnNext    = scope.carousel.querySelector(config.btnNext) || false;
  scope.carouselBtnPrev    = scope.carousel.querySelector(config.btnPrev) || false;
  scope.slidesToShow       = Math.round(scope.carousel.offsetWidth / scope.carouselSlides[0].offsetWidth);
  scope.oneByOne           = config.oneByOne || false;
  scope.speed              = config.speed || 1000;
  scope.delay              = config.delay || 0;
  scope.effect             = config.effect || 'linear';
  scope.autoplay           = config.autoplay || false;
  scope.autoplayDelay      = config.autoplayDelay || 1000;
  scope.autoplayStartDelay = config.autoplayStartDelay || scope.autoplayDelay;
  scope.autoplayDirection  = config.autoplayDirection || 'next';
  scope.infinite           = config.infinite || false;
  scope.carouselDots       = [];
  scope.activeIndex        = 0;

  scope.build = function() {
    var slidesCount = scope.carouselSlides.length,
        dotsCount,
        i;

    scope.carousel.className += ' pure-js-carousel';
    scope.carousel.style.width = (scope.carouselSlides[0].offsetWidth * scope.slidesToShow) + 'px';
    scope.carousel.insertBefore(scope.carouselList, scope.carouselSlides[0]);

    scope.carouselList.className = 'pure-js-carousel-list';
    if (scope.infinite === true) {
      scope.carouselList.style.marginLeft = - (scope.carouselSlides[0].offsetWidth * slidesCount) + 'px';
      scope.carouselList.style.width = (scope.carouselSlides[0].offsetWidth * slidesCount * 3) + 'px';
    } else if (scope.infinite === false) {
      scope.carouselList.style.marginLeft = '0px';
      scope.carouselList.style.width = (scope.carouselSlides[0].offsetWidth * slidesCount) + 'px';
    }
    scope.carouselList.addEventListener('touchstart', function(event) {
      scope.startTouchX = event.targetTouches[0].pageX;
      carouselListTouchStart();
    });
    scope.carouselList.addEventListener('touchmove', function(event) {
      scope.activeTouchX = event.targetTouches[0].pageX;
      carouselListTouchMove();
    });
    scope.carouselList.addEventListener('touchend', function(event) {
      carouselListTouchEnd();
    });

    scope.carousel.insertBefore(scope.carouselDotsList, scope.carouselSlides[0]);
    scope.carouselDotsList.className = 'pure-js-carousel-dots';
    if (scope.oneByOne === true) {
      if (scope.infinite === true) {
        dotsCount = slidesCount;
      } else if (scope.infinite === false) {
        dotsCount = ((scope.carouselList.offsetWidth - scope.carousel.offsetWidth) / scope.carouselSlides[0].offsetWidth) + 1;
      }
    } else {
      if (scope.infinite === true) {
        dotsCount = Math.ceil(scope.carouselList.offsetWidth / scope.carousel.offsetWidth / 3);
      } else if (scope.infinite === false) {
        dotsCount = Math.ceil(scope.carouselList.offsetWidth / scope.carousel.offsetWidth);
      }
    }
    scope.maxIndex = dotsCount - 1;
    for (var i = 0; i < dotsCount; i++) {
      var dot    = document.createElement('li'),
          dotBtn = document.createElement('button');

      scope.carouselDotsList.appendChild(dot);
      scope.carouselDots.push(dot);
      dot.className = 'pure-js-carousel-dot' + (i === 0 ? ' active' : '');

      dotBtn.className = 'pure-js-carousel-dot-btn';
      dotBtn.setAttribute('data-index', i);
      carouselDotBtnClick(scope, dotBtn);

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

    if (scope.carouselBtnNext === false) {
      scope.carouselBtnNext = document.createElement('button');
      scope.carousel.appendChild(scope.carouselBtnNext);
    }
    scope.carouselBtnNext.className += ' pure-js-carousel-btn pure-js-carousel-btn-next';
    scope.carouselBtnNext.type = 'button';
    scope.carouselBtnNext.addEventListener('click', function() {
      scope.goToNext();
    });

    for (i = 0; i < slidesCount; i++) {
      scope.carouselSlides[i].className += ' pure-js-carousel-slide';
      scope.carouselList.appendChild(scope.carouselSlides[i]);
    }

    if (scope.infinite === true) {
      scope.carouselBtnPrev.disabled = true;
      for (i = 0; i < slidesCount; i++) {
        scope.carouselList.appendChild(scope.carouselSlides[i].cloneNode(true));
      }
      for (i = 0; i < slidesCount; i++) {
        scope.carouselList.insertBefore(scope.carouselSlides[i].cloneNode(true), scope.carouselList.querySelector('.pure-js-carousel-slide')[i]);
      }
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
    } else if (scope.infinite === false) {
      newMargin = direction === 'next' ? Math.max(minMargin, currentMargin - scrollWidth) : Math.min(maxMargin, currentMargin + scrollWidth);
    }
    scroll(newMargin, index, direction, scrollWidth / carouselSlideWidth);
  };

  scope.goToPrev = function() {
    var index;
    if (scope.carouselBtnPrev.disabled === false) {
      if (scope.infinite === true) {
        index = scope.activeIndex - 1 < 0 ? scope.maxIndex : scope.activeIndex - 1;
      } else if (scope.infinite === false) {
        index = scope.activeIndex - 1;
      }
      directionBtnClick('prev', index);
    }
  };

  scope.goToNext = function() {
    var index;
    if (scope.carouselBtnNext.disabled === false) {
      if (scope.infinite === true) {
        index = scope.activeIndex + 1 > scope.maxIndex ? 0 : scope.activeIndex + 1;
      } else if (scope.infinite === false) {
        index = scope.activeIndex + 1;
      }
      directionBtnClick('next', index);
    }
  };

  scope.disableControl = function() {
    var i;
    scope.carouselBtnNext.disabled = true;
    scope.carouselBtnPrev.disabled = true;
    for (i = 0; i < scope.carouselDots.length; i++) {
      scope.carouselDots[i].disabled = true;
    }
  };

  scope.enableControl = function() {
    var i;
    scope.carouselBtnNext.disabled = false;
    scope.carouselBtnPrev.disabled = false;
    for (i = 0; i < scope.carouselDots.length; i++) {
      scope.carouselDots[i].disabled = false;
    }
  };

  scope.build();
  if (scope.autoplay === true) {
    autoplayScroll();
  }

  function carouselListTouchStart() {
    scope.startTouchMargin = parseInt(scope.carouselList.style.marginLeft);
  }

  function carouselListTouchMove() {
    scope.carouselList.style.marginLeft = scope.startTouchMargin + (scope.activeTouchX - scope.startTouchX) + 'px';
  }

  function carouselListTouchEnd() {
    var direction          = scope.activeTouchX - scope.startTouchX > 0 ? 'prev' : 'next',
        blockWidth         = scope.oneByOne === true ? scope.carouselSlides[0].offsetWidth : scope.carousel.offsetWidth;

    if (Math.abs(scope.activeTouchX - scope.startTouchX) >= blockWidth / 2) {
      if (scope.infinite === true) {
        direction === 'next' ? scope.goToNext() : scope.goToPrev();
      } else if (scope.infinite === false) {
        if ((direction === 'next' && scope.activeIndex < scope.maxIndex) || (direction === 'prev' && scope.activeIndex >  0)) {
          direction === 'next' ? scope.goToNext() : scope.goToPrev();
        } else {
          addTransition();
          scope.carouselList.style.marginLeft = scope.startTouchMargin + 'px';
          if (scope.carousel.style.transition === 'undefined') {
            removeTransition();
          } else {
            setTimeout(function() {
              removeTransition();
            }, scope.speed + scope.delay);
          }
        }
      }
    } else {
      addTransition();
      scope.carouselList.style.marginLeft = scope.startTouchMargin + 'px';
      if (scope.carousel.style.transition === 'undefined') {
        removeTransition();
      } else {
        setTimeout(function() {
          removeTransition();
        }, scope.speed + scope.delay);
      }
    }
  }

  function carouselDotBtnClick(scope, btn) {
    btn.addEventListener('click', function() {
      scope.goTo(parseInt(btn.getAttribute('data-index')));
    });
  }

  function setNewActiveIndex(index) {
    scope.carouselDots[scope.activeIndex].className = scope.carouselDots[scope.activeIndex].className.replace(' active', '');
    scope.activeIndex = index;
    scope.carouselDots[scope.activeIndex].className += ' active';
  }

  function addTransition() {
    if (scope.carouselList.style.transition !== 'undefined') {
      scope.carouselList.style.transition = 'margin-left ' + scope.speed + 'ms' + ' ' + scope.effect + ' ' + scope.delay + 'ms';
    }
  }

  function removeTransition() {
    if (scope.carouselList.style.transition !== 'undefined') {
      scope.carouselList.style.transition = null;
    }
  }

  function directionBtnClick(direction, index) {
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
    } else if (scope.infinite === false) {
      newMargin = direction === 'next' ? Math.max(minMargin, currentMargin - scrollWidth) : Math.min(maxMargin, currentMargin + scrollWidth);
    }

    scroll(newMargin, index, direction, scrollWidth / carouselSlideWidth);
  };

  function scroll(newMargin, index, direction, scrollSlidesCount) {
    scope.disableControl();
    addTransition();
    scope.carouselList.style.marginLeft = newMargin + 'px';
    if (scope.carousel.style.transition === 'undefined') {
      setNewActiveIndex(index);
      scrollEnd(direction, scrollSlidesCount);
    } else {
      setTimeout(function() {
        setNewActiveIndex(index);
        scrollEnd(direction, scrollSlidesCount);
      }, scope.speed + scope.delay);
    }
  }

  function autoplayScroll() {
    setInterval(function() {
      scope.autoplayDirection === 'next' ? scope.goToNext() : scope.goToPrev();
    }, scope.autoplayDelay);
  };

  function scrollEnd(direction, scrollSlidesCount) {
    removeTransition();
    if (scope.infinite === true) {
      for (var i = 0; i < scrollSlidesCount; i++) {
        if (direction === 'next') {
          scope.carouselList.appendChild(scope.carouselList.children[0]);
        } else if (direction === 'prev') {
          scope.carouselList.insertBefore(scope.carouselList.lastElementChild, scope.carouselList.children[0]);
        }
      }
      scope.carouselList.style.marginLeft = - scope.carouselList.offsetWidth / 3 + 'px';
      scope.enableControl();
    } else if (scope.infinite === false) {
      scope.enableControl();
      if (scope.activeIndex === 0) {
        scope.carouselBtnPrev.disabled = true;
      } else if (scope.activeIndex === scope.carouselDots.length - 1) {
        scope.carouselBtnNext.disabled = true;
      }
    }
  }
};

'use strict';

///////////////////////////////////////////////////////////////////////
// BANKIST SITE (ADVANCED DOM, NO LIBRARY USED)

//Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay__modal');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const imgLazy = document.querySelectorAll('img[data-src]');
const tabsContainerIcons = document.querySelector(
  '.operations__tab-container-icons'
);
const tabsIcons = document.querySelectorAll('.btn-icon');
const btnBars = document.querySelector('.nav__bars');
const navLinks = document.querySelector('.nav__links');
const overlayNav = document.querySelector('.overlay__nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//////////////////////////////////////////////
//Sidebar for small devices
const closeSideBar = function () {
  if (document.documentElement.clientWidth < 992) {
    navLinks.classList.add('hidden');
    overlayNav.classList.add('hidden');
  }
};

//Detect breakpoints and be sure to show the nav-links anytime the viewport width is larger than 992px
window.addEventListener('resize', function () {
  if (document.documentElement.clientWidth > 992) {
    navLinks.classList.remove('hidden');
    overlayNav.classList.add('hidden');
  } else {
    closeSideBar();
  }
});

closeSideBar();

btnBars.addEventListener('click', function () {
  navLinks.classList.remove('hidden');
  overlayNav.classList.remove('hidden');
});
overlayNav.addEventListener('click', closeSideBar);

//////////////////////////////////////////////
//Smooth scrolling (on button)

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////
//Page navigation

// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// With event delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  closeSideBar();
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id !== '#')
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
/////////////////////////////////////////////////////
//Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //Clear the already active
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  //Activate the tab
  clicked.classList.add('operations__tab--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Tabbed component small (max-width: 992px)
tabsContainerIcons.addEventListener('click', function (e) {
  const clicked = e.target.closest('.btn-icon');

  if (!clicked) return;

  //Clear the active
  tabsIcons.forEach(i => i.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  //Activate clicked
  clicked.classList.add('operations__tab--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.icon}`)
    .classList.add('operations__content--active');
});

//////////////////////////////////////////////////////
//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
  }
  logo.style.opacity = this;
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//////////////////////////////////////////////////////////
// Sticky navigation

// First way: not efficient (bad performance in older browsers or on mobile)
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   // console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//A better way to sticky navigation: Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else nav.classList.add('sticky');
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

//////////////////////////////////////////////////////////
// Sections appearing on scroll
const removeHidden = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(removeHidden, {
  root: null,
  threshold: 0.15,
});
sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

////////////////////////////////////////////////////////
// Lazy-loading images
const imgLoad = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgLazy.forEach(img => imgObserver.observe(img));

//Slider
const sliderFunctionality = function () {
  //Elements needed
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  //Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  //Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    activateDots(curSlide);
    goToSlide(curSlide);
  };

  //Previous slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    activateDots(curSlide);
    goToSlide(curSlide);
  };

  //Initialization
  const init = function () {
    createDots();
    activateDots(curSlide);
    goToSlide(0);
  };

  let curSlide = 0;
  const maxSlide = slides.length;
  init();

  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      activateDots(slide);
      goToSlide(slide);
    }
  });
};
//The slider, its elements and its functions are wrapped up into a function to preserve the code
sliderFunctionality();

// ////////////////////////////////////////////////////
// ///////////////////////////////////////////////////
// ///////////////////////////////////////////////////
// //Lectures (i decided to keep them here as a reference)

// //Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// //returns a HTMLCollection, a live list that can be updated
// //a NodeList remains the same as it was in the birthplace in spite of making changes afterwards
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// //Creating and inserting elements
// const message = document.createElement('div'); //DOM object
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analitycs';
// message.innerHTML =
//   'We use cookies for improved functionality and analitycs. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message); //adds the element as the first child of header
// // header.append(message); //adds the element as the last child of header
// //it will be just appended(as the last operation), because it is a live DOM tree element that cannot be in multiple places

// // header.append(message.cloneNode(true)); //having both of them

// // header.before(message); //insert before the element
// // header.after(message); //insert after the element

// //Delete element
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     //Old way
//     // message.parentElement.removeChild(message);
//   });

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color); //returns nothing because style represents the inline-styles, not the CSS computed styles
// // use getComputedStyle
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // CSS Custom Styles
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);

// console.log(logo.className);
// logo.alt = 'Beautiful minimalist logo';

// //Non-standard
// console.log(logo.getAttribute('designer'));
// console.log(logo.setAttribute('company', 'Bankist'));

// console.log(logo.src); //absolute attribute
// console.log(logo.getAttribute('src')); //relative src attribute
// //the same is true for links

// //Data attributes
// console.log(logo.dataset.versionNumber);

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);
//   // console.log(e.target.getBoundingClientRect());
//   // console.log('Current scroll (X/Y)\n', window.pageXOffset, pageYOffset);
//   // console.log(
//   //   'height/width viewport',
//   //   document.documentElement.clientHeight,
//   //   document.documentElement.clientWidth
//   // );

//   //Scrolling
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );

//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   section1.scrollIntoView({ behavior: 'smooth' }); //only for super modern browsers
// });

//Events and event handlers

// const h1 = document.querySelector('h1');
// //mouseenter - hover in CSS
// const alertH1 = function (e) {
//   alert('You are reading a heading');

//   // h1.removeEventListener('mouseenter', alertH1);
// };
// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('You are reading a heading');
// };
//old school

//
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Link', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   //Stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Container', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Nav', e.target, e.currentTarget);
// });

// const h1 = document.querySelector('h1');

// //Going downwards: children
// console.log(h1.querySelector('.highlight'));
// console.log(h1.childNodes); //all the children nodes
// console.log(h1.children); //direct children (elements)
// h1.firstElementChild.style.color = 'white'; // first child that is an element
// h1.lastElementChild.style.color = 'orangered'; // last element that is a child

// //Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'lightgrey'; // closest parent with a certain selector
// // used for accessing indirect parents
// // opposed to the querySelector (it goes upwards)

// // Going sideways: siblings
// // We can acces only the immediate siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) {
//     el.style.transform = 'scale(0.5)';
//   }
// });

//Intersection observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null, // target intersects the viewport
//   threshold: 0.1, //at a ratio of 10%
// }; //(this means 10% is visible in the viewport)

// const observer = new IntersectionObserver(obsCallback, obsOptions);

// const target = document.querySelector('#section--1');
// observer.observe(target);

//Lifecycle DOM events

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ''; //This will display the browser pop-up
// });

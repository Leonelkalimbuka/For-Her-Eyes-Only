// ---- SLIDESHOW INTRO ----
const intro = document.getElementById("intro");
const enterSite = document.getElementById("enterSite");
const skipIntro = document.getElementById("skipIntro");

const slider = document.getElementById("slider");
const dotsWrap = document.getElementById("dots");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");

// Update these to match your uploaded photo filenames
const introSlides = [
  "assets/photos/01.jpg",
  "assets/photos/02.jpg",
  "assets/photos/03.jpg",
  "assets/photos/04.jpg",
  "assets/photos/05.jpg",
];

let current = 0;
let autoTimer = null;

function renderSlides(){
  if(!slider || !dotsWrap) return;

  slider.innerHTML = "";
  dotsWrap.innerHTML = "";

  introSlides.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "slide" + (i === 0 ? " active" : "");
    slide.innerHTML = `<img src="${src}" alt="Slide ${i+1}" loading="lazy">`;
    slider.appendChild(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Go to slide ${i+1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
}

function setActive(index){
  const slides = slider?.querySelectorAll(".slide") || [];
  const dots = dotsWrap?.querySelectorAll(".dot") || [];
  slides.forEach((s, i) => s.classList.toggle("active", i === index));
  dots.forEach((d, i) => d.classList.toggle("active", i === index));
}

function goTo(index){
  current = (index + introSlides.length) % introSlides.length;
  setActive(current);
}

function next(){
  goTo(current + 1);
}

function prev(){
  goTo(current - 1);
}

function startAuto(){
  stopAuto();
  autoTimer = setInterval(next, 3800); // change speed here
}
function stopAuto(){
  if(autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}

prevSlideBtn?.addEventListener("click", () => { prev(); startAuto(); });
nextSlideBtn?.addEventListener("click", () => { next(); startAuto(); });

function enter(){
  // Scroll to your hero/letter area
  const hero = document.querySelector(".hero");
  if(hero) hero.scrollIntoView({ behavior:"smooth", block:"start" });
  // Optional: hide intro once entered
  intro.style.display = "none";
  stopAuto();
}

enterSite?.addEventListener("click", enter);
skipIntro?.addEventListener("click", enter);

// Swipe support (iPad/iPhone)
let touchStartX = 0;
slider?.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive:true });

slider?.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - touchStartX;
  if(Math.abs(diff) > 40){
    diff < 0 ? next() : prev();
    startAuto();
  }
}, { passive:true });

// Pause autoplay on interaction
slider?.addEventListener("mouseenter", stopAuto);
slider?.addEventListener("mouseleave", startAuto);
slider?.addEventListener("touchstart", stopAuto, { passive:true });

// Initialize
renderSlides();
startAuto();

// OPTIONAL: pull name from URL ?her=NAME (same as your template)
(function(){
  const params = new URLSearchParams(window.location.search);
  const her = params.get("her");
  if(her){
    const introName = document.getElementById("introName");
    if(introName) introName.textContent = her;
  }
})();
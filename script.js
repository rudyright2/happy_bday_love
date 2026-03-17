gsap.registerPlugin(ScrollTrigger);

// Hero content enters softly to set the romantic mood from the first frame.
gsap.from(".hero__content", {
  y: 50,
  opacity: 0,
  duration: 1.4,
  ease: "power3.out",
});

// Memory cards are animated with one timeline per panel.
// Each timeline is tied to scroll progress (scrub) so cards:
// 1) begin below viewport, 2) move to center while enlarging,
// 3) stay visible for a short scroll range, 4) move upward and fade out.
document.querySelectorAll(".memory-panel").forEach((panel) => {
  const card = panel.querySelector(".memory-card");

  const memoryTl = gsap.timeline({
    scrollTrigger: {
      trigger: panel,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });

  memoryTl
    .fromTo(
      card,
      { yPercent: 130, scale: 0.78, opacity: 0 },
      { yPercent: 0, scale: 1, opacity: 1, ease: "power2.out", duration: 1 }
    )
    .to(card, { yPercent: -5, scale: 1.04, opacity: 1, ease: "none", duration: 0.45 })
    .to(card, { yPercent: -135, scale: 0.9, opacity: 0, ease: "power2.in", duration: 1 });
});

const envelope = document.getElementById("envelope");
const flap = document.getElementById("envelopeFlap");
const letters = gsap.utils.toArray(".letter-card");

// Envelope section scroll choreography:
// - envelope rises from below and scales into center
// - flap rotates open gradually
// - letters slide out in sequence once flap is mostly open
const envelopeTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".envelope-stage",
    start: "top bottom",
    end: "bottom bottom",
    scrub: 1,
  },
});

envelopeTl
  .fromTo(
    envelope,
    { yPercent: 120, scale: 0.72 },
    { yPercent: 0, scale: 1, ease: "power2.out", duration: 1.1 }
  )
  .to(flap, { rotateX: -155, ease: "none", duration: 1.05 }, 0.52);

const totalLetters = letters.length;
const centerIndex = (totalLetters - 1) / 2;
const maxDistanceFromCenter = Math.max(1, centerIndex);
const maxHorizontalSpread = Math.min(150, 70 + totalLetters * 14);
const revealWindow = 0.7;
const revealStart = 1.22;

letters.forEach((letter, index) => {
  const offsetFromCenter = index - centerIndex;
  const normalizedOffset = offsetFromCenter / maxDistanceFromCenter;

  // Auto layout logic for any number of letters:
  // - evenly distribute around center
  // - rotate outward slightly for a natural fan look
  // - lift center letters a touch more than edge letters
  const xOffset = normalizedOffset * maxHorizontalSpread;
  const rotation = normalizedOffset * 9;
  const yOffset = -220 - Math.abs(normalizedOffset) * 28;
  const revealAt =
    revealStart + (index / Math.max(1, totalLetters - 1)) * revealWindow;

  gsap.set(letter, {
    zIndex: Math.round(100 - Math.abs(offsetFromCenter) * 10),
  });

  envelopeTl.to(
    letter,
    {
      opacity: 1,
      y: yOffset,
      x: xOffset,
      rotate: rotation,
      scale: 0.98,
      ease: "power2.out",
      duration: 0.58,
    },
    revealAt
  );
});

const modal = document.getElementById("letterModal");
const modalImage = document.getElementById("modalImage");

function openLetter(imagePath, imageAlt) {
  modalImage.src = imagePath;
  modalImage.alt = imageAlt || "Opened love letter";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLetter() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
  document.body.style.overflow = "";
}

letters.forEach((letter) => {
  letter.addEventListener("click", () => {
    const imagePath = letter.dataset.letter;
    const image = letter.querySelector("img");
    openLetter(imagePath, image?.alt);
  });
});

modal.addEventListener("click", (event) => {
  const shouldClose =
    event.target instanceof HTMLElement && event.target.dataset.close === "true";

  if (shouldClose) {
    closeLetter();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeLetter();
  }
});

// Opening animation script
const openingAnimation = document.getElementById('opening-animation');

function createHeart(isCenter = false) {
  const heart = document.createElement('div');
  heart.className = 'heart';
  if (isCenter) heart.classList.add('center');

  // Randomize position for non-center hearts
  if (!isCenter) {
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${Math.random() * 100}vh`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
  }

  openingAnimation.appendChild(heart);
}

// Generate multiple hearts
for (let i = 0; i < 20; i++) {
  createHeart();
}

// Add the central heart
createHeart(true);

// Remove animation overlay after completion
setTimeout(() => {
  openingAnimation.style.opacity = '0';
  openingAnimation.style.transition = 'opacity 1s ease';
  setTimeout(() => {
    openingAnimation.remove();
  }, 1000);
}, 6000);

// Intersection Observer for Love Letter Section
const loveLetterSection = document.querySelector("#love-letter");
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      const paragraphs = loveLetterSection.querySelectorAll("p");
      paragraphs.forEach((p, index) => {
        p.style.animation = `fadeIn 1.5s ease ${index * 0.3}s forwards`;
      });
      observer.unobserve(loveLetterSection);
    }
  },
  { threshold: 0.5 }
);

observer.observe(loveLetterSection);

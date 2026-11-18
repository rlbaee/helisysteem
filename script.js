// Highlight the current section in the sidebar while scrolling
const links = document.querySelectorAll("nav a[data-link]");
const sections = [...links].map((a) =>
  document.querySelector(a.getAttribute("href")),
);
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle(
            "active",
            l.getAttribute("href") === "#" + entry.target.id,
          ),
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);
sections.forEach((s) => s && observer.observe(s));

// Light / dark toggle
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");

function updateThemeIcon() {
  const isDark =
    root.getAttribute("data-theme") === "dark" ||
    (!root.getAttribute("data-theme") &&
      matchMedia("(prefers-color-scheme: dark)").matches);
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Vaheta heledale teemale" : "Vaheta tumedale teemale",
  );
  themeToggle.setAttribute("title", themeToggle.getAttribute("aria-label"));
}

themeToggle.addEventListener("click", () => {
  const dark =
    root.getAttribute("data-theme") === "dark" ||
    (!root.getAttribute("data-theme") &&
      matchMedia("(prefers-color-scheme: dark)").matches);
  root.setAttribute("data-theme", dark ? "light" : "dark");
  updateThemeIcon();
});

updateThemeIcon();

// Open guide images in a full-screen lightbox
const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxStage = document.getElementById("lightboxStage");
const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const zoomReset = document.getElementById("zoomReset");
const zoomLevel = document.getElementById("zoomLevel");
let zoomScale = 1;

const setZoom = (scale) => {
  zoomScale = Math.min(8, Math.max(1, scale));
  lightboxImage.style.transform = `scale(${zoomScale})`;
  lightboxImage.style.cursor = zoomScale > 1 ? "zoom-out" : "zoom-in";
  zoomLevel.textContent = `${Math.round(zoomScale * 100)}%`;
};

const resetZoom = () => setZoom(1);

document.querySelectorAll(".image img").forEach((image) => {
  image.setAttribute("tabindex", "0");
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", "Ava pilt suurelt");

  const openImage = () => {
    const imageContainer = image.closest(".image");
    const caption = imageContainer?.querySelector(".image-caption");
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption?.textContent.trim() || image.alt;
    resetZoom();
    lightboxStage.scrollTop = 0;
    lightboxStage.scrollLeft = 0;
    imageLightbox.showModal();
  };

  image.addEventListener("click", openImage);
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openImage();
    }
  });
});

zoomIn.addEventListener("click", () => setZoom(zoomScale * 1.5));
zoomOut.addEventListener("click", () => setZoom(zoomScale / 1.5));
zoomReset.addEventListener("click", resetZoom);
lightboxImage.addEventListener("click", (event) => {
  event.stopPropagation();
  setZoom(zoomScale > 1 ? 1 : zoomScale * 2);
});
lightboxStage.addEventListener("wheel", (event) => {
  event.preventDefault();
  setZoom(zoomScale + (event.deltaY < 0 ? 0.25 : -0.25));
}, { passive: false });

lightboxClose.addEventListener("click", () => {
  imageLightbox.close();
  resetZoom();
});
imageLightbox.addEventListener("click", (event) => {
  if (event.target === imageLightbox) {
    imageLightbox.close();
    resetZoom();
  }
});

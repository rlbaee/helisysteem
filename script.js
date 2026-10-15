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

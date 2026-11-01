// Theme toggle functionality
window.setTheme = function(mode) {
  localStorage.setItem("theme-storage", mode);
}

window.toggleTheme = function() {
  const currentTheme = localStorage.getItem("theme-storage");
  if (currentTheme === "light") {
    setTheme("dark");
  } else {
    setTheme("light");
  }
  updateItemToggleTheme();
}

window.updateItemToggleTheme = function() {
  let mode = getSavedTheme();
  const darkModeStyle = document.getElementById("darkModeStyle");
  if (darkModeStyle) {
    darkModeStyle.disabled = (mode === "light");
  }
  
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  
  if (sunIcon && moonIcon) {
    if (mode === "dark") {
      sunIcon.style.display = "inline-block";
      moonIcon.style.display = "none";
    } else {
      sunIcon.style.display = "none";
      moonIcon.style.display = "inline-block";
    }
  }

  let htmlElement = document.querySelector("html");
  if (mode === "dark") {
    htmlElement.classList.remove("light");
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
    htmlElement.classList.add("light");
  }
}

window.getSavedTheme = function() {
  const configured = document.documentElement.dataset.themeMode;
  if (configured === "light" || configured === "dark") return configured;
  if (configured === "auto") {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  }
  let currentTheme = localStorage.getItem("theme-storage");
  if(!currentTheme) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = "dark";
    } else {
      currentTheme = "light";
    }
    setTheme(currentTheme);
  }
  return currentTheme;
}

// Mermaid rendering
function mermaidRender(theme) {
  const mmdElements = document.getElementsByClassName("mermaid");
  const mmdHTML = [];
  for (let i = 0; i < mmdElements.length; i++) {
    mmdHTML[i] = mmdElements[i].innerHTML;
  }
  
  const initOptions = {
    startOnLoad: false,
    theme: theme === "dark" ? "dark" : "neutral",
  };
  
  for (let i = 0; i < mmdElements.length; i++) {
    delete mmdElements[i].dataset.processed;
    mmdElements[i].innerHTML = mmdHTML[i];
  }
  
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize(initOptions);
    mermaid.run();
  }
}

// Article interactions
document.addEventListener('DOMContentLoaded', function () {
  // Initialize theme
  updateItemToggleTheme();
  if (document.documentElement.dataset.themeMode === 'auto') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateItemToggleTheme);
  }
  
  // Initialize mermaid if available
  const currentTheme = getSavedTheme();
  if (typeof mermaid !== 'undefined') {
    mermaidRender(currentTheme);
  }
});

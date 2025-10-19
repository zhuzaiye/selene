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

// Code block functionality
document.addEventListener('DOMContentLoaded', function () {
  // Copy button functionality
  const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M13.485 1.85a.5.5 0 0 1 1.065.02.75.75 0 0 1-.02 1.065L5.82 12.78a.75.75 0 0 1-1.106.02L1.476 9.346a.75.75 0 1 1 1.05-1.07l2.74 2.742L12.44 2.92a.75.75 0 0 1 1.045-.07z"/></svg>`;
  const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.293 2.293a1 1 0 0 1 1.414 0L8 6.586l4.293-4.293a1 1 0 0 1 1.414 1.414L9.414 8l4.293 4.293a1 1 0 0 1-1.414 1.414L8 9.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L6.586 8 2.293 3.707a1 1 0 0 1 0-1.414z"/></svg>`;
  const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M10 1.5a.5.5 0 0 1 .5-.5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h2a.5.5 0 0 1 .5.5V3h3V1.5zM6.5 3V2h3v1h-3zm4 0v1h2a1 1 0 0 0-1-1h-2V3zm-5 0H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H5.5V3z"/></svg>`;

  // Function to change icons after copying
  const changeIcon = (button, isSuccess) => {
    button.innerHTML = isSuccess ? successIcon : errorIcon;
    setTimeout(() => {
      button.innerHTML = copyIcon;
    }, 2000);
  };

  // Function to get code text
  const getCodeText = (codeBlock) => {
    const isTable = codeBlock.querySelector('table');
    if (isTable) {
      return [...codeBlock.querySelectorAll('tr')]
        .map(row => row.querySelector('td:last-child')?.innerText ?? '')
        .join('');
    } else {
      return codeBlock.textContent.trim();
    }
  };

  // Add copy buttons to code blocks
  document.querySelectorAll('pre code').forEach(codeBlock => {
    const pre = codeBlock.parentNode;
    pre.style.position = 'relative';

    // Create and append the copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'clipboard-button';
    copyBtn.innerHTML = copyIcon;
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
    pre.appendChild(copyBtn);

    // Attach event listener to copy button
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(getCodeText(codeBlock));
        changeIcon(copyBtn, true);
      } catch (error) {
        changeIcon(copyBtn, false);
      }
    });

    const langClass = codeBlock.className.match(/language-(\w+)/);
    const lang = langClass ? langClass[1] : 'default';

    // Create and append the label
    const label = document.createElement('span');
    label.className = 'code-label label-' + lang;
    label.textContent = lang.toUpperCase();
    pre.appendChild(label);
  });

  // Table of Contents functionality
  const toc = document.querySelector(".toc-sticky");
  if (toc) {
    const submenu = [...document.querySelectorAll(".toc-sticky a")];
    if (submenu.length > 0) {
      const article = document.querySelector("article.post-content");
      if (article) {
        const headings = [...article.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter(
          (el) => el.id && el.offsetParent !== null
        );

        if (headings.length > 0) {
          // Smooth scroll for TOC links
          submenu.forEach((link) => {
            link.addEventListener("click", function (e) {
              e.preventDefault();
              const id = this.getAttribute("href");
              if (id && id.startsWith("#")) {
                const target = document.querySelector(id);
                if (target) {
                  target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  if (history.pushState) {
                    history.pushState(null, null, id);
                  }
                }
              }
            });
          });

          // Highlight active heading in TOC
          let headingObserver = new IntersectionObserver(
            (entries) => {
              let visibleHeadings = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);

              if (visibleHeadings.length > 0) {
                let currentHeading = visibleHeadings[0].target;
                updateTocHighlight(currentHeading.id);
              }
            }, 
            {
              threshold: [0, 0.5],
              rootMargin: "-80px 0px -80% 0px",
            }
          );

          headings.forEach((heading) => headingObserver.observe(heading));

          function updateTocHighlight(headingId) {
            submenu.forEach(link => {
              link.closest("li")?.classList.remove("selected", "parent");
            });

            const activeLink = submenu.find(
              link => decodeURIComponent(link.hash) === "#" + headingId
            );

            if (activeLink) {
              let listItem = activeLink.closest("li");
              if (listItem) {
                listItem.classList.add("selected");

                activeLink.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "nearest",
                });

                let parentLi = listItem.parentElement?.closest("li");
                while (parentLi) {
                  parentLi.classList.add("parent");
                  parentLi = parentLi.parentElement?.closest("li");
                }
              }
            }
          }

          // Initialize TOC highlight
          if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            updateTocHighlight(targetId);
          } else {
            updateTocHighlight(headings[0].id);
          }
        }
      }
    }
  }

  // Initialize theme
  updateItemToggleTheme();
  
  // Initialize mermaid if available
  const currentTheme = getSavedTheme();
  if (typeof mermaid !== 'undefined') {
    mermaidRender(currentTheme);
  }
});

// 确保函数在全局作用域中
window.setTheme = function(mode) {
    localStorage.setItem("theme-storage", mode);
    console.log("Theme set to:", mode);
}

// Functions needed for the theme toggle
window.toggleTheme = function() {
    const currentTheme = localStorage.getItem("theme-storage");
    console.log("Current theme before toggle:", currentTheme);
    
    if (currentTheme === "light") {
        setTheme("dark");
        updateItemToggleTheme();
    } else if (currentTheme === "dark") {
        setTheme("light");
        updateItemToggleTheme();
    } else {
        // 如果没有设置，默认设置为 dark
        setTheme("dark");
        updateItemToggleTheme();
    }
}

window.updateItemToggleTheme = function() {
    let mode = getSavedTheme();
    console.log("Updating theme to:", mode);

    const darkModeStyle = document.getElementById("darkModeStyle");
    if (darkModeStyle) {
        darkModeStyle.disabled = (mode === "light");
        console.log("Dark mode stylesheet disabled:", darkModeStyle.disabled);
    }
    
    const sunIcon = document.getElementById("sun-icon");
    const moonIcon = document.getElementById("moon-icon");
    
    console.log("Sun icon element:", sunIcon);
    console.log("Moon icon element:", moonIcon);
    
    if (sunIcon && moonIcon) {
        if (mode === "dark") {
            sunIcon.style.display = "inline-block";
            moonIcon.style.display = "none";
        } else {
            sunIcon.style.display = "none";
            moonIcon.style.display = "inline-block";
        }
        console.log("Sun icon display:", sunIcon.style.display);
        console.log("Moon icon display:", moonIcon.style.display);
    }

    let htmlElement = document.querySelector("html");
    if (mode === "dark") {
        htmlElement.classList.remove("light")
        htmlElement.classList.add("dark")
    } else if (mode === "light") {
        htmlElement.classList.remove("dark")
        htmlElement.classList.add("light")
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
        // 保存默认主题
        setTheme(currentTheme);
    }

    return currentTheme;
}

// Update the toggle theme on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateItemToggleTheme);
} else {
    updateItemToggleTheme();
}

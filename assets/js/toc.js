// Table of Contents 交互功能
document.addEventListener("DOMContentLoaded", () => {
  const toc = document.querySelector(".toc-sticky");
  if (!toc) return;

  const submenu = [...document.querySelectorAll(".toc-sticky a")];
  if (submenu.length === 0) return;

  // 获取文章内容容器
  const article = document.querySelector("article.post-content");
  if (!article) return;

  // 获取所有标题元素
  const headings = [...article.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter(
    (el) => el.id && el.offsetParent !== null
  );

  if (headings.length === 0) return;

  // 获取文章中的所有段落和元素
  let paragraphs = [...article.querySelectorAll("*")].filter(
    (el) => el.offsetParent !== null
  );

  // 平滑滚动
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
          // 更新 URL
          if (history.pushState) {
            history.pushState(null, null, id);
          }
        }
      }
    });
  });

  // 找到元素之前的标题 ID
  function previousHeaderId(element) {
    while (element && !element.matches("h1, h2, h3, h4, h5, h6")) {
      element = element.previousElementSibling;
    }
    return element?.id;
  }

  // 建立段落和菜单项的映射
  let paragraphMenuMap = paragraphs.reduce((map, paragraph) => {
    let headerId = previousHeaderId(paragraph);
    paragraph.previousHeader = headerId;
    
    if (headerId) {
      let menuItem = submenu.find(
        (link) => decodeURIComponent(link.hash) === "#" + headerId
      );
      if (menuItem) {
        map[headerId] = menuItem;
      }
    }
    return map;
  }, {});

  // 使用 IntersectionObserver 监听标题元素
  let headingObserver = new IntersectionObserver(headingHandler, {
    threshold: [0, 0.25, 0.5, 0.75, 1.0],
    rootMargin: "-80px 0px -80% 0px",
  });

  headings.forEach((heading) => headingObserver.observe(heading));

  // 当前激活的标题
  let activeHeading = null;

  function headingHandler(entries) {
    // 找到最接近顶部的可见标题
    let visibleHeadings = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);

    if (visibleHeadings.length > 0) {
      let currentHeading = visibleHeadings[0].target;
      if (currentHeading !== activeHeading) {
        activeHeading = currentHeading;
        updateTocHighlight(currentHeading.id);
      }
    }
  }

  // 更新TOC高亮
  function updateTocHighlight(headingId) {
    // 移除所有高亮
    submenu.forEach(link => {
      link.closest("li")?.classList.remove("selected", "parent");
    });

    // 添加当前项的高亮
    const activeLink = submenu.find(
      link => decodeURIComponent(link.hash) === "#" + headingId
    );

    if (activeLink) {
      let listItem = activeLink.closest("li");
      if (listItem) {
        listItem.classList.add("selected");

        // 平滑滚动TOC到可见区域
        activeLink.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

        // 标记所有父级
        let parentLi = listItem.parentElement?.closest("li");
        while (parentLi) {
          parentLi.classList.add("parent");
          parentLi = parentLi.parentElement?.closest("li");
        }
      }
    }
  }

  // 使用 IntersectionObserver 监听段落元素（保持原有功能）
  let observer = new IntersectionObserver(handler, {
    threshold: [0],
    rootMargin: "-100px 0px -66% 0px",
  });

  paragraphs.forEach((paragraph) => observer.observe(paragraph));

  let selection;
  function handler(entries) {
    // 保持之前的状态，只更新变化的条目
    selection = (selection || entries).map(
      (prevEntry) =>
        entries.find((entry) => entry.target === prevEntry.target) || prevEntry
    );

    // 先移除不在视口内的元素对应的高亮
    for (let entry of selection) {
      if (!entry.isIntersecting) {
        const menuItem = paragraphMenuMap[entry.target.previousHeader];
        menuItem?.parentElement.classList.remove("selected", "parent");
      }
    }

    // 再添加在视口内的元素对应的高亮
    for (let entry of selection) {
      if (entry.isIntersecting) {
        const menuItem = paragraphMenuMap[entry.target.previousHeader];
        let listItem = menuItem?.closest("li");
        
        if (!listItem) continue;

        // 标记当前项为选中
        listItem.classList.add("selected");

        // 标记所有父级
        let parentLi = listItem.parentElement?.closest("li");
        while (parentLi) {
          parentLi.classList.add("parent");
          parentLi = parentLi.parentElement?.closest("li");
        }
      }
    }
  }

  // 页面加载时初始化高亮
  if (headings.length > 0) {
    // 检查URL中是否有hash
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      updateTocHighlight(targetId);
    } else {
      // 默认高亮第一个标题
      updateTocHighlight(headings[0].id);
    }
  }
});

// WeChat-style Like button with localStorage persistence
(function () {
  'use strict';

  const STORAGE_KEY = 'wechat_likes';

  function getLikes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveLikes(likes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
  }

  function getArticleKey() {
    return window.location.pathname;
  }

  function getArticleLike() {
    const all = getLikes();
    return all[getArticleKey()] || { liked: false, count: 0 };
  }

  function setArticleLike(data) {
    const all = getLikes();
    all[getArticleKey()] = data;
    saveLikes(all);
  }

  function formatCount(n) {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const likeBtn = document.getElementById('wechat-like');
    if (!likeBtn) return;

    const likeCountEl = document.getElementById('like-count');
    const state = getArticleLike();

    likeCountEl.textContent = formatCount(state.count);
    if (state.liked) {
      likeBtn.classList.add('liked');
    }

    likeBtn.addEventListener('click', function () {
      const current = getArticleLike();
      if (!current.liked) {
        current.liked = true;
        current.count += 1;
        likeBtn.classList.add('liked');
      } else {
        current.liked = false;
        current.count = Math.max(0, current.count - 1);
        likeBtn.classList.remove('liked');
      }
      likeCountEl.textContent = formatCount(current.count);
      setArticleLike(current);
    });
  });
})();

// Share button
(function () {
  'use strict';

  const shareBtn = document.getElementById('wechat-share');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', function () {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function () {});
    } else {
      navigator.clipboard.writeText(url).catch(function () {});
    }
  });
})();

// Comment button: scroll to gitalk section
(function () {
  'use strict';

  const commentBtn = document.getElementById('wechat-comment-btn');
  if (!commentBtn) return;

  commentBtn.addEventListener('click', function () {
    const container = document.getElementById('gitalk-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();

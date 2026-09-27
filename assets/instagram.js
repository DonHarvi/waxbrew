// Ручная подборка постов для секции Instagram на главной.
// Как добавить пост: открой его в Instagram → Share → Copy link → вставь строкой ниже.
// Можно держать 3-6 ссылок, старые просто удаляй.
var INSTAGRAM_POSTS = [
  // 'https://www.instagram.com/p/XXXXXXXXXXX/',
];

function renderInstagram() {
  var grid = document.getElementById('insta-grid');
  if (!grid) return;

  if (INSTAGRAM_POSTS.length === 0) {
    grid.innerHTML =
      '<div class="insta-empty" data-en="Curated posts are coming soon — follow us on Instagram in the meantime."' +
      ' data-sr="Izbor objava uskoro stiže — u međuvremenu nas prati na Instagramu."' +
      ' data-ru="Подборка постов скоро появится — а пока подпишись на нас в Instagram.">' +
      'Curated posts are coming soon — follow us on Instagram in the meantime.</div>';
    if (window.WaxBrewI18n) window.WaxBrewI18n.applyCurrent();
    return;
  }

  grid.innerHTML = INSTAGRAM_POSTS.map(function (url) {
    return '<blockquote class="instagram-media" data-instgrm-permalink="' + url + '" data-instgrm-version="14"></blockquote>';
  }).join('');

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.instagram.com/embed.js';
  document.body.appendChild(s);
}

document.addEventListener('DOMContentLoaded', renderInstagram);

// ─── i18n ────────────────────────────────────────────────────────────────────

const STRINGS = {
  en: {
    loading: 'Loading playlist…',
    empty:   "The barista hasn't picked today's records yet.",
    error:   "Couldn't load the playlist.",
  },
  sr: {
    loading: 'Učitavam playlist…',
    empty:   'Barista još nije odabrao ploče za danas.',
    error:   'Nije moguće učitati playlist.',
  }
};

function t(key) {
  const lang = localStorage.getItem('waxbrew-lang') || 'en';
  return STRINGS[lang]?.[key] ?? STRINGS.en[key];
}

// ─── Конфиг ──────────────────────────────────────────────────────────────────
// Замените SHEET_ID на ID вашей Google Таблицы
// (из URL: docs.google.com/spreadsheets/d/THIS_PART/edit)
const SHEET_ID = 'YOUR_SHEET_ID_HERE';

// ─── Загрузка плейлиста ───────────────────────────────────────────────────────

async function loadPlaylist() {
  const container = document.getElementById('playlist');

  if (SHEET_ID === 'YOUR_SHEET_ID_HERE') {
    container.innerHTML = renderDemo();
    return;
  }

  try {
    // Google Visualization Query API — без API-ключа, работает для публичных таблиц
    // Выбираем строки где столбец I (Сегодня) = true
    const query = encodeURIComponent("SELECT B,C,D,E,G,H WHERE I = true");
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Catalog&tq=${query}`;

    const res = await fetch(url);
    const text = await res.text();

    // Google возвращает JSONP-обёртку, убираем её
    const json = JSON.parse(text.replace(/^.*?\(/, '').replace(/\);?\s*$/, ''));
    const rows = json.table.rows;

    if (!rows || rows.length === 0) {
      container.innerHTML = `<div class="empty">${t('empty')}</div>`;
      return;
    }

    container.innerHTML = rows.map(row => {
      const c = row.c;
      const artist   = c[0]?.v || '';
      const album    = c[1]?.v || '';
      const year     = c[2]?.v || '';
      const genre    = c[3]?.v || '';
      const coverUrl = c[4]?.v || '';
      const discogsUrl = c[5]?.v || '#';

      return renderTrack({ artist, album, year, genre, coverUrl, discogsUrl });
    }).join('');

  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="empty">${t('error')}</div>`;
  }
}

// ─── Рендер карточки ─────────────────────────────────────────────────────────

function renderTrack({ artist, album, year, genre, coverUrl, discogsUrl }) {
  const cover = coverUrl
    ? `<img class="track-cover" src="${escHtml(coverUrl)}" alt="${escHtml(album)}" loading="lazy" onerror="this.outerHTML='<div class=track-cover-placeholder>◉</div>'">`
    : `<div class="track-cover-placeholder">◉</div>`;

  const meta = [year, genre].filter(Boolean).join(' · ');

  return `
    <a class="track" href="${escHtml(discogsUrl)}" target="_blank" rel="noopener">
      ${cover}
      <div class="track-info">
        <div class="track-artist">${escHtml(artist)}</div>
        <div class="track-album">${escHtml(album)}</div>
        ${meta ? `<div class="track-meta">${escHtml(meta)}</div>` : ''}
      </div>
      <span class="track-discogs">Discogs ↗</span>
    </a>`;
}

// ─── Demo-данные ──────────────────────────────────────────────────────────────

function renderDemo() {
  const demo = [
    {
      artist: 'Kirill Matveev',
      album: 'An Actor Is The Only Person…Who Believes In The Words He Says',
      year: '2025',
      genre: 'Deep Techno, Dub Techno',
      coverUrl: 'https://i.discogs.com/j3O0IimuuoWYgQ2NwQcGq51RPu6yXrH2uOQuukQXdtc/rs:fit/g:sm/q:90/h:576/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM1ODA0/NzQ5LTE3NjQ1MTE2/NTMtNjU1Ni5qcGVn.jpeg',
      discogsUrl: 'https://www.discogs.com/release/35804749'
    },
    {
      artist: 'Kirill Matveev',
      album: 'Please Convince Me EP',
      year: '2024',
      genre: 'Minimal, Tech House',
      coverUrl: 'https://i.discogs.com/-x4SlApVZknZsg0mDCxYjuVxu4DjzL-0LwTl140A2Ks/rs:fit/g:sm/q:90/h:600/w:450/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMwODg5/NzIyLTE3NTM4ODUx/NDAtNzIxOC5qcGVn.jpeg',
      discogsUrl: 'https://www.discogs.com/release/30889722'
    },
    {
      artist: 'Kirill Matveev',
      album: 'Reflections',
      year: '2022',
      genre: 'Deep House, Minimal',
      coverUrl: 'https://i.discogs.com/N1eFrOvZfZ7jHwoYLHkx5fxEzTcFlXZNlCsJXYX3Nzc/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIyMDI3/ODQzLTE2NDQwMTE5/NTQtMjE1NC5qcGVn.jpeg',
      discogsUrl: 'https://www.discogs.com/release/22027843'
    },
    {
      artist: 'Kirill Matveev',
      album: 'Sakura Tree',
      year: '2022',
      genre: 'Dub Techno',
      coverUrl: 'https://i.discogs.com/bVuYs5-L0oArKUtKgnh-3u9NeCt0ZtUBWR5S8m3vcKc/rs:fit/g:sm/q:90/h:599/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI0MjM2/MTUwLTE2NjA4MTM0/OTMtMzU3OC5qcGVn.jpeg',
      discogsUrl: 'https://www.discogs.com/release/24236150'
    },
  ];
  return demo.map(t => renderTrack(t)).join('');
}

// ─── Утилиты ─────────────────────────────────────────────────────────────────

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Старт ───────────────────────────────────────────────────────────────────

loadPlaylist();

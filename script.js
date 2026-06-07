const teams = {
  navi: {
    name: "Natus Vincere", flag: "🇺🇦", country: "Україна", founded: 2009,
    firstCaptain: "Zeus (Данило Тесленко)",
    currentCaptain: "Aleksib (Aleksi Віролайнен)",
    medals: [
      { icon: "🏆", label: "Major Champion × 3", type: "gold" },
      { icon: "⭐", label: "BLAST Premier 2021",  type: "gold" },
      { icon: "🥈", label: "IEM Finals 2022",     type: "silver" },
    ],
    players: [
      { nick: "s1mple",     flag: "🇺🇦", role: "AWPer",   rating: "1.31" },
      { nick: "b1t",        flag: "🇺🇦", role: "Rifler",  rating: "1.18" },
      { nick: "electroNic", flag: "🇷🇺", role: "Rifler",  rating: "1.10" },
      { nick: "Aleksib",    flag: "🇫🇮", role: "IGL",     rating: "1.02" },
      { nick: "npl",        flag: "🇺🇦", role: "Support", rating: "1.05" },
    ]
  },
  faze: {
    name: "FaZe Clan", flag: "🌍", country: "США / Міжнародна", founded: 2010,
    firstCaptain: "karrigan (Фінн Андерсен)",
    currentCaptain: "Twistzz (Russel Van Dulken)",
    medals: [
      { icon: "🏆", label: "IEM Katowice 2022", type: "gold" },
      { icon: "🏆", label: "NAVI Major 2022",   type: "gold" },
      { icon: "🥉", label: "BLAST Spring 2023", type: "bronze" },
    ],
    players: [
      { nick: "broky",   flag: "🇸🇰", role: "AWPer",  rating: "1.22" },
      { nick: "rain",    flag: "🇳🇴", role: "Rifler", rating: "1.14" },
      { nick: "Twistzz", flag: "🇨🇦", role: "Rifler", rating: "1.19" },
      { nick: "karrigan",flag: "🇩🇰", role: "IGL",    rating: "1.06" },
      { nick: "ropz",    flag: "🇪🇪", role: "Lurker", rating: "1.20" },
    ]
  },
  g2: {
    name: "G2 Esports", flag: "🇩🇪", country: "Німеччина / Іспанія", founded: 2014,
    firstCaptain: "Ex6TenZ (Кевін Друланс)",
    currentCaptain: "HooXi (Расмус Нільсен)",
    medals: [
      { icon: "🏆", label: "IEM Cologne 2023",  type: "gold" },
      { icon: "⭐", label: "MVP ZywOo 2023",     type: "gold" },
      { icon: "🥈", label: "Paris Major 2023",   type: "silver" },
    ],
    players: [
      { nick: "ZywOo",   flag: "🇫🇷", role: "AWPer",   rating: "1.32" },
      { nick: "NiKo",    flag: "🇧🇦", role: "Rifler",  rating: "1.28" },
      { nick: "huNter-", flag: "🇧🇦", role: "Rifler",  rating: "1.15" },
      { nick: "HooXi",   flag: "🇩🇰", role: "IGL",     rating: "1.01" },
      { nick: "Snax",    flag: "🇵🇱", role: "Support", rating: "1.08" },
    ]
  },
  vitality: {
    name: "Team Vitality", flag: "🇫🇷", country: "Франція", founded: 2013,
    firstCaptain: "apEX (Дан Мадесклер)",
    currentCaptain: "apEX (залишається капітаном)",
    medals: [
      { icon: "🏆", label: "BLAST Premier 2023",  type: "gold" },
      { icon: "🥈", label: "IEM Cologne 2023",    type: "silver" },
      { icon: "🥉", label: "ESL Pro League S17",  type: "bronze" },
    ],
    players: [
      { nick: "ZywOo",   flag: "🇫🇷", role: "AWPer",   rating: "1.35" },
      { nick: "apEX",    flag: "🇫🇷", role: "IGL",     rating: "1.05" },
      { nick: "dupreeh", flag: "🇩🇰", role: "Rifler",  rating: "1.12" },
      { nick: "magisk",  flag: "🇩🇰", role: "Support", rating: "1.10" },
      { nick: "Spinx",   flag: "🇮🇱", role: "Rifler",  rating: "1.18" },
    ]
  },
  mouz: {
    name: "MOUZ", flag: "🇩🇪", country: "Німеччина", founded: 2002,
    firstCaptain: "gob b (Фатіх Дайік)",
    currentCaptain: "xertioN (Доріан Берман)",
    medals: [
      { icon: "🏆", label: "IEM Sydney 2019",     type: "gold" },
      { icon: "🥈", label: "ESL Cologne 2019",    type: "silver" },
      { icon: "🥉", label: "BLAST Spring 2024",   type: "bronze" },
    ],
    players: [
      { nick: "xertioN",  flag: "🇩🇪", role: "IGL/Rifler", rating: "1.15" },
      { nick: "torzsi",   flag: "🇭🇺", role: "AWPer",      rating: "1.20" },
      { nick: "Jimpphat", flag: "🇫🇮", role: "Rifler",     rating: "1.18" },
      { nick: "Brollan",  flag: "🇸🇪", role: "Rifler",     rating: "1.14" },
      { nick: "siuhy",    flag: "🇩🇰", role: "Support",    rating: "1.08" },
    ]
  }
};

let activeBtn = null;

function selectTeam(id, btn) {
  if (activeBtn) activeBtn.classList.remove('active');
  btn.classList.add('active');
  activeBtn = btn;

  const t = teams[id];
  const panel = document.getElementById('detail-panel');

  const medalsHTML = t.medals.map(m =>
    `<span class="medal ${m.type}">${m.icon} ${m.label}</span>`
  ).join('');

  const playersHTML = t.players.map((p, i) => `
    <div class="player-row">
      <span class="player-num">${i + 1}</span>
      <span class="player-flag">${p.flag}</span>
      <span class="player-nick">${p.nick}</span>
      <span class="player-role">${p.role}</span>
      <span class="player-rating">${p.rating}</span>
    </div>
  `).join('');

  panel.innerHTML = `
    <div class="fade-up">
      <div class="detail-header">
        <div class="detail-flag">${t.flag}</div>
        <div>
          <div class="detail-name">${t.name}</div>
          <div class="detail-country">📍 ${t.country}</div>
        </div>
        <div class="detail-founded">
          <span>${t.founded}</span>
          <small>ЗАСНОВАНА</small>
        </div>
      </div>
      <div class="detail-body">
        <div class="info-card">
          <label>Перший капітан</label>
          <p>${t.firstCaptain}</p>
        </div>
        <div class="info-card">
          <label>Нинішній капітан</label>
          <p>${t.currentCaptain}</p>
        </div>
      </div>
      <div class="medals-section">
        <h4>Нагороди</h4>
        <div class="medals">${medalsHTML}</div>
      </div>
      <div class="players-section">
        <h4>Склад гравців</h4>
        <div class="players-grid">${playersHTML}</div>
      </div>
    </div>
  `;
}
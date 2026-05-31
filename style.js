document.querySelectorAll('.team-name').forEach(btn => {
    btn.addEventListener('click', () => {
      const players = btn.nextElementSibling;
      const isOpen = players.style.display === 'block';
      
      document.querySelectorAll('.players').forEach(p => p.style.display = 'none');
      document.querySelectorAll('.team-name').forEach(b => {
        b.style.background = '#444';
        b.style.color = '#fff';
      });
      
      if (!isOpen) {
        players.style.display = 'block';
        btn.style.background = '#ffcc00';
        btn.style.color = '#121212';
      }
    });
  });
  
  
  // const toggle = document.getElementById('fraggers-toggle');
// const list = document.getElementById('fraggers-list');

// toggle.addEventListener('click', () => {
//   const isOpen = list.style.display !== 'none';
//   list.style.display = isOpen ? 'none' : 'block';
//   toggle.textContent = isOpen ? 'Топ Фрагери ▶' : 'Топ Фрагери ▼';
// });
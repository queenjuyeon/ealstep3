document.addEventListener("DOMContentLoaded", function () {
  const trigger = document.querySelector('.emotion-menu-trigger');
  const menu = document.getElementById('emotionMenu');
  const overlay = document.querySelector('.menu-overlay');

  if (trigger && menu && overlay) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) {
        menu.classList.remove('active');
        overlay.classList.remove('active');
      }
    });
  }
});

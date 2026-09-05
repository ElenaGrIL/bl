(function () {
  'use strict';

  if (window.bl_menu_test) return;
  window.bl_menu_test = true;

  function addButton() {
    var menu = $('.menu .menu__list').eq(0);

    if (!menu.length) {
      setTimeout(addButton, 500);
      return;
    }

    if (
      menu.find(
        '[data-action="bl_test"]'
      ).length
    ) return;

    var button = $(
      '<li class="menu__item selector" ' +
      'data-action="bl_test">' +

        '<div class="menu__ico">' +

          '<svg viewBox="0 0 24 24">' +

            '<path fill="currentColor" ' +
            'd="M12 21.35l-1.45-1.32' +
            'C5.4 15.36 2 12.28 2 8.5' +
            'C2 5.42 4.42 3 7.5 3' +
            'c1.74 0 3.41.81 4.5 2.09' +
            'C13.09 3.81 14.76 3 16.5 3' +
            'C19.58 3 22 5.42 22 8.5' +
            'c0 3.78-3.4 6.86-8.55 11.54' +
            'L12 21.35z"/>' +

          '</svg>' +

        '</div>' +

        '<div class="menu__text">' +
          'BL' +
        '</div>' +

      '</li>'
    );

    button.on(
      'hover:enter',
      function () {

        Lampa.Select.show({
          title: '❤️ BL',

          items: [
            {
              title: '🔥 Новые BL'
            },
            {
              title: '🆕 BL 2026'
            },
            {
              title: '⭐ Популярные BL'
            },
            {
              title: '❤️ Все BL'
            }
          ],

          onSelect: function (item) {
            Lampa.Noty.show(
              item.title
            );
          },

          onBack: function () {
            Lampa.Controller.toggle(
              'menu'
            );
          }
        });
      }
    );

    menu.append(button);
  }

  if (window.appready) {
    addButton();
  } else {
    Lampa.Listener.follow(
      'app',
      function (e) {
        if (e.type === 'ready') {
          addButton();
        }
      }
    );
  }

})();

(function () {
  'use strict';

  if (window.bl_catalog_v3) return;
  window.bl_catalog_v3 = true;

  var BL_KEYWORD = '289844';

  function openFull(title, params) {
    Lampa.Activity.push({
      title: title,
      component: 'category_full',
      source: 'tmdb',
      url: 'discover/tv',
      page: 1,
      params: params
    });
  }

  function showBLMenu() {
    Lampa.Select.show({
      title: '❤️ BL',

      items: [
        {
          title: '🔥 Новые BL',
          action: 'new'
        },
        {
          title: '🆕 BL 2026',
          action: '2026'
        },
        {
          title: '⭐ Популярные BL',
          action: 'popular'
        },
        {
          title: '❤️ Все BL',
          action: 'all'
        }
      ],

      onSelect: function (item) {
        if (item.action === 'new') {
          openFull(
            '🔥 Новые BL',
            {
              with_keywords: BL_KEYWORD,
              sort_by: 'first_air_date.desc',
              language: 'ru-RU'
            }
          );
        }

        if (item.action === '2026') {
          openFull(
            '🆕 BL 2026',
            {
              with_keywords: BL_KEYWORD,
              'first_air_date.gte': '2026-01-01',
              'first_air_date.lte': '2026-12-31',
              sort_by: 'popularity.desc',
              language: 'ru-RU'
            }
          );
        }

        if (item.action === 'popular') {
          openFull(
            '⭐ Популярные BL',
            {
              with_keywords: BL_KEYWORD,
              sort_by: 'popularity.desc',
              language: 'ru-RU'
            }
          );
        }

        if (item.action === 'all') {
          openFull(
            '❤️ Все BL',
            {
              with_keywords: BL_KEYWORD,
              sort_by: 'vote_count.desc',
              language: 'ru-RU'
            }
          );
        }
      },

      onBack: function () {
        Lampa.Controller.toggle('menu');
      }
    });
  }

  function addButton() {
    var menu = $('.menu .menu__list').eq(0);

    if (!menu.length) {
      setTimeout(addButton, 500);
      return;
    }

    if (
      menu.find(
        '[data-action="bl_catalog_v3"]'
      ).length
    ) {
      return;
    }

    var button = $(
      '<li class="menu__item selector" ' +
      'data-action="bl_catalog_v3">' +

        '<div class="menu__ico">' +

          '<svg viewBox="0 0 24 24">' +

            '<path ' +
            'fill="currentColor" ' +
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
        showBLMenu();
      }
    );

    menu.append(button);
  }

  function startPlugin() {
    if (window.appready) {
      addButton();
      return;
    }

    Lampa.Listener.follow(
      'app',
      function (e) {
        if (e.type === 'ready') {
          addButton();
        }
      }
    );
  }

  startPlugin();

})();

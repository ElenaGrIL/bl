(function () {
  'use strict';

  var PLUGIN_NAME = 'bl_332';
  var BL_KEYWORD = '289844';

  if (window[PLUGIN_NAME]) return;
  window[PLUGIN_NAME] = true;

  function openCategory(title, params) {
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
          openCategory(
            '🔥 Новые BL',
            {
              with_keywords: BL_KEYWORD,
              sort_by: 'first_air_date.desc'
            }
          );
        }

        if (item.action === '2026') {
          openCategory(
            '🆕 BL 2026',
            {
              with_keywords: BL_KEYWORD,
              'first_air_date.gte': '2026-01-01',
              'first_air_date.lte': '2026-12-31',
              sort_by: 'popularity.desc'
            }
          );
        }

        if (item.action === 'popular') {
          openCategory(
            '⭐ Популярные BL',
            {
              with_keywords: BL_KEYWORD,
              sort_by: 'popularity.desc'
            }
          );
        }

        if (item.action === 'all') {
          openCategory(
            '❤️ Все BL',
            {
              with_keywords: BL_KEYWORD,
              sort_by: 'vote_count.desc'
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
    if (!Lampa.Menu || !Lampa.Menu.addButton) {
      setTimeout(addButton, 500);
      return;
    }

    Lampa.Menu.addButton({
      title: 'BL',
      icon:
        '<svg viewBox="0 0 24 24">' +
        '<path fill="currentColor" ' +
        'd="M12 21.35l-1.45-1.32C5.4 15.36 ' +
        '2 12.28 2 8.5 2 5.42 4.42 3 ' +
        '7.5 3c1.74 0 3.41.81 4.5 2.09 ' +
        'C13.09 3.81 14.76 3 16.5 3 ' +
        '19.58 3 22 5.42 22 8.5 ' +
        'c0 3.78-3.4 6.86-8.55 11.54 ' +
        'L12 21.35z"/>' +
        '</svg>',

      onSelect: function () {
        showBLMenu();
      }
    });
  }

  function start() {
    if (typeof Lampa === 'undefined') {
      setTimeout(start, 500);
      return;
    }

    addButton();

    if (Lampa.Noty && Lampa.Noty.show) {
      Lampa.Noty.show('BL plugin loaded');
    }
  }

  start();
})();

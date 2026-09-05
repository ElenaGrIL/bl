(function () {
  'use strict';

  var BL_KEYWORD = '289844';

  if (window.elena_bl_plugin_ready) return;

  function openBL(title, query) {
    Lampa.Activity.push({
      url:
        'discover/tv?with_keywords=' +
        BL_KEYWORD +
        '&include_adult=false&' +
        query,
      title: title,
      component: 'list',
      page: 1,
      filter: true,
      source: 'tmdb'
    });
  }

  function startPlugin() {
    if (window.elena_bl_plugin_ready) return;

    window.elena_bl_plugin_ready = true;

    var button = $(
      '<li class="menu__item selector">' +
        '<div class="menu__ico">' +
          '<svg viewBox="0 0 24 24" width="24" height="24">' +
            '<path fill="currentColor" ' +
            'd="M12 21.35l-1.45-1.32C5.4 15.36 ' +
            '2 12.28 2 8.5 2 5.42 4.42 3 ' +
            '7.5 3c1.74 0 3.41.81 4.5 2.09 ' +
            'C13.09 3.81 14.76 3 16.5 3 ' +
            '19.58 3 22 5.42 22 8.5 ' +
            'c0 3.78-3.4 6.86-8.55 11.54 ' +
            'L12 21.35z"/>' +
          '</svg>' +
        '</div>' +
        '<div class="menu__text">BL</div>' +
      '</li>'
    );

    button.on('hover:enter', function () {
      Lampa.Select.show({
        title: '❤️ BL',
        items: [
          {
            title: '🔥 Новые BL',
            query:
              'sort_by=first_air_date.desc' +
              '&first_air_date.lte=2026-09-05'
          },
          {
            title: '🆕 BL 2026',
            query:
              'sort_by=popularity.desc' +
              '&first_air_date.gte=2026-01-01' +
              '&first_air_date.lte=2026-12-31'
          },
          {
            title: '⭐ Популярные BL',
            query:
              'sort_by=popularity.desc'
          },
          {
            title: '❤️ Все BL',
            query:
              'sort_by=vote_count.desc'
          }
        ],

        onSelect: function (item) {
          openBL(item.title, item.query);
        },

        onBack: function () {
          Lampa.Controller.toggle('menu');
        }
      });
    });

    $('.menu .menu__list')
      .eq(0)
      .append(button);
  }

  if (window.appready) {
    startPlugin();
  } else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') {
        startPlugin();
      }
    });
  }
})();

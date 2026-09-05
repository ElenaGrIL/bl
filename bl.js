(function () {
    'use strict';

    var plugin_id = 'elena_bl_plugin';

    if (window[plugin_id]) return;

    function addMenuItem() {
        if ($('.menu__item[data-action="elena_bl"]').length) return;

        var item = $(
            '<li class="menu__item selector" data-action="elena_bl">' +
                '<div class="menu__ico">' +
                    '<svg viewBox="0 0 24 24" width="24" height="24">' +
                        '<path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
                    '</svg>' +
                '</div>' +
                '<div class="menu__text">BL</div>' +
            '</li>'
        );

        item.on('hover:enter', function () {
            Lampa.Select.show({
                title: '❤️ BL',
                items: [
                    {
                        title: '🔥 Новые BL',
                        url: 'discover/tv?with_keywords=289844&sort_by=first_air_date.desc'
                    },
                    {
                        title: '🆕 BL 2026',
                        url: 'discover/tv?with_keywords=289844&first_air_date.gte=2026-01-01&first_air_date.lte=2026-12-31&sort_by=popularity.desc'
                    },
                    {
                        title: '⭐ Популярные BL',
                        url: 'discover/tv?with_keywords=289844&sort_by=popularity.desc'
                    },
                    {
                        title: '❤️ Все BL',
                        url: 'discover/tv?with_keywords=289844&sort_by=vote_count.desc'
                    }
                ],

                onSelect: function (selected) {
                    Lampa.Activity.push({
                        url: selected.url,
                        title: selected.title,
                        component: 'category_full',
                        source: 'tmdb'
                    });
                },

                onBack: function () {
                    Lampa.Controller.toggle('menu');
                }
            });
        });

        $('.menu__list').eq(0).append(item);
    }

    function start() {
        window[plugin_id] = true;
        addMenuItem();
    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') start();
        });
    }
})();

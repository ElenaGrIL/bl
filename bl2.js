(function () {
'use strict';

if (window.plugin_bl2_bldub_v1) return;
window.plugin_bl2_bldub_v1 = true;

var API =
    'https://bldub.com/api/v3/index.php?' +
    'a=GetTitles&limit=8&sort=0';

var ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M12 21.35l-1.45-1.32C5.4 15.36 ' +
    '2 12.28 2 8.5 2 5.42 4.42 3 7.5 3' +
    'c1.74 0 3.41.81 4.5 2.09' +
    'C13.09 3.81 14.76 3 16.5 3' +
    '19.58 3 22 5.42 22 8.5' +
    'c0 3.78-3.4 6.86-8.55 11.54' +
    'L12 21.35z"/></svg>';


function fixItem(item) {

    var d = item.data || {};

    return {
        id: item.id,

        title:
            d.name || d.aka || 'Без названия',

        name:
            d.name || d.aka || 'Без названия',

        original_title:
            d.aka || '',

        year:
            d.year || '',

        release_year:
            d.year || '',

        overview:
            d.description || '',

        description:
            d.description || '',

        genres:
            d.genre || '',

        country:
            d.country || '',

        status:
            d.status || '',

        type:
            d.type || '',

        episodes:
            d.episodes || item.episodes || '',

        translations:
            item.translations || [],

        vote_average:
            item.rating &&
            item.rating.avg
                ? item.rating.avg
                : 0,

        img:
            d.image || '',

        poster:
            d.image || '',

        background_image:
            d.image || '',

        bldub_id:
            item.id,

        bldub_url:
            'https://bldub.com/title/' +
            item.id,

        source:
            'bldub'
    };
}


function showInfo(item) {

    var lines = [];

    if (item.year)
        lines.push(
            'Год: ' + item.year
        );

    if (item.country)
        lines.push(
            'Страна: ' + item.country
        );

    if (item.genres)
        lines.push(
            'Жанр: ' + item.genres
        );

    if (item.status)
        lines.push(
            'Статус: ' + item.status
        );

    if (item.episodes)
        lines.push(
            'Серий: ' + item.episodes
        );

    if (
        item.translations &&
        item.translations.length
    ) {
        lines.push(
            'Перевод: ' +
            item.translations.join(', ')
        );
    }

    if (item.vote_average) {
        lines.push(
            'Рейтинг: ' +
            Number(
                item.vote_average
            ).toFixed(1)
        );
    }

    if (item.original_title) {
        lines.push(
            'Оригинальное название: ' +
            item.original_title
        );
    }

    if (item.description) {
        lines.push('');
        lines.push(
            item.description
        );
    }

    Lampa.Modal.open({
        title:
            item.title,

        html:
            $('<div style="' +
              'font-size:1.1em;' +
              'line-height:1.5;' +
              'padding:1em;">' +
              lines
                .join('<br>')
              +
              '</div>'),

        size:
            'medium',

        onBack:
            function () {
                Lampa.Modal.close();
                Lampa.Controller.toggle(
                    'content'
                );
            }
    });
}


function BL2(object) {

    var comp =
        new Lampa.InteractionMain(
            object
        );

    var network =
        new Lampa.Reguest();


    comp.create =
        function () {

            var _this = this;

            this.activity
                .loader(true);

            network.silent(
                API,

                function (json) {

                    var result = [];

                    if (
                        json &&
                        json.result
                    ) {
                        result =
                            json.result.map(
                                fixItem
                            );
                    }

                    if (!result.length) {

                        _this.empty();
                        return;
                    }

                    Lampa.Utils
                        .extendItemsParams(
                            result,
                            {
                                style: {
                                    name:
                                        'wide'
                                }
                            }
                        );

                    _this.build([
                        {
                            title:
                                '❤️ BLDUB',

                            results:
                                result
                        }
                    ]);

                    _this.activity
                        .loader(false);
                },

                function () {

                    _this.activity
                        .loader(false);

                    _this.empty();
                }
            );

            return this.render();
        };


    comp.onAppend =
        function (
            line,
            element
        ) {

            line.onAppend =
                function (card) {

                    card.onEnter =
                        function (
                            target,
                            card_data
                        ) {

                            showInfo(
                                card_data
                            );
                        };
                };
        };


    return comp;
}


function addButton() {

    var menu =
        $('.menu .menu__list')
            .eq(0);

    if (!menu.length) {

        setTimeout(
            addButton,
            500
        );

        return;
    }


    if (
        menu.find(
            '.menu__item[data-sid="bl2-bldub"]'
        ).length
    ) return;


    var button = $(

        '<li ' +
        'class="menu__item selector" ' +
        'data-action="bl2_bldub" ' +
        'data-sid="bl2-bldub">' +

        '<div class="menu__ico">' +
        ICON +
        '</div>' +

        '<div class="menu__text">' +
        'BL2' +
        '</div>' +

        '</li>'
    );


    button.on(
        'hover:enter',

        function () {

            Lampa.Activity.push({
                title:
                    'BL2 · BLDUB',

                component:
                    'bl2_bldub_main'
            });
        }
    );


    menu.append(button);
}


function startPlugin() {

    Lampa.Component.add(
        'bl2_bldub_main',
        BL2
    );

    addButton();


    setInterval(
        function () {

            if (
                window.appready
            ) {
                addButton();
            }
        },

        4000
    );
}


if (window.appready) {

    startPlugin();

} else {

    Lampa.Listener.follow(
        'app',

        function (e) {

            if (
                e.type ===
                'ready'
            ) {
                startPlugin();
            }
        }
    );
}

})();

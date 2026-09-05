(function () {
'use strict';

if (window.plugin_bl2_bldub_v3) return;
window.plugin_bl2_bldub_v3 = true;

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


function convertItem(item) {

    var d = item.data || {};

    return {
        id: item.id,

        bldub_id:
            item.id,

        title:
            d.name ||
            d.aka ||
            'Без названия',

        name:
            d.name ||
            d.aka ||
            'Без названия',

        original_title:
            d.aka || '',

        year:
            d.year || '',

        description:
            d.description || '',

        country:
            d.country || '',

        genre:
            d.genre || '',

        status:
            d.status || '',

        episodes:
            d.episodes ||
            item.episodes ||
            '',

        translations:
            item.translations || [],

        vote_average:
            item.rating &&
            item.rating.avg
                ? Number(item.rating.avg)
                : 0,

        img:
            d.image || '',

        poster:
            d.image || '',

        background_image:
            d.image || '',

        bldub_url:
            'https://bldub.com/title/' +
            item.id
    };
}


function openBLDUB(item) {

    var url =
        item.bldub_url;

    Lampa.Noty.show(
        'Открываю BLDUB...'
    );

    /*
       На webOS/LG пробуем открыть
       страницу сайта как внешний URL.
    */

    try {

        if (
            window.webOS &&
            window.webOS.service
        ) {

            window.open(
                url,
                '_blank'
            );

            return;
        }

    } catch (e) {}


    try {

        var opened =
            window.open(
                url,
                '_blank'
            );

        if (opened) {
            return;
        }

    } catch (e) {}


    /*
       Запасной вариант.
    */

    try {

        window.location.href =
            url;

    } catch (e) {

        Lampa.Noty.show(
            'Не удалось открыть BLDUB'
        );
    }
}


function BL2(object) {

    var comp =
        Lampa.Maker.make(
            'Main',
            object
        );


    comp.use({

        onCreate:
            function () {

                var self =
                    this;

                self.activity
                    .loader(true);

                var network =
                    new Lampa.Reguest();


                network.silent(

                    API,

                    function (json) {

                        self.activity
                            .loader(false);

                        var results = [];

                        if (
                            json &&
                            json.result
                        ) {

                            results =
                                json.result.map(
                                    convertItem
                                );
                        }


                        if (!results.length) {

                            self.empty();

                            return;
                        }


                        self.build([
                            {
                                title:
                                    '❤️ BLDUB',

                                results:
                                    results,

                                params: {
                                    items: {
                                        view: 7
                                    }
                                }
                            }
                        ]);
                    },


                    function () {

                        self.activity
                            .loader(false);

                        self.empty();
                    }
                );
            },


        onInstance:
            function (
                line,
                lineData
            ) {

                line.use({

                    onInstance:
                        function (
                            card,
                            cardData
                        ) {

                            card.use({

                                onlyEnter:
                                    function () {

                                        openBLDUB(
                                            cardData
                                        );
                                    },


                                onFocus:
                                    function () {

                                        if (
                                            cardData
                                                .background_image &&
                                            Lampa.Background
                                        ) {

                                            Lampa.Background
                                                .change(
                                                    cardData
                                                        .background_image
                                                );
                                        }
                                    }
                            });
                        }
                });
            }
    });


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
            '[data-sid="bl2-bldub-v3"]'
        ).length
    ) {
        return;
    }


    var button = $(

        '<li ' +
        'class="menu__item selector" ' +
        'data-action="bl2_bldub_v3" ' +
        'data-sid="bl2-bldub-v3">' +

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
                    'bl2_bldub_v3'
            });
        }
    );


    menu.append(
        button
    );
}


function startPlugin() {

    Lampa.Component.add(
        'bl2_bldub_v3',
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

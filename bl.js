(function () {
'use strict';

if (window.plugin_bl_ready_v20) return;
window.plugin_bl_ready_v20 = true;

var BL_CONFIG = {
    bl: {
        title: 'BL',

        icon:
            '<svg viewBox="0 0 24 24" fill="currentColor">' +
            '<path d="M12 21.35l-1.45-1.32C5.4 15.36 ' +
            '2 12.28 2 8.5 2 5.42 4.42 3 7.5 3' +
            'c1.74 0 3.41.81 4.5 2.09' +
            'C13.09 3.81 14.76 3 16.5 3' +
            '19.58 3 22 5.42 22 8.5' +
            'c0 3.78-3.4 6.86-8.55 11.54' +
            'L12 21.35z"/></svg>',

        categories: [
            {
                title: '🔥 Новые BL',
                params: {
                    with_keywords: '289844',
                    sort_by: 'first_air_date.desc',
                    'first_air_date.lte': '{current_date}'
                }
            },

            {
                title: '🆕 BL 2026',
                params: {
                    with_keywords: '289844',
                    'first_air_date.gte': '2026-01-01',
                    'first_air_date.lte': '2026-12-31',
                    sort_by: 'popularity.desc'
                }
            },

            {
                title: '⭐ Популярные BL',
                params: {
                    with_keywords: '289844',
                    sort_by: 'popularity.desc'
                }
            },

            {
                title: '❤️ Все BL',
                params: {
                    with_keywords: '289844',
                    sort_by: 'vote_count.desc'
                }
            }
        ]
    }
};


function currentDate() {
    var d = new Date();

    return [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
    ].join('-');
}


function makeUrl(params, page) {

    var query = [];

    query.push(
        'api_key=' +
        encodeURIComponent(
            Lampa.TMDB.key()
        )
    );

    query.push(
        'language=ru-RU'
    );

    query.push(
        'include_adult=false'
    );

    query.push(
        'page=' +
        (page || 1)
    );


    for (var key in params) {

        var value =
            params[key];

        if (
            value ===
            '{current_date}'
        ) {
            value =
                currentDate();
        }

        query.push(
            encodeURIComponent(key) +
            '=' +
            encodeURIComponent(value)
        );
    }


    return Lampa.TMDB.api(
        'discover/tv?' +
        query.join('&')
    );
}


function loadPage(
    params,
    page,
    success,
    error
) {

    var network =
        new Lampa.Reguest();

    network.silent(
        makeUrl(
            params,
            page
        ),

        function (json) {

            if (
                json &&
                json.results
            ) {

                json.results
                    .forEach(
                        function (item) {
                            item.source =
                                'tmdb';
                        }
                    );
            }

            success(json);
        },

        function () {

            if (error)
                error();
        }
    );
}


/* =========================
   ПОЛНЫЙ КАТАЛОГ
   ========================= */

function BLFull(object) {

    var comp =
        new Lampa.InteractionCategory(
            object
        );

    var page = 1;


    comp.create =
        function () {

            var _this = this;

            this.activity
                .loader(true);

            loadPage(
                object.bl_params,
                1,

                function (json) {

                    _this.activity
                        .loader(false);

                    _this.build(
                        json
                    );
                },

                function () {

                    _this.activity
                        .loader(false);

                    _this.empty();
                }
            );

            return this.render();
        };


    comp.nextPageReuest =
        function (
            next,
            resolve,
            reject
        ) {

            page =
                next.page || page + 1;

            loadPage(
                object.bl_params,
                page,
                resolve,
                reject
            );
        };


    return comp;
}


/* =========================
   ГЛАВНЫЙ ЭКРАН BL
   ========================= */

function BLMain(object) {

    var comp =
        Lampa.Maker.make(
            'Main',
            object
        );


    comp.use({

        onCreate: function () {

            var _this = this;

            this.activity
                .loader(true);

            var rows = [];

            var completed = 0;


            BL_CONFIG.bl.categories
                .forEach(
                    function (
                        category,
                        index
                    ) {

                        loadPage(
                            category.params,
                            1,

                            function (json) {

                                var results =
                                    json.results ||
                                    [];


                                rows[index] = {

                                    title:
                                        category.title,

                                    results:
                                        results,

                                    bl_title:
                                        category.title,

                                    bl_params:
                                        category.params,

                                    page:
                                        json.page || 1,

                                    total_pages:
                                        json.total_pages || 1,

                                    total_results:
                                        json.total_results || 0,

                                    params: {
                                        items: {
                                            view: 7
                                        }
                                    }
                                };


                                completed++;

                                if (
                                    completed ===
                                    BL_CONFIG
                                        .bl
                                        .categories
                                        .length
                                ) {

                                    _this.activity
                                        .loader(false);

                                    _this.build(
                                        rows.filter(
                                            Boolean
                                        )
                                    );
                                }
                            },

                            function () {

                                completed++;

                                if (
                                    completed ===
                                    BL_CONFIG
                                        .bl
                                        .categories
                                        .length
                                ) {

                                    _this.activity
                                        .loader(false);

                                    _this.build(
                                        rows.filter(
                                            Boolean
                                        )
                                    );
                                }
                            }
                        );
                    }
                );
        },


        onInstance:
            function (
                line,
                data
            ) {

                line.use({

                    onMore:
                        function () {

                            Lampa.Activity
                                .push({

                                    title:
                                        data.bl_title,

                                    component:
                                        'bl_full_v20',

                                    bl_params:
                                        data.bl_params,

                                    page: 1
                                });
                        },


                    onInstance:
                        function (
                            card,
                            cardData
                        ) {

                            card.use({

                                onEnter:
                                    function () {

                                        Lampa.Router
                                            .call(
                                                'full',
                                                cardData
                                            );
                                    },

                                onFocus:
                                    function () {

                                        if (
                                            Lampa.Background &&
                                            Lampa.Utils
                                                .cardImgBackground
                                        ) {

                                            Lampa.Background
                                                .change(
                                                    Lampa.Utils
                                                        .cardImgBackground(
                                                            cardData
                                                        )
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


/* =========================
   КНОПКА BL
   ========================= */

function addMenuButton() {

    var menu =
        $('.menu .menu__list')
            .eq(0);

    if (!menu.length) {

        setTimeout(
            addMenuButton,
            500
        );

        return;
    }


    if (
        menu.find(
            '.menu__item[data-sid="bl-v20"]'
        ).length
    ) return;


    var btn = $(

        '<li ' +
        'class="menu__item selector" ' +
        'data-action="bl_action_v20" ' +
        'data-sid="bl-v20">' +

        '<div class="menu__ico">' +
        BL_CONFIG.bl.icon +
        '</div>' +

        '<div class="menu__text">' +
        'BL' +
        '</div>' +

        '</li>'
    );


    btn.on(
        'hover:enter',

        function () {

            Lampa.Activity
                .push({

                    title: 'BL',

                    component:
                        'bl_main_v20',

                    page: 1
                });
        }
    );


    menu.append(btn);
}


/* =========================
   ЗАПУСК
   ========================= */

function startPlugin() {

    Lampa.Component.add(
        'bl_main_v20',
        BLMain
    );

    Lampa.Component.add(
        'bl_full_v20',
        BLFull
    );


    addMenuButton();


    setInterval(
        function () {

            if (
                window.appready
            ) {

                addMenuButton();
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

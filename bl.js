(function () {
'use strict';

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
                url: 'discover/tv',
                params: {
                    with_keywords: '289844',
                    sort_by: 'first_air_date.desc',
                    'first_air_date.lte': '{current_date}'
                }
            },
            {
                title: '🆕 BL 2026',
                url: 'discover/tv',
                params: {
                    with_keywords: '289844',
                    'first_air_date.gte': '2026-01-01',
                    'first_air_date.lte': '2026-12-31',
                    sort_by: 'popularity.desc'
                }
            },
            {
                title: '⭐ Популярные BL',
                url: 'discover/tv',
                params: {
                    with_keywords: '289844',
                    sort_by: 'popularity.desc'
                }
            },
            {
                title: '❤️ Все BL',
                url: 'discover/tv',
                params: {
                    with_keywords: '289844',
                    sort_by: 'vote_count.desc'
                }
            }
        ]
    }
};


function BLMain(object) {

    var comp =
        new Lampa.InteractionMain(object);

    var config =
        BL_CONFIG[object.service_id];

    comp.create = function () {

        var _this = this;

        this.activity.loader(true);

        var categories =
            config.categories;

        var network =
            new Lampa.Reguest();

        var status =
            new Lampa.Status(
                categories.length
            );

        status.onComplite =
            function () {

                var fulldata = [];

                Object.keys(status.data)
                    .sort(function (a, b) {
                        return a - b;
                    })
                    .forEach(function (key) {

                        var data =
                            status.data[key];

                        if (
                            data &&
                            data.results &&
                            data.results.length
                        ) {

                            var cat =
                                categories[
                                    parseInt(key)
                                ];

                            Lampa.Utils
                                .extendItemsParams(
                                    data.results,
                                    {
                                        style: {
                                            name: 'wide'
                                        }
                                    }
                                );

                            fulldata.push({
                                title: cat.title,
                                results:
                                    data.results,
                                url: cat.url,
                                params:
                                    cat.params,
                                service_id:
                                    object.service_id
                            });
                        }
                    });

                if (fulldata.length) {

                    _this.build(
                        fulldata
                    );

                    _this.activity
                        .loader(false);

                } else {

                    _this.empty();
                }
            };


        categories.forEach(
            function (cat, index) {

                var params = [];

                params.push(
                    'api_key=' +
                    Lampa.TMDB.key()
                );

                params.push(
                    'language=' +
                    Lampa.Storage.get(
                        'language',
                        'ru'
                    )
                );

                if (cat.params) {

                    for (
                        var key in cat.params
                    ) {

                        var val =
                            cat.params[key];

                        if (
                            val ===
                            '{current_date}'
                        ) {

                            var d =
                                new Date();

                            val = [
                                d.getFullYear(),
                                (
                                    '0' +
                                    (
                                        d.getMonth()
                                        + 1
                                    )
                                ).slice(-2),
                                (
                                    '0' +
                                    d.getDate()
                                ).slice(-2)
                            ].join('-');
                        }

                        params.push(
                            key +
                            '=' +
                            val
                        );
                    }
                }

                var url =
                    Lampa.TMDB.api(
                        cat.url +
                        '?' +
                        params.join('&')
                    );

                network.silent(
                    url,

                    function (json) {

                        status.append(
                            index.toString(),
                            json
                        );
                    },

                    function () {

                        status.error();
                    }
                );
            }
        );

        return this.render();
    };


    comp.onMore =
        function (data) {

            Lampa.Activity.push({
                url: data.url,
                params: data.params,
                title: data.title,
                component: 'bl_view',
                page: 1
            });
        };

    return comp;
}


function BLView(object) {

    var comp =
        new Lampa.InteractionCategory(
            object
        );

    var network =
        new Lampa.Reguest();


    function buildUrl(page) {

        var params = [];

        params.push(
            'api_key=' +
            Lampa.TMDB.key()
        );

        params.push(
            'language=' +
            Lampa.Storage.get(
                'language',
                'ru'
            )
        );

        params.push(
            'page=' + page
        );


        if (object.params) {

            for (
                var key in object.params
            ) {

                var val =
                    object.params[key];

                if (
                    val ===
                    '{current_date}'
                ) {

                    var d =
                        new Date();

                    val = [
                        d.getFullYear(),
                        (
                            '0' +
                            (
                                d.getMonth()
                                + 1
                            )
                        ).slice(-2),
                        (
                            '0' +
                            d.getDate()
                        ).slice(-2)
                    ].join('-');
                }

                params.push(
                    key +
                    '=' +
                    val
                );
            }
        }

        return Lampa.TMDB.api(
            object.url +
            '?' +
            params.join('&')
        );
    }


    comp.create =
        function () {

            var _this = this;

            network.silent(
                buildUrl(1),

                function (json) {
                    _this.build(json);
                },

                this.empty.bind(this)
            );
        };


    comp.nextPageReuest =
        function (
            object,
            resolve,
            reject
        ) {

            network.silent(
                buildUrl(object.page),
                resolve,
                reject
            );
        };

    return comp;
}


function startPlugin() {

    if (
        window.plugin_bl_ready
    ) return;

    window.plugin_bl_ready =
        true;


    Lampa.Component.add(
        'bl_main',
        BLMain
    );

    Lampa.Component.add(
        'bl_view',
        BLView
    );


    function addMenuButton() {

        var menu =
            $('.menu .menu__list')
                .eq(0);

        if (!menu.length)
            return;


        if (
            menu.find(
                '.menu__item[data-sid="bl"]'
            ).length
        ) return;


        var btn = $(
            '<li ' +
            'class="menu__item selector" ' +
            'data-action="bl_action" ' +
            'data-sid="bl">' +

            '<div class="menu__ico">' +
            BL_CONFIG.bl.icon +
            '</div>' +

            '<div class="menu__text">' +
            BL_CONFIG.bl.title +
            '</div>' +

            '</li>'
        );


        btn.on(
            'hover:enter',
            function () {

                Lampa.Activity.push({
                    title:
                        BL_CONFIG.bl.title,

                    component:
                        'bl_main',

                    service_id:
                        'bl',

                    page: 1
                });
            }
        );


        menu.append(btn);
    }


    if (window.appready) {

        addMenuButton();

    } else {

        Lampa.Listener.follow(
            'app',
            function (e) {

                if (
                    e.type == 'ready'
                ) {
                    addMenuButton();
                }
            }
        );
    }


    setInterval(
        function () {

            if (
                window.appready &&
                $('.menu .menu__list')
                    .eq(0)
                    .length
            ) {

                addMenuButton();
            }

        },
        4000
    );
}


if (!window.plugin_bl_ready) {

    startPlugin();
}

})();

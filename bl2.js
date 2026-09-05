(function () {
'use strict';

if (window.plugin_bl2_bldub_v2) return;
window.plugin_bl2_bldub_v2 = true;


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

    var rating = 0;

    if (
        item.rating &&
        item.rating.avg
    ) {
        rating =
            Number(
                item.rating.avg
            );
    }


    return {

        id:
            item.id,

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

        country:
            d.country || '',

        genre:
            d.genre || '',

        description:
            d.description || '',

        overview:
            d.description || '',

        status:
            d.status || '',

        type:
            d.type || '',

        episodes:
            d.episodes ||
            item.episodes ||
            '',

        premium:
            d.premium || '',

        translations:
            item.translations || [],

        vote_average:
            rating,

        img:
            d.image || '',

        poster:
            d.image || '',

        background_image:
            d.image || '',

        bldub_url:
            'https://bldub.com/title/' +
            item.id,

        source:
            'bldub'
    };
}


function escapeHtml(text) {

    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


function showDetails(item) {

    var translation = '';

    if (
        item.translations &&
        item.translations.length
    ) {
        translation =
            item.translations.join(', ');
    }


    var rating = '';

    if (item.vote_average) {

        rating =
            Number(
                item.vote_average
            ).toFixed(1);
    }


    var html = '';

    html +=
        '<div style="' +
        'padding:1.2em;' +
        'line-height:1.5;' +
        'font-size:1.05em;">';


    if (item.img) {

        html +=
            '<div style="' +
            'display:flex;' +
            'gap:1.2em;' +
            'align-items:flex-start;">';


        html +=
            '<img src="' +
            escapeHtml(item.img) +
            '" style="' +
            'width:11em;' +
            'max-height:16em;' +
            'object-fit:cover;' +
            'border-radius:.5em;">';


        html +=
            '<div>';
    }


    if (item.original_title) {

        html +=
            '<div><b>Оригинальное:</b> ' +
            escapeHtml(
                item.original_title
            ) +
            '</div>';
    }


    if (item.year) {

        html +=
            '<div><b>Год:</b> ' +
            escapeHtml(
                item.year
            ) +
            '</div>';
    }


    if (item.country) {

        html +=
            '<div><b>Страна:</b> ' +
            escapeHtml(
                item.country
            ) +
            '</div>';
    }


    if (item.type) {

        html +=
            '<div><b>Тип:</b> ' +
            escapeHtml(
                item.type
            ) +
            '</div>';
    }


    if (item.genre) {

        html +=
            '<div><b>Жанр:</b> ' +
            escapeHtml(
                item.genre
            ) +
            '</div>';
    }


    if (item.status) {

        html +=
            '<div><b>Статус:</b> ' +
            escapeHtml(
                item.status
            ) +
            '</div>';
    }


    if (item.episodes) {

        html +=
            '<div><b>Серий:</b> ' +
            escapeHtml(
                item.episodes
            ) +
            '</div>';
    }


    if (translation) {

        html +=
            '<div><b>Перевод:</b> ' +
            escapeHtml(
                translation
            ) +
            '</div>';
    }


    if (rating) {

        html +=
            '<div><b>Рейтинг:</b> ' +
            escapeHtml(
                rating
            ) +
            '</div>';
    }


    html +=
        '<div><b>BLDUB ID:</b> ' +
        escapeHtml(
            item.bldub_id
        ) +
        '</div>';


    if (item.img) {

        html +=
            '</div></div>';
    }


    if (item.description) {

        html +=
            '<div style="' +
            'margin-top:1.2em;' +
            'font-size:.95em;">' +

            escapeHtml(
                item.description
            ) +

            '</div>';
    }


    html += '</div>';


    Lampa.Modal.open({

        title:
            item.title,

        html:
            $(html),

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
                                    },

                                    style: {
                                        name:
                                            'wide'
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

                                        showDetails(
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
            '[data-sid="bl2-bldub-v2"]'
        ).length
    ) {
        return;
    }


    var button = $(

        '<li ' +
        'class="menu__item selector" ' +
        'data-action="bl2_bldub_v2" ' +
        'data-sid="bl2-bldub-v2">' +

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
                    'bl2_bldub_v2'
            });
        }
    );


    menu.append(
        button
    );
}


function startPlugin() {

    Lampa.Component.add(
        'bl2_bldub_v2',
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

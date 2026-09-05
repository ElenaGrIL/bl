(function () {
'use strict';

if (window.plugin_bl2_ready) return;
window.plugin_bl2_ready = true;

var LAKORNLAND =
    'https://me14.lakornland.land/all';

var ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M12 21.35l-1.45-1.32C5.4 15.36 ' +
    '2 12.28 2 8.5 2 5.42 4.42 3 7.5 3' +
    'c1.74 0 3.41.81 4.5 2.09' +
    'C13.09 3.81 14.76 3 16.5 3' +
    '19.58 3 22 5.42 22 8.5' +
    'c0 3.78-3.4 6.86-8.55 11.54' +
    'L12 21.35z"/></svg>';


function openLakornland() {

    Lampa.Noty.show(
        'Открываю Lakornland...'
    );

    setTimeout(
        function () {
            window.location.href =
                LAKORNLAND;
        },
        300
    );
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
            '.menu__item[data-sid="bl2"]'
        ).length
    ) return;


    var button = $(

        '<li ' +
        'class="menu__item selector" ' +
        'data-action="bl2_action" ' +
        'data-sid="bl2">' +

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
            openLakornland();
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

            if (
                e.type === 'ready'
            ) {
                addButton();
            }
        }
    );
}


setInterval(
    function () {

        if (window.appready) {
            addButton();
        }
    },

    4000
);

})();

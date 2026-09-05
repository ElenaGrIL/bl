(function () {
'use strict';

if (window.plugin_bl2_player_test) return;
window.plugin_bl2_player_test = true;

var PLAYER_URL =
    'https://bg.doramia.one/play/newplayer.php?' +
    'file=1653b356-7c50-11f1-9905-c4346bb0f228' +
    '&key=c743bad3597ee64fe0da71782911df82' +
    '&hash=7ddc803904bfb505969dd0ccbb6fa7ef57f5130eac9ce58649b68a70b0ae1414' +
    '&p=' +
    '&i=70426';


var ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M8 5v14l11-7z"/>' +
    '</svg>';


function openPlayer() {

    var html =
        '<div style="' +
        'width:100%;' +
        'height:75vh;' +
        'background:#000;">' +

        '<iframe ' +
        'src="' + PLAYER_URL + '" ' +
        'style="' +
        'width:100%;' +
        'height:100%;' +
        'border:0;' +
        'background:#000;" ' +
        'allow="autoplay; fullscreen; encrypted-media" ' +
        'allowfullscreen>' +

        '</iframe>' +

        '</div>';


    Lampa.Modal.open({

        title:
            '▶ Тест BLDUB',

        html:
            $(html),

        size:
            'large',

        onBack:
            function () {

                Lampa.Modal.close();

                Lampa.Controller.toggle(
                    'content'
                );
            }
    });
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
            '[data-sid="bl2-player-test"]'
        ).length
    ) {
        return;
    }


    var button = $(

        '<li ' +
        'class="menu__item selector" ' +
        'data-action="bl2_player_test" ' +
        'data-sid="bl2-player-test">' +

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

            openPlayer();
        }
    );


    menu.append(
        button
    );
}


function startPlugin() {

    addButton();

    setInterval(
        function () {

            if (window.appready) {
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

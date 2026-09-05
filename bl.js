(function () {
  'use strict';

  if (window.bl_maker_v1) return;
  window.bl_maker_v1 = true;

  var BL_KEYWORD = '289844';

  var ICON =
    '<svg viewBox="0 0 24 24">' +
    '<path fill="currentColor" ' +
    'd="M12 21.35l-1.45-1.32' +
    'C5.4 15.36 2 12.28 2 8.5' +
    'C2 5.42 4.42 3 7.5 3' +
    'c1.74 0 3.41.81 4.5 2.09' +
    'C13.09 3.81 14.76 3 16.5 3' +
    'C19.58 3 22 5.42 22 8.5' +
    'c0 3.78-3.4 6.86-8.55 11.54' +
    'L12 21.35z"/>' +
    '</svg>';

  var sections = [
    {
      title: '🔥 Новые BL',
      params: {
        with_keywords: BL_KEYWORD,
        sort_by: 'first_air_date.desc'
      }
    },
    {
      title: '🆕 BL 2026',
      params: {
        with_keywords: BL_KEYWORD,
        'first_air_date.gte': '2026-01-01',
        'first_air_date.lte': '2026-12-31',
        sort_by: 'popularity.desc'
      }
    },
    {
      title: '⭐ Популярные BL',
      params: {
        with_keywords: BL_KEYWORD,
        sort_by: 'popularity.desc'
      }
    },
    {
      title: '❤️ Все BL',
      params: {
        with_keywords: BL_KEYWORD,
        sort_by: 'vote_count.desc'
      }
    }
  ];

  function encode(params) {
    var out = [];

    Object.keys(params).forEach(function (key) {
      out.push(
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(params[key])
      );
    });

    return out.join('&');
  }

  function tmdbUrl(params, page) {
    var query = Object.assign({}, params);

    query.api_key = Lampa.TMDB.key();
    query.language = 'ru-RU';
    query.include_adult = 'false';
    query.page = page || 1;

    return Lampa.TMDB.api(
      'discover/tv?' + encode(query)
    );
  }

  function request(params, page, success, fail) {
    var network = new Lampa.Request();

    network.silent(
      tmdbUrl(params, page),
      function (json) {
        json = Lampa.Utils.addSource(
          json,
          'tmdb'
        );

        success(json);
      },
      function () {
        if (fail) fail();
      }
    );
  }

  function openCard(data) {
    Lampa.Router.call(
      'full',
      data
    );
  }

  function FullCatalog(object) {
    var comp = Lampa.Maker.make(
      'Main',
      object
    );

    comp.use({
      onCreate: function () {
        var _this = this;
        var rows = [];
        var loaded = 0;
        var pages = 6;

        for (
          var page = 1;
          page <= pages;
          page++
        ) {
          (function (pageNumber) {

            request(
              object.bl_params,
              pageNumber,

              function (json) {
                rows[pageNumber - 1] = {
                  title:
                    pageNumber === 1
                      ? object.title
                      : 'Продолжение ' +
                        pageNumber,

                  results: json.results,

                  params: {
                    items: {
                      view: 7
                    }
                  }
                };

                loaded++;

                if (loaded === pages) {
                  _this.build(
                    rows.filter(Boolean)
                  );
                }
              },

              function () {
                rows[pageNumber - 1] = {
                  title:
                    'Страница ' +
                    pageNumber,
                  results: []
                };

                loaded++;

                if (loaded === pages) {
                  _this.build(
                    rows.filter(Boolean)
                  );
                }
              }
            );

          })(page);
        }
      },

      onInstance: function (line) {
        line.use({
          onInstance: function (
            card,
            data
          ) {
            card.use({
              onEnter: function () {
                openCard(data);
              },

              onFocus: function () {
                if (
                  Lampa.Background &&
                  Lampa.Utils.cardImgBackground
                ) {
                  Lampa.Background.change(
                    Lampa.Utils
                      .cardImgBackground(data)
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

  function BLMain(object) {
    var comp = Lampa.Maker.make(
      'Main',
      object
    );

    comp.use({
      onCreate: function () {
        var _this = this;
        var rows = [];
        var loaded = 0;

        sections.forEach(
          function (section, index) {

            request(
              section.params,
              1,

              function (json) {
                rows[index] = {
                  title:
                    section.title,

                  results:
                    json.results.slice(
                      0,
                      8
                    ),

                  bl_title:
                    section.title,

                  bl_params:
                    section.params,

                  params: {
                    items: {
                      view: 7
                    }
                  }
                };

                loaded++;

                if (
                  loaded ===
                  sections.length
                ) {
                  _this.build(
                    rows.filter(Boolean)
                  );
                }
              },

              function () {
                loaded++;

                if (
                  loaded ===
                  sections.length
                ) {
                  _this.build(
                    rows.filter(Boolean)
                  );
                }
              }
            );
          }
        );
      },

      onInstance: function (
        line,
        data
      ) {
        line.use({
          onMore: function () {
            Lampa.Activity.push({
              title:
                data.bl_title,

              component:
                'bl_full_maker',

              bl_params:
                data.bl_params
            });
          },

          onInstance: function (
            card,
            cardData
          ) {
            card.use({
              onEnter: function () {
                openCard(
                  cardData
                );
              },

              onFocus: function () {
                if (
                  Lampa.Background &&
                  Lampa.Utils
                    .cardImgBackground
                ) {
                  Lampa.Background.change(
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

  function addMenu() {
    if (
      !Lampa.Menu ||
      !Lampa.Menu.addButton
    ) {
      setTimeout(
        addMenu,
        500
      );
      return;
    }

    if (
      document.querySelector(
        '.bl-maker-button'
      )
    ) return;

    var button =
      Lampa.Menu.addButton(
        ICON,
        'BL',
        function () {
          Lampa.Activity.push({
            title: 'BL',
            component:
              'bl_main_maker'
          });
        }
      );

    button.addClass(
      'bl-maker-button'
    );
  }

  function start() {
    if (
      !Lampa.Maker ||
      !Lampa.Component
    ) {
      setTimeout(
        start,
        500
      );
      return;
    }

    Lampa.Component.add(
      'bl_main_maker',
      BLMain
    );

    Lampa.Component.add(
      'bl_full_maker',
      FullCatalog
    );

    addMenu();
  }

  if (window.appready) {
    start();
  } else {
    Lampa.Listener.follow(
      'app',
      function (e) {
        if (
          e.type === 'ready'
        ) {
          start();
        }
      }
    );
  }

})();

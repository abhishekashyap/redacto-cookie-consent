/*global redacto, ga, Shareaholic, stLight, clicky, top, google, Typekit, FB, ferankReady, IN, stButtons, twttr, PCWidget*/
/*jslint regexp: true, nomen: true*/
/* min ready */

// generic iframe
redacto.services.iframe = {
  key: 'iframe',
  type: 'other',
  name: 'Web content',
  uri: '',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tac_iframe'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : '',
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen'),
        url = redacto.getElemAttr(x, 'url');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowtransparency' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'iframe';
    redacto.fallback(['tac_iframe'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// madmetrics
redacto.services.madmetrics = {
  key: 'madmetrics',
  type: 'ads',
  name: 'MadMetrics',
  uri: 'https://www.keyade.com/fr/politique-de-confidentialite/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.madmetricsHostname === undefined) {
      return;
    }

    redacto.addScript(
      'https://static.madmetrics.com/ktck_seo_acd_pv-min.js',
      '',
      function () {
        var clientId = redacto.user.madmetricsClientId,
          siteId = redacto.user.madmetricsSiteId,
          directId = redacto.user.madmetricsDirectId,
          referalId = redacto.user.madmetricsReferalId;
        var _kTck = new KaTracker(clientId, siteId, directId, referalId);
        _kTck.setBridge(
          'https://' + redacto.user.madmetricsHostname + '/k_redirect_md.php'
        );
        _kTck.track();
      }
    );
  },
};

// fillout
redacto.services.fillout = {
  key: 'fillout',
  type: 'other',
  name: 'Fillout',
  uri: 'https://www.fillout.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tac_fillout'], '');
    redacto.addScript('https://server.fillout.com/embed/v1/');
  },
  fallback: function () {
    'use strict';
    var id = 'fillout';
    redacto.fallback(['tac_fillout'], function (elem) {
      return redacto.engage(id);
    });
  },
};

// kompass
redacto.services.kompass = {
  key: 'kompass',
  type: 'analytic',
  name: 'Kompass',
  uri: 'https://fr.kompass.com/l/cookie-use-policy',
  needConsent: true,
  cookies: [
    'kompass',
    'gq_lead',
    '_first_pageview',
    'eqy_sessionid',
    'eqy_siteid',
    'cluid',
    'eqy_company',
    'gq_utm',
    '_jsuid',
  ],
  js: function () {
    'use strict';

    if (redacto.user.kompassId === undefined) {
      return;
    }

    redacto.addScript(
      'https://fr.kompass.com/leads/script.js?id=' + redacto.user.kompassId
    );
  },
};

// goldenbees
redacto.services.goldenbees = {
  key: 'goldenbees',
  type: 'ads',
  name: 'Golden Bees',
  uri: 'https://www.goldenbees.fr/politique-confidentialite',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.goldenbeesId === undefined) {
      return;
    }

    redacto.addScript(
      'https://cdn.goldenbees.fr/proxy?url=http%3A%2F%2Fstatic.goldenbees.fr%2Fcdn%2Fjs%2Fgtag%2Fgoldentag-min.js&attachment=0',
      '',
      function () {
        window.gbTag = GbTagBuilder.build(redacto.user.goldenbeesId);
        window.gbTag.fire();
      }
    );
  },
};

// weply
redacto.services.weply = {
  key: 'weply',
  type: 'support',
  name: 'Weply',
  uri: 'https://weply.chat/',
  needConsent: true,
  cookies: ['weply.analytics', 'logglytrackingsession'],
  js: function () {
    'use strict';

    if (redacto.user.weplyId === undefined) {
      return;
    }

    redacto.addScript('https://app.weply.chat/widget/' + redacto.user.weplyId);
  },
};

// skaze
redacto.services.skaze = {
  key: 'skaze',
  type: 'ads',
  name: 'Skaze',
  uri: 'https://www.skaze.com/fr/politique/politique-de-confidentialite/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.skazeIdentifier === undefined) {
      return;
    }

    window.skaze = window.skaze || {};
    redacto.addScript(
      'https://events.sk.ht/' + redacto.user.skazeIdentifier + '/lib.js',
      '',
      function () {
        skaze.cmd = skaze.cmd || [];
        skaze.cmd.push(function () {
          skaze.init({ siteIdentifier: redacto.user.skazeIdentifier });

          if (typeof redacto.user.skazeMore === 'function') {
            redacto.user.skazeMore();
          }
        });
      }
    );
  },
};

// dialoginsight
redacto.services.dialoginsight = {
  key: 'dialoginsight',
  type: 'support',
  name: 'Dialog Insight',
  uri: 'https://www.dialoginsight.com/politique-de-confidentialite/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.dialogInsightId === undefined) {
      return;
    }

    redacto.addScript(
      'https://t.ofsys.com/js/Journey/1/' +
        redacto.user.dialogInsightId +
        '/DI.Journey-min.js'
    );
  },
};

// markerio
redacto.services.markerio = {
  key: 'markerio',
  type: 'support',
  name: 'Marker.io',
  uri: 'https://marker.io/cookie-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.markerioProjectId === undefined) {
      return;
    }

    window.markerConfig = {
      project: redacto.user.markerioProjectId,
      source: 'snippet',
    };

    !(function (e, r, a) {
      if (!e.__Marker) {
        e.__Marker = {};
        var t = [],
          n = { __cs: t };
        [
          'show',
          'hide',
          'isVisible',
          'capture',
          'cancelCapture',
          'unload',
          'reload',
          'isExtensionInstalled',
          'setReporter',
          'setCustomData',
          'on',
          'off',
        ].forEach(function (e) {
          n[e] = function () {
            var r = Array.prototype.slice.call(arguments);
            r.unshift(e), t.push(r);
          };
        }),
          (e.Marker = n);
        var s = r.createElement('script');
        (s.async = 1), (s.src = 'https://edge.marker.io/latest/shim.js');
        var i = r.getElementsByTagName('script')[0];
        i.parentNode.insertBefore(s, i);
      }
    })(window, document);
  },
};

// tolkaigenii
redacto.services.tolkaigenii = {
  key: 'tolkaigenii',
  type: 'support',
  name: 'Tolk.ai Genii',
  uri: 'https://www.tolk.ai/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.tolkaiGeniiProject === undefined) {
      return;
    }

    redacto.addScript(
      'https://genii-script.tolk.ai/lightchat.js',
      'lightchat-bot',
      '',
      '',
      'project-id',
      redacto.user.tolkaiGeniiProject
    );
  },
};

// seamlessaccess
redacto.services.seamlessaccess = {
  key: 'seamlessaccess',
  type: 'api',
  name: 'Seamlessaccess',
  uri: 'https://seamlessaccess.org/about/trust/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.seamlessaccessInitiator === undefined) {
      return;
    }
    var uniqIds = [];
    redacto.fallback(
      ['seamlessaccess_button'],
      function (x) {
        var uniqId = redacto.getElemAttr(x, 'id');
        if (uniqId === '') {
          uniqId = '_' + Math.random().toString(36).substr(2, 9);
          x.setAttribute('id', uniqId);
        }
        uniqIds.push(uniqId);
        x.innerHTML = '';
      },
      true
    );
    redacto.addScript(
      '//service.seamlessaccess.org/thiss.js',
      'seamlessaccessjs',
      function () {
        for (var i = 0; i < uniqIds.length; i += 1) {
          thiss.DiscoveryComponent.render(
            {
              loginInitiatorURL: redacto.user.seamlessaccessInitiator,
            },
            '#' + uniqIds[i]
          );
        }
      }
    );
  },
  fallback: function () {
    'use strict';
    var id = 'seamlessaccess';
    redacto.fallback(['seamlessaccess_button'], redacto.engage(id));
  },
};

// reddit
redacto.services.reddit = {
  key: 'reddit',
  type: 'ads',
  name: 'Reddit',
  uri: 'https://business.reddithelp.com/helpcenter/s/article/Reddit-Advertising-Policy-Overview',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.redditInit === undefined) {
      return;
    }

    !(function (w, d) {
      if (!w.rdt) {
        var p = (w.rdt = function () {
          p.sendEvent
            ? p.sendEvent.apply(p, arguments)
            : p.callQueue.push(arguments);
        });
        p.callQueue = [];
        var t = d.createElement('script');
        (t.src = 'https://www.redditstatic.com/ads/pixel.js'), (t.async = !0);
        var s = d.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(t, s);
      }
    })(window, document);
    rdt('init', redacto.user.redditInit, {
      aaid: redacto.user.redditAAID,
      externalId: redacto.user.redditExternalId,
      idfa: redacto.user.redditIDFA,
    });
    rdt('track', 'PageVisit');
  },
};

// zoho
redacto.services.zoho = {
  key: 'zoho',
  type: 'support',
  name: 'Zoho SalesIQ',
  uri: 'https://www.zoho.com/gdpr.html',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.zohoWidgetCode === undefined) {
      return;
    }

    var $zoho = $zoho || {};
    $zoho.salesiq = $zoho.salesiq || {
      widgetcode: redacto.user.zohoWidgetCode,
      values: {},
      ready: function () {},
    };
    redacto.addScript('https://salesiq.zoho.eu/widget');
  },
};

// teads
redacto.services.teads = {
  key: 'teads',
  type: 'ads',
  name: 'Teads',
  uri: 'https://privacy-policy.teads.com',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.teadsBuyerPixelId === undefined) {
      return;
    }

    redacto.addScript('https://p.teads.tv/teads-fellow.js');

    window.teads_e = window.teads_e || [];
    window.teads_buyer_pixel_id = redacto.user.teadsBuyerPixelId;
  },
};

// thetradedesk
redacto.services.thetradedesk = {
  key: 'thetradedesk',
  type: 'ads',
  name: 'TheTradeDesk',
  uri: 'https://www.thetradedesk.com/fr/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.thetradedeskAdvertiserId === undefined ||
      redacto.user.thetradedeskUpixelId === undefined
    ) {
      return;
    }

    redacto.addScript(
      'https://js.adsrvr.org/up_loader.1.1.0.js',
      '',
      function () {
        ttd_dom_ready(function () {
          if (typeof TTDUniversalPixelApi === 'function') {
            var universalPixelApi = new TTDUniversalPixelApi();
            universalPixelApi.init(
              redacto.user.thetradedeskAdvertiserId,
              [redacto.user.thetradedeskUpixelId],
              'https://insight.adsrvr.org/track/up'
            );
          }
        });
      }
    );
  },
};

// gcmanalyticsstorage
redacto.services.gcmanalyticsstorage = {
  key: 'gcmanalyticsstorage',
  type: 'google',
  name: 'Analytics',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  },
  fallback: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  },
};

// gcmadstorage
redacto.services.gcmadstorage = {
  key: 'gcmadstorage',
  type: 'google',
  name: 'Advertising',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        ad_storage: 'granted',
      });
    }
  },
  fallback: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        ad_storage: 'denied',
      });
    }
  },
};

// gcmadsuserdata
redacto.services.gcmadsuserdata = {
  key: 'gcmadsuserdata',
  type: 'google',
  name: 'Personalized Advertising',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  },
  fallback: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  },
};

// gcmpersonalization
redacto.services.gcmpersonalization = {
  key: 'gcmpersonalization',
  type: 'google',
  name: 'Personalization',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        personalization_storage: 'granted',
      });
    }
  },
  fallback: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        personalization_storage: 'denied',
      });
    }
  },
};

// gcmfunctionality
redacto.services.gcmfunctionality = {
  key: 'gcmfunctionality',
  type: 'google',
  name: 'Functionality',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        functionality_storage: 'granted',
      });
    }
  },
  fallback: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        functionality_storage: 'denied',
      });
    }
  },
};

// gcmsecurity
redacto.services.gcmsecurity = {
  key: 'gcmsecurity',
  type: 'google',
  name: 'Security',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        security_storage: 'granted',
      });
    }
  },
  fallback: function () {
    'use strict';

    if (redacto.parameters.googleConsentMode === true) {
      window.tac_gtag('consent', 'update', {
        security_storage: 'denied',
      });
    }
  },
};

// piximedia
redacto.services.piximedia = {
  key: 'piximedia',
  type: 'ads',
  name: 'Piximedia',
  uri: 'https://piximedia.com/privacy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.piximediaName === undefined ||
      redacto.user.piximediaTag === undefined ||
      redacto.user.piximediaType === undefined ||
      redacto.user.piximediaId === undefined
    ) {
      return;
    }

    redacto.addScript(
      'https://ad.piximedia.com/tools/activity/?' +
        redacto.user.piximediaName +
        '||' +
        redacto.user.piximediaTag +
        '|' +
        redacto.user.piximediaType +
        '|' +
        redacto.user.piximediaId +
        '|||||'
    );
  },
};

// screeb
redacto.services.screeb = {
  key: 'screeb',
  type: 'support',
  name: 'Screeb',
  uri: 'https://screeb.app/gdpr-privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.screebId === undefined) {
      return;
    }

    window['ScreebObject'] = '$screeb';
    window['$screeb'] =
      window['$screeb'] ||
      function () {
        var d = arguments;
        return new Promise(function (a, b) {
          (window['$screeb'].q = window['$screeb'].q || []).push({
            v: 1,
            args: d,
            ok: a,
            ko: b,
          });
        });
      };

    redacto.addScript('https://t.screeb.app/tag.js', '$screeb');

    if (redacto.user.screebDontInit !== true) {
      window.$screeb('init', redacto.user.screebId);
    }
  },
};

// pipedrive
redacto.services.pipedrive = {
  key: 'pipedrive',
  type: 'support',
  name: 'Pipedrive',
  uri: 'https://www.pipedrive.com/en/cookie-notice',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.pipedriveCompany === undefined ||
      redacto.user.pipedrivePlaybook === undefined
    ) {
      return;
    }

    window.pipedriveLeadboosterConfig = {
      base: 'leadbooster-chat.pipedrive.com',
      companyId: redacto.user.pipedriveCompany,
      playbookUuid: redacto.user.pipedrivePlaybook,
      version: 2,
    };

    if (!window.LeadBooster) {
      window.LeadBooster = {
        q: [],
        on: function (n, h) {
          this.q.push({
            t: 'o',
            n: n,
            h: h,
          });
        },
        trigger: function (n) {
          this.q.push({
            t: 't',
            n: n,
          });
        },
      };
    }

    redacto.addScript(
      'https://leadbooster-chat.pipedrive.com/assets/loader.js'
    );
  },
  fallback: function () {
    'use strict';
    var id = '';
    redacto.fallback(['proactiveChat'], function (elem) {
      return redacto.engage(id);
    });
  },
};

// dynatrace
redacto.services.dynatrace = {
  key: 'dynatrace',
  type: 'api',
  name: 'Dynatrace',
  uri: 'https://www.dynatrace.com/company/trust-center/privacy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.dynatraceJSPath === undefined ||
      redacto.user.dynatraceConfig === undefined
    ) {
      return;
    }

    redacto.addScript(
      redacto.user.dynatraceJSPath,
      '',
      '',
      '',
      'data-dtconfig',
      redacto.user.dynatraceConfig
    );
  },
};

// mixpanel
redacto.services.mixpanel = {
  key: 'mixpanel',
  type: 'analytic',
  name: 'Mixpanel',
  uri: 'https://docs.mixpanel.com/docs/privacy/overview',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    (function (f, b) {
      if (!b.__SV) {
        var e, g, i, h;
        window.mixpanel = b;
        b._i = [];
        b.init = function (e, f, c) {
          function g(a, d) {
            var b = d.split('.');
            2 == b.length && ((a = a[b[0]]), (d = b[1]));
            a[d] = function () {
              a.push([d].concat(Array.prototype.slice.call(arguments, 0)));
            };
          }
          var a = b;
          'undefined' !== typeof c ? (a = b[c] = []) : (c = 'mixpanel');
          a.people = a.people || [];
          a.toString = function (a) {
            var d = 'mixpanel';
            'mixpanel' !== c && (d += '.' + c);
            a || (d += ' (stub)');
            return d;
          };
          a.people.toString = function () {
            return a.toString(1) + '.people (stub)';
          };
          i =
            'disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove'.split(
              ' '
            );
          for (h = 0; h < i.length; h++) g(a, i[h]);
          var j = 'set set_once union unset remove delete'.split(' ');
          a.get_group = function () {
            function b(c) {
              d[c] = function () {
                call2_args = arguments;
                call2 = [c].concat(Array.prototype.slice.call(call2_args, 0));
                a.push([e, call2]);
              };
            }
            for (
              var d = {},
                e = ['get_group'].concat(
                  Array.prototype.slice.call(arguments, 0)
                ),
                c = 0;
              c < j.length;
              c++
            )
              b(j[c]);
            return d;
          };
          b._i.push([e, f, c]);
        };
        b.__SV = 1.2;
        e = f.createElement('script');
        e.type = 'text/javascript';
        e.async = !0;
        e.src =
          'undefined' !== typeof MIXPANEL_CUSTOM_LIB_URL
            ? MIXPANEL_CUSTOM_LIB_URL
            : 'file:' === f.location.protocol &&
                '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'.match(/^\/\//)
              ? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
              : '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
        g = f.getElementsByTagName('script')[0];
        g.parentNode.insertBefore(e, g);
      }
    })(document, window.mixpanel || []);
  },
};

// freshsalescrm
redacto.services.freshsalescrm = {
  key: 'freshsalescrm',
  type: 'analytic',
  name: 'FreshSales (CRM)',
  uri: 'https://www.freshworks.com/gdpr/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.freshsalescrmId === undefined) {
      return;
    }

    redacto.addScript(
      'https://eu.fw-cdn.com/' + redacto.user.freshsalescrmId + '.js'
    );
  },
};

// equativ
redacto.services.equativ = {
  key: 'equativ',
  type: 'ads',
  name: 'Equativ',
  uri: 'https://equativ.com/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.equativId === undefined) {
      return;
    }

    redacto.addScript(
      'https://ced.sascdn.com/tag/' + redacto.user.equativId + '/smart.js'
    );
  },
};

// twitch
redacto.services.twitch = {
  key: 'twitch',
  type: 'video',
  name: 'Twitch',
  needConsent: true,
  cookies: [],
  uri: 'https://www.twitch.tv/p/en/legal/privacy-notice',
  js: function () {
    'use strict';
    redacto.fallback(['twitch_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Twitch iframe',
        id = redacto.getElemAttr(x, 'videoID'),
        parent = redacto.getElemAttr(x, 'parent'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');
      var embedURL =
        'https://player.twitch.tv/?video=' + id + '&parent=' + parent;

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="' +
        embedURL +
        '"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'twitch';
    redacto.fallback(['twitch_player'], redacto.engage(id));
  },
};

// eskimi
redacto.services.eskimi = {
  key: 'eskimi',
  type: 'ads',
  name: 'Eskimi',
  uri: 'https://fr.eskimi.com/privacy-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.eskimiInit === undefined) {
      return;
    }

    window.___esk = window.esk = function () {
      window.___esk.callMethod
        ? window.___esk.callMethod.apply(window.___esk, arguments)
        : window.___esk.queue.push(arguments);
    };
    window.___esk.push = window.___esk;
    window.___esk.loaded = true;
    window.___esk.queue = [];

    redacto.addScript(
      'https://dsp-media.eskimi.com/assets/js/e/gtr.min.js',
      '',
      function () {
        esk('init', redacto.user.eskimiInit);
      }
    );
  },
};

// sharethissticky
redacto.services.sharethissticky = {
  key: 'sharethissticky',
  type: 'social',
  name: 'ShareThis Sticky',
  uri: 'https://sharethis.com/fr/privacy/',
  needConsent: true,
  cookies: ['_stid', '_stidv', 'pubconsent'],
  js: function () {
    'use strict';

    if (redacto.user.sharethisStickyProperty === undefined) {
      return;
    }

    redacto.addScript(
      'https://platform-api.sharethis.com/js/sharethis.js#property=' +
        redacto.user.sharethisStickyProperty +
        '&product=sticky-share-buttons'
    );
  },
};

// pianoanalytics
redacto.services.pianoanalytics = {
  key: 'pianoanalytics',
  type: 'analytic',
  name: 'Piano Analytics',
  uri: 'https://piano.io/privacy-policy/',
  needConsent: true,
  cookies: ['_pcid', '_pctx', '_pctx', 'pa_user', 'pa_privacy'],
  js: function () {
    'use strict';

    if (
      redacto.user.pianoCollectDomain === undefined ||
      redacto.user.pianoSite === undefined
    ) {
      return;
    }

    redacto.addScript(
      'https://tag.aticdn.net/piano-analytics.js',
      '',
      function () {
        pa.setConfigurations({
          site: redacto.user.pianoSite,
          collectDomain: redacto.user.pianoCollectDomain,
        });

        if (redacto.user.pianoSendData !== false) {
          pa.sendEvent('page.display', {
            page: document.title,
          });
        }
      }
    );
  },
};

// actistat
redacto.services.actistat = {
  key: 'actistat',
  type: 'analytic',
  name: 'ActiSTAT',
  uri: 'https://actigraph.com/actistat',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.actistatId === undefined) {
      return;
    }

    redacto.addScript(
      'https://actistat.fr/umami.js',
      '',
      '',
      '',
      'data-website-id',
      redacto.user.actistatId
    );
  },
};

// outbrainamplify
redacto.services.outbrainamplify = {
  key: 'outbrainamplify',
  type: 'ads',
  name: 'Outbrain Amplify',
  uri: 'https://www.outbrain.com/privacy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.outbrainamplifyId === undefined) {
      return;
    }

    var OB_ADV_ID = redacto.user.outbrainamplifyId;
    if (window.obApi) {
      var toArray = function (object) {
        return Object.prototype.toString.call(object) === '[object Array]'
          ? object
          : [object];
      };
      window.obApi.marketerId = toArray(_window.obApi.marketerId).concat(
        toArray(OB_ADV_ID)
      );
      return;
    }
    var api = (window.obApi = function () {
      api.dispatch
        ? api.dispatch.apply(api, arguments)
        : api.queue.push(arguments);
    });
    api.version = '1.1';
    api.loaded = true;
    api.marketerId = OB_ADV_ID;
    api.queue = [];

    redacto.addScript(
      'https://amplify.outbrain.com/cp/obtp.js',
      '',
      function () {
        obApi('track', 'PAGE_VIEW');
      }
    );
  },
};

// playplay
redacto.services.playplay = {
  key: 'playplay',
  type: 'video',
  name: 'PlayPlay',
  uri: 'https://playplay.com/fr/confidentialite',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    redacto.fallback(['tac_playplay'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Playplay iframe',
        id = redacto.getElemAttr(x, 'data-id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');

      var playURL = 'https://playplay.com/app/embed-video/' + id;

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        'border:0;" src="' +
        playURL +
        '" allowfullscreen></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'playplay';
    redacto.fallback(['tac_playplay'], function (elem) {
      return redacto.engage(id);
    });
  },
};

// adobeworkspace
redacto.services.adobeworkspace = {
  key: 'adobeworkspace',
  type: 'analytic',
  name: 'Adobe - Analysis Workspace',
  uri: 'https://www.adobe.com/privacy/policy.html',
  needConsent: true,
  cookies: ['s_ecid', 's_cc', 's_sq', 's_vi', 's_fid'],
  js: function () {
    'use strict';

    if (
      redacto.user.adobeworkspaceId1 === undefined ||
      redacto.user.adobeworkspaceId2 === undefined ||
      redacto.user.adobeworkspaceId3 === undefined
    ) {
      return;
    }

    redacto.addScript(
      'https://assets.adobedtm.com/' +
        redacto.user.adobeworkspaceId1 +
        '/' +
        redacto.user.adobeworkspaceId2 +
        '/launch-' +
        redacto.user.adobeworkspaceId3 +
        '.min.js'
    );
  },
};

// zohopagesense
redacto.services.zohopagesense = {
  key: 'zohopagesense',
  type: 'analytic',
  name: 'Zoho PageSense',
  uri: 'https://www.zoho.com/pagesense/cookie-policy.html',
  needConsent: true,
  cookies: [
    'zab_g_',
    'zabUserID',
    'zabVisitID',
    'zabSplit',
    'zabBucket',
    'zabHMBucket',
    'zpsfa_',
    'zfa',
    'zsr',
    'zabme',
    'zsd',
    'ps_payloadSeqId',
    'zabPZBucket',
    'zPersonalization',
    'zia_',
    'zpc',
    'zps_permission_status',
    'zps-tgr-dts',
    'zpspolls_',
    'zpsPollsBucket',
    'zpspb',
    'zpsPopupBucket',
    'zpssr',
    'zab_g_',
    'zab_',
    'zPersonalization',
  ],
  js: function () {
    'use strict';

    if (
      redacto.user.zohoPageSenseProjectId === undefined ||
      redacto.user.zohoPageSenseScriptHash === undefined
    ) {
      return;
    }
    redacto.addScript(
      'https://cdn-eu.pagesense.io/js/' +
        redacto.user.zohoPageSenseProjectId +
        '/' +
        redacto.user.zohoPageSenseScriptHash +
        '.js'
    );
  },
};

// leadinfo
redacto.services.leadinfo = {
  key: 'leadinfo',
  type: 'analytic',
  name: 'Leadinfo',
  uri: 'https://www.leadinfo.com/en/privacy/',
  needConsent: true,
  cookies: ['_li_id', '_li_ses'],
  js: function () {
    'use strict';

    if (redacto.user.leadinfoId === undefined) {
      return;
    }

    window.GlobalLeadinfoNamespace = window.GlobalLeadinfoNamespace || [];
    window.GlobalLeadinfoNamespace.push('leadinfo');
    window['leadinfo'] = function () {
      (window['leadinfo'].q = window['leadinfo'].q || []).push(arguments);
    };
    window['leadinfo'].t = window['leadinfo'].t || redacto.user.leadinfoId;
    window['leadinfo'].q = window['leadinfo'].q || [];

    redacto.addScript('https://cdn.leadinfo.net/ping.js');
  },
};

// force24
redacto.services.force24 = {
  key: 'force24',
  type: 'analytic',
  name: 'Force24',
  uri: 'https://support.force24.co.uk/support/solutions/articles/79000128057-cookie-policies',
  needConsent: true,
  cookies: ['F24_autoID', 'F24_personID'],
  js: function () {
    'use strict';

    if (
      redacto.user.force24trackingId === undefined ||
      redacto.user.force24clientId === undefined
    ) {
      return;
    }

    (window.Force24Object = 'f24'),
      (window['f24'] =
        window['f24'] ||
        function () {
          (window['f24'].q = window['f24'].q || []),
            window['f24'].q.push(arguments);
        }),
      (window['f24'].l = 1 * new Date());

    redacto.addScript(
      'https://static.websites.data-crypt.com/scripts/activity/v3/inject-v3.min.js'
    );

    f24('config', 'set_tracking_id', redacto.user.force24trackingId);
    f24('config', 'set_client_id', redacto.user.force24clientId);
  },
};

// tiktokvideo
redacto.services.tiktokvideo = {
  key: 'tiktokvideo',
  type: 'video',
  name: 'Tiktok Video',
  uri: 'https://www.tiktok.com/legal/page/eea/privacy-policy/en',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    redacto.addScript('https://www.tiktok.com/embed.js');
  },
  fallback: function () {
    'use strict';
    var id = 'tiktokvideo';
    redacto.fallback(['tiktok-embed'], function (elem) {
      return redacto.engage(id);
    });
  },
};

// shinystat
redacto.services.shinystat = {
  key: 'shinystat',
  type: 'analytic',
  name: 'Shinystat',
  uri: 'https://www.shinystat.com/en/opt-out.html',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.shinystatUser === undefined) {
      return;
    }

    redacto.addScript(
      'https://codice.shinystat.com/cgi-bin/getcod.cgi?USER=' +
        redacto.user.shinystatUser
    );
  },
};

// activecampaignvgo
redacto.services.activecampaignvgo = {
  key: 'activecampaignvgo',
  type: 'other',
  name: 'Active Campaign',
  uri: 'https://www.activecampaign.com/legal/privacy-policy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.activecampaignAccount === undefined) {
      return;
    }

    window.visitorGlobalObjectAlias = 'vgo';
    window[window.visitorGlobalObjectAlias] =
      window[window.visitorGlobalObjectAlias] ||
      function () {
        (window[window.visitorGlobalObjectAlias].q =
          window[window.visitorGlobalObjectAlias].q || []).push(arguments);
      };
    window[window.visitorGlobalObjectAlias].l = new Date().getTime();

    redacto.addScript(
      'https://diffuser-cdn.app-us1.com/diffuser/diffuser.js',
      '',
      function () {
        vgo('setAccount', redacto.user.activecampaignAccount);
        vgo('setTrackByDefault', true);
        vgo('process');
      }
    );
  },
};

// Brevo (formerly sendinblue)
redacto.services.sendinblue = {
  key: 'sendinblue',
  type: 'other',
  name: 'Brevo (formerly sendinblue)',
  uri: 'https://www.brevo.com/fr/legal/cookies/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.sendinblueKey === undefined) {
      return;
    }

    window.sib = { equeue: [], client_key: redacto.user.sendinblueKey };
    window.sendinblue = {};
    for (
      var j = ['track', 'identify', 'trackLink', 'page'], i = 0;
      i < j.length;
      i++
    ) {
      (function (k) {
        window.sendinblue[k] = function () {
          var arg = Array.prototype.slice.call(arguments);
          (
            window.sib[k] ||
            function () {
              var t = {};
              t[k] = arg;
              window.sib.equeue.push(t);
            }
          )(arg[0], arg[1], arg[2], arg[3]);
        };
      })(j[i]);
    }

    redacto.addScript(
      'https://sibautomation.com/sa.js?key=' + window.sib.client_key,
      'sendinblue-js',
      function () {
        window.sendinblue.page();
      }
    );
  },
};

// collectchat
redacto.services.collectchat = {
  key: 'collectchat',
  type: 'other',
  name: 'Collect Chat',
  uri: 'https://collect.chat/privacy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.collectchatId === undefined) {
      return;
    }

    window.CollectId = redacto.user.collectchatId;

    redacto.addScript('https://collectcdn.com/launcher.js');
  },
};

// eulerian
redacto.services.eulerian = {
  key: 'eulerian',
  type: 'analytic',
  name: 'Eulerian',
  uri: 'https://www.eulerian.com/rgpd',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.eulerianHost === undefined) {
      return;
    }

    (function (e, a) {
      var i = e.length,
        y = 5381,
        k = 'script',
        s = window,
        v = document,
        o = v.createElement(k);
      for (; i; ) {
        i -= 1;
        y = (y * 33) ^ e.charCodeAt(i);
      }
      y = '_EA_' + (y >>>= 0);
      (function (e, a, s, y) {
        s[a] =
          s[a] ||
          function () {
            (s[y] = s[y] || []).push(arguments);
            s[y].eah = e;
          };
      })(e, a, s, y);
      i = (new Date() / 1e7) | 0;
      o.ea = y;
      y = i % 26;
      o.async = 1;
      o.src =
        '//' +
        e +
        '/' +
        String.fromCharCode(97 + y, 122 - y, 65 + y) +
        (i % 1e3) +
        '.js?2';
      s = v.getElementsByTagName(k)[0];
      s.parentNode.insertBefore(o, s);
    })(redacto.user.eulerianHost, 'EA_push');
    EA_push();
  },
};

// posthog
redacto.services.posthog = {
  key: 'posthog',
  type: 'other',
  name: 'Posthog',
  uri: 'https://posthog.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.posthogApiKey === undefined ||
      redacto.user.posthogHost === undefined
    ) {
      return;
    }

    !(function (t, e) {
      var o, n, p, r;
      e.__SV ||
        ((window.posthog = e),
        (e._i = []),
        (e.init = function (i, s, a) {
          function g(t, e) {
            var o = e.split('.');
            2 == o.length && ((t = t[o[0]]), (e = o[1])),
              (t[e] = function () {
                t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
              });
          }
          ((p = t.createElement('script')).type = 'text/javascript'),
            (p.async = !0),
            (p.src = s.api_host + '/static/array.js'),
            (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(
              p,
              r
            );
          var u = e;
          for (
            void 0 !== a ? (u = e[a] = []) : (a = 'posthog'),
              u.people = u.people || [],
              u.toString = function (t) {
                var e = 'posthog';
                return (
                  'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e
                );
              },
              u.people.toString = function () {
                return u.toString(1) + '.people (stub)';
              },
              o =
                'capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags'.split(
                  ' '
                ),
              n = 0;
            n < o.length;
            n++
          )
            g(u, o[n]);
          e._i.push([i, s, a]);
        }),
        (e.__SV = 1));
    })(document, window.posthog || []);

    posthog.init(redacto.user.posthogApiKey, {
      api_host: redacto.user.posthogHost,
    });
  },
};

// googlesignin
redacto.services.googlesignin = {
  key: 'googlesignin',
  type: 'other',
  name: 'Google Signin',
  uri: 'https://policies.google.com/technologies/cookies#types-of-cookies',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    redacto.addScript('https://accounts.google.com/gsi/client');
  },
};

// calendly
redacto.services.calendly = {
  key: 'calendly',
  type: 'other',
  name: 'Calendly',
  uri: 'https://calendly.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['calendly-inline-widget'], '');
    redacto.addScript('https://assets.calendly.com/assets/external/widget.js');
  },
  fallback: function () {
    'use strict';
    var id = 'calendly';
    redacto.fallback(['calendly-inline-widget'], function (elem) {
      return redacto.engage(id);
    });
  },
};

// tolkai
redacto.services.tolkai = {
  key: 'tolkai',
  type: 'other',
  name: 'tolk.ai',
  uri: 'https://www.tolk.ai/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.tolkaiBot === undefined) {
      return;
    }

    window.tcfbot = redacto.user.tolkaiBot;
    window.TcfWbchtParams = { behaviour: 'default' };
    window.display = 'iframe';
    redacto.addScript('https://script.tolk.ai/iframe-latest.js');
  },
};

// kwanko
redacto.services.kwanko = {
  key: 'kwanko',
  type: 'ads',
  name: 'Kwanko',
  uri: 'https://www.kwanko.com/fr/rgpd/politique-gestion-donnees/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tac_kwanko'], function (x) {
      var mclic = redacto.getElemAttr(x, 'data-mclic');

      return (
        '<img src="https://action.metaffiliation.com/trk.php?mclic=' +
        mclic +
        '" width="1" height="1" />'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'kwanko';
    redacto.fallback(['tac_kwanko'], function (elem) {
      return redacto.engage(id);
    });
  },
};

// leadforensics
redacto.services.leadforensics = {
  key: 'leadforensics',
  type: 'ads',
  name: 'Lead Forensics',
  uri: 'https://www.leadforensics.com/cookie-policy/',
  needConsent: true,
  cookies: ['ifuuid'],
  js: function () {
    'use strict';
    if (redacto.user.leadforensicsId === undefined) {
      return;
    }

    redacto.addScript(
      'https://secure.team8save.com/js/sc/' +
        redacto.user.leadforensicsId +
        '.js'
    );
  },
};

// ubib
redacto.services.ubib = {
  key: 'ubib',
  type: 'support',
  name: 'Ubib Chatbot',
  uri: 'https://ubib.libanswers.com/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.ubibId === undefined ||
      redacto.user.ubibHash === undefined
    ) {
      return;
    }

    redacto.addScript(
      'https://' +
        redacto.user.ubibId +
        '.libanswers.com/load_chat.php?hash=' +
        redacto.user.ubibHash
    );
  },
};

// wysistathightrack
redacto.services.wysistathightrack = {
  key: 'wysistathightrack',
  type: 'analytic',
  name: 'Wysistat (privacy by design)',
  uri: 'https://www.wysistat.net/webanalytics/exemption-cnil/',
  needConsent: false,
  cookies: ['wysistat'],
  js: function () {
    'use strict';

    if (redacto.user.wysistatNom === undefined) {
      return;
    }

    window._wsq = window._wsq || [];
    window._wsq.push(['_setNom', redacto.user.wysistatNom]);
    window._wsq.push(['_wysistat']);

    redacto.addScript('https://www.wysistat.com/ws.jsa');
  },
};

// robofabrica
redacto.services.robofabrica = {
  key: 'robofabrica',
  type: 'support',
  name: 'Robo Fabrica Chatbot',
  uri: 'https://robofabrica.tech/charte-vie-privee/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.robofabricaUuid === undefined) {
      return;
    }

    redacto.addScript(
      'https://app.robofabrica.tech/widget/script',
      'inceptive-cw-script',
      function () {
        document
          .getElementById('inceptive-cw-script')
          .setAttribute('unique-url', redacto.user.robofabricaUuid);
        document
          .getElementById('inceptive-cw-script')
          .setAttribute('label', 'start');
        document
          .getElementById('inceptive-cw-script')
          .setAttribute('launch-btn-id', 'inceptive-cw-launch');
        document
          .getElementById('inceptive-cw-script')
          .setAttribute('chat-server-url', 'https://app.robofabrica.tech:443');
      }
    );
  },
};

// trustpilot
redacto.services.trustpilot = {
  key: 'trustpilot',
  type: 'other',
  name: 'Trustpilot',
  uri: 'https://fr.legal.trustpilot.com/for-reviewers/end-user-privacy-terms',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['trustpilot-widget'], '');
    redacto.addScript(
      'https://widget.trustpilot.com/bootstrap/v5/tp.widget.sync.bootstrap.min.js'
    );
  },
  fallback: function () {
    'use strict';
    var id = 'trustpilot';
    redacto.fallback(['trustpilot-widget'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'data-style-width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'data-style-height')
      );
      return redacto.engage(id);
    });
  },
};

// snapchat
redacto.services.snapchat = {
  key: 'snapchat',
  type: 'analytic',
  name: 'Snapchat',
  uri: 'https://snap.com/fr-FR/privacy/privacy-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.snapchatId === undefined) {
      return;
    }

    var a = (window.snaptr = function () {
      a.handleRequest
        ? a.handleRequest.apply(a, arguments)
        : a.queue.push(arguments);
    });
    a.queue = [];

    if (redacto.user.snapchatEmail === undefined) {
      window.snaptr('init', redacto.user.snapchatId);
    } else {
      window.snaptr('init', redacto.user.snapchatId, {
        user_email: redacto.user.snapchatEmail,
      });
    }
    window.snaptr('track', 'PAGE_VIEW');

    redacto.addScript('https://sc-static.net/scevent.min.js');

    if (typeof redacto.user.snapchatMore === 'function') {
      redacto.user.snapchatMore();
    }
  },
};

// antvoice
redacto.services.antvoice = {
  key: 'antvoice',
  type: 'ads',
  name: 'antvoice',
  uri: 'https://www.antvoice.com/fr/privacy-policy/',
  needConsent: true,
  cookies: ['antvoice'],
  js: function () {
    'use strict';

    if (redacto.user.antvoiceId === undefined) {
      return;
    }

    window.avDataLayer = window.avDataLayer || [];
    window.avtag =
      window.avtag ||
      function (_cmd, _p) {
        window.avDataLayer.push({ cmd: _cmd, p: _p });
      };
    window.avtag('setConsent', { consent: true });
    window.avtag('init', { id: redacto.user.antvoiceId });

    redacto.addScript('https://static.avads.net/avtag.min.js');
  },
};

// plausible
redacto.services.plausible = {
  key: 'plausible',
  type: 'analytic',
  name: 'Plausible',
  uri: 'https://plausible.io/privacy',
  needConsent: false,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.plausibleDomain === undefined) {
      return;
    }

    if (redacto.user.plausibleEndpoint === undefined) {
      redacto.user.plausibleEndpoint = 'plausible.io';
    }

    redacto.addScript(
      'https://' + redacto.user.plausibleEndpoint + '/js/script.js',
      '',
      '',
      '',
      'data-domain',
      redacto.user.plausibleDomain
    );
  },
};

// videas
redacto.services.videas = {
  key: 'videas',
  type: 'video',
  name: 'Videas',
  uri: 'https://videas.fr/fr/legal',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tac_videas'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Videas iframe',
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        id = redacto.getElemAttr(x, 'data-id'),
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="https://app.videas.fr/embed/' +
        id +
        '/" style="' +
        styleAttr +
        '" allowtransparency ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'videas';
    redacto.fallback(['tac_videas'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// myfeelback
redacto.services.myfeelback = {
  key: 'myfeelback',
  type: 'api',
  name: 'MyFeelBack (Skeepers)',
  uri: 'https://help.myfeelback.com/fr/quels-sont-les-cookies-d%C3%A9pos%C3%A9s-par-un-dispositif-de-collecte-myfeelback',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.myfeelbackId === undefined) {
      return;
    }

    window._Mfb_useCookie = true;
    window._Mfb_ud = {
      var1: undefined,
      var2: undefined,
      varN: undefined,
      _context: {
        lang: undefined,
        privacyMode: false,
        _page: {
          url: location.pathname,
          storageDuration: 30,
        },
      },
    };
    redacto.addScript(
      'https://actorssl-5637.kxcdn.com/actor/' +
        redacto.user.myfeelbackId +
        '/action',
      'MFBActor'
    );
  },
};

// arcio
redacto.services.arcio = {
  key: 'arcio',
  type: 'api',
  name: 'Arc.io',
  uri: 'https://arc.io/about',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.arcId === undefined) {
      return;
    }

    redacto.addScript('https://arc.io/widget.min.js#' + redacto.user.arcId);
  },
};

// doubleclick
redacto.services.doubleclick = {
  key: 'doubleclick',
  type: 'ads',
  name: 'DoubleClick',
  uri: 'https://support.google.com/admanager/answer/2839090',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['doubleclick_container'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Doubleclick iframe',
        id1 = redacto.getElemAttr(x, 'data-id1'),
        id2 = redacto.getElemAttr(x, 'data-id2'),
        type = redacto.getElemAttr(x, 'data-type'),
        cat = redacto.getElemAttr(x, 'data-cat'),
        item = redacto.getElemAttr(x, 'data-item'),
        quantity = redacto.getElemAttr(x, 'data-quantity'),
        price = redacto.getElemAttr(x, 'data-price'),
        postage = redacto.getElemAttr(x, 'data-postage'),
        seller = redacto.getElemAttr(x, 'data-seller'),
        gdpr = redacto.getElemAttr(x, 'data-gdpr'),
        gdpr_consent = redacto.getElemAttr(x, 'data-gdpr-consent'),
        ord = redacto.getElemAttr(x, 'data-ord'),
        num = redacto.getElemAttr(x, 'data-num');

      return (
        '<iframe title="' +
        frame_title +
        '" src="https://' +
        id1 +
        '.fls.doubleclick.net/activityi;src=' +
        id2 +
        ';type=' +
        type +
        ';cat=' +
        cat +
        ';item=' +
        item +
        ';quantity=' +
        quantity +
        ';price=' +
        price +
        ';postage=' +
        postage +
        ';seller=' +
        seller +
        ';gdpr=' +
        gdpr +
        ';gdpr_consent=' +
        gdpr_consent +
        ';num=' +
        num +
        ';ord=' +
        ord +
        '?" style="width:1px;height:1px;display:none"></iframe>'
      );
    });
  },
};

// userpilot
redacto.services.userpilot = {
  key: 'userpilot',
  type: 'analytic',
  name: 'UserPilot',
  uri: 'https://userpilot.com/privacy-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.userpilotToken === undefined) {
      return;
    }

    window.userpilotSettings = { token: redacto.user.userpilotToken };
    redacto.addScript('https://js.userpilot.io/sdk/latest.js');
  },
};

redacto.services.piwikpro = {
  key: 'piwikpro',
  type: 'analytic',
  name: 'Piwik Pro',
  uri: 'https://piwik.pro/privacy-policy/',
  needConsent: true,
  cookies: [
    '_pk_ref',
    '_pk_cvar',
    '_pk_id',
    '_pk_ses',
    '_pk_hsr',
    'piwik_ignore',
    '_pk_uid',
  ],
  js: function () {
    'use strict';
    if (
      redacto.user.piwikProId === undefined ||
      redacto.user.piwikProContainer === undefined
    ) {
      return;
    }

    (window['dataLayer'] = window['dataLayer'] || []),
      window['dataLayer'].push({
        start: new Date().getTime(),
        event: 'stg.start',
      });

    function stgCreateCookie(a, b, c) {
      var d = '';
      if (c) {
        var e = new Date();
        e.setTime(e.getTime() + 24 * c * 60 * 60 * 1e3),
          (d = '; expires=' + e.toUTCString());
      }
      document.cookie = a + '=' + b + d + '; path=/';
    }

    var isStgDebug =
      (window.location.href.match('stg_debug') ||
        document.cookie.match('stg_debug')) &&
      !window.location.href.match('stg_disable_debug');
    stgCreateCookie('stg_debug', isStgDebug ? 1 : '', isStgDebug ? 14 : -1);
    var qP = [];

    var qPString = qP.length > 0 ? '?' + qP.join('&') : '';
    redacto.addScript(
      'https://' +
        redacto.user.piwikProContainer +
        '.containers.piwik.pro/' +
        redacto.user.piwikProId +
        '.js' +
        qPString
    );

    !(function (a, n, i) {
      a[n] = a[n] || {};
      for (var c = 0; c < i.length; c++)
        !(function (i) {
          (a[n][i] = a[n][i] || {}),
            (a[n][i].api =
              a[n][i].api ||
              function () {
                var a = [].slice.call(arguments, 0);
                'string' == typeof a[0] &&
                  window['dataLayer'].push({
                    event: n + '.' + i + ':' + a[0],
                    parameters: [].slice.call(arguments, 1),
                  });
              });
        })(i[c]);
    })(window, 'ppms', ['tm', 'cm']);
  },
};

// pinterestpixel
redacto.services.pinterestpixel = {
  key: 'pinterestpixel',
  type: 'ads',
  name: 'Pinterest Pixel',
  uri: 'https://help.pinterest.com/fr/business/article/track-conversions-with-pinterest-tag',
  needConsent: true,
  cookies: [
    '_pinterest_sess',
    '_pinterest_ct',
    '_pinterest_ct_mw',
    '_pinterest_ct_rt',
    '_epik',
    '_derived_epik',
    '_pin_unauth',
    '_pinterest_ct_ua',
  ],
  js: function () {
    'use strict';

    if (redacto.user.pinterestpixelId === undefined) {
      return;
    }

    if (!window.pintrk) {
      window.pintrk = function () {
        window.pintrk.queue.push(Array.prototype.slice.call(arguments));
      };

      var n = window.pintrk;
      n.queue = [];
      n.version = '3.0';

      redacto.addScript('https://s.pinimg.com/ct/core.js', '', function () {
        window.pintrk('load', redacto.user.pinterestpixelId);
        window.pintrk('page');
      });
    }
  },
};

// elfsight
redacto.services.elfsight = {
  key: 'elfsight',
  type: 'support',
  name: 'Elfsight',
  uri: 'https://elfsight.com/privacy-policy/',
  needConsent: true,
  cookies: ['__cfduid', '_p_hfp_client_id', 'session_id'],
  js: function () {
    'use strict';

    redacto.addScript('https://apps.elfsight.com/p/platform.js');
  },
};

// plezi
redacto.services.plezi = {
  key: 'plezi',
  type: 'analytic',
  name: 'Plezi',
  uri: 'https://www.plezi.co/fr/mentions-legales/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.pleziTenant === undefined ||
      redacto.user.pleziTw === undefined
    ) {
      return;
    }

    redacto.addScript(
      'https://brain.plezi.co/api/v1/analytics?tenant=' +
        redacto.user.pleziTenant +
        '&tw=' +
        redacto.user.pleziTw
    );
  },
};

// smartsupp
redacto.services.smartsupp = {
  key: 'smartsupp',
  type: 'support',
  name: 'Smartsupp',
  uri: 'https://www.smartsupp.com/help/privacy/',
  needConsent: true,
  cookies: ['ssupp.vid', 'ssupp.visits', 'AWSALB', 'AWSALBCORS'],
  js: function () {
    'use strict';

    if (redacto.user.smartsuppKey === undefined) {
      return;
    }

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = redacto.user.smartsuppKey;
    window.smartsupp = function () {
      window.smartsupp._.push(arguments);
    };
    window.smartsupp._ = [];

    redacto.addScript('https://www.smartsuppchat.com/loader.js');
  },
};

// sharpspring
redacto.services.sharpspring = {
  key: 'sharpspring',
  type: 'analytic',
  name: 'SharpSpring',
  uri: 'https://sharpspring.com/legal/sharpspring-cookie-policy/',
  needConsent: true,
  cookies: ['koitk', '__ss', '__ss_tk', '__ss_referrer'],
  js: function () {
    'use strict';

    if (
      redacto.user.ssId === undefined ||
      redacto.user.ssAccount === undefined
    ) {
      return;
    }

    window._ss = window._ss || [];
    window._ss.push([
      '_setDomain',
      'https://' + redacto.user.ssId + '.marketingautomation.services/net',
    ]);
    window._ss.push(['_setAccount', redacto.user.ssAccount]);
    window._ss.push(['_trackPageView']);

    window._pa = window._pa || {};

    redacto.addScript(
      'https://' +
        redacto.user.ssId +
        '.marketingautomation.services/client/ss.js'
    );
  },
};

// pardot
redacto.services.pardot = {
  key: 'pardot',
  type: 'analytic',
  name: 'Pardot',
  uri: 'https://www.salesforce.com/company/privacy/full_privacy/',
  needConsent: true,
  cookies: ['visitor_id'],
  js: function () {
    'use strict';
    if (redacto.user.piAId === undefined || redacto.user.piCId === undefined) {
      return;
    }

    window.piAId = redacto.user.piAId;
    window.piCId = redacto.user.piCId;
    window.piHostname = 'pi.pardot.com';

    redacto.addScript('https://pi.pardot.com/pd.js');
  },
};

// Open Web Analytics
redacto.services.openwebanalytics = {
  key: 'openwebanalytics',
  type: 'analytic',
  name: 'Open Web Analytics',
  uri: '',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.openwebanalyticsId === undefined ||
      redacto.user.openwebanalyticsHost === undefined
    ) {
      return;
    }

    window.owa_baseUrl = redacto.user.openwebanalyticsHost;
    window.owa_cmds = window.owa_cmds || [];
    window.owa_cmds.push(['setSiteId', redacto.user.openwebanalyticsId]);
    window.owa_cmds.push(['trackPageView']);
    window.owa_cmds.push(['trackClicks']);

    redacto.addScript(
      window.owa_baseUrl + 'modules/base/js/owa.tracker-combined-min.js'
    );
  },
};

// xandr universal pixel
// https://docs.xandr.com/bundle/invest_invest-standard/page/topics/universal-pixel-overview.html
redacto.services.xandr = {
  key: 'xandr',
  type: 'ads',
  name: 'Xandr (Universal)',
  uri: 'https://www.xandr.com/privacy/cookie-policy/',
  needConsent: true,
  cookies: ['uuid2', 'uids', 'sess', 'icu', 'anj', 'usersync'],
  js: function () {
    'use strict';
    if (redacto.user.xandrId === undefined) {
      return;
    }

    if (!window.pixie) {
      var n = (window.pixie = function (e, i, a) {
        n.actionQueue.push({
          action: e,
          actionValue: i,
          params: a,
        });
      });
      n.actionQueue = [];
    }

    redacto.addScript(
      'https://acdn.adnxs.com/dmp/up/pixie.js',
      '',
      function () {
        window.pixie('init', redacto.user.xandrId);
        window.pixie('event', 'PageView');
      }
    );
  },
};

// xandr segment
// https://docs.xandr.com/bundle/invest_invest-standard/page/topics/segment-pixels-advanced.html
redacto.services.xandrsegment = {
  key: 'xandrsegment',
  type: 'ads',
  name: 'Xandr (Segment)',
  uri: 'https://www.xandr.com/privacy/cookie-policy/',
  needConsent: true,
  cookies: ['uuid2', 'uids', 'sess', 'icu', 'anj', 'usersync'],
  js: function () {
    'use strict';
    var uniqIds = [],
      i,
      uri;

    redacto.fallback(['xandrsegment-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      return (
        '<div id="' +
        uniqId +
        '" xandrsegmentAdd="' +
        redacto.getElemAttr(x, 'xandrsegmentAdd') +
        '" xandrsegmentAddCode="' +
        redacto.getElemAttr(x, 'xandrsegmentAddCode') +
        '" xandrsegmentRemove="' +
        redacto.getElemAttr(x, 'xandrsegmentRemove') +
        '" xandrsegmentRemoveCode="' +
        redacto.getElemAttr(x, 'xandrsegmentRemoveCode') +
        '" xandrsegmentMember="' +
        redacto.getElemAttr(x, 'xandrsegmentMember') +
        '" xandrsegmentRedir="' +
        redacto.getElemAttr(x, 'xandrsegmentRedir') +
        '" xandrsegmentValue="' +
        redacto.getElemAttr(x, 'xandrsegmentValue') +
        '" xandrsegmentOther="' +
        redacto.getElemAttr(x, 'xandrsegmentOther') +
        '"></div>'
      );
    });

    for (i = 0; i < uniqIds.length; i += 1) {
      uri = '//ib.adnxs.com/seg?t=2&';
      uri +=
        'add=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrsegmentAdd'
        ) +
        '&';
      uri +=
        'add_code=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrsegmentAddCode'
        ) +
        '&';
      uri +=
        'remove=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrsegmentRemove'
        ) +
        '&';
      uri +=
        'remove_code=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrsegmentRemoveCode'
        ) +
        '&';
      uri +=
        'member=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrsegmentMember'
        ) +
        '&';
      uri +=
        'redir=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrsegmentRedir'
        ) +
        '&';
      uri +=
        'value=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrsegmentValue'
        ) +
        '&';
      uri +=
        'other=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrsegmentOther'
        );

      document.getElementById(uniqIds[i]).innerHTML =
        "<img src='" + uri + "' width='1' height='1' />";
    }
  },
  fallback: function () {
    'use strict';
    var id = 'xandrsegment';
    redacto.fallback(['xandrsegment-canvas'], redacto.engage(id));
  },
};

// xandr conversion
// https://docs.xandr.com/bundle/invest_invest-standard/page/topics/working-with-conversion-pixels.html
redacto.services.xandrconversion = {
  key: 'xandrconversion',
  type: 'ads',
  name: 'Xandr (Conversion)',
  uri: 'https://www.xandr.com/privacy/cookie-policy/',
  needConsent: true,
  cookies: ['uuid2', 'uids', 'sess', 'icu', 'anj', 'usersync'],
  js: function () {
    'use strict';
    var uniqIds = [],
      i,
      uri;

    redacto.fallback(['xandrconversion-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      return (
        '<div id="' +
        uniqId +
        '" xandrconversionId="' +
        redacto.getElemAttr(x, 'xandrconversionId') +
        '" xandrconversionSeg="' +
        redacto.getElemAttr(x, 'xandrconversionSeg') +
        '" xandrconversionOrderId="' +
        redacto.getElemAttr(x, 'xandrconversionOrderId') +
        '" xandrconversionValue="' +
        redacto.getElemAttr(x, 'xandrconversionValue') +
        '" xandrconversionRedir="' +
        redacto.getElemAttr(x, 'xandrconversionRedir') +
        '" xandrconversionOther="' +
        redacto.getElemAttr(x, 'xandrconversionOther') +
        '"></div>'
      );
    });

    for (i = 0; i < uniqIds.length; i += 1) {
      uri = '//ib.adnxs.com/px?t=2&';
      uri +=
        'id=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrconversionId'
        ) +
        '&';
      uri +=
        'seg=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrconversionSeg'
        ) +
        '&';
      uri +=
        'order_id=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrconversionOrderId'
        ) +
        '&';
      uri +=
        'value=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrconversionValue'
        ) +
        '&';
      uri +=
        'redir=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrconversionRedir'
        ) +
        '&';
      uri +=
        'other=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'xandrconversionOther'
        );

      document.getElementById(uniqIds[i]).innerHTML =
        "<img src='" + uri + "' width='1' height='1' />";
    }
  },
  fallback: function () {
    'use strict';
    var id = 'xandrconversion';
    redacto.fallback(['xandrconversion-canvas'], redacto.engage(id));
  },
};

// helloasso
redacto.services.helloasso = {
  key: 'helloasso',
  type: 'api',
  name: 'HelloAsso',
  uri: 'https://www.helloasso.com/confidentialite',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tac_helloasso'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'HelloAsso iframe',
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        url = redacto.getElemAttr(x, 'data-url'),
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" id="haWidget" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowtransparency ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'helloasso';
    redacto.fallback(['tac_helloasso'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// podcloud
redacto.services.podcloud = {
  key: 'podcloud',
  type: 'video',
  name: 'podCloud',
  uri: 'https://podcloud.fr/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tac_podcloud'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'podCloud iframe',
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        url = redacto.getElemAttr(x, 'data-url'),
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowtransparency ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'podcloud';
    redacto.fallback(['tac_podcloud'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// facebookpost
redacto.services.facebookpost = {
  key: 'facebookpost',
  type: 'social',
  name: 'Facebook (post)',
  uri: 'https://www.facebook.com/policy.php',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tac_facebookpost'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Facebook iframe',
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        url = redacto.getElemAttr(x, 'data-url'),
        appId = redacto.getElemAttr(x, 'data-appid'),
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen'),
        showText = redacto.getElemAttr(x, 'data-show-text');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="https://www.facebook.com/plugins/post.php?href=' +
        encodeURIComponent(url) +
        '&amp;width=' +
        width +
        '&amp;show_text=false&amp;appId=' +
        appId +
        '&amp;show_text=' +
        showText +
        '&amp;height=' +
        height +
        '" style="' +
        styleAttr +
        '" allowtransparency ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'facebookpost';
    redacto.fallback(['tac_facebookpost'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// amplitude
redacto.services.amplitude = {
  key: 'amplitude',
  type: 'analytic',
  name: 'Amplitude',
  uri: 'https://amplitude.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.amplitude === undefined) {
      return;
    }
    redacto.addScript(
      'https://cdn.amplitude.com/libs/amplitude-5.8.0-min.gz.js',
      '',
      function () {
        window.amplitude = {
          _q: [],
          _iq: {},
        };
        function s(e, t) {
          e.prototype[t] = function () {
            this._q.push([t].concat(Array.prototype.slice.call(arguments, 0)));
            return this;
          };
        }
        var o = function () {
          this._q = [];
          return this;
        };
        var a = [
          'add',
          'append',
          'clearAll',
          'prepend',
          'set',
          'setOnce',
          'unset',
        ];
        for (var u = 0; u < a.length; u++) {
          s(o, a[u]);
        }
        amplitude.Identify = o;
        var c = function () {
          this._q = [];
          return this;
        };
        var l = [
          'setProductId',
          'setQuantity',
          'setPrice',
          'setRevenueType',
          'setEventProperties',
        ];
        for (var p = 0; p < l.length; p++) {
          s(c, l[p]);
        }
        amplitude.Revenue = c;
        var d = [
          'init',
          'logEvent',
          'logRevenue',
          'setUserId',
          'setUserProperties',
          'setOptOut',
          'setVersionName',
          'setDomain',
          'setDeviceId',
          'enableTracking',
          'setGlobalUserProperties',
          'identify',
          'clearUserProperties',
          'setGroup',
          'logRevenueV2',
          'regenerateDeviceId',
          'groupIdentify',
          'onInit',
          'logEventWithTimestamp',
          'logEventWithGroups',
          'setSessionId',
          'resetSessionId',
        ];
        function v(e) {
          function t(t) {
            e[t] = function () {
              e._q.push([t].concat(Array.prototype.slice.call(arguments, 0)));
            };
          }
          for (var n = 0; n < d.length; n++) {
            t(d[n]);
          }
        }
        v(amplitude);
        amplitude.getInstance = function (e) {
          e = (!e || e.length === 0 ? '$default_instance' : e).toLowerCase();
          if (!amplitude._iq.hasOwnProperty(e)) {
            amplitude._iq[e] = { _q: [] };
            v(amplitude._iq[e]);
          }
          return amplitude._iq[e];
        };

        amplitude.getInstance().init(redacto.user.amplitude);
      }
    );
  },
};

// abtasty
redacto.services.abtasty = {
  key: 'abtasty',
  type: 'api',
  name: 'ABTasty',
  uri: 'https://www.abtasty.com/terms-of-use/',
  needConsent: true,
  cookies: ['ABTasty', 'ABTastySession'],
  js: function () {
    'use strict';
    if (redacto.user.abtastyID === undefined) {
      return;
    }
    redacto.addScript('//try.abtasty.com/' + redacto.user.abtastyID + '.js');
  },
};

// yandex metrica
redacto.services.metrica = {
  key: 'metrica',
  type: 'analytic',
  name: 'Yandex Metrica',
  uri: 'https://yandex.com/legal/confidential/',
  needConsent: true,
  cookies: [
    '_ym_metrika_enabled',
    '_ym_isad',
    '_ym_uid',
    '_ym_d',
    'yabs-sid',
    '_ym_debug',
    '_ym_mp2_substs',
    '_ym_hostIndex',
    '_ym_mp2_track',
    'yandexuid',
    'usst',
  ],
  js: function () {
    'use strict';
    if (redacto.user.yandexmetrica === undefined) {
      return;
    }
    redacto.addScript('https://mc.yandex.ru/metrika/tag.js', '', function () {
      (function (m, e, t, r, i, k, a) {
        m[i] =
          m[i] ||
          function () {
            (m[i].a = m[i].a || []).push(arguments);
          };
        m[i].l = 1 * new Date();
        (k = e.createElement(t)),
          (a = e.getElementsByTagName(t)[0]),
          (k.async = 1),
          (k.src = r),
          a.parentNode.insertBefore(k, a);
      })(
        window,
        document,
        'script',
        'https://mc.yandex.ru/metrika/tag.js',
        'ym'
      );

      ym(redacto.user.yandexmetrica, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: 'dataLayer',
      });
    });
  },
};

// addthis
redacto.services.addthis = {
  key: 'addthis',
  type: 'social',
  name: 'AddThis',
  uri: 'https://www.addthis.com/privacy/privacy-policy#publisher-visitors',
  needConsent: true,
  cookies: ['__atuvc', '__atuvs'],
  js: function () {
    'use strict';
    if (redacto.user.addthisPubId === undefined) {
      return;
    }
    if (redacto.isAjax === true) {
      window.addthis = null;
      window._adr = null;
      window._atc = null;
      window._atd = null;
      window._ate = null;
      window._atr = null;
      window._atw = null;
    }
    redacto.fallback(['addthis_inline_share_toolbox'], '');
    redacto.addScript(
      '//s7.addthis.com/js/300/addthis_widget.js#pubid=' +
        redacto.user.addthisPubId
    );
  },
  fallback: function () {
    'use strict';
    var id = 'addthis';
    redacto.fallback(['addthis_inline_share_toolbox'], redacto.engage(id));
  },
};

// addtoanyfeed
redacto.services.addtoanyfeed = {
  key: 'addtoanyfeed',
  type: 'social',
  name: 'AddToAny (feed)',
  uri: 'https://www.addtoany.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.addtoanyfeedUri === undefined) {
      return;
    }
    redacto.user.addtoanyfeedSubscribeLink =
      'https://www.addtoany.com/subscribe?linkurl=' +
      redacto.user.addtoanyfeedUri;
    window.a2a_config = window.a2a_config || {};
    window.a2a_config.linkurl = redacto.user.addtoanyfeedUri;
    redacto.addScript('//static.addtoany.com/menu/feed.js');
  },
  fallback: function () {
    'use strict';
    redacto.user.addtoanyfeedSubscribeLink =
      'https://www.addtoany.com/subscribe?linkurl=' +
      redacto.user.addtoanyfeedUri;
  },
};

// addtoanyshare
redacto.services.addtoanyshare = {
  key: 'addtoanyshare',
  type: 'social',
  name: 'AddToAny (share)',
  uri: 'https://www.addtoany.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(
      ['tac_addtoanyshare'],
      function (elem) {
        elem.remove();
      },
      true
    );
    redacto.addScript('//static.addtoany.com/menu/page.js');
  },
  fallback: function () {
    'use strict';
    var id = 'addtoanyshare';
    redacto.fallback(['tac_addtoanyshare'], redacto.engage(id));
  },
};

// aduptech ads
redacto.services.aduptech_ads = {
  key: 'aduptech_ads',
  type: 'ads',
  name: 'Ad Up Technology (ads)',
  uri: 'https://www.adup-tech.com/datenschutz',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    var IDENTIFIER = 'aduptech_ads',
      API_URL = 'https://s.d.adup-tech.com/jsapi';

    var elements = document.getElementsByClassName(IDENTIFIER);
    if (!elements || elements.length === 0) {
      return;
    }

    redacto.fallback([IDENTIFIER], '');

    redacto.addScript(API_URL, '', function () {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        if (!redacto.getElemAttr(element, 'id')) {
          element.setAttribute(
            'id',
            IDENTIFIER + Math.random().toString(36).substr(2, 9)
          );
        }

        window.uAd.embed(redacto.getElemAttr(element, 'id'), {
          placementKey: redacto.getElemAttr(element, 'placementKey'),
          responsive: Boolean(redacto.getElemAttr(element, 'responsive')),
          lazy: Boolean(redacto.getElemAttr(element, 'lazy')),
          adtest: Boolean(redacto.getElemAttr(element, 'test')),
          query: redacto.getElemAttr(element, 'query') || '',
          minCpc: redacto.getElemAttr(element, 'minCpc') || '',
          pageUrl: redacto.getElemAttr(element, 'pageUrl') || '',
          skip: redacto.getElemAttr(element, 'skip') || '',
        });
      }
    });
  },
  fallback: function () {
    'use strict';
    redacto.fallback(['aduptech_ads'], redacto.engage('aduptech_ads'));
  },
};

// aduptech conversion
redacto.services.aduptech_conversion = {
  key: 'aduptech_conversion',
  type: 'ads',
  name: 'Ad Up Technology (conversion)',
  uri: 'https://www.adup-tech.com/datenschutz',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    var IDENTIFIER = 'aduptech_conversion',
      CONVERSION_PIXEL_BASE_URL = 'https://d.adup-tech.com/campaign/conversion';

    var elements = document.getElementsByClassName(IDENTIFIER);
    if (!elements || elements.length === 0) {
      return;
    }

    redacto.fallback([IDENTIFIER], '');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];

      if (
        !redacto.getElemAttr(element, 'advertiserId') ||
        !redacto.getElemAttr(element, 'conversionCode')
      ) {
        continue;
      }

      var url =
        CONVERSION_PIXEL_BASE_URL +
        '/' +
        encodeURIComponent(redacto.getElemAttr(element, 'advertiserId')) +
        '?t=' +
        encodeURIComponent(redacto.getElemAttr(element, 'conversionCode'));

      if (redacto.getElemAttr(element, 'price')) {
        url +=
          '&price=' + encodeURIComponent(redacto.getElemAttr(element, 'price'));
      }

      if (redacto.getElemAttr(element, 'quantity')) {
        url +=
          '&quantity=' +
          encodeURIComponent(redacto.getElemAttr(element, 'quantity'));
      }

      if (redacto.getElemAttr(element, 'total')) {
        url +=
          '&total=' + encodeURIComponent(redacto.getElemAttr(element, 'total'));
      }

      if (redacto.getElemAttr(element, 'orderId')) {
        url +=
          '&order_id=' +
          encodeURIComponent(redacto.getElemAttr(element, 'orderId'));
      }

      if (redacto.getElemAttr(element, 'itemNumber')) {
        url +=
          '&item_number=' +
          encodeURIComponent(redacto.getElemAttr(element, 'itemNumber'));
      }

      if (redacto.getElemAttr(element, 'description')) {
        url +=
          '&description=' +
          encodeURIComponent(redacto.getElemAttr(element, 'description'));
      }

      new Image().src = url;
    }
  },
};

// aduptech retargeting
redacto.services.aduptech_retargeting = {
  key: 'aduptech_retargeting',
  type: 'ads',
  name: 'Ad Up Technology (retargeting)',
  uri: 'https://www.adup-tech.com/datenschutz',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    var IDENTIFIER = 'aduptech_retargeting',
      API_URL = 'https://s.d.adup-tech.com/services/retargeting.js';

    var elements = document.getElementsByClassName(IDENTIFIER);
    if (!elements || elements.length === 0) {
      return;
    }

    redacto.fallback([IDENTIFIER], '');

    window.AdUpRetargeting = function (api) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        api.init();

        api.setAccount(redacto.getElemAttr(element, 'account'));

        if (redacto.getElemAttr(element, 'email')) {
          api.setEmail(redacto.getElemAttr(element, 'email'));
        } else if (redacto.getElemAttr(element, 'hashedEmail')) {
          api.setHashedEmail(redacto.getElemAttr(element, 'hashedEmail'));
        }

        if (redacto.getElemAttr(element, 'product')) {
          try {
            api.setProduct(JSON.parse(redacto.getElemAttr(element, 'product')));
          } catch (e) {
            api.setProduct(redacto.getElemAttr(element, 'product'));
          }
        }

        if (redacto.getElemAttr(element, 'transaction')) {
          try {
            api.setTransaction(
              JSON.parse(redacto.getElemAttr(element, 'transaction'))
            );
          } catch (e) {
            api.setTransaction(redacto.getElemAttr(element, 'transaction'));
          }
        }

        if (redacto.getElemAttr(element, 'demarkUser')) {
          api.setDemarkUser();
        } else if (redacto.getElemAttr(element, 'demarkProducts')) {
          api.setDemarkProducts();
        }

        if (redacto.getElemAttr(element, 'conversionCode')) {
          api.setConversionCode(redacto.getElemAttr(element, 'conversionCode'));
        }

        if (redacto.getElemAttr(element, 'device')) {
          var setter =
            'set' +
            redacto.getElemAttr(element, 'device').charAt(0).toUpperCase() +
            redacto.getElemAttr(element, 'device').slice(1);
          if (typeof api[setter] === 'function') {
            api[setter]();
          }
        }

        if (redacto.getElemAttr(element, 'track')) {
          var tracker =
            'track' +
            redacto.getElemAttr(element, 'track').charAt(0).toUpperCase() +
            redacto.getElemAttr(element, 'track').slice(1);
          if (typeof api[tracker] === 'function') {
            api[tracker]();
          } else {
            api.trackHomepage();
          }
        }
      }
    };

    redacto.addScript(API_URL);
  },
};

// alexa
redacto.services.alexa = {
  key: 'alexa',
  type: 'analytic',
  name: 'Alexa',
  uri: 'https://www.alexa.com/help/privacy',
  needConsent: true,
  cookies: ['__asc', '__auc'],
  js: function () {
    'use strict';
    if (redacto.user.alexaAccountID === undefined) {
      return;
    }
    window._atrk_opts = {
      atrk_acct: redacto.user.alexaAccountID,
      domain: window.location.hostname.match(/[^\.]*\.[^.]*$/)[0],
      dynamic: true,
    };
    redacto.addScript('https://d31qbv1cthcecs.cloudfront.net/atrk.js');
  },
};

// amazon
redacto.services.amazon = {
  key: 'amazon',
  type: 'ads',
  name: 'Amazon',
  uri: 'https://www.amazon.com/gp/help/customer/display.html/?ie=UTF8&nodeId=201909010',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['amazon_product'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Amazon iframe',
        amazonId = redacto.getElemAttr(x, 'amazonid'),
        productId = redacto.getElemAttr(x, 'productid'),
        url =
          '//ws-eu.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=' +
          redacto.getLanguage().toUpperCase() +
          '&source=ss&ref=ss_til&ad_type=product_link&tracking_id=' +
          amazonId +
          '&marketplace=amazon&region=' +
          redacto.getLanguage().toUpperCase() +
          '&placement=' +
          productId +
          '&asins=' +
          productId +
          '&show_border=true&link_opens_in_new_window=true',
        iframe =
          '<iframe title="' +
          frame_title +
          '" style="width:120px;height:240px;" src="' +
          url +
          '"></iframe>';

      return iframe;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'amazon';
    redacto.fallback(['amazon_product'], redacto.engage(id));
  },
};

// calameo
redacto.services.calameo = {
  key: 'calameo',
  type: 'video',
  name: 'Calameo',
  uri: 'https://fr.calameo.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['calameo-canvas'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Calameo iframe',
        id = redacto.getElemAttr(x, 'data-id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        url = '//v.calameo.com/?bkcode=' + id,
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowtransparency ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'calameo';
    redacto.fallback(['calameo-canvas'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// calameolibrary
redacto.services.calameolibrary = {
  key: 'calameolibrary',
  type: 'video',
  name: 'Calameo Library',
  uri: 'https://fr.calameo.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['calameolibrary-canvas'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Calameo iframe',
        id = redacto.getElemAttr(x, 'data-id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        url = '//v.calameo.com/library/?type=subscription&id=' + id,
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowtransparency ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'calameolibrary';
    redacto.fallback(['calameolibrary-canvas'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// clicky
redacto.services.clicky = {
  key: 'clicky',
  type: 'analytic',
  name: 'Clicky',
  uri: 'https://clicky.com/terms',
  needConsent: true,
  cookies: [
    '_jsuid',
    '_eventqueue',
    '_referrer_og',
    '_utm_og',
    '_first_pageview',
    'clicky_olark',
    'no_trackyy_' + redacto.user.clickyId,
    'unpoco_' + redacto.user.clickyId,
    'heatmaps_g2g_' + redacto.user.clickyId,
  ],
  js: function () {
    'use strict';
    if (redacto.user.clickyId === undefined) {
      return;
    }
    redacto.addScript('//static.getclicky.com/js', '', function () {
      if (typeof clicky.init === 'function') {
        clicky.init(redacto.user.clickyId);
      }
      if (typeof redacto.user.clickyMore === 'function') {
        redacto.user.clickyMore();
      }
    });
  },
};

// clicmanager
redacto.services.clicmanager = {
  key: 'clicmanager',
  type: 'ads',
  name: 'Clicmanager',
  uri: 'https://www.clicmanager.fr/infos_legales.php',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    var uniqIds = [],
      i,
      uri;

    redacto.fallback(['clicmanager-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      return (
        '<div id="' +
        uniqId +
        '" c="' +
        redacto.getElemAttr(x, 'c') +
        '" s="' +
        redacto.getElemAttr(x, 's') +
        '" t="' +
        redacto.getElemAttr(x, 't') +
        '"></div>'
      );
    });

    for (i = 0; i < uniqIds.length; i += 1) {
      uri = '//ads.clicmanager.fr/exe.php?';
      uri +=
        'c=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'c') +
        '&';
      uri +=
        's=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 's') +
        '&';
      uri +=
        't=' + redacto.getElemAttr(document.getElementById(uniqIds[i]), 't');

      redacto.makeAsync.init(uri, uniqIds[i]);
    }
  },
  fallback: function () {
    'use strict';
    var id = 'clicmanager';
    redacto.fallback(['clicmanager-canvas'], redacto.engage(id));
  },
};

// compteur
redacto.services.compteur = {
  key: 'compteur',
  type: 'analytic',
  name: 'Compteur.fr',
  uri: 'https://www.compteur.fr/help_privacy_policy.htm',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.compteurID === undefined) {
      return;
    }
    redacto.addScript('https://server2.compteur.fr/log7.js', '', function () {
      wtslog7(redacto.user.compteurID, 1);
    });
  },
};

// contentsquare
redacto.services.contentsquare = {
  key: 'contentsquare',
  type: 'analytic',
  name: 'ContentSquare',
  uri: 'https://docs.contentsquare.com/uxa-en/#collected-data',
  needConsent: true,
  cookies: ['_cs_id', '_cs_s', '_cs_vars', '_cs_ex', '_cs_c', '_cs_optout'],
  js: function () {
    'use strict';
    if (redacto.user.contentsquareID === undefined) {
      return;
    }
    redacto.addScript(
      '//t.contentsquare.net/uxa/' + redacto.user.contentsquareID + '.js'
    );
  },
};

// crazyegg
redacto.services.crazyegg = {
  key: 'crazyegg',
  type: 'analytic',
  name: 'Crazy Egg',
  uri: 'https://www.crazyegg.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.crazyeggId === undefined) {
      return;
    }

    redacto.addScript(
      '//script.crazyegg.com/pages/scripts/' +
        redacto.user.crazyeggId.substr(0, 4) +
        '/' +
        redacto.user.crazyeggId.substr(4, 4) +
        '.js'
    );
  },
};

// clarity
redacto.services.clarity = {
  key: 'clarity',
  type: 'analytic',
  name: 'Clarity',
  uri: 'https://clarity.microsoft.com/',
  needConsent: true,
  cookies: ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM'],
  js: function () {
    'use strict';

    if (redacto.user.clarity === undefined) {
      return;
    }

    window['clarity'] =
      window['clarity'] ||
      function () {
        (window['clarity'].q = window['clarity'].q || []).push(arguments);
      };

    redacto.addScript(
      'https://www.clarity.ms/tag/' + redacto.user.clarity,
      '',
      function () {
        window['clarity']('consent');
      }
    );
  },
  fallback: function () {
    if (redacto.parameters.bingConsentMode === true) {
      if (redacto.parameters.softConsentMode === false) {
        this.js();
      }
    }
  },
};

// criteo
redacto.services.criteo = {
  key: 'criteo',
  type: 'ads',
  name: 'Criteo',
  uri: 'https://www.criteo.com/privacy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    document.MAX_ct0 = '';
    var uniqIds = [],
      i,
      uri;

    redacto.fallback(['criteo-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      return (
        '<div id="' +
        uniqId +
        '" zoneid="' +
        redacto.getElemAttr(x, 'zoneid') +
        '"></div>'
      );
    });

    for (i = 0; i < uniqIds.length; i += 1) {
      uri = '//cas.criteo.com/delivery/ajs.php?';
      uri +=
        'zoneid=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'zoneid');
      uri += '&nodis=1&cb=' + Math.floor(Math.random() * 99999999999);
      uri += '&loc=' + encodeURI(window.location);
      uri += document.MAX_used !== ',' ? '&exclude=' + document.MAX_used : '';
      uri +=
        document.charset !== undefined ? '&charset=' + document.charset : '';
      uri +=
        document.characterSet !== undefined
          ? '&charset=' + document.characterSet
          : '';
      uri +=
        document.referrer !== undefined
          ? '&referer=' + encodeURI(document.referrer)
          : '';
      uri +=
        document.context !== undefined
          ? '&context=' + encodeURI(document.context)
          : '';
      uri +=
        document.MAX_ct0 !== undefined &&
        document.MAX_ct0.substring(0, 4) === 'http'
          ? '&ct0=' + encodeURI(document.MAX_ct0)
          : '';
      uri += document.mmm_fo !== undefined ? '&mmm_fo=1' : '';

      redacto.makeAsync.init(uri, uniqIds[i]);
    }
  },
  fallback: function () {
    'use strict';
    var id = 'criteo';
    redacto.fallback(['criteo-canvas'], redacto.engage(id));
  },
};

// criteo onetag
redacto.services.criteoonetag = {
  key: 'criteoonetag',
  type: 'ads',
  name: 'Criteo OneTag',
  uri: 'https://www.criteo.com/privacy/',
  needConsent: true,
  cookies: ['uid', 'tk', 'uid3pd'],
  js: function () {
    'use strict';
    if (redacto.user.criteoonetagAccount === undefined) return;

    window.criteo_q = window.criteo_q || [];
    window.criteo_q.push({
      event: 'setAccount',
      account: redacto.user.criteoonetagAccount,
    });

    redacto.addScript('//static.criteo.net/js/ld/ld.js', '', function () {
      if (typeof redacto.user.criteoonetagMore === 'function') {
        redacto.user.criteoonetagMore();
      }
    });
  },
};

// artetv
redacto.services.artetv = {
  key: 'artetv',
  type: 'video',
  name: 'Arte.tv',
  uri: 'https://www.arte.tv/sites/fr/corporate/donnees-personnelles/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['artetv_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Arte.tv iframe',
        video_json = redacto.getElemAttr(x, 'json'),
        video_width = redacto.getElemAttr(x, 'width'),
        video_height = redacto.getElemAttr(x, 'height'),
        video_frame,
        video_allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen');

      if (video_json === '') {
        return '';
      }

      var styleAttr =
        (video_width !== ''
          ? 'width:' + redacto.getStyleSize(video_width) + ';'
          : '') +
        (video_height !== ''
          ? 'height:' + redacto.getStyleSize(video_height) + ';'
          : '');

      video_frame =
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        'transition-duration: 0; transition-property: no; margin: 0 auto; position: relative; display: block; background-color: #000000;" src="https://www.arte.tv/player/v5/index.php?json_url=' +
        video_json +
        '" ' +
        (video_allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>';
      return video_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'artetv';
    redacto.fallback(['artetv_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// dailymotion
redacto.services.dailymotion = {
  key: 'dailymotion',
  type: 'video',
  name: 'Dailymotion',
  uri: 'https://www.dailymotion.com/legal/privacy',
  needConsent: true,
  cookies: ['ts', 'dmvk', 'hist', 'v1st', 's_vi'],
  js: function () {
    'use strict';
    redacto.fallback(['dailymotion_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Dailymotion iframe',
        video_id = redacto.getElemAttr(x, 'videoID'),
        video_width = redacto.getElemAttr(x, 'width'),
        video_height = redacto.getElemAttr(x, 'height'),
        styleAttr = '',
        video_frame,
        embed_type = redacto.getElemAttr(x, 'embedType'),
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen'),
        showinfo = redacto.getElemAttr(x, 'showinfo'),
        autoplay = redacto.getElemAttr(x, 'autoplay'),
        api = redacto.getElemAttr(x, 'api'),
        params = 'info=' + showinfo + '&autoPlay=' + autoplay + '&api=' + api;

      if (video_id === '') {
        return '';
      }
      if (video_width !== '') {
        styleAttr += 'width:' + redacto.getStyleSize(video_width) + ';';
      }
      if (video_height !== undefined) {
        styleAttr += 'height:' + redacto.getStyleSize(video_height) + ';';
      }
      if (embed_type === '' || !['video', 'playlist'].includes(embed_type)) {
        embed_type = 'video';
      }
      video_frame =
        '<iframe title="' +
        frame_title +
        '" src="//www.dailymotion.com/embed/' +
        embed_type +
        '/' +
        video_id +
        '?' +
        params +
        '" style="' +
        styleAttr +
        '" ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>';
      return video_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'dailymotion';
    redacto.fallback(['dailymotion_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// dating affiliation
redacto.services.datingaffiliation = {
  key: 'datingaffiliation',
  type: 'ads',
  name: 'Dating Affiliation',
  uri: 'https://www.dating-affiliation.com/conditions-generales.php',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['datingaffiliation-canvas'], function (x) {
      var frame_title =
          redacto.getElemAttr(x, 'title') || 'Dating Affiliation iframe',
        comfrom = redacto.getElemAttr(x, 'data-comfrom'),
        r = redacto.getElemAttr(x, 'data-r'),
        p = redacto.getElemAttr(x, 'data-p'),
        cf0 = redacto.getElemAttr(x, 'data-cf0'),
        langue = redacto.getElemAttr(x, 'data-langue'),
        forward_affiliate = redacto.getElemAttr(x, 'data-forwardAffiliate'),
        cf2 = redacto.getElemAttr(x, 'data-cf2'),
        cfsa2 = redacto.getElemAttr(x, 'data-cfsa2'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        url = 'https://www.tools-affil2.com/rotaban/ban.php?' + comfrom;

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '&r=' +
        r +
        '&p=' +
        p +
        '&cf0=' +
        cf0 +
        '&langue=' +
        langue +
        '&forward_affiliate=' +
        forward_affiliate +
        '&cf2=' +
        cf2 +
        '&cfsa2=' +
        cfsa2 +
        '" style="' +
        styleAttr +
        '"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'datingaffiliation';
    redacto.fallback(['datingaffiliation-canvas'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// dating affiliation popup
redacto.services.datingaffiliationpopup = {
  key: 'datingaffiliationpopup',
  type: 'ads',
  name: 'Dating Affiliation (Pop Up)',
  uri: 'https://www.dating-affiliation.com/conditions-generales.php',
  needConsent: true,
  cookies: [
    '__utma',
    '__utmb',
    '__utmc',
    '__utmt_Tools',
    '__utmv',
    '__utmz',
    '_ga',
    '_gat',
    '_gat_UA-65072040-17',
    '__da-pu-xflirt-ID-pc-o169',
  ],
  js: function () {
    'use strict';
    var uniqIds = [],
      i,
      uri;

    redacto.fallback(['datingaffiliationpopup-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      return (
        '<div id="' +
        uniqId +
        '" uri="' +
        redacto.getElemAttr(x, 'uri') +
        '" comfrom="' +
        redacto.getElemAttr(x, 'comfrom') +
        '" promo="' +
        redacto.getElemAttr(x, 'promo') +
        '" productid="' +
        redacto.getElemAttr(x, 'productid') +
        '" submitconfig="' +
        redacto.getElemAttr(x, 'submitconfig') +
        '" ur="' +
        redacto.getElemAttr(x, 'ur') +
        '" brand="' +
        redacto.getElemAttr(x, 'brand') +
        '" lang="' +
        redacto.getElemAttr(x, 'lang') +
        '" cf0="' +
        redacto.getElemAttr(x, 'cf0') +
        '" cf2="' +
        redacto.getElemAttr(x, 'cf2') +
        '" subid1="' +
        redacto.getElemAttr(x, 'subid1') +
        '" cfsa2="' +
        redacto.getElemAttr(x, 'cfsa2') +
        '" subid2="' +
        redacto.getElemAttr(x, 'subid2') +
        '" nicheid="' +
        redacto.getElemAttr(x, 'nicheid') +
        '" degreid="' +
        redacto.getElemAttr(x, 'degreid') +
        '" bt="' +
        redacto.getElemAttr(x, 'bt') +
        '" vis="' +
        redacto.getElemAttr(x, 'vis') +
        '" hid="' +
        redacto.getElemAttr(x, 'hid') +
        '" snd="' +
        redacto.getElemAttr(x, 'snd') +
        '" aabd="' +
        redacto.getElemAttr(x, 'aabd') +
        '" aabs="' +
        redacto.getElemAttr(x, 'aabs') +
        '"></div>'
      );
    });

    for (i = 0; i < uniqIds.length; i += 1) {
      uri = 'https://www.promotools.biz/da/popunder/script.php?';
      uri +=
        'comfrom=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'comfrom') +
        '&';
      uri +=
        'promo=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'promo') +
        '&';
      uri +=
        'product_id=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'productid') +
        '&';
      uri +=
        'submitconfig=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'submitconfig'
        ) +
        '&';
      uri +=
        'ur=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'ur') +
        '&';
      uri +=
        'brand=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'brand') +
        '&';
      uri +=
        'lang=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'lang') +
        '&';
      uri +=
        'cf0=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'cf0') +
        '&';
      uri +=
        'cf2=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'cf2') +
        '&';
      uri +=
        'subid1=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'subid1') +
        '&';
      uri +=
        'cfsa2=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'cfsa2') +
        '&';
      uri +=
        'subid2=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'subid2') +
        '&';
      uri +=
        'nicheId=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'nicheid') +
        '&';
      uri +=
        'degreId=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'degreid') +
        '&';
      uri +=
        'bt=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'bt') +
        '&';
      uri +=
        'vis=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'vis') +
        '&';
      uri +=
        'hid=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'hid') +
        '&';
      uri +=
        'snd=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'snd') +
        '&';
      uri +=
        'aabd=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'aabd') +
        '&';
      uri +=
        'aabs=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'aabs');

      redacto.makeAsync.init(uri, uniqIds[i]);
    }
  },
  fallback: function () {
    'use strict';
    var id = 'datingaffiliationpopup';
    redacto.fallback(['datingaffiliationpopup-canvas'], redacto.engage(id));
  },
};

// deezer
redacto.services.deezer = {
  key: 'deezer',
  type: 'video',
  name: 'Deezer',
  uri: 'https://www.deezer.com/legal/personal-datas',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['deezer_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Deezer iframe',
        deezer_id = redacto.getElemAttr(x, 'deezerID'),
        deezer_width = redacto.getElemAttr(x, 'width'),
        deezer_height = redacto.getElemAttr(x, 'height'),
        styleAttr = '',
        deezer_frame,
        embed_theme = redacto.getElemAttr(x, 'theme'),
        embed_type = redacto.getElemAttr(x, 'embedType'),
        radius = redacto.getElemAttr(x, 'radius'),
        tracklist = redacto.getElemAttr(x, 'tracklist'),
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen'),
        params;

      if (deezer_id === '') {
        return '';
      }
      if (deezer_width !== '') {
        styleAttr += 'width:' + redacto.getStyleSize(deezer_width) + ';';
      }
      if (deezer_height !== '') {
        styleAttr += 'height:' + redacto.getStyleSize(deezer_height) + ';';
      }
      if (
        embed_theme === '' ||
        !['auto', 'light', 'dark'].includes(embed_theme)
      ) {
        embed_theme = 'auto';
      }
      if (
        embed_type === '' ||
        !['album', 'track', 'playlist'].includes(embed_type)
      ) {
        embed_type = 'album';
      }
      if (radius === '' || !['true', 'false'].includes(radius)) {
        radius = 'true';
      }
      if (tracklist === '' || !['true', 'false'].includes(tracklist)) {
        tracklist = 'true';
      }
      params = 'tracklist=' + tracklist + '&radius=' + radius;
      deezer_frame =
        '<iframe title="' +
        frame_title +
        '" src="//widget.deezer.com/widget/' +
        embed_theme +
        '/' +
        embed_type +
        '/' +
        deezer_id +
        '?' +
        params +
        '" style="' +
        styleAttr +
        '" ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>';
      return deezer_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'deezer';
    redacto.fallback(['deezer_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// leadforensicsold
redacto.services.leadforensicsold = {
  key: 'leadforensicsold',
  type: 'analytic',
  name: 'LeadForensics',
  uri: 'https://www.leadforensics.com/privacy-policy/',
  needConsent: true,
  cookies: ['trackalyzer'],
  js: function () {
    'use strict';
    if (
      redacto.user.leadforensicsSf14gv === undefined ||
      redacto.user.leadforensicsIidentifier === undefined
    ) {
      return;
    }

    window.sf14gv = redacto.user.leadforensicsSf14gv;

    (function () {
      var sf14g = document.createElement('script');
      sf14g.async = true;
      sf14g.src =
        ('https:' == document.location.protocol ? 'https://' : 'http://') +
        't.sf14g.com/sf14g.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(sf14g, s);
    })();

    redacto.addScript(
      '//secure.leadforensics.com/js/' +
        redacto.user.leadforensicsIidentifier +
        '.js'
    );
  },
};

// disqus
redacto.services.disqus = {
  key: 'disqus',
  type: 'comment',
  name: 'Disqus',
  uri: 'https://help.disqus.com/customer/portal/articles/466259-privacy-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.disqusShortname === undefined) {
      return;
    }
    redacto.addScript(
      '//' + redacto.user.disqusShortname + '.disqus.com/embed.js'
    );
    redacto.addScript(
      '//' + redacto.user.disqusShortname + '.disqus.com/count.js'
    );
  },
  fallback: function () {
    'use strict';
    var id = 'disqus';

    if (document.getElementById('disqus_thread')) {
      document.getElementById('disqus_thread').innerHTML = redacto.engage(id);
    }
  },
};

// ekomi
redacto.services.ekomi = {
  key: 'ekomi',
  type: 'social',
  name: 'eKomi',
  uri: 'https://www.ekomi-us.com/us/privacy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.ekomiCertId === undefined) {
      return;
    }
    window.eKomiIntegrationConfig = [{ certId: redacto.user.ekomiCertId }];
    redacto.addScript(
      '//connect.ekomi.de/integration_1410173009/' +
        redacto.user.ekomiCertId +
        '.js'
    );
  },
};

// etracker
redacto.services.etracker = {
  key: 'etracker',
  type: 'analytic',
  name: 'eTracker',
  uri: 'https://www.etracker.com/en/data-protection.html',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.etracker === undefined) {
      return;
    }

    redacto.addScript(
      '//static.etracker.com/code/e.js',
      '_etLoader',
      function () {},
      true,
      'data-secure-code',
      redacto.user.etracker
    );
  },
};

// facebook
redacto.services.facebook = {
  key: 'facebook',
  type: 'social',
  name: 'Facebook',
  uri: 'https://www.facebook.com/policy.php',
  needConsent: true,
  cookies: ['xs', 'sb', 'fr', 'datr', 'dpr', 'c_user'],
  js: function () {
    'use strict';
    redacto.fallback(
      [
        'fb-post',
        'fb-follow',
        'fb-activity',
        'fb-send',
        'fb-share-button',
        'fb-like',
        'fb-video',
      ],
      ''
    );
    redacto.addScript(
      '//connect.facebook.net/' +
        redacto.getLocale() +
        '/sdk.js#xfbml=1&version=v2.0',
      'facebook-jssdk'
    );
    if (redacto.isAjax === true) {
      if (typeof FB !== 'undefined') {
        FB.XFBML.parse();
      }
    }
  },
  fallback: function () {
    'use strict';
    var id = 'facebook';
    redacto.fallback(
      [
        'fb-post',
        'fb-follow',
        'fb-activity',
        'fb-send',
        'fb-share-button',
        'fb-like',
        'fb-video',
      ],
      redacto.engage(id)
    );
  },
};

// facebooklikebox
redacto.services.facebooklikebox = {
  key: 'facebooklikebox',
  type: 'social',
  name: 'Facebook (like box)',
  uri: 'https://www.facebook.com/policy.php',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['fb-like-box', 'fb-page'], '');
    redacto.addScript(
      '//connect.facebook.net/' +
        redacto.getLocale() +
        '/sdk.js#xfbml=1&version=v2.3',
      'facebook-jssdk'
    );
    if (redacto.isAjax === true) {
      if (typeof FB !== 'undefined') {
        FB.XFBML.parse();
      }
    }
  },
  fallback: function () {
    'use strict';
    var id = 'facebooklikebox';
    redacto.fallback(['fb-like-box', 'fb-page'], redacto.engage(id));
  },
};

// facebookcomment
redacto.services.facebookcomment = {
  key: 'facebookcomment',
  type: 'comment',
  name: 'Facebook (commentaire)',
  uri: 'https://www.facebook.com/policy.php',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['fb-comments'], '');
    redacto.addScript(
      '//connect.facebook.net/' +
        redacto.getLocale() +
        '/sdk.js#xfbml=1&version=v2.0',
      'facebook-jssdk'
    );
    if (redacto.isAjax === true) {
      if (typeof FB !== 'undefined') {
        FB.XFBML.parse();
      }
    }
  },
  fallback: function () {
    'use strict';
    var id = 'facebookcomment';
    redacto.fallback(['fb-comments'], redacto.engage(id));
  },
};

// ferank
redacto.services.ferank = {
  key: 'ferank',
  type: 'analytic',
  name: 'FERank',
  uri: 'https://www.ferank.fr/respect-vie-privee/#mesureaudience',
  needConsent: false,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript('//static.ferank.fr/pixel.js', '', function () {
      if (typeof redacto.user.ferankMore === 'function') {
        redacto.user.ferankMore();
      }
    });
  },
};

// pingdom
redacto.services.pingdom = {
  key: 'pingdom',
  type: 'api',
  name: 'Pingdom',
  uri: 'https://www.solarwinds.com/general-data-protection-regulation-cloud',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.pingdomId === undefined) {
      return;
    }

    window._prum = [
      ['id', redacto.user.pingdomId],
      ['mark', 'firstbyte', new Date().getTime()],
    ];

    redacto.addScript('https://rum-static.pingdom.net/prum.min.js');
  },
};

// simpleanalytics
redacto.services.simpleanalytics = {
  key: 'simpleanalytics',
  type: 'analytic',
  name: 'Simple Analytics',
  uri: 'https://docs.simpleanalytics.com/what-we-collect',
  needConsent: false,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript('https://scripts.simpleanalyticscdn.com/latest.js');
  },
};

// stonly
redacto.services.stonly = {
  key: 'stonly',
  type: 'api',
  name: 'Stonly (privacy by design)',
  uri: 'https://trust.stonly.com/',
  needConsent: false,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.stonlyId === undefined) {
      return;
    }

    window.STONLY_WID = redacto.user.stonlyId;
    window.StonlyWidget ||
      ((window.w = window.StonlyWidget =
        function () {
          window.w._api
            ? window.w._api.apply(window.w, arguments)
            : window.w.queue.push(arguments);
        }).queue = []);

    redacto.addScript(
      'https://stonly.com/js/widget/v2/stonly-widget.js?v=' + Date.now()
    );
  },
};

// stripe
/*redacto.services.stripe = {
    "key": "stripe",
    "type": "api",
    "name": "Stripe",
    "uri": "https://stripe.com/cookies-policy/legal",
    "needConsent": true,
    "cookies": [],
    "js": function () {
        "use strict";
        redacto.addScript('https://js.stripe.com/v3/');
    }
};*/

// ferank pub
redacto.services.ferankpub = {
  key: 'ferankpub',
  type: 'ads',
  name: 'FERank (pub)',
  uri: 'https://www.ferank.fr/respect-vie-privee/#regiepublicitaire',
  needConsent: false,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript('//static.ferank.fr/publicite.async.js');
    if (redacto.isAjax === true) {
      if (typeof ferankReady === 'function') {
        ferankReady();
      }
    }
  },
  fallback: function () {
    'use strict';
    var id = 'ferankpub';
    redacto.fallback(['ferank-publicite'], redacto.engage(id));
  },
};

// get+
redacto.services.getplus = {
  key: 'getplus',
  type: 'analytic',
  name: 'Get+',
  uri: 'https://www.getplus.fr/Conditions-generales-de-vente_a226.html',
  needConsent: true,
  cookies: [
    '_first_pageview',
    '_jsuid',
    'no_trackyy_' + redacto.user.getplusId,
    '_eventqueue',
  ],
  js: function () {
    'use strict';
    if (redacto.user.getplusId === undefined) {
      return;
    }

    window.webleads_site_ids = window.webleads_site_ids || [];
    window.webleads_site_ids.push(redacto.user.getplusId);
    redacto.addScript('//stats.webleads-tracker.com/js');
  },
};

// google+
redacto.services.gplus = {
  key: 'gplus',
  type: 'social',
  name: 'Google+',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript('https://apis.google.com/js/platform.js');
  },
  fallback: function () {
    'use strict';
    var id = 'gplus';
    redacto.fallback(['g-plus', 'g-plusone'], redacto.engage(id));
  },
};

// google+ badge
redacto.services.gplusbadge = {
  key: 'gplusbadge',
  type: 'social',
  name: 'Google+ (badge)',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript('https://apis.google.com/js/platform.js');
  },
  fallback: function () {
    'use strict';
    var id = 'gplusbadge';
    redacto.fallback(['g-page', 'g-person'], redacto.engage(id));
  },
};

// google adsense
redacto.services.adsense = {
  key: 'adsense',
  type: 'ads',
  name: 'Google Adsense',
  uri: 'https://adssettings.google.com/',
  needConsent: true,
  readmoreLink: 'https://policies.google.com/technologies/partner-sites',
  cookies: ['__gads'],
  js: function () {
    'use strict';
    redacto.fallback(['adsbygoogle'], '');
    redacto.addScript(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
    );
  },
  fallback: function () {
    'use strict';
    var id = 'adsense';
    redacto.fallback(['adsbygoogle'], redacto.engage(id));
  },
};

// google adsense automatic
redacto.services.adsenseauto = {
  key: 'adsenseauto',
  type: 'ads',
  name: 'Google Adsense Automatic',
  uri: 'https://adssettings.google.com/',
  needConsent: true,
  readmoreLink: 'https://policies.google.com/technologies/partner-sites',
  cookies: ['__gads'],
  js: function () {
    'use strict';

    if (redacto.user.adsensecapub === undefined) {
      return;
    }
    redacto.addScript(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
        redacto.user.adsensecapub,
      '',
      '',
      '',
      'crossorigin',
      'anonymous'
    );
  },
};

// Google Adsense Search
redacto.services.adsensesearch = {
  key: 'adsensesearch',
  type: 'ads',
  name: 'Google Adsense Search',
  uri: 'https://adssettings.google.com/',
  needConsent: true,
  readmoreLink: 'https://policies.google.com/technologies/partner-sites',
  cookies: ['__gads'],
  js: function () {
    'use strict';
    redacto.addScript('https://www.google.com/adsense/search/ads.js');
  },
  fallback: function () {
    'use strict';
    var id = 'adsensesearch';
    redacto.fallback(['afscontainer1'], redacto.engage(id));
  },
};

// google partners badge
redacto.services.googlepartners = {
  key: 'googlepartners',
  type: 'ads',
  name: 'Google Partners Badge',
  uri: 'https://adssettings.google.com/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript('https://apis.google.com/js/platform.js');
  },
  fallback: function () {
    'use strict';
    var id = 'googlepartners';
    redacto.fallback(['g-partnersbadge'], redacto.engage(id));
  },
};

// google adsense search (form)
redacto.services.adsensesearchform = {
  key: 'adsensesearchform',
  type: 'ads',
  name: 'Google Adsense Search (form)',
  uri: 'https://adssettings.google.com/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript(
      '//www.google.com/coop/cse/brand?form=cse-search-box&lang=' +
        redacto.getLanguage()
    );
  },
};

// google adsense search (result)
redacto.services.adsensesearchresult = {
  key: 'adsensesearchresult',
  type: 'ads',
  name: 'Google Adsense Search (result)',
  uri: 'https://adssettings.google.com/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.adsensesearchresultCx === undefined) {
      return;
    }
    redacto.addScript(
      '//www.google.com/cse/cse.js?cx=' + redacto.user.adsensesearchresultCx
    );
  },
  fallback: function () {
    'use strict';
    var id = 'adsensesearchresult';

    if (document.getElementById('gcse_searchresults')) {
      document.getElementById('gcse_searchresults').innerHTML =
        redacto.engage(id);
    }
  },
};

// googleadwordsconversion
redacto.services.googleadwordsconversion = {
  key: 'googleadwordsconversion',
  type: 'ads',
  name: 'Google Adwords (conversion)',
  uri: 'https://www.google.com/settings/ads',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.adwordsconversionId === undefined) {
      return;
    }

    redacto.addScript(
      '//www.googleadservices.com/pagead/conversion_async.js',
      '',
      function () {
        window.google_trackConversion({
          google_conversion_id: redacto.user.adwordsconversionId,
          google_conversion_label: redacto.user.adwordsconversionLabel,
          google_conversion_language: redacto.user.adwordsconversionLanguage,
          google_conversion_format: redacto.user.adwordsconversionFormat,
          google_conversion_color: redacto.user.adwordsconversionColor,
          google_conversion_value: redacto.user.adwordsconversionValue,
          google_conversion_currency: redacto.user.adwordsconversionCurrency,
          google_custom_params: {
            parameter1: redacto.user.adwordsconversionCustom1,
            parameter2: redacto.user.adwordsconversionCustom2,
          },
        });
      }
    );
  },
};

// googleadwordsremarketing
redacto.services.googleadwordsremarketing = {
  key: 'googleadwordsremarketing',
  type: 'ads',
  name: 'Google Adwords (remarketing)',
  uri: 'https://www.google.com/settings/ads',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.adwordsremarketingId === undefined) {
      return;
    }

    redacto.addScript(
      '//www.googleadservices.com/pagead/conversion_async.js',
      '',
      function () {
        window.google_trackConversion({
          google_conversion_id: redacto.user.adwordsremarketingId,
          google_remarketing_only: true,
        });
      }
    );
  },
};

// google analytics (old)
redacto.services.gajs = {
  key: 'gajs',
  type: 'analytic',
  name: 'Google Analytics (ga.js)',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: (function () {
    var googleIdentifier = redacto.user.gajsUa,
      tagUaCookie = '_gat_gtag_' + googleIdentifier,
      tagGCookie = '_ga_' + googleIdentifier;

    tagUaCookie = tagUaCookie.replace(/-/g, '_');
    tagGCookie = tagGCookie.replace(/G-/g, '');

    return [
      '_ga',
      '_gat',
      '_gid',
      '__utma',
      '__utmb',
      '__utmc',
      '__utmt',
      '__utmz',
      tagUaCookie,
      tagGCookie,
      '_gcl_au',
    ];
  })(),
  js: function () {
    'use strict';

    if (redacto.user.gajsUa === undefined) {
      return;
    }

    window._gaq = window._gaq || [];
    window._gaq.push(['_setAccount', redacto.user.gajsUa]);
    if (timeExpire !== undefined) {
      _gaq.push(['_setVisitorCookieTimeout', timeExpire]);
    }

    if (redacto.user.gajsAnonymizeIp) {
      window._gaq.push(['_gat._anonymizeIp']);
    }

    if (redacto.user.gajsPageView) {
      window._gaq.push(['_trackPageview, ' + redacto.user.gajsPageView]);
    } else {
      window._gaq.push(['_trackPageview']);
    }

    redacto.addScript('//www.google-analytics.com/ga.js', '', function () {
      if (typeof redacto.user.gajsMore === 'function') {
        redacto.user.gajsMore();
      }
    });
  },
};

// google analytics
redacto.services.analytics = {
  key: 'analytics',
  type: 'analytic',
  name: 'Google Analytics (universal)',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: (function () {
    var googleIdentifier = redacto.user.analyticsUa,
      tagUaCookie = '_gat_gtag_' + googleIdentifier,
      tagGCookie = '_ga_' + googleIdentifier;

    tagUaCookie = tagUaCookie.replace(/-/g, '_');
    tagGCookie = tagGCookie.replace(/G-/g, '');

    return [
      '_ga',
      '_gat',
      '_gid',
      '__utma',
      '__utmb',
      '__utmc',
      '__utmt',
      '__utmz',
      tagUaCookie,
      tagGCookie,
      '_gcl_au',
    ];
  })(),
  js: function () {
    'use strict';

    if (redacto.user.analyticsUa === undefined) {
      return;
    }

    window.GoogleAnalyticsObject = 'ga';
    window.ga =
      window.ga ||
      function () {
        window.ga.q = window.ga.q || [];
        window.ga.q.push(arguments);
      };
    window.ga.l = new Date();
    redacto.addScript(
      'https://www.google-analytics.com/analytics.js',
      '',
      function () {
        var uaCreate = {
          cookieExpires: timeExpire !== undefined ? timeExpire : 34128000,
        };
        redacto.extend(uaCreate, redacto.user.analyticsUaCreate || {});
        ga('create', redacto.user.analyticsUa, uaCreate);

        if (redacto.user.analyticsAnonymizeIp) {
          ga('set', 'anonymizeIp', true);
        }

        if (typeof redacto.user.analyticsPrepare === 'function') {
          redacto.user.analyticsPrepare();
        }

        if (redacto.user.analyticsPageView) {
          ga('send', 'pageview', redacto.user.analyticsPageView);
        } else {
          ga('send', 'pageview');
        }

        if (typeof redacto.user.analyticsMore === 'function') {
          redacto.user.analyticsMore();
        }
      }
    );
  },
};

// google ads
redacto.services.googleads = {
  key: 'googleads',
  type: 'ads',
  name: 'Google Ads',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: (function () {
    var googleIdentifier = redacto.user.googleadsId,
      tagUaCookie = '_gat_gtag_' + googleIdentifier,
      tagGCookie = '_ga_' + googleIdentifier;

    tagUaCookie = tagUaCookie.replace(/-/g, '_');
    tagGCookie = tagGCookie.replace(/G-/g, '');

    return [
      '_ga',
      '_gat',
      '_gid',
      '__utma',
      '__utmb',
      '__utmc',
      '__utmt',
      '__utmz',
      tagUaCookie,
      tagGCookie,
      '_gcl_au',
    ];
  })(),
  js: function () {
    'use strict';

    if (redacto.user.googleadsId === undefined) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    redacto.addScript(
      'https://www.googletagmanager.com/gtag/js?id=' + redacto.user.googleadsId,
      '',
      function () {
        window.gtag = function gtag() {
          dataLayer.push(arguments);
        };
        gtag('js', new Date());
        var additional_config_info =
          timeExpire !== undefined
            ? { anonymize_ip: true, cookie_expires: timeExpire / 1000 }
            : { anonymize_ip: true };

        gtag('config', redacto.user.googleadsId, additional_config_info);

        if (typeof redacto.user.googleadsMore === 'function') {
          redacto.user.googleadsMore();
        }
      }
    );
  },
  fallback: function () {
    if (redacto.parameters.googleConsentMode === true) {
      if (redacto.parameters.softConsentMode === false) {
        this.js();
      }
    }
  },
};

// google analytics
redacto.services.gtag = {
  key: 'gtag',
  type: 'analytic',
  name: 'Google Analytics (GA4)',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: (function () {
    var googleIdentifier = redacto.user.gtagUa,
      tagUaCookie = '_gat_gtag_' + googleIdentifier,
      tagGCookie = '_ga_' + googleIdentifier;

    tagUaCookie = tagUaCookie.replace(/-/g, '_');
    tagGCookie = tagGCookie.replace(/G-/g, '');

    return [
      '_ga',
      '_gat',
      '_gid',
      '__utma',
      '__utmb',
      '__utmc',
      '__utmt',
      '__utmz',
      tagUaCookie,
      tagGCookie,
      '_gcl_au',
    ];
  })(),
  js: function () {
    'use strict';

    if (redacto.user.gtagUa === undefined) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    redacto.addScript(
      'https://www.googletagmanager.com/gtag/js?id=' + redacto.user.gtagUa,
      '',
      function () {
        window.gtag = function gtag() {
          dataLayer.push(arguments);
        };
        gtag('js', new Date());
        var additional_config_info =
          timeExpire !== undefined
            ? { anonymize_ip: true, cookie_expires: timeExpire / 1000 }
            : { anonymize_ip: true };

        if (redacto.user.gtagCrossdomain) {
          /**
           * https://support.google.com/analytics/answer/7476333?hl=en
           * https://developers.google.com/analytics/devguides/collection/gtagjs/cross-domain
           */
          gtag('config', redacto.user.gtagUa, additional_config_info, {
            linker: { domains: redacto.user.gtagCrossdomain },
          });
        } else {
          gtag('config', redacto.user.gtagUa, additional_config_info);
        }

        if (typeof redacto.user.gtagMore === 'function') {
          redacto.user.gtagMore();
        }
      }
    );
  },
  fallback: function () {
    if (redacto.parameters.googleConsentMode === true) {
      if (redacto.parameters.softConsentMode === false) {
        this.js();
      }
    }
  },
};

redacto.services.firebase = {
  key: 'firebase',
  type: 'analytic',
  name: 'Firebase',
  uri: 'https://firebase.google.com/support/privacy',
  needConsent: true,
  cookies: (function () {
    var googleIdentifier = redacto.user.firebaseMeasurementId,
      tagGCookie = '_ga_' + googleIdentifier;

    tagGCookie = tagGCookie.replace(/G-/g, '');

    return ['_ga', tagGCookie];
  })(),
  js: function () {
    'use strict';

    if (redacto.user.firebaseApiKey === undefined) {
      return;
    }

    redacto.addScript(
      'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js',
      '',
      function () {
        redacto.addScript(
          'https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js',
          '',
          function () {
            var firebaseConfig = {
              apiKey: redacto.user.firebaseApiKey,
              authDomain: redacto.user.firebaseAuthDomain,
              databaseURL: redacto.user.firebaseDatabaseUrl,
              projectId: redacto.user.firebaseProjectId,
              storageBucket: redacto.user.firebaseStorageBucket,
              appId: redacto.user.firebaseAppId,
              measurementId: redacto.user.firebaseMeasurementId,
            };
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
          }
        );
      }
    );
  },
};

// genially
redacto.services.genially = {
  key: 'genially',
  type: 'api',
  name: 'genially',
  uri: 'https://www.genial.ly/cookies',
  needConsent: true,
  cookies: ['_gat', '_ga', '_gid'],
  js: function () {
    'use strict';

    redacto.fallback(['tac_genially'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'genially iframe',
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        geniallyid = redacto.getElemAttr(x, 'geniallyid'),
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe style="' +
        styleAttr +
        '" title="' +
        frame_title +
        '" src="https://view.genial.ly/' +
        geniallyid +
        '" allowtransparency ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'genially';
    redacto.fallback(['tac_genially'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// google maps
redacto.services.googlemaps = {
  key: 'googlemaps',
  type: 'api',
  name: 'Google Maps',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    var mapOptions,
      map,
      uniqIds = [],
      i;

    if (redacto.user.mapscallback === undefined) {
      redacto.user.mapscallback = 'tac_googlemaps_callback';
    }

    // Add Google Maps libraries if any (https://developers.google.com/maps/documentation/javascript/libraries)
    var googleMapsLibraries = '';
    if (redacto.user.googlemapsLibraries) {
      googleMapsLibraries = '&libraries=' + redacto.user.googlemapsLibraries;
    }

    redacto.addScript(
      '//maps.googleapis.com/maps/api/js?v=3.exp&key=' +
        redacto.user.googlemapsKey +
        '&callback=' +
        redacto.user.mapscallback +
        googleMapsLibraries
    );

    window.tac_googlemaps_callback = function () {
      redacto.fallback(['googlemaps-canvas'], function (x) {
        var uniqId = '_' + Math.random().toString(36).substr(2, 9);
        uniqIds.push(uniqId);
        return (
          '<div id="' +
          uniqId +
          '" zoom="' +
          redacto.getElemAttr(x, 'zoom') +
          '" latitude="' +
          redacto.getElemAttr(x, 'latitude') +
          '" longitude="' +
          redacto.getElemAttr(x, 'longitude') +
          '" style="width:' +
          redacto.getStyleSize(x.offsetWidth) +
          ';height:' +
          redacto.getStyleSize(x.offsetHeight) +
          '"></div>'
        );
      });

      var i;
      for (i = 0; i < uniqIds.length; i += 1) {
        mapOptions = {
          zoom: parseInt(
            redacto.getElemAttr(document.getElementById(uniqIds[i]), 'zoom'),
            10
          ),
          center: new google.maps.LatLng(
            parseFloat(
              redacto.getElemAttr(
                document.getElementById(uniqIds[i]),
                'latitude'
              ),
              10
            ),
            parseFloat(
              redacto.getElemAttr(
                document.getElementById(uniqIds[i]),
                'longitude'
              ),
              10
            )
          ),
        };
        map = new google.maps.Map(
          document.getElementById(uniqIds[i]),
          mapOptions
        );
        new google.maps.Marker({
          position: {
            lat: parseFloat(
              redacto.getElemAttr(
                document.getElementById(uniqIds[i]),
                'latitude'
              ),
              10
            ),
            lng: parseFloat(
              redacto.getElemAttr(
                document.getElementById(uniqIds[i]),
                'longitude'
              ),
              10
            ),
          },
          map: map,
        });
      }
    };
  },
  fallback: function () {
    'use strict';
    var id = 'googlemaps';
    redacto.fallback(['googlemaps-canvas'], redacto.engage(id));
  },
};

// googlemaps search
redacto.services.googlemapssearch = {
  key: 'googlemapssearch',
  type: 'api',
  name: 'Google Maps Search API',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: ['nid'],
  js: function () {
    'use strict';
    redacto.fallback(['googlemapssearch'], function (x) {
      var frame_title =
          redacto.getElemAttr(x, 'title') || 'Google search iframe',
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        // url = redacto.getElemAttr(x, "data-url");
        query = escape(redacto.getElemAttr(x, 'data-search')),
        key = redacto.getElemAttr(x, 'data-api-key');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        'border:0" src="https://www.google.com/maps/embed/v1/place?q=' +
        query +
        '&key=' +
        key +
        '" allowfullscreen></iframe> '
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'googlemapssearch';
    redacto.fallback(['googlemapssearch'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// googlemaps embed iframe
redacto.services.googlemapsembed = {
  key: 'googlemapsembed',
  type: 'api',
  name: 'Google Maps Embed',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [
    'apisid',
    'hsid',
    'nid',
    'sapisid',
    'sid',
    'sidcc',
    'ssid',
    '1p_jar',
  ],
  js: function () {
    'use strict';
    redacto.fallback(['googlemapsembed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Google maps iframe',
        width = redacto.getElemWidth(x),
        height = redacto.getElemHeight(x),
        url = redacto.getElemAttr(x, 'data-url');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowtransparency allowfullscreen></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'googlemapsembed';
    redacto.fallback(['googlemapsembed'], function (elem) {
      elem.style.width = redacto.getStyleSize(redacto.getElemWidth(elem));
      elem.style.height = redacto.getStyleSize(redacto.getElemHeight(elem));
      return redacto.engage(id);
    });
  },
};

// openstreetmap embed iframe
redacto.services.openstreetmap = {
  key: 'openstreetmap',
  type: 'api',
  name: 'Openstreetmap Embed',
  uri: 'https://wiki.osmfoundation.org/wiki/Privacy_Policy#Cookies',
  needConsent: true,
  cookies: [
    'apisid',
    'hsid',
    'nid',
    'sapisid',
    'sid',
    'sidcc',
    'ssid',
    '1p_jar',
  ],
  js: function () {
    'use strict';
    redacto.fallback(['openstreetmap'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Openstreetmap iframe',
        width = redacto.getElemWidth(x),
        height = redacto.getElemHeight(x),
        url = redacto.getElemAttr(x, 'data-url');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowfullscreen></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'openstreetmap';
    redacto.fallback(['openstreetmap'], function (elem) {
      elem.style.width = redacto.getStyleSize(redacto.getElemWidth(elem));
      elem.style.height = redacto.getStyleSize(redacto.getElemHeight(elem));
      return redacto.engage(id);
    });
  },
};

// geoportail embed iframe
redacto.services.geoportail = {
  key: 'geoportail',
  type: 'api',
  name: 'Geoportail maps Embed',
  uri: 'https://www.ign.fr/institut/gestion-des-cookies',
  needConsent: true,
  cookies: [
    'apisid',
    'hsid',
    'nid',
    'sapisid',
    'sid',
    'sidcc',
    'ssid',
    '1p_jar',
  ],
  js: function () {
    'use strict';
    redacto.fallback(['geoportail'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Geoportail maps iframe',
        width = redacto.getElemWidth(x),
        height = redacto.getElemHeight(x),
        url = redacto.getElemAttr(x, 'data-url');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" sandbox="allow-forms allow-scripts allow-same-origin" allowfullscreen></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'geoportail';
    redacto.fallback(['geoportail'], function (elem) {
      elem.style.width = redacto.getStyleSize(redacto.getElemWidth(elem));
      elem.style.height = redacto.getStyleSize(redacto.getElemHeight(elem));
      return redacto.engage(id);
    });
  },
};

// google tag manager
redacto.services.googletagmanager = {
  key: 'googletagmanager',
  type: 'api',
  name: 'Google Tag Manager',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [
    '_ga',
    '_gat',
    '__utma',
    '__utmb',
    '__utmc',
    '__utmt',
    '__utmz',
    '__gads',
    '_drt_',
    'FLC',
    'exchange_uid',
    'id',
    'fc',
    'rrs',
    'rds',
    'rv',
    'uid',
    'UIDR',
    'UID',
    'clid',
    'ipinfo',
    'acs',
  ],
  js: function () {
    'use strict';
    if (redacto.user.googletagmanagerId === undefined) {
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    redacto.addScript(
      'https://www.googletagmanager.com/gtm.js?id=' +
        redacto.user.googletagmanagerId
    );
  },
  fallback: function () {
    if (redacto.parameters.googleConsentMode === true) {
      if (redacto.parameters.softConsentMode === false) {
        this.js();
      }
    }
  },
};

// google tag manager multiple
redacto.services.multiplegoogletagmanager = {
  key: 'multiplegoogletagmanager',
  type: 'api',
  name: 'Google Tag Manager',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [
    '_ga',
    '_gat',
    '__utma',
    '__utmb',
    '__utmc',
    '__utmt',
    '__utmz',
    '__gads',
    '_drt_',
    'FLC',
    'exchange_uid',
    'id',
    'fc',
    'rrs',
    'rds',
    'rv',
    'uid',
    'UIDR',
    'UID',
    'clid',
    'ipinfo',
    'acs',
  ],
  js: function () {
    'use strict';
    if (redacto.user.multiplegoogletagmanagerId === undefined) {
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    redacto.user.multiplegoogletagmanagerId.forEach(function (id) {
      redacto.addScript('https://www.googletagmanager.com/gtm.js?id=' + id);
    });
  },
  fallback: function () {
    if (redacto.parameters.googleConsentMode === true) {
      if (redacto.parameters.softConsentMode === false) {
        this.js();
      }
    }
  },
};

// google webfonts
redacto.services.googlefonts = {
  key: 'googlefonts',
  type: 'api',
  name: 'Google Webfonts',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.googleFonts === undefined) {
      return;
    }
    redacto.addScript(
      '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
      '',
      function () {
        if (redacto.user.googleFonts instanceof Array) {
          WebFont.load({
            google: {
              families: redacto.user.googleFonts,
            },
          });
        } else {
          WebFont.load({
            google: {
              families: [redacto.user.googleFonts],
            },
          });
        }
      }
    );
  },
};

// hubspot
redacto.services.hubspot = {
  key: 'hubspot',
  type: 'analytic',
  name: 'Hubspot',
  uri: 'https://legal.hubspot.com/privacy-policy',
  needConsent: true,
  cookies: ['hubspotutk', 'fr', '__hstc', '__hssrc', '__hssc', '__cfduid'],
  js: function () {
    'use strict';

    if (redacto.user.hubspotId === undefined) {
      return;
    }

    var tac_businessUnitId = '';
    if (
      redacto.user.hubspotBusinessUnitId !== undefined &&
      redacto.user.hubspotBusinessUnitId !== null &&
      redacto.user.hubspotBusinessUnitId !== ''
    ) {
      tac_businessUnitId =
        '?businessUnitId=' + redacto.user.hubspotBusinessUnitId;
    }

    redacto.addScript(
      '//js.hs-scripts.com/' +
        redacto.user.hubspotId +
        '.js' +
        tac_businessUnitId,
      'hs-script-loader'
    );
  },
};

// instagram
redacto.services.instagram = {
  key: 'instagram',
  type: 'social',
  name: 'Instagram',
  uri: 'https://www.instagram.com/legal/privacy/',
  needConsent: true,
  cookies: [
    'shbts',
    'sessionid',
    'csrftoken',
    'rur',
    'shbid',
    'mid',
    'ds_usr_id',
    'ig_did',
    'ig_cb',
    'datr',
  ],
  js: function () {
    'use strict';
    redacto.fallback(['instagram_post'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Instagram iframe',
        post_id = redacto.getElemAttr(x, 'postId'),
        page_id = redacto.getElemAttr(x, 'pageId'),
        post_permalink = redacto.getElemAttr(x, 'data-instgrm-permalink'),
        embed_width = redacto.getElemAttr(x, 'width'),
        embed_height = redacto.getElemAttr(x, 'height'),
        styleAttr = '',
        post_frame;

      if (post_permalink != null) {
        redacto.addScript('//www.instagram.com/embed.js', 'instagram-embed');

        return '';
      }

      var post_link =
        post_id !== '' ? 'p/' + post_id : page_id !== '' ? page_id : '';
      if (post_link === '') {
        return '';
      }

      if (embed_width !== '') {
        styleAttr = 'width:' + redacto.getStyleSize(embed_width) + ';';
      }
      if (embed_height !== '') {
        styleAttr = 'height:' + redacto.getStyleSize(embed_height) + ';';
      }

      post_frame =
        '<iframe title="' +
        frame_title +
        '" src="//www.instagram.com/' +
        post_link +
        '/embed" style="' +
        styleAttr +
        '"></iframe>';

      return post_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'instagram';
    redacto.fallback(['instagram_post'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// jsapi
redacto.services.jsapi = {
  key: 'jsapi',
  type: 'api',
  name: 'Google jsapi',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript('//www.google.com/jsapi');
  },
};

// twitterwidgetsapi
redacto.services.twitterwidgetsapi = {
  key: 'twitterwidgetsapi',
  type: 'api',
  name: 'X (formerly Twitter) Widgets API',
  uri: 'https://support.twitter.com/articles/20170514',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tacTwitterAPI'], '');
    redacto.addScript('//platform.twitter.com/widgets.js', 'twitter-wjs');
  },
  fallback: function () {
    'use strict';
    var id = 'twitterwidgetsapi';
    redacto.fallback(['tacTwitterAPI'], redacto.engage(id));
  },
};

// recaptcha
redacto.services.recaptcha = {
  key: 'recaptcha',
  type: 'api',
  name: 'reCAPTCHA',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: ['nid'],
  js: function () {
    'use strict';
    window.tacRecaptchaOnLoad = redacto.user.recaptchaOnLoad || function () {};
    redacto.fallback(['g-recaptcha'], '');

    let url =
      'https://www.google.com/recaptcha/api.js?onload=tacRecaptchaOnLoad';
    if (redacto.user.recaptchaapi !== undefined) {
      url += '&render=' + redacto.user.recaptchaapi;
    }
    if (redacto.user.recaptcha_hl !== undefined) {
      url += '&hl=' + redacto.user.recaptcha_hl;
    }
    redacto.addScript(url);
  },
  fallback: function () {
    'use strict';
    var id = 'recaptcha';
    redacto.fallback(['g-recaptcha'], redacto.engage(id));
  },
};

// linkedin
redacto.services.linkedin = {
  key: 'linkedin',
  type: 'social',
  name: 'Linkedin',
  uri: 'https://www.linkedin.com/legal/cookie-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tacLinkedin'], '');
    redacto.addScript('//platform.linkedin.com/in.js');
    if (redacto.isAjax === true) {
      if (typeof IN !== 'undefined') {
        IN.parse();
      }
    }
  },
  fallback: function () {
    'use strict';
    var id = 'linkedin';
    redacto.fallback(['tacLinkedin'], redacto.engage(id));
  },
};

// mautic
redacto.services.mautic = {
  key: 'mautic',
  type: 'analytic',
  name: 'Mautic',
  uri: 'https://www.mautic.org/privacy-policy/',
  needConsent: true,
  cookies: ['mtc_id', 'mtc_sid'],
  js: function () {
    'use strict';
    if (redacto.user.mauticurl === undefined) {
      return;
    }

    window.MauticTrackingObject = 'mt';
    window.mt =
      window.mt ||
      function () {
        window.mt.q = window.mt.q || [];
        window.mt.q.push(arguments);
      };

    redacto.addScript(redacto.user.mauticurl, '', function () {
      mt('send', 'pageview');
    });
  },
};

// microsoftcampaignanalytics
redacto.services.microsoftcampaignanalytics = {
  key: 'microsoftcampaignanalytics',
  type: 'analytic',
  name: 'Microsoft Campaign Analytics',
  uri: 'https://privacy.microsoft.com/privacystatement/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.microsoftcampaignanalyticsUUID === undefined) {
      return;
    }

    redacto.addScript(
      '//flex.atdmt.com/mstag/site/' +
        redacto.user.microsoftcampaignanalyticsUUID +
        '/mstag.js',
      'mstag_tops',
      function () {
        window.mstag = { loadTag: function () {}, time: new Date().getTime() };
        window.mstag.loadTag('analytics', {
          dedup: '1',
          domainId: redacto.user.microsoftcampaignanalyticsdomainId,
          type: '1',
          actionid: redacto.user.microsoftcampaignanalyticsactionId,
        });
      }
    );
  },
};

// onesignal
redacto.services.onesignal = {
  key: 'onesignal',
  type: 'api',
  name: 'OneSignal',
  uri: 'https://onesignal.com/privacy_policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.onesignalAppId === undefined) {
      return;
    }
    window.OneSignal = window.OneSignal || [];

    window.OneSignal.push(function () {
      window.OneSignal.init({
        appId: redacto.user.onesignalAppId,
      });
    });

    redacto.addScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js');
  },
};

// pinterest
redacto.services.pinterest = {
  key: 'pinterest',
  type: 'social',
  name: 'Pinterest',
  uri: 'https://about.pinterest.com/privacy-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tacPinterest'], '');
    redacto.addScript('//assets.pinterest.com/js/pinit.js');
  },
  fallback: function () {
    'use strict';
    var id = 'pinterest';
    redacto.fallback(['tacPinterest'], redacto.engage(id));
  },
};

// prelinker
redacto.services.prelinker = {
  key: 'prelinker',
  type: 'ads',
  name: 'Prelinker',
  uri: 'https://www.prelinker.com/index/index/cgu/',
  needConsent: true,
  cookies: ['_sp_id.32f5', '_sp_ses.32f5'],
  js: function () {
    'use strict';
    var uniqIds = [],
      i,
      uri;

    redacto.fallback(['prelinker-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      return (
        '<div id="' +
        uniqId +
        '" siteId="' +
        redacto.getElemAttr(x, 'siteId') +
        '" bannerId="' +
        redacto.getElemAttr(x, 'bannerId') +
        '" defaultLanguage="' +
        redacto.getElemAttr(x, 'defaultLanguage') +
        '" tracker="' +
        redacto.getElemAttr(x, 'tracker') +
        '"></div>'
      );
    });

    for (i = 0; i < uniqIds.length; i += 1) {
      uri = 'https://promo.easy-dating.org/banner/index?';
      uri +=
        'site_id=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'siteId') +
        '&';
      uri +=
        'banner_id=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'bannerId') +
        '&';
      uri +=
        'default_language=' +
        redacto.getElemAttr(
          document.getElementById(uniqIds[i]),
          'defaultLanguage'
        ) +
        '&';
      uri +=
        'tr4ck=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'trackrt');

      redacto.makeAsync.init(uri, uniqIds[i]);
    }
  },
  fallback: function () {
    'use strict';
    var id = 'prelinker';
    redacto.fallback(['prelinker-canvas'], redacto.engage(id));
  },
};

// prezi
redacto.services.prezi = {
  key: 'prezi',
  type: 'video',
  name: 'Prezi',
  uri: 'https://prezi.com/privacy-policy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['prezi-canvas'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Prezi iframe',
        id = redacto.getElemAttr(x, 'data-id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        url =
          'https://prezi.com/embed/' +
          id +
          '/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0';

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowtransparency allowfullscreen></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'prezi';
    redacto.fallback(['prezi-canvas'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// pubdirecte
redacto.services.pubdirecte = {
  key: 'pubdirecte',
  type: 'ads',
  name: 'Pubdirecte',
  uri: 'https://pubdirecte.com/contact.php',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    var uniqIds = [],
      i,
      uri;

    redacto.fallback(['pubdirecte-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      return (
        '<div id="' +
        uniqId +
        '" pid="' +
        redacto.getElemAttr(x, 'pid') +
        '" ref="' +
        redacto.getElemAttr(x, 'ref') +
        '"></div>'
      );
    });

    for (i = 0; i < uniqIds.length; i += 1) {
      uri = '//www.pubdirecte.com/script/banniere.php?';
      uri +=
        'id=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'pid') +
        '&';
      uri +=
        'ref=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'ref');

      redacto.makeAsync.init(uri, uniqIds[i]);
    }
  },
  fallback: function () {
    'use strict';
    var id = 'pubdirecte';
    redacto.fallback(['pubdirecte-canvas'], redacto.engage(id));
  },
};

// purechat
redacto.services.purechat = {
  key: 'purechat',
  type: 'support',
  name: 'PureChat',
  uri: 'https://www.purechat.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.purechatId === undefined) {
      return;
    }

    redacto.addScript(
      '//app.purechat.com/VisitorWidget/WidgetScript',
      '',
      function () {
        try {
          window.w = new PCWidget({ c: redacto.user.purechatId, f: true });
        } catch (e) {}
      }
    );
  },
};

// Intercom
redacto.services.intercomChat = {
  key: 'intercomChat',
  type: 'support',
  name: 'Intercom',
  uri: 'https://www.intercom.com/',
  needConsent: true,
  cookies: [
    'intercom-id-' + redacto.user.intercomKey,
    'intercom-session-' + redacto.user.intercomKey,
  ],
  readmoreLink: 'https://www.intercom.com/legal/privacy',
  js: function () {
    if (redacto.user.intercomKey === undefined) {
      return;
    }

    window.intercomSettings = {
      app_id: redacto.user.intercomKey,
    };

    var w = window;
    var ic = w.Intercom;
    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', w.intercomSettings);
    } else {
      var i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      redacto.addScript(
        'https://widget.intercom.io/widget/' + redacto.user.intercomKey,
        '',
        function () {
          // Execute callback if function `intercomChatEnable`
          // is defined
          if (typeof intercomChatEnable === 'function') {
            intercomChatEnable();
          }
        }
      );
    }
  },
  fallback: function () {
    'use strict';
    var id = 'intercomChat';
    redacto.fallback(['intercom-chat'], function () {
      // Execute callback if function `intercomChatDisable`
      // is defined
      if (typeof intercomChatDisable === 'function') {
        intercomChatDisable();
      }
      return redacto.engage(id);
    });
  },
};

// rumbletalk
redacto.services.rumbletalk = {
  key: 'rumbletalk',
  type: 'social',
  name: 'RumbleTalk',
  needConsent: true,
  cookies: ['AWSALB'],
  js: function () {
    'use strict';
    if (redacto.user.rumbletalkid === undefined) {
      return;
    }

    redacto.addScript(
      'https://rumbletalk.com/client/?' + redacto.user.rumbletalkid
    );

    redacto.fallback(['rumbletalk'], function (x) {
      var width = redacto.getElemWidth(x),
        height = redacto.getElemHeight(x),
        id = redacto.getElemAttr(x, 'data-id');

      return (
        '<div style="height: ' +
        redacto.getStyleSize(height) +
        '; width: ' +
        redacto.getStyleSize(width) +
        ';"><div id="' +
        id +
        '"></div></div>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'rumbletalk';
    redacto.fallback(['rumbletalk'], function (elem) {
      elem.style.width = redacto.getStyleSize(redacto.getElemWidth(elem));
      elem.style.height = redacto.getStyleSize(redacto.getElemHeight(elem));

      return redacto.engage(id);
    });
  },
};

// shareaholic
redacto.services.shareaholic = {
  key: 'shareaholic',
  type: 'social',
  name: 'Shareaholic',
  uri: 'https://shareaholic.com/privacy/choices',
  needConsent: true,
  cookies: [
    '__utma',
    '__utmb',
    '__utmc',
    '__utmz',
    '__utmt_Shareaholic%20Pageviews',
  ],
  js: function () {
    'use strict';
    if (redacto.user.shareaholicSiteId === undefined) {
      return;
    }

    redacto.fallback(['shareaholic-canvas'], '');
    redacto.addScript(
      '//dsms0mj1bbhn4.cloudfront.net/assets/pub/shareaholic.js',
      '',
      function () {
        try {
          Shareaholic.init(redacto.user.shareaholicSiteId);
        } catch (e) {}
      }
    );
  },
  fallback: function () {
    'use strict';
    var id = 'shareaholic';
    redacto.fallback(['shareaholic-canvas'], redacto.engage(id));
  },
};

// shareasale
redacto.services.shareasale = {
  key: 'shareasale',
  type: 'ads',
  name: 'ShareASale',
  uri: 'https://www.shareasale.com/PrivacyPolicy.pdf',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    var uniqIds = [],
      i,
      uri;

    redacto.fallback(['shareasale-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      return (
        '<div id="' +
        uniqId +
        '" amount="' +
        redacto.getElemAttr(x, 'amount') +
        '" tracking="' +
        redacto.getElemAttr(x, 'tracking') +
        '" transtype="' +
        redacto.getElemAttr(x, 'transtype') +
        '" persale="' +
        redacto.getElemAttr(x, 'persale') +
        '" perlead="' +
        redacto.getElemAttr(x, 'perlead') +
        '" perhit="' +
        redacto.getElemAttr(x, 'perhit') +
        '" merchantID="' +
        redacto.getElemAttr(x, 'merchantID') +
        '"></div>'
      );
    });

    for (i = 0; i < uniqIds.length; i += 1) {
      uri = 'https://shareasale.com/sale.cfm?';
      uri +=
        'amount=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'amount') +
        '&';
      uri +=
        'tracking=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'tracking') +
        '&';
      uri +=
        'transtype=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'transtype') +
        '&';
      uri +=
        'persale=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'persale') +
        '&';
      uri +=
        'perlead=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'perlead') +
        '&';
      uri +=
        'perhit=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'perhit') +
        '&';
      uri +=
        'merchantID=' +
        redacto.getElemAttr(document.getElementById(uniqIds[i]), 'merchantID');

      document.getElementById(uniqIds[i]).innerHTML =
        "<img src='" + uri + "' width='1' height='1' />";
    }
  },
  fallback: function () {
    'use strict';
    var id = 'shareasale';
    redacto.fallback(['shareasale-canvas'], redacto.engage(id));
  },
};

// sharethis
redacto.services.sharethis = {
  key: 'sharethis',
  type: 'social',
  name: 'ShareThis',
  uri: 'https://www.sharethis.com/legal/privacy/',
  needConsent: true,
  cookies: ['__unam'],
  js: function () {
    'use strict';
    if (redacto.user.sharethisPublisher === undefined) {
      return;
    }
    var switchTo5x = true,
      uri =
        ('https:' === document.location.protocol ? 'https://ws' : 'http://w') +
        '.sharethis.com/button/buttons.js';

    redacto.fallback(['tacSharethis'], '');
    redacto.addScript(uri, '', function () {
      stLight.options({
        publisher: redacto.user.sharethisPublisher,
        doNotHash: false,
        doNotCopy: false,
        hashAddressBar: false,
      });
    });

    if (redacto.isAjax === true) {
      if (typeof stButtons !== 'undefined') {
        stButtons.locateElements();
      }
    }
  },
  fallback: function () {
    'use strict';
    var id = 'sharethis';
    redacto.fallback(['tacSharethis'], redacto.engage(id));
  },
};

// slideshare
redacto.services.slideshare = {
  key: 'slideshare',
  type: 'video',
  name: 'SlideShare',
  uri: 'https://www.linkedin.com/legal/privacy-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['slideshare-canvas'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Slideshare iframe',
        id = redacto.getElemAttr(x, 'data-id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        url = '//www.slideshare.net/slideshow/embed_code/key/' + id;

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowtransparency allowfullscreen></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'slideshare';
    redacto.fallback(['slideshare-canvas'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// soundcloud
redacto.services.soundcloud = {
  key: 'soundcloud',
  type: 'video',
  name: 'SoundCloud',
  needConsent: true,
  uri: 'https://soundcloud.com/pages/privacy',
  cookies: ['sc_anonymous_id', 'sclocale'],
  js: function () {
    'use strict';
    redacto.fallback(['soundcloud_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Soundcloud iframe',
        player_height = redacto.getElemAttr(x, 'data-height'),
        frame_height = 'height:' + redacto.getStyleSize(player_height) + ';',
        playable_id = redacto.getElemAttr(x, 'data-playable-id'),
        playable_type = redacto.getElemAttr(x, 'data-playable-type'),
        playable_url = redacto.getElemAttr(x, 'data-playable-url'),
        color = redacto.getElemAttr(x, 'data-color'),
        autoplay = redacto.getElemAttr(x, 'data-auto-play'),
        hideRelated = redacto.getElemAttr(x, 'data-hide-related'),
        showComments = redacto.getElemAttr(x, 'data-show-comments'),
        showUser = redacto.getElemAttr(x, 'data-show-user'),
        showReposts = redacto.getElemAttr(x, 'data-show-reposts'),
        showTeaser = redacto.getElemAttr(x, 'data-show-teaser'),
        visual = redacto.getElemAttr(x, 'data-visual'),
        artwork = redacto.getElemAttr(x, 'data-artwork');

      var allowAutoplay = autoplay === 'true' ? 'allow="autoplay"' : '';

      if (playable_id === '' && playable_url === '') {
        return '';
      }

      // Allow to embed from API results (playable_type + playable_id)
      var qs =
        '?url=https%3A//api.soundcloud.com/' +
        playable_type +
        '/' +
        playable_id;
      // Or from raw URL from Soundcloud website
      if (playable_url && playable_url.length > 0)
        qs = '?url=' + escape(playable_url);

      if (hideRelated && hideRelated.length > 0)
        qs += '&hide_related=' + hideRelated;
      if (color && color.length > 0)
        qs += '&color=' + color.replace('#', '%23');
      if (autoplay && autoplay.length > 0) qs += '&auto_play=' + autoplay;
      if (showComments && showComments.length > 0)
        qs += '&show_comments=' + showComments;
      if (hideRelated && hideRelated.length > 0)
        qs += '&hide_related=' + hideRelated;
      if (showUser && showUser.length > 0) qs += '&show_user=' + showUser;
      if (showReposts && showReposts.length > 0)
        qs += '&show_reposts=' + showReposts;
      if (showTeaser && showTeaser.length > 0)
        qs += '&show_teaser=' + showTeaser;
      if (visual && visual.length > 0) qs += '&visual=' + visual;
      if (artwork && artwork.length > 0) qs += '&show_artwork=' + artwork;

      return (
        '<iframe title="' +
        frame_title +
        '" style="width:100%;' +
        frame_height +
        '" ' +
        allowAutoplay +
        ' src="https://w.soundcloud.com/player/' +
        qs +
        '"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    redacto.fallback(['soundcloud_player'], function (elem) {
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'data-height')
      );
      return redacto.engage('soundcloud');
    });
  },
};

// spotify
redacto.services.spotify = {
  key: 'spotify',
  type: 'video',
  name: 'Spotify',
  uri: 'https://www.spotify.com/us/legal/privacy-policy/',
  needConsent: true,
  cookies: [
    'sp_landing',
    '_ga',
    'sp_ab',
    'sp_landingref',
    'sp_t',
    'sp_usid',
    'OptanonConsent',
    'sp_m',
    'spot',
  ],
  js: function () {
    'use strict';
    redacto.fallback(['spotify_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Spotify iframe',
        spotify_id = redacto.getElemAttr(x, 'spotifyID'),
        spotify_width = redacto.getElemAttr(x, 'width'),
        spotify_height = redacto.getElemAttr(x, 'height'),
        styleAttr = 'border-radius:12px;',
        spotify_frame;

      if (spotify_id === '') {
        return '';
      }
      if (spotify_width !== '') {
        styleAttr += 'width:' + redacto.getStyleSize(spotify_width) + ';';
      }
      if (spotify_height !== '') {
        styleAttr += 'height:' + redacto.getStyleSize(spotify_height) + ';';
      }
      spotify_frame =
        '<iframe title="' +
        frame_title +
        '" src="//open.spotify.com/embed/' +
        spotify_id +
        '" style="' +
        styleAttr +
        '" allowfullscreen></iframe>';
      return spotify_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'spotify';
    redacto.fallback(['spotify_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// statcounter
redacto.services.statcounter = {
  key: 'statcounter',
  type: 'analytic',
  name: 'StatCounter',
  uri: 'https://fr.statcounter.com/about/legal/#privacy',
  needConsent: true,
  cookies: ['sc_is_visitor_unique'],
  js: function () {
    'use strict';
    var uniqIds = [],
      i,
      uri = '//statcounter.com/counter/counter.js';

    redacto.fallback(['statcounter-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      return '<div id="' + uniqId + '"></div>';
    });

    for (i = 0; i < uniqIds.length; i += 1) {
      redacto.makeAsync.init(uri, uniqIds[i]);
    }
  },
  fallback: function () {
    'use strict';
    var id = 'statcounter';
    redacto.fallback(['statcounter-canvas'], redacto.engage(id));
  },
};

// timelinejs
redacto.services.timelinejs = {
  key: 'timelinejs',
  type: 'api',
  name: 'Timeline JS',
  uri: 'https://timeline.knightlab.com/#help',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['timelinejs-canvas'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Twitter iframe',
        spreadsheet_id = redacto.getElemAttr(x, 'spreadsheet_id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        lang = redacto.getElemAttr(x, 'lang_2_letter'),
        font = redacto.getElemAttr(x, 'font'),
        map = redacto.getElemAttr(x, 'map'),
        start_at_end = redacto.getElemAttr(x, 'start_at_end'),
        hash_bookmark = redacto.getElemAttr(x, 'hash_bookmark'),
        start_at_slide = redacto.getElemAttr(x, 'start_at_slide'),
        start_zoom = redacto.getElemAttr(x, 'start_zoom'),
        url =
          '//cdn.knightlab.com/libs/timeline/latest/embed/index.html?source=' +
          spreadsheet_id +
          '&font=' +
          font +
          '&maptype=' +
          map +
          '&lang=' +
          lang +
          '&start_at_end=' +
          start_at_end +
          '&hash_bookmark=' +
          hash_bookmark +
          '&start_at_slide=' +
          start_at_slide +
          '&start_zoom_adjust=' +
          start_zoom +
          '&height=' +
          height;

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        url +
        '" style="' +
        styleAttr +
        '" allowtransparency allowfullscreen></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'timelinejs';
    redacto.fallback(['timelinejs-canvas'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// tagcommander
redacto.services.tagcommander = {
  key: 'tagcommander',
  type: 'api',
  name: 'TagCommander',
  uri: 'https://www.commandersact.com/en/privacy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.tagcommanderid === undefined) {
      return;
    }
    redacto.addScript(
      'https://cdn.tagcommander.com/' + redacto.user.tagcommanderid + '.js'
    );
  },
};

// typekit
redacto.services.typekit = {
  key: 'typekit',
  type: 'api',
  name: 'Typekit (adobe)',
  uri: 'https://www.adobe.com/privacy.html',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.typekitId === undefined) {
      return;
    }
    redacto.addScript(
      '//use.typekit.net/' + redacto.user.typekitId + '.js',
      '',
      function () {
        try {
          Typekit.load();
        } catch (e) {}
      }
    );
  },
};

// twenga
redacto.services.twenga = {
  key: 'twenga',
  type: 'ads',
  name: 'Twenga',
  uri: 'https://www.twenga.com/privacy.php',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.twengaId === undefined ||
      redacto.user.twengaLocale === undefined
    ) {
      return;
    }

    redacto.addScript(
      '//tracker.twenga.' +
        redacto.user.twengaLocale +
        '/st/tracker_' +
        redacto.user.twengaId +
        '.js'
    );
  },
};

// twitter
redacto.services.twitter = {
  key: 'twitter',
  type: 'social',
  name: 'X (formerly Twitter)',
  uri: 'https://support.twitter.com/articles/20170514',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tacTwitter'], '');
    redacto.addScript('//platform.twitter.com/widgets.js', 'twitter-wjs');
  },
  fallback: function () {
    'use strict';
    var id = 'twitter';
    redacto.fallback(['tacTwitter'], redacto.engage(id));
  },
};

// twitter embed
redacto.services.twitterembed = {
  key: 'twitterembed',
  type: 'social',
  name: 'X (formerly Twitter) cards',
  uri: 'https://support.twitter.com/articles/20170514',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    var uniqIds = [],
      i,
      e,
      html;

    redacto.fallback(['twitterembed-canvas'], function (x) {
      var uniqId = '_' + Math.random().toString(36).substr(2, 9);
      uniqIds.push(uniqId);
      html = '<div id="' + uniqId + '" ';
      html += 'tweetid="' + redacto.getElemAttr(x, 'tweetid') + '" ';
      html += 'theme="' + redacto.getElemAttr(x, 'theme') + '" ';
      html += 'cards="' + redacto.getElemAttr(x, 'cards') + '" ';
      html += 'conversation="' + redacto.getElemAttr(x, 'conversation') + '" ';
      html += 'data-width="' + redacto.getElemAttr(x, 'data-width') + '" ';
      html += 'data-align="' + redacto.getElemAttr(x, 'data-align') + '" ';
      html += '></div>';
      return html;
    });

    redacto.addScript(
      '//platform.twitter.com/widgets.js',
      'twitter-wjs',
      function () {
        var i;
        for (i = 0; i < uniqIds.length; i += 1) {
          e = document.getElementById(uniqIds[i]);
          twttr.widgets.createTweet(redacto.getElemAttr(e, 'tweetid'), e, {
            theme: redacto.getElemAttr(e, 'theme'),
            cards: redacto.getElemAttr(e, 'cards'),
            conversation: redacto.getElemAttr(e, 'conversation'),
            lang: redacto.getLanguage(),
            dnt: true,
            width: redacto.getElemAttr(e, 'data-width'),
            align: redacto.getElemAttr(e, 'data-align'),
          });
        }
      }
    );
  },
  fallback: function () {
    'use strict';
    var id = 'twitterembed';
    redacto.fallback(['twitterembed-canvas'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'data-width')
      );
      return redacto.engage(id);
    });
  },
};

// twitter timeline
redacto.services.twittertimeline = {
  key: 'twittertimeline',
  type: 'social',
  name: 'X (formerly Twitter) timelines',
  uri: 'https://support.twitter.com/articles/20170514',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tacTwitterTimelines'], '');
    redacto.addScript('https://platform.twitter.com/widgets.js', 'twitter-wjs');
  },
  fallback: function () {
    'use strict';
    var id = 'twittertimeline';
    redacto.fallback(['tacTwitterTimelines'], redacto.engage(id));
  },
};

// twitter universal website tag
redacto.services.twitteruwt = {
  key: 'twitteruwt',
  type: 'analytic',
  name: 'X (formerly Twitter) Universal Website Tag',
  uri: 'https://business.twitter.com/en/help/campaign-measurement-and-analytics/conversion-tracking-for-websites.html',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.twitteruwtId === undefined) {
      return;
    }

    window.twq = function () {
      window.twq.exe
        ? window.twq.exe.apply(window.twq, arguments)
        : window.twq.queue.push(arguments);
    };
    window.twq.version = '1.1';
    window.twq.queue = [];

    redacto.addScript('https://static.ads-twitter.com/uwt.js', '', function () {
      window.twq('init', redacto.user.twitteruwtId);
      window.twq('track', 'PageView');
    });
  },
};

// user voice
redacto.services.uservoice = {
  key: 'uservoice',
  type: 'support',
  name: 'UserVoice',
  uri: 'https://www.uservoice.com/privacy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.userVoiceApi === undefined) {
      return;
    }
    redacto.addScript(
      '//widget.uservoice.com/' + redacto.user.userVoiceApi + '.js'
    );
  },
};

// vimeo
redacto.services.vimeo = {
  key: 'vimeo',
  type: 'video',
  name: 'Vimeo',
  uri: 'https://vimeo.com/privacy',
  needConsent: true,
  cookies: [
    '__utmt_player',
    '__utma',
    '__utmb',
    '__utmc',
    '__utmv',
    'vuid',
    '__utmz',
    'player',
  ],
  js: function () {
    'use strict';
    redacto.fallback(['vimeo_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Vimeo iframe',
        video_width = redacto.getElemAttr(x, 'width'),
        video_height = redacto.getElemAttr(x, 'height'),
        styleAttr = '',
        video_id = redacto.getElemAttr(x, 'videoID'),
        video_hash = redacto.getElemAttr(x, 'data-hash') || '',
        video_allowfullscreen = redacto.getElemAttr(x, 'data-allowfullscreen'),
        video_qs = '',
        attrs = [
          'title',
          'byline',
          'portrait',
          'loop',
          'autoplay',
          'autopause',
          'background',
          'color',
          'controls',
          'maxheight',
          'maxwidth',
          'muted',
          'playsinline',
          'speed',
          'transparent',
        ],
        params = attrs
          .filter(function (a) {
            return redacto.getElemAttr(x, a) !== '';
          })
          .map(function (a) {
            return a + '=' + redacto.getElemAttr(x, a);
          }),
        video_frame;

      if (video_id === '') {
        return '';
      }

      // query params
      if (video_hash.length > 0) {
        params.push('h=' + video_hash);
      }
      if (params.length > 0) {
        video_qs = '?' + params.join('&');
      }

      // attributes
      if (video_width !== undefined) {
        styleAttr += 'width:' + redacto.getStyleSize(video_width) + ';';
      }
      if (video_height !== undefined) {
        styleAttr += 'height:' + redacto.getStyleSize(video_height) + ';';
      }

      video_frame =
        '<iframe title="' +
        frame_title +
        '" src="//player.vimeo.com/video/' +
        video_id +
        video_qs +
        '" style="' +
        styleAttr +
        '" ' +
        (video_allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>';

      return video_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'vimeo';
    redacto.fallback(['vimeo_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// visualrevenue
redacto.services.visualrevenue = {
  key: 'visualrevenue',
  type: 'analytic',
  name: 'VisualRevenue',
  uri: 'https://www.outbrain.com/legal/privacy-713/',
  needConsent: true,
  cookies: ['__vrf', '__vrm', '__vrl', '__vry', '__vru', '__vrid', '__vrz'],
  js: function () {
    'use strict';
    if (redacto.user.visualrevenueId === undefined) {
      return;
    }
    window._vrq = window._vrq || [];
    window._vrq.push(['id', redacto.user.visualrevenueId]);
    window._vrq.push(['automate', true]);
    window._vrq.push(['track', function () {}]);
    redacto.addScript('https://a.visualrevenue.com/vrs.js');
  },
};

// verizon dot tag
redacto.services.verizondottag = {
  key: 'verizondottag',
  type: 'analytic',
  name: 'Verizon Dot Tag',
  uri: 'https://developer.verizonmedia.com/native/guide/audience-management/dottags/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.verizondottagProjectId === undefined) {
      return;
    }

    window.dotq = window.dotq || [];
    window.dotq.push({
      projectId: redacto.user.verizondottagProjectId,
      properties: { pixelId: redacto.user.verizondottagPixelId },
    });

    redacto.addScript('https://s.yimg.com/wi/ytc.js', '', function () {
      //const items = window.dotq;
      window.dotq = [];
      window.dotq.push = function (item) {
        YAHOO.ywa.I13N.fireBeacon([item]);
      };
      YAHOO.ywa.I13N.fireBeacon(items);
    });
  },
};

// vshop
redacto.services.vshop = {
  key: 'vshop',
  type: 'ads',
  name: 'vShop',
  uri: 'https://vshop.fr/privacy-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['vcashW'], '');
    redacto.addScript('//vshop.fr/js/w.js');
  },
  fallback: function () {
    'use strict';
    var id = 'vshop';
    redacto.fallback(['vcashW'], redacto.engage(id));
  },
};

// wysistat
redacto.services.wysistat = {
  key: 'wysistat',
  type: 'analytic',
  name: 'Wysistat',
  uri: 'https://wysistat.net/contact/',
  needConsent: true,
  cookies: ['Wysistat'],
  js: function () {
    'use strict';
    if (redacto.user.wysistat === undefined) {
      return;
    }
    redacto.addScript('//www.wysistat.com/statistique.js', '', function () {
      window.stat(
        redacto.user.wysistat.cli,
        redacto.user.wysistat.frm,
        redacto.user.wysistat.prm,
        redacto.user.wysistat.ce,
        redacto.user.wysistat.page,
        redacto.user.wysistat.roi,
        redacto.user.wysistat.prof,
        redacto.user.wysistat.cpt
      );
    });
  },
};

// xiti
redacto.services.xiti = {
  key: 'xiti',
  type: 'analytic',
  name: 'Xiti',
  uri: 'https://www.atinternet.com/rgpd-et-vie-privee/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.xitiId === undefined) {
      return;
    }
    var Xt_param = 's=' + redacto.user.xitiId + '&p=',
      Xt_r,
      Xt_h,
      Xt_i,
      Xt_s,
      div = document.createElement('div');
    try {
      Xt_r = top.document.referrer;
    } catch (e) {
      Xt_r = document.referrer;
    }
    Xt_h = new Date();
    Xt_i = '<img style="display:none" border="0" alt="" ';
    Xt_i += 'src="https://logv3.xiti.com/hit.xiti?' + Xt_param;
    Xt_i +=
      '&hl=' +
      Xt_h.getHours() +
      'x' +
      Xt_h.getMinutes() +
      'x' +
      Xt_h.getSeconds();
    if (parseFloat(navigator.appVersion) >= 4) {
      Xt_s = screen;
      Xt_i +=
        '&r=' +
        Xt_s.width +
        'x' +
        Xt_s.height +
        'x' +
        Xt_s.pixelDepth +
        'x' +
        Xt_s.colorDepth;
    }

    div.innerHTML =
      Xt_i +
      '&ref=' +
      Xt_r.replace(/[<>"]/g, '').replace(/&/g, '$') +
      '" title="Internet Audience">';
    document.getElementsByTagName('body')[0].appendChild(div.firstChild);

    if (typeof redacto.user.xitiMore === 'function') {
      redacto.user.xitiMore();
    }
  },
};

// AT Internet
redacto.services.atinternet = {
  key: 'atinternet',
  type: 'analytic',
  name: 'AT Internet (privacy by design)',
  uri: 'https://www.atinternet.com/rgpd-et-vie-privee/',
  needConsent: true,
  safeanalytic: false,
  cookies: ['atidvisitor', 'atreman', 'atredir', 'atsession'],
  js: function () {
    'use strict';
    if (redacto.user.atLibUrl === undefined) {
      return;
    }

    if (redacto.user.atinternetAlreadyLoaded !== undefined) {
      return;
    }

    redacto.addScript(redacto.user.atLibUrl, '', function () {
      window.tag = new ATInternet.Tracker.Tag();

      if (typeof window.tag.privacy !== 'undefined') {
        window.tag.privacy.setVisitorOptin();
      }

      if (typeof redacto.user.atMore === 'function') {
        redacto.user.atMore();
      }

      if (redacto.user.atinternetSendData !== false) {
        window.tag.page.send();
      }
    });
  },
  fallback: function () {
    'use strict';
    if (redacto.user.atLibUrl === undefined) {
      return;
    }

    if (redacto.user.atNoFallback === true) {
      return;
    }

    redacto.user.atinternetAlreadyLoaded = true;

    redacto.addScript(redacto.user.atLibUrl, '', function () {
      window.tag = new ATInternet.Tracker.Tag();

      if (typeof window.tag.privacy !== 'undefined') {
        var visitorMode = window.tag.privacy.getVisitorMode();
        if (
          visitorMode !== null &&
          visitorMode.name !== undefined &&
          visitorMode.name == 'optout'
        ) {
          window.tag.privacy.setVisitorOptout();
        } else {
          window.tag.privacy.setVisitorMode('cnil', 'exempt');
        }
      }

      if (typeof redacto.user.atMore === 'function') {
        redacto.user.atMore();
      }

      if (redacto.user.atinternetSendData !== false) {
        window.tag.page.send();
      }
    });
  },
};

// AT Internet
redacto.services.atinternethightrack = {
  key: 'atinternethightrack',
  type: 'analytic',
  name: 'AT Internet',
  uri: 'https://www.atinternet.com/rgpd-et-vie-privee/',
  needConsent: true,
  cookies: ['atidvisitor', 'atreman', 'atredir', 'atsession'],
  js: function () {
    'use strict';
    if (redacto.user.atLibUrl === undefined) {
      return;
    }

    redacto.addScript(redacto.user.atLibUrl, '', function () {
      var tag = new ATInternet.Tracker.Tag();

      if (typeof redacto.user.atMore === 'function') {
        redacto.user.atMore();
      }
    });
  },
};

// youtube
redacto.services.youtube = {
  key: 'youtube',
  type: 'video',
  name: 'YouTube',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: ['VISITOR_INFO1_LIVE', 'YSC', 'PREF'],
  js: function () {
    'use strict';
    redacto.fallback(['youtube_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Youtube iframe',
        video_id = redacto.getElemAttr(x, 'videoID'),
        srcdoc = redacto.getElemAttr(x, 'srcdoc'),
        loading = redacto.getElemAttr(x, 'loading'),
        video_width = redacto.getElemAttr(x, 'width'),
        video_height = redacto.getElemAttr(x, 'height'),
        styleAttr = '',
        video_frame,
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen'),
        start = redacto.getElemAttr(x, 'start'),
        end = redacto.getElemAttr(x, 'end'),
        attrs = [
          'theme',
          'rel',
          'controls',
          'showinfo',
          'autoplay',
          'mute',
          'start',
          'end',
          'loop',
          'enablejsapi',
        ],
        params = attrs
          .filter(function (a) {
            return redacto.getElemAttr(x, a) !== '';
          })
          .map(function (a) {
            return a + '=' + redacto.getElemAttr(x, a);
          })
          .join('&');

      if (redacto.getElemAttr(x, 'loop') == 1) {
        params = params + '&playlist=' + video_id;
      }

      if (video_id === '') {
        return '';
      }
      if (video_width !== '') {
        styleAttr += 'width:' + redacto.getStyleSize(video_width) + ';';
      }
      if (video_height !== '') {
        styleAttr += 'height:' + redacto.getStyleSize(video_height) + ';';
      }

      if (srcdoc !== undefined && srcdoc !== null && srcdoc !== '') {
        srcdoc = 'srcdoc="' + srcdoc + '" ';
      } else {
        srcdoc = '';
      }

      if (loading !== undefined && loading !== null && loading !== '') {
        loading = 'loading ';
      } else {
        loading = '';
      }

      video_frame =
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="//www.youtube-nocookie.com/embed/' +
        video_id +
        '?' +
        params +
        '"' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        ' ' +
        srcdoc +
        ' ' +
        loading +
        '></iframe>';
      return video_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'youtube';
    redacto.fallback(['youtube_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// youtube playlist
redacto.services.youtubeplaylist = {
  key: 'youtubeplaylist',
  type: 'video',
  name: 'YouTube (playlist)',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: ['VISITOR_INFO1_LIVE', 'YSC', 'PREF'],
  js: function () {
    'use strict';
    redacto.fallback(['youtube_playlist_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Youtube iframe',
        playlist_id = redacto.getElemAttr(x, 'playlistID'),
        video_width = redacto.getElemAttr(x, 'width'),
        video_height = redacto.getElemAttr(x, 'height'),
        styleAttr = '',
        video_frame,
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen'),
        params =
          'theme=' +
          redacto.getElemAttr(x, 'theme') +
          '&rel=' +
          redacto.getElemAttr(x, 'rel') +
          '&controls=' +
          redacto.getElemAttr(x, 'controls') +
          '&showinfo=' +
          redacto.getElemAttr(x, 'showinfo') +
          '&autoplay=' +
          redacto.getElemAttr(x, 'autoplay') +
          '&mute=' +
          redacto.getElemAttr(x, 'mute');

      if (playlist_id === '') {
        return '';
      }
      if (video_width !== '') {
        styleAttr += 'width:' + redacto.getStyleSize(video_width) + ';';
      }
      if (video_height !== '') {
        styleAttr += 'height:' + redacto.getStyleSize(video_height) + ';';
      }
      video_frame =
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="//www.youtube-nocookie.com/embed/videoseries?list=' +
        playlist_id +
        '&' +
        params +
        '"' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>';
      return video_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'youtubeplaylist';
    redacto.fallback(['youtube_playlist_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// zopim
redacto.services.zopim = {
  key: 'zopim',
  type: 'support',
  name: 'Zopim',
  uri: 'https://www.zopim.com/privacy',
  needConsent: true,
  cookies: ['__zlcid', '__zprivacy'],
  js: function () {
    'use strict';
    if (redacto.user.zopimID === undefined) {
      return;
    }
    redacto.addScript('//v2.zopim.com/?' + redacto.user.zopimID);
  },
};

// kameleoon
redacto.services.kameleoon = {
  key: 'kameleoon',
  type: 'analytic',
  name: 'Kameleoon',
  uri: 'https://www.kameleoon.com/fr/compliance/rgpd',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.kameleoon !== undefined) {
      redacto.addScript(
        'https://' + redacto.user.kameleoon + '.kameleoon.eu/kameleoon.js'
      );
    }
  },
};

// linkedin insight
redacto.services.linkedininsighttag = {
  key: 'linkedininsighttag',
  type: 'ads',
  name: 'Linkedin Insight',
  uri: 'https://www.linkedin.com/legal/cookie-policy',
  needConsent: true,
  cookies: ['li_fat_id'],
  js: function () {
    'use strict';
    if (redacto.user.linkedininsighttag !== undefined) {
      window._linkedin_data_partner_ids =
        window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(redacto.user.linkedininsighttag);
    }

    redacto.addScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
  },
};

// xiti smartTag
redacto.services.xiti_smarttag = {
  key: 'xiti_smarttag',
  type: 'analytic',
  name: 'Xiti (SmartTag)',
  uri: 'https://www.atinternet.com/rgpd-et-vie-privee/',
  needConsent: true,
  cookies: [
    'atidvisitor',
    'atreman',
    'atredir',
    'atsession',
    'attvtreman',
    'attvtsession',
  ],
  js: function () {
    'use strict';
    if (redacto.user.xiti_smarttagLocalPath !== undefined) {
      redacto.addScript(
        redacto.user.xiti_smarttagLocalPath,
        'smarttag',
        null,
        null,
        'onload',
        'addTracker();'
      );
    } else {
      var xitiSmarttagId = redacto.user.xiti_smarttagSiteId;
      if (xitiSmarttagId === undefined) {
        return;
      }

      redacto.addScript(
        '//tag.aticdn.net/' + xitiSmarttagId + '/smarttag.js',
        'smarttag',
        null,
        null,
        'onload',
        'addTracker();'
      );
    }
  },
};

// facebook pixel
redacto.services.facebookpixel = {
  key: 'facebookpixel',
  type: 'ads',
  name: 'Facebook Pixel',
  uri: 'https://www.facebook.com/policy.php',
  needConsent: true,
  cookies: [
    'datr',
    'fr',
    'reg_ext_ref',
    'reg_fb_gate',
    'reg_fb_ref',
    'sb',
    'wd',
    'x-src',
    '_fbp',
  ],
  js: function () {
    'use strict';

    if (redacto.user.facebookpixelId === undefined) {
      return;
    }

    var n;
    if (window.fbq) return;
    n = window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    redacto.addScript('https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', redacto.user.facebookpixelId);
    fbq('track', 'PageView');

    if (typeof redacto.user.facebookpixelMore === 'function') {
      redacto.user.facebookpixelMore();
    }
  },
};

//Issuu
redacto.services.issuu = {
  key: 'issuu',
  type: 'other',
  name: 'Issuu',
  uri: 'https://issuu.com/legal/privacy',
  needConsent: true,
  cookies: ['__qca', 'iutk', 'mc'],
  js: function () {
    'use strict';
    redacto.fallback(['issuu_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Issuu iframe',
        issuu_id = redacto.getElemAttr(x, 'issuuID'),
        issuu_width = redacto.getElemAttr(x, 'width'),
        issuu_height = redacto.getElemAttr(x, 'height'),
        styleAttr = '',
        issuu_frame,
        issuu_embed;

      if (issuu_id === '') {
        return '';
      }
      if (issuu_width !== '') {
        styleAttr += 'width:' + redacto.getStyleSize(issuu_width) + ';';
      }
      if (issuu_height !== '') {
        styleAttr += 'height:' + redacto.getStyleSize(issuu_height) + ';';
      }

      if (issuu_id.match(/\d+\/\d+/)) {
        issuu_embed = '#' + issuu_id;
      } else if (issuu_id.match(/d=(.*)&u=(.*)/)) {
        issuu_embed = '?' + issuu_id;
      }

      issuu_frame =
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="//e.issuu.com/embed.html' +
        issuu_embed +
        '"></iframe>';

      return issuu_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'issuu';
    redacto.fallback(['issuu_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// webmecanik
redacto.services.webmecanik = {
  key: 'webmecanik',
  type: 'analytic',
  name: 'Webmecanik',
  uri: 'https://webmecanik.com/tos',
  needConsent: true,
  cookies: ['mtc_id', 'mtc_sid'],
  js: function () {
    'use strict';
    if (redacto.user.webmecanikurl === undefined) {
      return;
    }

    window.MauticTrackingObject = 'mt';
    window.mt =
      window.mt ||
      function () {
        window.mt.q = window.mt.q || [];
        window.mt.q.push(arguments);
      };

    redacto.addScript(redacto.user.webmecanikurl, '', function () {
      mt('send', 'pageview');
    });
  },
};

// google analytics multiple
redacto.services.multiplegtag = {
  key: 'multiplegtag',
  type: 'analytic',
  name: 'Google Analytics (gtag.js)',
  uri: 'https://support.google.com/analytics/answer/6004245',
  needConsent: true,
  cookies: (function () {
    var cookies = [
      '_ga',
      '_gat',
      '_gid',
      '__utma',
      '__utmb',
      '__utmc',
      '__utmt',
      '__utmz',
      '_gcl_au',
    ];

    if (redacto.user.multiplegtagUa !== undefined) {
      redacto.user.multiplegtagUa.forEach(function (ua) {
        cookies.push('_gat_gtag_' + ua.replace(/-/g, '_'));
        cookies.push('_ga_' + ua.replace(/G-/g, ''));
      });
    }

    return cookies;
  })(),
  js: function () {
    'use strict';
    window.dataLayer = window.dataLayer || [];

    if (redacto.user.multiplegtagUa !== undefined) {
      redacto.user.multiplegtagUa.forEach(function (ua) {
        redacto.addScript(
          'https://www.googletagmanager.com/gtag/js?id=' + ua,
          '',
          function () {
            window.gtag = function gtag() {
              dataLayer.push(arguments);
            };
            gtag('js', new Date());
            var additional_config_info =
              timeExpire !== undefined
                ? { anonymize_ip: true, cookie_expires: timeExpire / 1000 }
                : { anonymize_ip: true };
            gtag('config', ua, additional_config_info);
          }
        );
      });
    }
  },
  fallback: function () {
    if (redacto.parameters.googleConsentMode === true) {
      if (redacto.parameters.softConsentMode === false) {
        this.js();
      }
    }
  },
};

// Koban
redacto.services.koban = {
  key: 'koban',
  type: 'analytic',
  name: 'Koban',
  uri: 'https://koban.cloud/tos',
  needConsent: true,
  cookies: ['kbntrk'],
  js: function () {
    'use strict';
    if (redacto.user.kobanurl === undefined) {
      return;
    }
    if (redacto.user.kobanapi === undefined) {
      return;
    }
    window.KobanObject = 'kb';
    window.kb =
      window.kb ||
      function () {
        window.kb.q = window.kb.q || [];
        window.kb.q.push(arguments);
      };
    window.kb.l = new Date();
    kb('reg', redacto.user.kobanapi);
    redacto.addScript(redacto.user.kobanurl, '', function () {});
  },
};

// DEPRECATED, USE MATOMO CLOUD
redacto.services.matomo = {
  key: 'matomo',
  type: 'analytic',
  name: 'Matomo (privacy by design)',
  uri: 'https://matomo.org/faq/general/faq_146/',
  needConsent: false,
  cookies: [
    '_pk_ref',
    '_pk_cvar',
    '_pk_id',
    '_pk_ses',
    '_pk_hsr',
    'piwik_ignore',
    '_pk_uid',
  ],
  js: function () {
    'use strict';
    if (redacto.user.matomoId === undefined) {
      return;
    }

    window._paq = window._paq || [];
    window._paq.push(['setSiteId', redacto.user.matomoId]);
    window._paq.push(['setTrackerUrl', redacto.user.matomoHost + 'piwik.php']);
    window._paq.push(['setDoNotTrack', 1]);
    window._paq.push(['trackPageView']);
    window._paq.push(['setIgnoreClasses', ['no-tracking', 'colorbox']]);
    window._paq.push(['enableLinkTracking']);

    if (typeof redacto.user.matomoMore === 'function') {
      redacto.user.matomoMore();
    }

    window._paq.push([
      function () {
        var self = this;
        function getOriginalVisitorCookieTimeout() {
          var now = new Date(),
            nowTs = Math.round(now.getTime() / 1000),
            visitorInfo = self.getVisitorInfo();
          var createTs = parseInt(visitorInfo[2]);
          var cookieTimeout = 33696000; // 13 mois en secondes
          var originalTimeout = createTs + cookieTimeout - nowTs;
          return originalTimeout;
        }
        this.setVisitorCookieTimeout(getOriginalVisitorCookieTimeout());
      },
    ]);

    redacto.addScript(
      redacto.user.matomoHost + 'piwik.js',
      '',
      '',
      true,
      'defer',
      true
    );

    // waiting for piwik to be ready to check first party cookies
    var interval = setInterval(function () {
      if (typeof Piwik === 'undefined') return;

      clearInterval(interval);

      // make piwik/matomo cookie accessible by getting tracker
      Piwik.getTracker();

      // looping throught cookies
      var theCookies = document.cookie.split(';');
      for (var i = 1; i <= theCookies.length; i++) {
        var cookie = theCookies[i - 1].split('=');
        var cookieName = cookie[0].trim();

        // if cookie starts like a piwik one, register it
        if (cookieName.indexOf('_pk_') === 0) {
          redacto.services.matomo.cookies.push(cookieName);
        }
      }
    }, 100);
  },
};

// DEPRECATED, USE MATOMO CLOUD
redacto.services.matomohightrack = {
  key: 'matomohightrack',
  type: 'analytic',
  name: 'Matomo',
  uri: 'https://matomo.org/faq/general/faq_146/',
  needConsent: false,
  cookies: [
    '_pk_ref',
    '_pk_cvar',
    '_pk_id',
    '_pk_ses',
    '_pk_hsr',
    'piwik_ignore',
    '_pk_uid',
  ],
  js: function () {
    'use strict';
    if (redacto.user.matomoId === undefined) {
      return;
    }

    window._paq = window._paq || [];
    window._paq.push(['setSiteId', redacto.user.matomoId]);
    window._paq.push(['setTrackerUrl', redacto.user.matomoHost + 'piwik.php']);
    window._paq.push(['trackPageView']);
    window._paq.push(['setIgnoreClasses', ['no-tracking', 'colorbox']]);
    window._paq.push(['enableLinkTracking']);
    window._paq.push([
      function () {
        var self = this;
      },
    ]);

    redacto.addScript(
      redacto.user.matomoHost + 'piwik.js',
      '',
      '',
      true,
      'defer',
      true
    );

    // waiting for piwik to be ready to check first party cookies
    var interval = setInterval(function () {
      if (typeof Piwik === 'undefined') return;

      clearInterval(interval);
      Piwik.getTracker();

      var theCookies = document.cookie.split(';');
      for (var i = 1; i <= theCookies.length; i++) {
        var cookie = theCookies[i - 1].split('=');
        var cookieName = cookie[0].trim();

        if (cookieName.indexOf('_pk_') === 0) {
          redacto.services.matomo.cookies.push(cookieName);
        }
      }
    }, 100);
  },
};

// matomocloud
redacto.services.matomocloud = {
  key: 'matomocloud',
  type: 'analytic',
  name: 'Matomo Cloud (privacy by design)',
  uri: 'https://matomo.org/faq/general/faq_146/',
  needConsent: true,
  cookies: [
    '_pk_ref',
    '_pk_cvar',
    '_pk_id',
    '_pk_ses',
    '_pk_hsr',
    'mtm_consent',
    'matomo_ignore',
    'matomo_sessid',
  ],
  js: function () {
    'use strict';
    if (redacto.user.matomoId === undefined) {
      return;
    }

    window._paq = window._paq || [];

    if (redacto.user.matomoFullTracking === true) {
      window._paq.push(['requireCookieConsent']);
      window._paq.push(['setCookieConsentGiven']);
      window._paq.push(['trackAllContentImpressions']);
    } else {
      window._paq.push(['requireConsent']);
      window._paq.push(['setConsentGiven']);
    }

    window._paq.push(['setSiteId', redacto.user.matomoId]);
    window._paq.push(['setTrackerUrl', redacto.user.matomoHost + 'matomo.php']);
    window._paq.push(['enableLinkTracking']);

    if (redacto.user.matomoDontTrackPageView !== true) {
      window._paq.push(['trackPageView']);
    }

    if (
      redacto.user.matomoCustomJSPath === undefined ||
      redacto.user.matomoCustomJSPath == ''
    ) {
      redacto.addScript(
        'https://cdn.matomo.cloud/matomo.js',
        '',
        '',
        true,
        'defer',
        true
      );
    } else {
      redacto.addScript(
        redacto.user.matomoCustomJSPath,
        '',
        '',
        true,
        'defer',
        true
      );
    }

    if (typeof redacto.user.matomocloudMore === 'function') {
      redacto.user.matomocloudMore();
    }

    // waiting for Matomo to be ready to check first party cookies
    var interval = setInterval(function () {
      if (typeof Matomo === 'undefined') return;

      clearInterval(interval);

      // make Matomo cookie accessible by getting tracker
      Matomo.getTracker();

      // looping through cookies
      var theCookies = document.cookie.split(';');
      for (var i = 1; i <= theCookies.length; i++) {
        var cookie = theCookies[i - 1].split('=');
        var cookieName = cookie[0].trim();

        // if cookie starts like a matomo one, register it
        if (cookieName.indexOf('_pk_') === 0) {
          redacto.services.matomo.cookies.push(cookieName);
        }
      }
    }, 100);
  },
  fallback: function () {
    'use strict';
    if (redacto.user.matomoId === undefined) {
      return;
    }

    window._paq = window._paq || [];
    if (redacto.user.matomoFullTracking === true) {
      window._paq.push(['requireCookieConsent']);
    } else {
      window._paq.push(['requireConsent']);
    }
    window._paq.push(['setSiteId', redacto.user.matomoId]);
    window._paq.push(['setTrackerUrl', redacto.user.matomoHost + 'matomo.php']);
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);

    if (typeof redacto.user.matomocloudMore === 'function') {
      redacto.user.matomocloudMore();
    }

    if (
      redacto.user.matomoCustomJSPath === undefined ||
      redacto.user.matomoCustomJSPath == ''
    ) {
      redacto.addScript(
        'https://cdn.matomo.cloud/matomo.js',
        '',
        '',
        true,
        'defer',
        true
      );
    } else {
      redacto.addScript(
        redacto.user.matomoCustomJSPath,
        '',
        '',
        true,
        'defer',
        true
      );
    }
  },
};

// matomotm
redacto.services.matomotm = {
  key: 'matomotm',
  type: 'api',
  name: 'Matomo Tag Manager',
  uri: 'https://matomo.org/privacy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.matomotmUrl === undefined) {
      return;
    }

    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });

    redacto.addScript(redacto.user.matomotmUrl);
  },
  fallback: function () {
    'use strict';
    if (redacto.user.matomotmUrl === undefined) {
      return;
    }

    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push(['disableCookies']);
    _mtm.push(['disableBrowserFeatureDetection']);
    _mtm.push(['setAnonymizeIp', true]);
    _mtm.push(['disablePerformanceTracking']);
    _mtm.push(['disableHeartBeatTimer']);
    _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });

    redacto.addScript(redacto.user.matomotmUrl);
  },
};

// Hotjar
redacto.services.hotjar = {
  key: 'hotjar',
  type: 'analytic',
  name: 'Hotjar',
  uri: 'https://help.hotjar.com/hc/en-us/categories/115001323967-About-Hotjar',
  needConsent: true,
  cookies: [
    'hjClosedSurveyInvites',
    '_hjDonePolls',
    '_hjMinimizedPolls',
    '_hjShownFeedbackMessage',
    '_hjAbsoluteSessionInProgress',
    '_hjid',
  ],
  js: function () {
    'use strict';
    if (
      redacto.user.hotjarId === undefined ||
      redacto.user.HotjarSv === undefined
    ) {
      return;
    }
    window.hj =
      window.hj ||
      function () {
        (window.hj.q = window.hj.q || []).push(arguments);
      };
    window._hjSettings = {
      hjid: redacto.user.hotjarId,
      hjsv: redacto.user.HotjarSv,
    };
    var uri = 'https://static.hotjar.com/c/hotjar-';
    var extension = '.js?sv=';
    redacto.addScript(
      uri + window._hjSettings.hjid + extension + window._hjSettings.hjsv
    );
  },
};

// bing ads universal event tracking
redacto.services.bingads = {
  key: 'bingads',
  type: 'ads',
  name: 'Bing Ads Universal Event Tracking',
  uri: 'https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads',
  needConsent: true,
  cookies: ['_uetmsclkid', '_uetvid', '_uetsid'],
  js: function () {
    'use strict';

    if (redacto.user.bingadsID === undefined) {
      return;
    }

    window.uetq = window.uetq || [];

    redacto.addScript('https://bat.bing.com/bat.js', '', function () {
      var bingadsCreate = { ti: redacto.user.bingadsID };

      if ('bingadsStoreCookies' in redacto.user) {
        bingadsCreate['storeConvTrackCookies'] =
          redacto.user.bingadsStoreCookies;
      }

      bingadsCreate.q = window.uetq;
      window.uetq = new UET(bingadsCreate);
      window.uetq.push('pageLoad');

      if (typeof redacto.user.bingadsMore === 'function') {
        redacto.user.bingadsMore();
      }
    });
  },
  fallback: function () {
    if (redacto.parameters.bingConsentMode === true) {
      if (redacto.parameters.softConsentMode === false) {
        this.js();
      }
    }
  },
};

//Matterport
redacto.services.matterport = {
  key: 'matterport',
  type: 'other',
  name: 'Matterport',
  uri: 'https://matterport.com/es/legal/privacy-policy/',
  needConsent: true,
  cookies: ['__cfduid', 'ajs_anonymous_id', 'ajs_group_id', 'ajs_user_id'],
  js: function () {
    'use strict';
    redacto.fallback(['matterport'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Matterport iframe',
        matterport_id = redacto.getElemAttr(x, 'matterportID'),
        matterport_width = redacto.getElemAttr(x, 'width'),
        matterport_height = redacto.getElemAttr(x, 'height'),
        styleAttr = '',
        matterport_parameters = redacto.getElemAttr(x, 'parameters'),
        matterport_allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen'),
        matterport_frame;

      if (matterport_id === '') {
        return '';
      }
      if (matterport_width !== '') {
        styleAttr += 'width:' + redacto.getStyleSize(matterport_width) + ';';
      }
      if (matterport_height !== undefined) {
        styleAttr += 'height:' + redacto.getStyleSize(matterport_height) + ';';
      }
      if (matterport_parameters === '') {
        return '';
      }

      matterport_frame =
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="https://my.matterport.com/show/?m=' +
        matterport_id +
        '&utm_source=hit-content' +
        matterport_parameters +
        '"' +
        (matterport_allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>';
      return matterport_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'matterport';
    redacto.fallback(['matterport'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// Adform
redacto.services.adform = {
  key: 'adform',
  type: 'ads',
  name: 'Adform',
  uri: 'https://site.adform.com/privacy-center/overview/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (
      redacto.user.adformpm === undefined ||
      redacto.user.adformpagename === undefined
    ) {
      return;
    }

    window._adftrack = {
      pm: redacto.user.adformpm,
      divider: encodeURIComponent('|'),
      pagename: encodeURIComponent(redacto.user.adformpagename),
    };

    redacto.addScript(
      'https://track.adform.net/serving/scripts/trackpoint/async/'
    );
  },
};

// Active Campaign
redacto.services.activecampaign = {
  key: 'activecampaign',
  type: 'ads',
  name: 'Active Campaign',
  uri: 'https://www.activecampaign.com/privacy-policy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.actid === undefined) {
      return;
    }

    window.trackcmp_email = '';

    redacto.addScript(
      'https://trackcmp.net/visit?actid=' +
        redacto.user.actid +
        '&e=' +
        encodeURIComponent(trackcmp_email) +
        '&r=' +
        encodeURIComponent(document.referrer) +
        '&u=' +
        encodeURIComponent(window.location.href)
    );
  },
};

// tawk.to
redacto.services.tawkto = {
  key: 'tawkto',
  type: 'support',
  name: 'Tawk.to chat',
  uri: 'https://www.tawk.to/data-protection/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    if (redacto.user.tawktoId === undefined) {
      return;
    }

    redacto.user.tawktoWidgetId = redacto.user.tawktoWidgetId || 'default';

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    redacto.addScript(
      'https://embed.tawk.to/' +
        redacto.user.tawktoId +
        '/' +
        redacto.user.tawktoWidgetId
    );
  },
};

// getquanty
redacto.services.getquanty = {
  key: 'getquanty',
  type: 'analytic',
  name: 'GetQuanty',
  uri: 'https://www.getquanty.com/mentions-legales/',
  needConsent: true,
  cookies: [
    '_first_pageview',
    'eqy_sessionid',
    'eqy_siteid',
    'cluid',
    'eqy_company',
    'cluid',
    'gq_utm',
    '_jsuid',
  ],
  js: function () {
    'use strict';
    if (redacto.user.getguanty === undefined) {
      return;
    }

    if (redacto.user.getquantyAlreadyLoaded !== undefined) {
      return;
    }

    redacto.addScript(
      'https://get.smart-data-systems.com/gq?site_id=' +
        redacto.user.getguanty +
        '&consent=1'
    );
  },
  fallback: function () {
    'use strict';
    if (redacto.user.getguanty === undefined) {
      return;
    }

    redacto.user.getquantyAlreadyLoaded = true;

    redacto.addScript(
      'https://get.smart-data-systems.com/gq?site_id=' +
        redacto.user.getguanty +
        '&notrack=1'
    );
  },
};

// emolytics
redacto.services.emolytics = {
  key: 'emolytics',
  type: 'analytic',
  name: 'Emolytics',
  uri: 'https://www.emolytics.com/main/privacy-policy.php',
  needConsent: true,
  cookies: [
    '__hssc',
    '__hssrc',
    '__hstc',
    '_ga',
    '_gid',
    'hubspotutk',
    'lang',
    'incap_ses_',
    'nlbi_',
    'visid_incap_',
  ],
  js: function () {
    'use strict';
    if (redacto.user.emolyticsID === undefined) {
      return;
    }
    var scriptEmolytics = document.createElement('script');
    scriptEmolytics.text =
      'var getsmily_id="' + redacto.user.emolyticsID + '";';
    document.getElementsByTagName('body')[0].appendChild(scriptEmolytics);
    redacto.addScript('https://cdn.emolytics.com/script/emolytics-widget.js');
  },
};

// youtubeapi
redacto.services.youtubeapi = {
  key: 'youtubeapi',
  type: 'video',
  name: 'Youtube (Js API)',
  uri: 'https://policies.google.com/privacy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript('https://www.youtube.com/player_api');
  },
};

// Facil'ITI
redacto.services.faciliti = {
  key: 'faciliti',
  type: 'other',
  name: "Facil'ITI",
  uri: 'https://www.facil-iti.com/legal-terms/',
  needConsent: true,
  cookies: ['FACIL_ITI'],
  js: function () {
    'use strict';
    if (redacto.user.facilitiID === undefined) {
      return;
    }

    (function () {
      var fs = document.createElement('script');
      fs.setAttribute(
        'src',
        'https://cdn.facil-iti.app/tags/faciliti-tag.min.js'
      );
      fs.dataset.applicationIdentifier = redacto.user.facilitiID;
      document.head.appendChild(fs);
    })();
  },
};

// userlike
redacto.services.userlike = {
  key: 'userlike',
  type: 'support',
  name: 'Userlike',
  uri: 'https://www.userlike.com/en/terms#privacy-policy',
  needConsent: true,
  cookies: ['uslk_s', 'uslk_e'],
  js: function () {
    'use strict';
    if (redacto.user.userlikeKey === undefined) {
      return;
    }
    redacto.addScript(
      '//userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/' +
        redacto.user.userlikeKey
    );
  },
};

// adobeanalytics
redacto.services.adobeanalytics = {
  key: 'adobeanalytics',
  type: 'analytic',
  name: 'Adobe Analytics',
  uri: 'https://www.adobe.com/privacy/policy.html',
  needConsent: true,
  cookies: ['s_ecid', 's_cc', 's_sq', 's_vi', 's_fid'],
  js: function () {
    'use strict';
    if (redacto.user.adobeanalyticskey === undefined) {
      return;
    }
    redacto.addScript(
      '//assets.adobedtm.com/launch-' +
        redacto.user.adobeanalyticskey +
        '.min.js'
    );
  },
};

// woopra customer journey analytics
redacto.services.woopra = {
  key: 'woopra',
  type: 'analytic',
  name: 'Woopra Customer Journey Analytics',
  uri: 'https://www.woopra.com/privacy',
  needConsent: true,
  cookies: ['wooTracker', 'intercom-session-erbfalba', 'intercom-id-erbfalba'],
  js: function () {
    'use strict';

    if (redacto.user.woopraDomain === undefined) {
      return;
    }

    (function () {
      var t,
        i,
        e,
        n = window,
        o = document,
        a = arguments,
        s = 'script',
        r = [
          'config',
          'track',
          'identify',
          'visit',
          'push',
          'call',
          'trackForm',
          'trackClick',
        ],
        c = function () {
          var t,
            i = this;
          for (i._e = [], t = 0; r.length > t; t++)
            (function (t) {
              i[t] = function () {
                return (
                  i._e.push(
                    [t].concat(Array.prototype.slice.call(arguments, 0))
                  ),
                  i
                );
              };
            })(r[t]);
        };
      for (n._w = n._w || {}, t = 0; a.length > t; t++)
        n._w[a[t]] = n[a[t]] = n[a[t]] || new c();
      (i = o.createElement(s)),
        (i.async = 1),
        (i.src = '//static.woopra.com/js/w.js'),
        (e = o.getElementsByTagName(s)[0]),
        e.parentNode.insertBefore(i, e);
    })('woopra');

    woopra.config({
      domain: redacto.user.woopraDomain,
    });
    woopra.track();
  },
};

// ausha
redacto.services.ausha = {
  key: 'ausha',
  type: 'video',
  name: 'Ausha',
  uri: 'https://www.ausha.co/protection-personal-data/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['ausha_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Ausha iframe',
        player_height = redacto.getElemAttr(x, 'data-height'),
        podcast_id = redacto.getElemAttr(x, 'data-podcast-id'),
        player_id = redacto.getElemAttr(x, 'data-player-id'),
        playlist = redacto.getElemAttr(x, 'data-playlist'),
        useshowid = redacto.getElemAttr(x, 'data-useshowid'),
        color = redacto.getElemAttr(x, 'data-color');

      if (podcast_id === '') {
        return '';
      }

      var src =
        'https://player.ausha.co/index.html?podcastId=' + podcast_id + '&v=3';

      if (useshowid == '1') {
        src =
          'https://player.ausha.co/index.html?showId=' + podcast_id + '&v=3';
      }

      if (playlist && playlist.length > 0) src += '&playlist=' + playlist;
      if (color && color.length > 0)
        src += '&color=' + color.replace('#', '%23');
      if (player_id && player_id.length > 0) src += '&playerId=' + player_id;

      return (
        '<iframe title="' +
        frame_title +
        '" id="' +
        player_id +
        '" loading="lazy" style="width:100%;height:' +
        redacto.getStyleSize(player_height) +
        ';" src="' +
        src +
        '"></iframe>'
      );
    });

    redacto.addScript('//player.ausha.co/ausha-player.js', 'ausha-player');
  },
  fallback: function () {
    'use strict';
    redacto.fallback(['ausha_player'], function (elem) {
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'data-height')
      );
      return redacto.engage('ausha');
    });
  },
};

// visiblee
redacto.services.visiblee = {
  key: 'visiblee',
  type: 'analytic',
  name: 'Visiblee',
  uri: 'https://confidentiality.visiblee.io/fr/confidentialite',
  needConsent: true,
  cookies: [
    'visitor_v2',
    redacto.user.visibleedomain,
    'check',
    'campaign_ref_' + redacto.user.visibleedomain,
    'reload_' + redacto.user.visibleedomain,
  ],
  js: function () {
    'use strict';

    if (redacto.user.visibleeclientid === undefined) {
      return;
    }
    redacto.addScript(
      '//www.link-page.info/tracking_' + redacto.user.visibleeclientid + '.js',
      'visiblee'
    );
  },
};

// bandcamp
redacto.services.bandcamp = {
  key: 'bandcamp',
  type: 'video',
  name: 'Bandcamp',
  uri: 'https://bandcamp.com',
  readmoreLink: 'https://bandcamp.com/privacy',
  needConsent: true,
  cookies: ['client_id', 'BACKENDID', '_comm_playlist'],
  js: function () {
    'use strict';
    redacto.fallback(['bandcamp_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title') || 'Bandcamp iframe',
        album_id = redacto.getElemAttr(x, 'albumID'),
        bandcamp_width = redacto.getElemAttr(x, 'width'),
        bandcamp_height = redacto.getElemAttr(x, 'height'),
        styleAttr = '',
        attrs = [
          'size',
          'bgcol',
          'linkcol',
          'artwork',
          'minimal',
          'tracklist',
          'package',
          'transparent',
        ],
        params = attrs
          .filter(function (a) {
            return redacto.getElemAttr(x, a) !== '';
          })
          .map(function (a) {
            if (a && a.length > 0) return a + '=' + redacto.getElemAttr(x, a);
          })
          .join('/');

      if (album_id === '') {
        return '';
      }

      if (bandcamp_width !== '') {
        styleAttr += 'width:' + redacto.getStyleSize(bandcamp_width) + ';';
      }
      if (bandcamp_height !== '') {
        styleAttr += 'height:' + redacto.getStyleSize(bandcamp_height) + ';';
      }

      var src =
        'https://bandcamp.com/EmbeddedPlayer/album=' + album_id + '/' + params;

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        src +
        '" style="' +
        styleAttr +
        '" allowfullscreen seamless></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    redacto.fallback(['bandcamp_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage('bandcamp');
    });
  },
};

// Discord Widget
redacto.services.discord = {
  key: 'discord',
  type: 'social',
  name: 'Discord (Server Widget)',
  needConsent: true,
  cookies: [
    '__cfruid',
    '__dcfduid',
    '_ga',
    '_gcl_au',
    'OptanonConsent',
    'locale',
    '_gid',
  ],
  uri: 'https://discord.com/privacy',
  js: function () {
    'use strict';
    redacto.fallback(['discord_widget'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Discord iframe',
        id = redacto.getElemAttr(x, 'guildID'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');
      var widgetURL = 'https://discord.com/widget?id=' + id;

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="' +
        widgetURL +
        '"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'discord';
    redacto.fallback(['discord_widget'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// Google Maps
redacto.services.maps_noapi = {
  key: 'maps_noapi',
  type: 'other',
  name: 'Google Maps',
  needConsent: true,
  cookies: ['NID', 'OGPC', '1P_JAR', 'CONSENT'],
  uri: 'https://policies.google.com/privacy',
  js: function () {
    'use strict';
    redacto.fallback(['googlemaps_embed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Google maps iframe',
        id = redacto.getElemAttr(x, 'id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');
      var widgetURL = 'https://www.google.com/maps/embed?pb=' + id;

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        'border:0;" src="' +
        widgetURL +
        '" allowfullscreen loading="lazy"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'maps_noapi';
    redacto.fallback(['googlemaps_embed'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// hCaptcha
redacto.services.hcaptcha = {
  key: 'hcaptcha',
  type: 'other',
  name: 'hCaptcha',
  needConsent: true,
  cookies: [],
  uri: 'https://www.hcaptcha.com/privacy',
  js: function () {
    'use strict';
    redacto.fallback(['h-captcha'], '');
    redacto.addScript('https://hcaptcha.com/1/api.js', 'hcaptcha');
  },
  fallback: function () {
    'use strict';
    var id = 'hcaptcha';
    redacto.fallback(['h-captcha'], redacto.engage(id));
  },
};

// France Culture
redacto.services.fculture = {
  key: 'fculture',
  type: 'video',
  name: 'France Culture',
  needConsent: true,
  cookies: [
    '_gid',
    'didomi_token',
    'outbrain_cid_fetch',
    'xtvrn',
    'xtant',
    'YSC',
    'ABTasty',
    'xtan',
    'ABTastySession',
    'xtidc',
    '_ga',
    'VISITOR_INFO1_LIVE',
    'euconsent-v2',
    'v1st',
    'dmvk',
    'ts',
    'VISITOR_INFO1_LIVE',
    'YSC',
  ],
  uri: 'https://www.radiofrance.com/politique-d-utilisation-des-cookies-sur-les-sites-internet-du-groupe-radio-france',
  js: function () {
    'use strict';
    redacto.fallback(['fculture_embed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'France culture iframe',
        id = redacto.getElemAttr(x, 'id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="https://www.franceculture.fr/player/export-reecouter?content=' +
        id +
        '" style="' +
        styleAttr +
        '"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'fculture';
    redacto.fallback(['fculture_embed'], redacto.engage(id));
  },
};

// Acast
redacto.services.acast = {
  key: 'acast',
  type: 'video',
  name: 'Acast',
  needConsent: true,
  cookies: ['intercom-id-ayi0335i', 'intercom-session-ayi0335i'],
  uri: 'https://www.acast.com/en/privacy',
  js: function () {
    'use strict';
    redacto.fallback(['acast_embed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Acast iframe',
        id = redacto.getElemAttr(x, 'id1'),
        id2 = redacto.getElemAttr(x, 'id2'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        seek = redacto.getElemAttr(x, 'seek');
      var widgetURL =
        'https://embed.acast.com/' + id + '/' + id2 + '?seek=' + seek;

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        widgetURL +
        '" style="border: none; overflow: hidden;' +
        styleAttr +
        '"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'acast';
    redacto.fallback(['acast_embed'], redacto.engage(id));
  },
};

// Mixcloud
redacto.services.mixcloud = {
  key: 'mixcloud',
  type: 'video',
  name: 'Mixcloud',
  needConsent: true,
  cookies: [
    'UID',
    '_gat',
    '__stripe_mid',
    '_gid',
    '_ga',
    'c',
    'csrftoken',
    '__stripe_sid',
    'mx_t',
  ],
  uri: 'https://www.mixcloud.com/privacy/',
  js: function () {
    'use strict';
    redacto.fallback(['mixcloud_embed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Mixcloud iframe',
        id = redacto.getElemAttr(x, 'id'),
        hidecover = redacto.getElemAttr(x, 'hidecover'),
        mini = redacto.getElemAttr(x, 'mini'),
        light = redacto.getElemAttr(x, 'light'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="https://www.mixcloud.com/widget/iframe/?hide_cover=' +
        hidecover +
        '&mini=' +
        mini +
        '&light=' +
        light +
        '&feed=' +
        id +
        '"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'mixcloud';
    redacto.fallback(['mixcloud_embed'], redacto.engage(id));
  },
};

// Google Agenda
redacto.services.gagenda = {
  key: 'gagenda',
  type: 'other',
  name: 'Google Agenda',
  needConsent: true,
  cookies: ['CONSENT', 'NID'],
  uri: 'https://policies.google.com/privacy',
  js: function () {
    'use strict';
    redacto.fallback(['gagenda_embed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Google agenda iframe',
        calendar_data = redacto.getElemAttr(x, 'data'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" loading="lazy" style="' +
        styleAttr +
        'border-width:0" src="https://www.google.com/calendar/embed?' +
        calendar_data +
        '"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'gagenda';
    redacto.fallback(['gagenda_embed'], redacto.engage(id));
  },
};

// Google Docs
redacto.services.gdocs = {
  key: 'gdocs',
  type: 'other',
  name: 'Google Docs',
  needConsent: true,
  cookies: ['CONSENT', 'NID'],
  uri: 'https://policies.google.com/privacy',
  js: function () {
    'use strict';
    redacto.fallback(['gdocs_embed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Google docs iframe',
        id = redacto.getElemAttr(x, 'id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="https://docs.google.com/document/d/e/' +
        id +
        '/pub?embedded=true"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'gdocs';
    redacto.fallback(['gdocs_embed'], redacto.engage(id));
  },
};

// Google Sheets
redacto.services.gsheets = {
  key: 'gsheets',
  type: 'other',
  name: 'Google Sheets',
  needConsent: true,
  cookies: ['CONSENT', 'NID'],
  uri: 'https://policies.google.com/privacy',
  js: function () {
    'use strict';
    redacto.fallback(['gsheets_embed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Google sheets iframe',
        id = redacto.getElemAttr(x, 'id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        headers = redacto.getElemAttr(x, 'headers');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="https://docs.google.com/spreadsheets/d/e/' +
        id +
        '/pubhtml?widget=true&amp;headers=' +
        headers +
        '"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'gsheets';
    redacto.fallback(['gsheets_embed'], redacto.engage(id));
  },
};

// Google Slides
redacto.services.gslides = {
  key: 'gslides',
  type: 'other',
  name: 'Google Slides',
  needConsent: true,
  cookies: ['CONSENT', 'NID'],
  uri: 'https://policies.google.com/privacy',
  js: function () {
    'use strict';
    redacto.fallback(['gslides_embed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Google slides iframe',
        id = redacto.getElemAttr(x, 'id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        autostart = redacto.getElemAttr(x, 'autostart'),
        loop = redacto.getElemAttr(x, 'loop'),
        delay = redacto.getElemAttr(x, 'delay');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="https://docs.google.com/presentation/d/e/' +
        id +
        '/embed?start=' +
        autostart +
        '&loop=' +
        loop +
        '&delayms=' +
        delay +
        '" allowfullscreen mozallowfullscreen webkitallowfullscreen></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'gslides';
    redacto.fallback(['gslides_embed'], redacto.engage(id));
  },
};

// Google Forms
redacto.services.gforms = {
  key: 'gforms',
  type: 'other',
  name: 'Google Forms',
  needConsent: true,
  cookies: ['CONSENT', 'NID'],
  uri: 'https://policies.google.com/privacy',
  js: function () {
    'use strict';
    redacto.fallback(['gforms_embed'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Google forms iframe',
        id = redacto.getElemAttr(x, 'id'),
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="https://docs.google.com/forms/d/e/' +
        id +
        '/viewform?embedded=true"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'gforms';
    redacto.fallback(['gforms_embed'], redacto.engage(id));
  },
};

// Google Optimize
redacto.services.goptimize = {
  key: 'goptimize',
  type: 'other',
  name: 'Google Optimize',
  needConsent: true,
  cookies: ['CONSENT', 'NID'],
  uri: 'https://policies.google.com/privacy',
  js: function () {
    'use strict';

    if (redacto.user.goptimize === undefined) {
      return;
    }

    redacto.addScript(
      'https://www.googleoptimize.com/optimize.js?id=' + redacto.user.goptimize
    );
  },
};

// Marketo munchkin
redacto.services.marketomunchkin = {
  key: 'marketomunchkin',
  type: 'api',
  name: 'Marketo munchkin',
  uri: 'https://documents.marketo.com/legal/cookies',
  needConsent: true,
  cookies: ['OptAnon', '_mkto_trk'],
  js: function () {
    'use strict';
    if (redacto.user.marketomunchkinkey === undefined) {
      return;
    }
    var didInit = false;
    function initMunchkin() {
      if (didInit === false) {
        didInit = true;
        Munchkin.init(redacto.user.marketomunchkinkey);
      }
    }
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '//munchkin.marketo.net/munchkin.js';
    s.onreadystatechange = function () {
      if (this.readyState == 'complete' || this.readyState == 'loaded') {
        initMunchkin();
      }
    };
    s.onload = initMunchkin;
    document.getElementsByTagName('head')[0].appendChild(s);
  },
};

// outbrain
redacto.services.outbrain = {
  key: 'outbrain',
  type: 'ads',
  name: 'Outbrain',
  uri: 'https://www.outbrain.com/fr/advertisers/guidelines/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    redacto.addScript('https://widgets.outbrain.com/outbrain.js');
  },
};

// affilae
redacto.services.affilae = {
  key: 'affilae',
  type: 'ads',
  name: 'Affilae',
  uri: 'https://affilae.com/en/privacy-cookie-policy/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.affilae === undefined) {
      return;
    }

    window._ae = { pid: redacto.user.affilae };

    redacto.addScript('https://static.affilae.com/ae-v3.5.js');
  },
};

// Canal-U.tv
redacto.services.canalu = {
  key: 'canalu',
  type: 'video',
  name: 'Canal-U.tv',
  uri: 'https://www.canal-u.tv/conditions-generales-utilisations',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['canalu_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Canal-u.tv iframe',
        video_title = redacto.getElemAttr(x, 'videoTitle'),
        frame_url = 'https://www.canal-u.tv/embed/' + video_title,
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="' +
        frame_url +
        '?width=100%&amp;height=100%" ' +
        'style="' +
        styleAttr +
        '" ' +
        'allowfullscreen>' +
        '</iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    redacto.fallback(['canalu_player'], function (elem) {
      return redacto.engage('canalu');
    });
  },
};

// WebTV Normandie Université
redacto.services.webtvnu = {
  key: 'webtvnu',
  type: 'video',
  name: 'WebTV Normandie Université',
  uri: 'https://docs.google.com/document/d/1tpVclj4QBoAq1meSZgYrpNECwp7dbmb_IhICY3sTl9c/edit',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['webtvnu_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'WebTV Normandie Université iframe',
        frame_url =
          'https://webtv.normandie-univ.fr/permalink/' +
          redacto.getElemAttr(x, 'videoID') +
          '/iframe/',
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" style="' +
        styleAttr +
        '" src="' +
        frame_url +
        '" allowfullscreen allow="autoplay"></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    redacto.fallback(['webtvnu_player'], function (elem) {
      return redacto.engage('webtvnu');
    });
  },
};

// studizz
redacto.services.studizz = {
  key: 'studizz',
  type: 'support',
  name: 'Studizz Chatbot',
  uri: 'https://group.studizz.fr/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.studizzToken === undefined) {
      return;
    }

    redacto.addScript(
      'https://webchat.studizz.fr/webchat.js?token=' + redacto.user.studizzToken
    );
  },
};

// meteofrance
redacto.services.meteofrance = {
  key: 'meteofrance',
  type: 'api',
  name: 'Météo France',
  uri: 'https://meteofrance.com/politique-de-confidentialite',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tac_meteofrance'], function (x) {
      var frame_title =
          redacto.getElemAttr(x, 'title') || 'Météo France iframe',
        width = redacto.getElemAttr(x, 'width'),
        height = redacto.getElemAttr(x, 'height'),
        insee = redacto.getElemAttr(x, 'data-insee'),
        allowfullscreen = redacto.getElemAttr(x, 'allowfullscreen');

      var styleAttr =
        (width !== '' ? 'width:' + redacto.getStyleSize(width) + ';' : '') +
        (height !== '' ? 'height:' + redacto.getStyleSize(height) + ';' : '');

      return (
        '<iframe title="' +
        frame_title +
        '" src="https://meteofrance.com/widget/prevision/' +
        insee +
        '" style="' +
        styleAttr +
        '" allowtransparency ' +
        (allowfullscreen == '0'
          ? ''
          : ' webkitallowfullscreen mozallowfullscreen allowfullscreen') +
        '></iframe>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'meteofrance';
    redacto.fallback(['tac_meteofrance'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'height')
      );
      return redacto.engage(id);
    });
  },
};

// m6meteo
redacto.services.m6meteo = {
  key: 'm6meteo',
  type: 'api',
  name: 'M6 Météo',
  uri: 'https://gdpr.m6tech.net/charte-confidentialite-m6-web-meteocity.pdf',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.fallback(['tac_m6meteo'], function (x) {
      var id = redacto.getElemAttr(x, 'data-id');

      redacto.addScript('https://www.meteocity.com/widget/js/' + id);

      return (
        '<div id="cont_' +
        id +
        '"><div id="spa_' +
        id +
        '"><a id="a_' +
        id +
        '" href="#"></a> ©<a target="_top" href="https://www.meteocity.com">M6météo</a></div></div>'
      );
    });
  },
  fallback: function () {
    'use strict';
    var id = 'm6meteo';
    redacto.fallback(['tac_m6meteo'], function (elem) {
      return redacto.engage(id);
    });
  },
};

// mtcaptcha
redacto.services.mtcaptcha = {
  key: 'mtcaptcha',
  type: 'api',
  name: 'MTcaptcha',
  uri: 'https://www.mtcaptcha.com',
  readmoreLink: 'https://www.mtcaptcha.com/faq-cookie-declaration',
  needConsent: true,
  cookies: ['mtv1Pulse', 'mtv1ConfSum', 'mtv1Pong'],

  js: function () {
    if (redacto.user.mtcaptchaSitekey === undefined) {
      return;
    }

    window.mtcaptchaConfig = {
      sitekey: redacto.user.mtcaptchaSitekey,
    };

    redacto.addScript(
      'https://service.mtcaptcha.com/mtcv1/client/mtcaptcha.min.js'
    );
    redacto.addScript(
      'https://service2.mtcaptcha.com/mtcv1/client/mtcaptcha2.min.js'
    );
  },
};

// Internet Archive / https://archive.org
redacto.services.archive = {
  key: 'archive',
  type: 'video',
  name: 'Internet Archive',
  uri: 'https://archive.org/about/terms.php',
  needConsent: true,
  cookies: ['abtest-identifier', 'donation-identifier'],
  js: function () {
    'use strict';
    redacto.fallback(['archive_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Internet Archive iframe',
        video_id = redacto.getElemAttr(x, 'data-videoID'),
        video_width = redacto.getElemAttr(x, 'data-width'),
        video_height = redacto.getElemAttr(x, 'data-height'),
        styleAttr = '',
        video_frame;

      if (video_id === '') {
        return '';
      }
      if (video_width !== '') {
        styleAttr += 'width:' + redacto.getStyleSize(video_width) + ';';
      }
      if (video_height !== '') {
        styleAttr += 'height:' + redacto.getStyleSize(video_height) + ';';
      }
      video_frame =
        '<iframe title="' +
        frame_title +
        '" src="https://archive.org/embed/' +
        video_id +
        '" style="' +
        styleAttr +
        '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
      return video_frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'archive';
    redacto.fallback(['archive_player'], function (elem) {
      elem.style.width = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'data-width')
      );
      elem.style.height = redacto.getStyleSize(
        redacto.getElemAttr(elem, 'data-height')
      );
      return redacto.engage(id);
    });
  },
};

// Gallica
redacto.services.gallica = {
  key: 'gallica',
  type: 'other',
  name: 'Gallica',
  uri: 'https://gallica.bnf.fr/edit/und/conditions-dutilisation-des-contenus-de-gallica',
  needConsent: true,
  cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt', 'xtvrn'],
  js: function () {
    'use strict';
    redacto.fallback(['gallica_player'], function (x) {
      var frame_title = redacto.getElemAttr(x, 'title')
          ? redacto.getElemAttr(x, 'title')
          : 'Gallica iframe',
        src = redacto.getElemAttr(x, 'data-src'),
        style = redacto.getElemAttr(x, 'data-style'),
        frame;
      if (src === '') {
        return '';
      }
      frame =
        '<iframe title="' +
        frame_title +
        '" style="' +
        style +
        '" src="' +
        src +
        '"></iframe>';
      return frame;
    });
  },
  fallback: function () {
    'use strict';
    var id = 'gallica';
    redacto.fallback(['gallica_player'], function (elem) {
      elem.style = redacto.getElemAttr(elem, 'data-style');
      return redacto.engage(id);
    });
  },
};

// crisp
redacto.services.crisp = {
  key: 'crisp',
  type: 'other',
  name: 'Crisp Chat',
  uri: 'https://help.crisp.chat/en/article/crisp-chatbox-cookie-ip-policy-1147xor/',
  needConsent: false,
  cookies: ['crisp-client', '__cfduid'],
  js: function () {
    'use strict';

    if (redacto.user.crispID === undefined) {
      return;
    }

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = redacto.user.crispID;

    redacto.addScript('https://client.crisp.chat/l.js');
  },
};

// microanalytics
redacto.services.microanalytics = {
  key: 'microanalytics',
  type: 'analytic',
  name: 'MicroAnalytic',
  uri: 'https://microanalytics.io/page/privacy',
  needConsent: false,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.microanalyticsID === undefined) {
      return;
    }

    redacto.addScript(
      'https://microanalytics.io/js/script.js',
      redacto.user.microanalyticsID,
      undefined,
      true,
      'data-host',
      'https://microanalytics.io'
    );
  },
};

// facebookcustomerchat
redacto.services.facebookcustomerchat = {
  key: 'facebookcustomerchat',
  type: 'social',
  name: 'Facebook (Customer Chat)',
  uri: 'https://www.facebook.com/policies/cookies/',
  needConsent: true,
  cookies: [
    'act',
    'c_user',
    'datr',
    'dpr',
    'presence',
    'sb',
    'wd',
    'xs',
    '/tr',
  ],
  js: function () {
    'use strict';

    if (redacto.user.facebookChatID === undefined) {
      return;
    }

    redacto.fallback(['fb-customerchat'], '');
    window.fbAsyncInit = function () {
      FB.init({
        appId: redacto.user.facebookChatID,
        autoLogAppEvents: !0,
        xfbml: !0,
        version: 'v3.0',
      });
    };
    redacto.addScript(
      'https://connect.facebook.net/' +
        redacto.getLocale() +
        '/sdk/xfbml.customerchat.js',
      'facebook-jssdk'
    );
  },
  fallback: function () {
    'use strict';
    var id = 'facebookcustomerchat';
    redacto.fallback(['fb-customerchat'], redacto.engage(id));
  },
};

// weborama
redacto.services.weborama = {
  key: 'weborama',
  type: 'analytic',
  name: 'Weborama',
  uri: 'https://weborama.com/faq-cnil-avril-2021/',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';
    redacto.addScript(
      'https://cstatic.weborama.fr/js/advertiserv2/adperf_conversion.js'
    );
  },
};

// tiktok
redacto.services.tiktok = {
  key: 'tiktok',
  type: 'analytic',
  name: 'Tiktok',
  uri: 'https://www.tiktok.com/legal/tiktok-website-cookies-policy',
  needConsent: true,
  cookies: [],
  js: function () {
    'use strict';

    if (redacto.user.tiktokId === undefined) {
      return;
    }

    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      (ttq.methods = [
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie',
      ]),
        (ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        });
      for (var i = 0; i < ttq.methods.length; i++)
        ttq.setAndDefer(ttq, ttq.methods[i]);
      (ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      }),
        (ttq.load = function (e, n) {
          var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          (ttq._i = ttq._i || {}),
            (ttq._i[e] = []),
            (ttq._i[e]._u = i),
            (ttq._t = ttq._t || {}),
            (ttq._t[e] = +new Date()),
            (ttq._o = ttq._o || {}),
            (ttq._o[e] = n || {});
          var o = document.createElement('script');
          (o.type = 'text/javascript'),
            (o.async = !0),
            (o.src = i + '?sdkid=' + e + '&lib=' + t);
          var a = document.getElementsByTagName('script')[0];
          a.parentNode.insertBefore(o, a);
        });
      ttq.load(redacto.user.tiktokId);
      ttq.page();
    })(window, document, 'ttq');

    if (typeof redacto.user.tiktokMore === 'function') {
      redacto.user.tiktokMore();
    }
  },
};

// Klaviyo
redacto.services.klaviyo = {
  key: 'klaviyo',
  type: 'ads',
  name: 'Klaviyo',
  uri: 'https://help.klaviyo.com/hc/en-us/articles/360034666712-About-Cookies-in-Klaviyo',
  needConsent: true,
  cookies: ['__kla_id'],
  js: function () {
    'use strict';
    if (redacto.user.klaviyoCompanyId === undefined) {
      return;
    }
    redacto.addScript(
      '//static.klaviyo.com/onsite/js/klaviyo.js?company_id=' +
        redacto.user.klaviyoCompanyId
    );
  },
};

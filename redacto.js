/*jslint browser: true, evil: true */
/* min ready */

var redactoScriptsDiscover = document.getElementsByTagName("script"),
  redactoCurrentScript =
    document.currentScript instanceof HTMLScriptElement
      ? document.currentScript
      : redactoScriptsDiscover[redactoScriptsDiscover.length - 1],
  redactoPath = redactoCurrentScript.src.split("?")[0],
  redactoForceCDN = redactoForceCDN === undefined ? "" : redactoForceCDN,
  redactoUseMin = redactoUseMin === undefined ? "" : redactoUseMin,
  cdn =
    redactoForceCDN === ""
      ? redactoPath.split("/").slice(0, -1).join("/") + "/"
      : redactoForceCDN,
  alreadyLaunch = alreadyLaunch === undefined ? 0 : alreadyLaunch,
  redactoForceLanguage =
    redactoForceLanguage === undefined ? "" : redactoForceLanguage,
  redactoForceExpire =
    redactoForceExpire === undefined ? "" : redactoForceExpire,
  redactoCustomText = redactoCustomText === undefined ? "" : redactoCustomText,
  // redactoExpireInDay: true for day(s) value - false for hour(s) value
  redactoExpireInDay =
    redactoExpireInDay === undefined || typeof redactoExpireInDay !== "boolean"
      ? true
      : redactoExpireInDay,
  timeExpire = 31536000000,
  redactoProLoadServices,
  redactoNoAdBlocker = false,
  redactoIsLoaded = false;

var redacto = {
  version: "1.25.0",
  cdn: cdn,
  user: {},
  lang: {},
  services: {},
  added: [],
  idprocessed: [],
  state: {},
  launch: [],
  parameters: {},
  isAjax: false,
  reloadThePage: false,
  events: {
    init: function () {},
    load: function () {},
  },
  init: function (params) {
    "use strict";
    var origOpen;

    redacto.parameters = params;
    if (alreadyLaunch === 0) {
      alreadyLaunch = 1;
      if (window.addEventListener) {
        if (document.readyState === "complete") {
          redacto.initEvents.loadEvent(false);
        } else {
          window.addEventListener(
            "load",
            function () {
              redacto.initEvents.loadEvent(false);
            },
            false
          );
        }
        window.addEventListener(
          "scroll",
          function () {
            redacto.initEvents.scrollEvent();
          },
          false
        );

        window.addEventListener(
          "keydown",
          function (evt) {
            redacto.initEvents.keydownEvent(false, evt);
          },
          false
        );
        window.addEventListener(
          "hashchange",
          function () {
            redacto.initEvents.hashchangeEvent();
          },
          false
        );
        window.addEventListener(
          "resize",
          function () {
            redacto.initEvents.resizeEvent();
          },
          false
        );
      } else {
        if (document.readyState === "complete") {
          redacto.initEvents.loadEvent(true);
        } else {
          window.attachEvent("onload", function () {
            redacto.initEvents.loadEvent(true);
          });
        }
        window.attachEvent("onscroll", function () {
          redacto.initEvents.scrollEvent();
        });
        window.attachEvent("onkeydown", function (evt) {
          redacto.initEvents.keydownEvent(true, evt);
        });
        window.attachEvent("onhashchange", function () {
          redacto.initEvents.hashchangeEvent();
        });
        window.attachEvent("onresize", function () {
          redacto.initEvents.resizeEvent();
        });
      }

      if (typeof XMLHttpRequest !== "undefined") {
        origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
          if (window.addEventListener) {
            this.addEventListener(
              "load",
              function () {
                if (typeof redactoProLoadServices === "function") {
                  redactoProLoadServices();
                }
              },
              false
            );
          } else if (typeof this.attachEvent !== "undefined") {
            this.attachEvent("onload", function () {
              if (typeof redactoProLoadServices === "function") {
                redactoProLoadServices();
              }
            });
          } else {
            if (typeof redactoProLoadServices === "function") {
              setTimeout(redactoProLoadServices, 1000);
            }
          }

          try {
            origOpen.apply(this, arguments);
          } catch (err) {}
        };
      }
    }

    if (redacto.events.init) {
      redacto.events.init();
    }
  },
  initEvents: {
    loadEvent: function (isOldBrowser) {
      redacto.load();
      redacto.fallback(
        ["redactoOpenPanel"],
        function (elem) {
          if (isOldBrowser) {
            elem.attachEvent("onclick", function (event) {
              redacto.userInterface.openPanel();
              event.preventDefault();
            });
          } else {
            elem.addEventListener(
              "click",
              function (event) {
                redacto.userInterface.openPanel();
                event.preventDefault();
              },
              false
            );
          }
        },
        true
      );
    },
    keydownEvent: function (isOldBrowser, evt) {
      if (evt.keyCode === 27) {
        redacto.userInterface.closePanel();
      }

      if (isOldBrowser) {
        if (evt.keyCode === 9 && focusableEls.indexOf(evt.target) >= 0) {
          if (evt.shiftKey) {
            /* shift + tab */ if (document.activeElement === firstFocusableEl) {
              lastFocusableEl.focus();
              evt.preventDefault();
            }
          } /* tab */ else {
            if (document.activeElement === lastFocusableEl) {
              firstFocusableEl.focus();
              evt.preventDefault();
            }
          }
        }
      }
    },
    hashchangeEvent: function () {
      if (
        document.location.hash === redacto.hashtag &&
        redacto.hashtag !== ""
      ) {
        redacto.userInterface.openPanel();
      }
    },
    resizeEvent: function () {
      var tacElem = document.getElementById("redacto");
      var tacCookieContainer = document.getElementById(
        "redactoCookiesListContainer"
      );

      if (tacElem && tacElem.style.display === "block") {
        redacto.userInterface.jsSizing("main");
      }

      if (tacCookieContainer && tacCookieContainer.style.display === "block") {
        redacto.userInterface.jsSizing("cookie");
      }
    },
    scrollEvent: function () {
      var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      var heightPosition;
      var tacPercentage = document.getElementById("redactoPercentage");
      var tacAlertBig = document.getElementById("redactoAlertBig");

      if (tacAlertBig && !redacto.highPrivacy) {
        if (tacAlertBig.style.display === "block") {
          heightPosition = tacAlertBig.offsetHeight + "px";

          if (scrollPos > screen.height * 2) {
            redacto.userInterface.respondAll(true);
          } else if (scrollPos > screen.height / 2) {
            document.getElementById("redactoDisclaimerAlert").innerHTML =
              "<strong>" +
              redacto.lang.alertBigScroll +
              "</strong> " +
              redacto.lang.alertBig;
          }

          if (tacPercentage) {
            if (redacto.orientation === "top") {
              tacPercentage.style.top = heightPosition;
            } else {
              tacPercentage.style.bottom = heightPosition;
            }
            tacPercentage.style.width =
              (100 / (screen.height * 2)) * scrollPos + "%";
          }
        }
      }
    },
  },
  load: function () {
    "use strict";

    if (redactoIsLoaded === true) {
      return;
    }

    var cdn = redacto.cdn,
      language = redacto.getLanguage(),
      useMinifiedJS =
        new URL(cdn, redactoPath).host == "cdn.jsdelivr.net" ||
        redactoPath.indexOf(".min.") >= 0 ||
        redactoUseMin !== "",
      pathToLang =
        cdn +
        "lang/redacto." +
        language +
        (useMinifiedJS ? ".min" : "") +
        ".js?v=" +
        redacto.version,
      pathToServices =
        cdn +
        "redacto.services" +
        (useMinifiedJS ? ".min" : "") +
        ".js?v=" +
        redacto.version,
      linkElement = document.createElement("link"),
      defaults = {
        adblocker: false,
        hashtag: "#redacto",
        cookieName: "redacto",
        highPrivacy: true,
        orientation: "middle",
        bodyPosition: "bottom",
        removeCredit: false,
        showAlertSmall: false,
        showDetailsOnClick: true,
        showIcon: true,
        iconPosition: "BottomRight",
        cookieslist: false,
        cookieslistEmbed: false,
        handleBrowserDNTRequest: false,
        DenyAllCta: true,
        AcceptAllCta: true,
        moreInfoLink: true,
        privacyUrl: "",
        useExternalCss: false,
        useExternalJs: false,
        mandatory: true,
        mandatoryCta: true,
        closePopup: false,
        groupServices: false,
        serviceDefaultState: "wait",
        googleConsentMode: true,
        bingConsentMode: true,
        softConsentMode: false,
        dataLayer: false,
        serverSide: false,
        partnersList: false,
        alwaysNeedConsent: false,
      },
      params = redacto.parameters;

    // flag the tac load
    redactoIsLoaded = true;

    // Don't show the middle bar if we are on the privacy policy or more page
    if (
      ((redacto.parameters.readmoreLink !== undefined &&
        window.location.href == redacto.parameters.readmoreLink) ||
        window.location.href == redacto.parameters.privacyUrl) &&
      redacto.parameters.orientation == "middle"
    ) {
      redacto.parameters.orientation = "bottom";
    }

    // Step -1
    if (typeof redactoCustomPremium !== "undefined") {
      redactoCustomPremium();
    }

    // Step 0: get params
    if (params !== undefined) {
      for (var k in defaults) {
        if (!redacto.parameters.hasOwnProperty(k)) {
          redacto.parameters[k] = defaults[k];
        }
      }
    }

    // global
    redacto.orientation = redacto.parameters.orientation;
    redacto.hashtag = redacto.parameters.hashtag;
    redacto.highPrivacy = redacto.parameters.highPrivacy;
    redacto.handleBrowserDNTRequest =
      redacto.parameters.handleBrowserDNTRequest;
    redacto.customCloserId = redacto.parameters.customCloserId;

    // update dataLayer when consent is updated
    if (redacto.parameters.dataLayer === true) {
      window.addEventListener("tac.root_available", function () {
        setTimeout(function () {
          window.dataLayer = window.dataLayer || [];
          redacto.job.filter((job) => redacto.state[job] === true).length > 0 &&
            window.dataLayer.push({
              event: "tac_consent_update",
              tacAuthorizedVendors: redacto.job.filter(
                (job) => redacto.state[job] === true
              ),
            });
        }, 200);
      });
      document.addEventListener("tac.consent_updated", function () {
        window.dataLayer = window.dataLayer || [];
        redacto.job.filter((job) => redacto.state[job] === true).length > 0 &&
          window.dataLayer.push({
            event: "tac_consent_update",
            tacAuthorizedVendors: redacto.job.filter(
              (job) => redacto.state[job] === true
            ),
          });
      });
    }

    // bing consent mode
    if (redacto.parameters.bingConsentMode === true) {
      window.uetq = window.uetq || [];
      window.uetq.push("consent", "default", { ad_storage: "denied" });

      document.addEventListener(
        "clarity_consentModeOk",
        function () {
          window.uetq.push("consent", "update", { ad_storage: "granted" });
        },
        { once: true }
      );
      document.addEventListener(
        "clarity_consentModeKo",
        function () {
          window.uetq.push("consent", "update", { ad_storage: "denied" });
        },
        { once: true }
      );
      document.addEventListener(
        "bingads_consentModeOk",
        function () {
          window.uetq.push("consent", "update", { ad_storage: "granted" });
        },
        { once: true }
      );
      document.addEventListener(
        "bingads_consentModeKo",
        function () {
          window.uetq.push("consent", "update", { ad_storage: "denied" });
        },
        { once: true }
      );

      if (redacto.parameters.softConsentMode === false) {
        window.addEventListener("tac.root_available", function () {
          if (typeof redacto_block !== "undefined") {
            redacto_block.unblock(/clarity\.ms/);
            redacto_block.unblock(/bat\.bing\.com/);
          }
        });
      }
    }

    // google consent mode
    if (redacto.parameters.googleConsentMode === true) {
      // set the dataLayer and a function to update
      window.dataLayer = window.dataLayer || [];
      window.tac_gtag = function tac_gtag() {
        dataLayer.push(arguments);
      };

      // default consent to denied
      window.tac_gtag("consent", "default", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 800,
      });

      // if google ads, add a service for personalized ads
      document.addEventListener("googleads_added", function () {
        // skip if already added
        if (redacto.added["gcmads"] === true) {
          return;
        }

        // simple service to control gcm with event
        redacto.services.gcmads = {
          key: "gcmads",
          type: "ads",
          name: "Google Ads (personalized ads)",
          uri: "https://support.google.com/analytics/answer/9976101",
          needConsent: true,
          cookies: [],
          js: function () {},
          fallback: function () {},
        };
        redacto.job.push("gcmads");

        // fix the event handler on the buttons
        var i,
          allowBtns = document.getElementsByClassName("redactoAllow"),
          denyBtns = document.getElementsByClassName("redactoDeny");
        for (i = 0; i < allowBtns.length; i++) {
          redacto.addClickEventToElement(allowBtns[i], function () {
            redacto.userInterface.respond(this, true);
          });
        }
        for (i = 0; i < denyBtns.length; i++) {
          redacto.addClickEventToElement(denyBtns[i], function () {
            redacto.userInterface.respond(this, false);
          });
        }
      });

      // when personalized ads are accepted, accept googleads
      document.addEventListener("gcmads_allowed", function () {
        redacto.setConsent("googleads", true);
      });

      // personalized ads loaded/allowed, set gcm to granted
      document.addEventListener(
        "gcmads_consentModeOk",
        function () {
          window.tac_gtag("consent", "update", {
            ad_user_data: "granted",
            ad_personalization: "granted",
          });
        },
        { once: true }
      );

      // personalized ads disallowed, set gcm to denied
      document.addEventListener(
        "gcmads_consentModeKo",
        function () {
          window.tac_gtag("consent", "update", {
            ad_user_data: "denied",
            ad_personalization: "denied",
          });
        },
        { once: true }
      );

      // google ads loaded/allowed, set gcm to granted
      document.addEventListener(
        "googleads_consentModeOk",
        function () {
          window.tac_gtag("consent", "update", {
            ad_storage: "granted",
          });
        },
        { once: true }
      );

      // google ads disallowed, disable personalized ads and update gcm
      document.addEventListener(
        "googleads_consentModeKo",
        function () {
          redacto.setConsent("gcmads", false);
          window.tac_gtag("consent", "update", {
            ad_storage: "denied",
          });
        },
        { once: true }
      );

      // ga4 loaded/allowed, set gcm to granted
      document.addEventListener(
        "gtag_consentModeOk",
        function () {
          window.tac_gtag("consent", "update", {
            analytics_storage: "granted",
          });
        },
        { once: true }
      );

      // ga4 disallowed, update gcm
      document.addEventListener(
        "gtag_consentModeKo",
        function () {
          window.tac_gtag("consent", "update", {
            analytics_storage: "denied",
          });
        },
        { once: true }
      );

      // multiple ga4 loaded/allowed, set gcm to granted
      document.addEventListener(
        "multiplegtag_consentModeOk",
        function () {
          window.tac_gtag("consent", "update", {
            analytics_storage: "granted",
          });
        },
        { once: true }
      );

      // multiple ga4 disallowed, update gcm
      document.addEventListener(
        "multiplegtag_consentModeKo",
        function () {
          window.tac_gtag("consent", "update", {
            analytics_storage: "denied",
          });
        },
        { once: true }
      );

      // allow gtag/googleads by default if consent mode is on
      if (redacto.parameters.softConsentMode === false) {
        window.addEventListener("tac.root_available", function () {
          if (typeof redacto_block !== "undefined") {
            redacto_block.unblock(/www\.googletagmanager\.com\/gtag\/js/);
            redacto_block.unblock(
              /www\.googleadservices\.com\/pagead\/conversion/
            );
            redacto_block.unblock(/AW-/);
            redacto_block.unblock(/google-analytics\.com\/analytics\.js/);
            redacto_block.unblock(/google-analytics\.com\/ga\.js/);
          }
        });
      }
    }

    // Step 1: load css
    if (!redacto.parameters.useExternalCss) {
      linkElement.rel = "stylesheet";
      linkElement.type = "text/css";
      linkElement.href =
        cdn +
        "css/redacto" +
        (useMinifiedJS ? ".min" : "") +
        ".css?v=" +
        redacto.version;
      document.getElementsByTagName("head")[0].appendChild(linkElement);
    }
    // Step 2: load language and services
    redacto.addInternalScript(pathToLang, "", function () {
      if (redactoCustomText !== "") {
        redacto.lang = redacto.AddOrUpdate(redacto.lang, redactoCustomText);
      }

      document.documentElement.style.setProperty(
        "--tacTitleBanner",
        JSON.stringify(redacto.lang.middleBarHead)
      );

      redacto.addInternalScript(pathToServices, "", function () {
        // disable the expand option if services grouped by category
        if (redacto.parameters.groupServices == true) {
          redacto.parameters.showDetailsOnClick = true;
        }

        var body = document.body,
          div = document.createElement("div"),
          html = "",
          index,
          orientation = "Top",
          modalAttrs = "",
          cat = [
            "ads",
            "analytic",
            "api",
            "comment",
            "social",
            "support",
            "video",
            "other",
            "google",
          ],
          i;

        cat = cat.sort(function (a, b) {
          if (redacto.lang[a].title > redacto.lang[b].title) {
            return 1;
          }
          if (redacto.lang[a].title < redacto.lang[b].title) {
            return -1;
          }
          return 0;
        });

        if (!/^<\s*(p|ul)(\s|>)/i.test(redacto.lang.disclaimer)) {
          redacto.lang.disclaimer = "<p>" + redacto.lang.disclaimer + "</p>";
        }

        // Step 3: prepare the html
        html +=
          '<div role="heading" aria-level="2" id="tac_title" class="tac_visually-hidden">' +
          redacto.lang.title +
          "</div>";
        html += '<div id="redactoPremium"></div>';
        if (redacto.reloadThePage) {
          html +=
            '<button type="button" id="redactoBack" aria-label="' +
            redacto.lang.close +
            " (" +
            redacto.lang.reload +
            ')" title="' +
            redacto.lang.close +
            " (" +
            redacto.lang.reload +
            ')"></button>';
        } else {
          html +=
            '<button type="button" id="redactoBack" aria-label="' +
            redacto.lang.close +
            '" title="' +
            redacto.lang.close +
            '"></button>';
        }
        html +=
          '<div id="redacto" role="dialog" aria-modal="true" aria-labelledby="dialogTitle" tabindex="-1">';
        if (redacto.reloadThePage) {
          html +=
            '   <button type="button" id="redactoClosePanel" aria-describedby="dialogTitle" aria-label="' +
            redacto.lang.close +
            " (" +
            redacto.lang.reload +
            ')" title="' +
            redacto.lang.close +
            " (" +
            redacto.lang.reload +
            ')">';
        } else {
          html +=
            '   <button type="button" id="redactoClosePanel" aria-describedby="dialogTitle" >';
        }
        html += "       " + redacto.lang.close;
        html += "   </button>";
        html += '   <div id="redactoServices">';
        html +=
          '      <div class="redactoLine redactoMainLine" id="redactoMainLineOffset">';
        html +=
          '         <span class="redactoH1" role="heading" aria-level="2" id="dialogTitle">' +
          redacto.lang.title +
          "</span>";
        html += '         <div id="redactoInfo">';
        html += "         " + redacto.lang.disclaimer;
        if (redacto.parameters.privacyUrl !== "") {
          html += "   <br/><br/>";
          html +=
            '   <button type="button" id="redactoPrivacyUrlDialog" role="link">';
          html += "       " + redacto.lang.privacyUrl;
          html += "   </button>";
        }
        html += "         </div>";
        html += '         <div class="redactoName">';
        html +=
          '            <span class="redactoH2" role="heading" aria-level="3">' +
          redacto.lang.all +
          "</span>";
        html += "         </div>";
        html += '         <div class="redactoAsk" id="redactoScrollbarAdjust">';
        html +=
          '            <button aria-label="' +
          redacto.lang.icon +
          " : " +
          redacto.lang.allowAll +
          '" type="button" id="redactoAllAllowed" class="redactoAllow">';
        html +=
          '               <span class="redactoCheck" aria-hidden="true"></span> ' +
          redacto.lang.allowAll;
        html += "            </button> ";
        html +=
          '            <button aria-label="' +
          redacto.lang.icon +
          " : " +
          redacto.lang.denyAll +
          '" type="button" id="redactoAllDenied" class="redactoDeny">';
        html +=
          '               <span class="redactoCross" aria-hidden="true"></span> ' +
          redacto.lang.denyAll;
        html += "            </button>";
        html += "         </div>";
        html += "      </div>";
        html += '      <div class="redactoBorder">';
        html += '         <div class="clear"></div><ul>';

        if (redacto.parameters.mandatory == true) {
          html += '<li id="redactoServicesTitle_mandatory">';
          html += '<div class="redactoTitle">';
          if (redacto.parameters.showDetailsOnClick) {
            html +=
              '   <button type="button" tabindex="-1"><span class="redactoPlus" aria-hidden="true"></span> ' +
              redacto.lang.mandatoryTitle +
              "</button>";
          } else {
            html +=
              '   <span class="asCatToggleBtn">' +
              redacto.lang.mandatoryTitle +
              "</span>";
          }
          html += "</div>";
          html += '<ul id="redactoServices_mandatory">';
          html += '<li class="redactoLine">';
          html += '   <div class="redactoName">';
          html +=
            '       <span class="redactoH3" role="heading" aria-level="4">' +
            redacto.lang.mandatoryText +
            "</span>";
          html +=
            '       <span class="redactoListCookies" aria-hidden="true"></span><br/>';
          html += "   </div>";
          if (redacto.parameters.mandatoryCta == true) {
            html += '   <div class="redactoAsk">';
            html +=
              '       <button type="button" class="redactoAllow" tabindex="-1" disabled>';
            html +=
              '           <span class="redactoCheck" aria-hidden="true"></span> ' +
              redacto.lang.allow;
            html += "       </button> ";
            html +=
              '       <button type="button" class="redactoDeny" tabindex="-1">';
            html +=
              '           <span class="redactoCross" aria-hidden="true"></span> ' +
              redacto.lang.deny;
            html += "       </button> ";
            html += "   </div>";
          }
          html += "</li>";
          html += "</ul></li>";
        }

        if (
          redacto.parameters.cookieslist === false &&
          redacto.parameters.cookieslistEmbed === true
        ) {
          setTimeout(function () {
            redacto.addClickEventToId(
              "redacto-toggle-group-cookies",
              function () {
                redacto.userInterface.toggle("redactoServices_cookies");
                if (
                  document.getElementById("redactoServices_cookies").style
                    .display == "block"
                ) {
                  redacto.userInterface.addClass(
                    "redactoServicesTitle_cookies",
                    "redactoIsExpanded"
                  );
                  document
                    .getElementById("redacto-toggle-group-cookies")
                    .setAttribute("aria-expanded", "true");
                } else {
                  redacto.userInterface.removeClass(
                    "redactoServicesTitle_cookies",
                    "redactoIsExpanded"
                  );
                  document
                    .getElementById("redacto-toggle-group-cookies")
                    .setAttribute("aria-expanded", "false");
                }
              }
            );
          }, 800);

          html +=
            '         <li id="redactoServicesnoTitle_cookies" class="redactoHidden" style="display:block">';
          html +=
            "            <ul>" +
            '<li class="redactoLine" style="background:transparent">' +
            '   <div class="redactoName">' +
            '       <span class="redactoH3" role="heading" aria-level="3" id="redactoCookiesNumberBis">0 cookie</span>' +
            '      <button type="button" aria-expanded="false" class="redacto-toggle-group" id="redacto-toggle-group-cookies">' +
            redacto.lang.cookieDetail +
            "</button>" +
            "    </div>" +
            "</li>" +
            "</ul>";
          html +=
            '         <ul id="redactoServices_cookies" style="display:none"><div id="redactoCookiesList"></div></ul></li>';
        }

        for (i = 0; i < cat.length; i += 1) {
          html +=
            '         <li id="redactoServicesTitle_' +
            cat[i] +
            '" class="redactoHidden">';
          html +=
            '            <div class="redactoTitle" role="heading" aria-level="3">';
          if (redacto.parameters.showDetailsOnClick) {
            html +=
              '               <button type="button" class="catToggleBtn" aria-expanded="false" data-cat="redactoDetails' +
              cat[i] +
              '"><span class="redactoPlus" aria-hidden="true"></span> ' +
              redacto.lang[cat[i]].title +
              "</button>";
          } else {
            html +=
              '               <span class="asCatToggleBtn" data-cat="redactoInlineDetails' +
              cat[i] +
              '">' +
              redacto.lang[cat[i]].title +
              "</span>";
          }
          html += "            </div>";
          html +=
            '            <div id="redactoDetails' +
            cat[i] +
            '" class="redactoDetails ' +
            (redacto.parameters.showDetailsOnClick
              ? "redactoInfoBox"
              : "redactoDetailsInline") +
            '" role="paragraph">';
          html += "               " + redacto.lang[cat[i]].details;
          html += "            </div>";
          html += '         <ul id="redactoServices_' + cat[i] + '"></ul></li>';
        }
        html +=
          '             <li id="redactoNoServicesTitle" class="redactoLine">' +
          redacto.lang.noServices +
          "</li>";
        html += "         </ul>";
        html +=
          '         <div class="redactoHidden redacto-spacer-20" id="redactoScrollbarChild"></div>';
        if (redacto.parameters.removeCredit === false) {
          html +=
            '     <a class="redactoSelfLink" href="#" rel="nofollow noreferrer noopener" target="_blank" title="redacto ' +
            redacto.lang.newWindow +
            '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAAeCAYAAAAWwoEYAAADl0lEQVRoge1Y0W3bQAx9CjKARlC+9GVUmqDJBHEmiDyB6wkcTxBngtgTxJ0gzgQW4C/9aYOmE6g4lTQo+k6y3Rb94QOERNQd+cjj8XiGwWAwGAwGg8FgMBgMBoPB8F8RNRXe+whEKe7c36ZCAeCRxC9Rig2PUd8kPgAsoxSfQ3YAzAA8D/HwYYCb05kBKKO0teFkmbC1jlKsAnq/Abjn+QBqAIsoRS30ttwG/HNz1wH/XIxWTicLdvtW7xTAGEAMtP685CNsBTe2d/BLydfXAG57SEnMAST0zgYZSUCPk02bCvkJduIzuJzDLfPolbY+tLKmar+/8+IRePy4qdpE03qHuH8fipFb4N2+XdA3AJ/0vaQxt7s9FvkIS2XvtqnwM0rxpOQfbnE5G2LhTCmUO2fHIngOmcv+KG3HafDchB6ntwjYqenR2PqC7sOZ3E7FXHB0vqxoFyUyLh7OEH7LOGouvhhN3eIBeKXv0n5MsufdHqXcwYR5U2EbpV35lSspVPJmQj4TcgRK7jTg5IzmPUhhwM5a2WHUFCx+NgiDucmgh7idikLovHFlL0pxQ9xzX+IIP9Y6FrJsqhjlQpZRAkFVDCjZfcCHt6bqJDmuh5ylCWx0RVnk3oumaknqTH5sqrY0fBWyULaHUIgAgxb46MxV3DbieAhxOxUxjSuljig9lMQ/Bcfoi9BTEv9aLORSndVxYOH525sUDC6u2gWxcNzBNRxPanyh3ktKinOgy3WoxPbtUM0t6RkbQnzBnFPgi9GCOEubY9UffIryz9iKRe8s/FUfEWosJJGxagp85bpUO3VywQ46lOtAWfNxKwa4JXQ+628+bpxYGXXMzp5rXH401VEyXwIdowXFaKWSMFHvMTVmGnc+P3oXV2QOiBCfgex8QtcQCbcQE/H+eoHzrkFo1KM7zVO4jVVj5s6lRiWF7zyXyfRMc97J3tzj87mYqZ7E2YjzUct9GUi4tjHLR8dVkBLjQcuHFleWvQfRNEhFR7uX7pkctOwvZXsft7sAtyldEUIN2UTeLxnEfxKYswzdi88BdbZ8hifUoSMftQvP+muRwN6+Q3DeqqRExP9QmTtcheiHh0Ot1x2i2km1bP9pbufw5zZdyWsOrh7vQae5OZWbsMv30pi7cd/CKj3coPEVaCP4Zhx4eQWhOZ1Y9MTXGyP8/iGjEyfa1T4fO/4Lea9vBoPBYDAYDAaDwWAwGAwGwz8GgF8siXCCbrSRhgAAAABJRU5ErkJggg==" alt="redacto.io" /></a>';
        }
        html += "       </div>";
        html += "   </div>";
        html += "</div>";

        if (redacto.parameters.orientation === "bottom") {
          orientation = "Bottom";
        }

        if (
          redacto.parameters.orientation === "middle" ||
          redacto.parameters.orientation === "popup"
        ) {
          modalAttrs =
            ' role="dialog" aria-modal="true" aria-labelledby="tac_title"';
        }

        if (
          redacto.parameters.highPrivacy &&
          !redacto.parameters.AcceptAllCta
        ) {
          html +=
            '<div tabindex="-1" id="redactoAlertBig" class="redactoAlertBig' +
            orientation +
            '"' +
            modalAttrs +
            ">";
          //html += '<div class="redactoAlertBigWrapper">';
          html += '   <span id="redactoDisclaimerAlert" role="paragraph">';
          html += "       " + redacto.lang.alertBigPrivacy;
          html += "   </span>";
          //html += '   <span class="redactoAlertBigBtnWrapper">';
          html +=
            '   <button type="button" id="redactoPersonalize" aria-label="' +
            redacto.lang.personalize +
            " " +
            redacto.lang.modalWindow +
            '" title="' +
            redacto.lang.personalize +
            " " +
            redacto.lang.modalWindow +
            '">';
          html += "       " + redacto.lang.personalize;
          html += "   </button>";

          if (redacto.parameters.privacyUrl !== "") {
            html +=
              '   <button role="link" type="button" id="redactoPrivacyUrl">';
            html += "       " + redacto.lang.privacyUrl;
            html += "   </button>";
          }

          //html += '   </span>';
          //html += '</div>';
          html += "</div>";
        } else {
          html +=
            '<div tabindex="-1" id="redactoAlertBig" class="redactoAlertBig' +
            orientation +
            '"' +
            modalAttrs +
            ">";
          //html += '<div class="redactoAlertBigWrapper">';
          html += '   <span id="redactoDisclaimerAlert" role="paragraph">';

          if (redacto.parameters.highPrivacy) {
            html += "       " + redacto.lang.alertBigPrivacy;
          } else {
            html +=
              "       " +
              redacto.lang.alertBigClick +
              " " +
              redacto.lang.alertBig;
          }

          html += "   </span>";
          //html += '   <span class="redactoAlertBigBtnWrapper">';
          html +=
            '   <button aria-label="' +
            redacto.lang.icon +
            " : " +
            redacto.lang.acceptAll +
            '" type="button" class="redactoCTAButton redactoAllow" id="redactoPersonalize2" aria-describedby="redactoDisclaimerAlert" >';
          html +=
            '       <span class="redactoCheck" aria-hidden="true"></span> ' +
            redacto.lang.acceptAll;
          html += "   </button>";

          if (redacto.parameters.DenyAllCta) {
            if (redacto.reloadThePage) {
              html +=
                '   <button type="button" class="redactoCTAButton redactoDeny" id="redactoAllDenied2" aria-describedby="redactoDisclaimerAlert" aria-label="' +
                redacto.lang.icon +
                " : " +
                redacto.lang.denyAll +
                " (" +
                redacto.lang.reload +
                ')" title="' +
                redacto.lang.denyAll +
                " (" +
                redacto.lang.reload +
                ')">';
            } else {
              html +=
                '   <button type="button" class="redactoCTAButton redactoDeny" id="redactoAllDenied2" aria-describedby="redactoDisclaimerAlert" aria-label="' +
                redacto.lang.icon +
                " : " +
                redacto.lang.denyAll +
                '">';
            }
            html +=
              '       <span class="redactoCross" aria-hidden="true"></span> ' +
              redacto.lang.denyAll;
            html += "   </button>";
            //html += '   <br/><br/>';
          }

          html +=
            '   <button type="button" id="redactoCloseAlert"  aria-describedby="redactoDisclaimerAlert" aria-label="' +
            redacto.lang.personalize +
            " " +
            redacto.lang.modalWindow +
            '" title="' +
            redacto.lang.personalize +
            " " +
            redacto.lang.modalWindow +
            '">';
          html += "       " + redacto.lang.personalize;
          html += "   </button>";

          if (redacto.parameters.privacyUrl !== "") {
            html +=
              '   <button type="button" id="redactoPrivacyUrl" role="link">';
            html += "       " + redacto.lang.privacyUrl;
            html += "   </button>";
          }

          //html += '   </span>';
          //html += '</div>';
          html += "</div>";
          html += '<div id="redactoPercentage"></div>';
        }

        if (redacto.parameters.showIcon === true) {
          html +=
            '<div id="redactoIcon" class="redactoIcon' +
            redacto.parameters.iconPosition +
            '">';
          html +=
            '   <button type="button" id="redactoManager" aria-label="' +
            redacto.lang.icon +
            " " +
            redacto.lang.modalWindow +
            '" title="' +
            redacto.lang.icon +
            " " +
            redacto.lang.modalWindow +
            '">';
          html +=
            '       <img src="' +
            (redacto.parameters.iconSrc
              ? redacto.parameters.iconSrc
              : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAGA0lEQVRoge1a207bWBRdBtJwLYZhKDMVmlSK1LxNkPo+ZH6g8B6p5AuALwC+APoFoVLeoT8whPeRSt+CZKmZVu3AiIsRlEtCktGyjy8xzuXYhvahS0JJHJ/4rLP3XnuffcAPfGdQ7mM6jRLSAF4BxqsbewB2lRS2o35mpEQaJcwCyANIdLi1DGBNSWEzqmdHRqRRwjqAJclhtExOSUEP+/xIiDRKhhUWfL7ShTtBuJnqcw+/z4Ql0xNmMEwSSz4kuNIzSgpjSsqYJP/GeE185wYJroedRyiLNEpGLLzzrHSuk+83SgbxvOcyyRaDziWsRVZkSRDinpzPbwVGWIucuohsKynMS47fAQyls/BMSRmKJo3AFhG5wm2N1wF+Zs3zebbFfR0RxrXcJHQlgH+LMW616pR/WiIMEXfW3mtzXyeEGWsjKot8c4TOI98L+iKaR5PS6IUk88RLAO9F8UjrbYoYMOosNavpfmODIiwRXRR/G3ohaWVo1RU/c30jV8ab2mV8qVGzHWBOLyTLZiWs5Rolg/C3ySOi0tXP/k4aEwOwSBKPJs7Rp16ABJTe+p1xVX0It/owqqdDEMRoqd3RFxqDPh20Ig6VEPVC0i5RSCD+6wl6HlW7GksSlUMV11/GrUs5NasFLusDE9ELSVphXemtJwaT/8JyIRvxNNCfBmIiNdR04LII3DSrbe0yjqvyJF/ppptqVlt+MCLCEh/oOkPPP6N38Mb5cnQBGFsEqmXg5j3QMwoMzwGnr4HYbybBq13gZAOom/FO63zdf2qQArCsZrUN2TlJy69eSDKYV+6Q4MpP75ivHzPA53ngaBW4eGuSOt0A/lsGPmXMz0+3TFJcTfFbPfFbfnwlhON+iQhlWmA82CQ4ocQ7c6KcfL3DHuls0yT6Sx4YnLXJDCQOIRRv5yGIJBgP8Sdisj2qubpc5UGJmo+W49ifVmzL8HcpGhQPvZCUKiCliIhEN0tr2OCqHuSA8gwQ/92MkU7gxEmeVqGrTTgpxPXbUrtGWYus0I9thRIraagRQUIDf7Qn4yZhKRiFQIyhfMfUr3yblokVWSJ6k8xSnc7eNN/RjowfCYiFoDUFer1S3gW6JiJ8Nt30EMbEhU+vzSIztuRYjRLsR8IHLjlf7HZ+MrWWEXxNmbvapt4jGSqZRYSkGUetSNTPzHsui5YMQ2ajJUNks6mw4wT54Ok2ShnzzIPCUGshzawCRKy5FqvrTZe0RWzQGvw79m67XZjKmxJrLsICjtZa55gxXy+6F4sYsEtxTqhXdRTLC8ulSDaWoCLsolfN+8YUhOsJV709H7Cudr0LlVEtzqBcN+shEyThdR941OnAbF8pirKJqXyupTRTtQSReiVmXW1j7oBErB0d9xM2WEd5J9ZKYtuR4WKwwBSoORbpGrJ5ZI9lt71irJmGX1px0JYE26uNErawr2zfIcP4OHEKXm66PA3wjpCNEfpJunI4muifPjKvsFCkGjExTq63yxMJsZNMYF/J4HmDC5A3Yq36jy0ClePHVhwuu/b1HSFlEfHD5ZtD1bEK44Qu1mWys6tbWmZyPWckzlPTGiRw/XHCuk+q4Rek+mVrVL/UppwrdDEGNV2kpyuhccgc5Oxm9vWnn+19vJrVpLor0kTUrGacMplb1CfOFyTD4o9uNrHqr2Z+ZMSp1c2XcVSORnh9Q81q3k599ETgkNnjg0nGzi10K7rX+bZpHbrblPcY5A4Zxk2xcjzCvTpd9027Aa0QtouyyrKFRR6D/04DwkFGvHPXM3Qda/Jb4nPgI7hQLVM1q5HIBt2MzQNa57Z1DiiLAGa5Mi+O4Sz3Mpp6laPHO6InII3ITnX1QtI+EOX+m9ZxleOZ/j9PiuKoLi3aqXPuEoSye/Vhkm+LalbLtHhMS0R6zu7aZ3vP2jOjL7QVv4McxhcDnZIelAQibGIbULOapf3PuE1Vs9qeaOTdkVKr00gCQiw4NlBzDvf1Lxx+uP5r3Dgv5KQZRzWn+GRwz8jmDS8itUg7iB6vLuJCF5Uty4A9mVKkFR6MiJDachST/oHvHgD+B4SoUIitpF05AAAAAElFTkSuQmCC") +
            '" alt="' +
            redacto.lang.icon +
            " " +
            redacto.lang.modalWindow +
            '" title="' +
            redacto.lang.icon +
            " " +
            redacto.lang.modalWindow +
            '">';
          html += "   </button>";
          html += "</div>";
        }

        if (redacto.parameters.showAlertSmall === true) {
          html +=
            '<div id="redactoAlertSmall" class="redactoAlertSmall' +
            orientation +
            '">';
          html +=
            '   <button type="button" id="redactoManager" aria-label="' +
            redacto.lang.alertSmall +
            " " +
            redacto.lang.modalWindow +
            '" title="' +
            redacto.lang.alertSmall +
            " " +
            redacto.lang.modalWindow +
            '">';
          html += "       " + redacto.lang.alertSmall;
          html += '       <span id="redactoDot">';
          html += '           <span id="redactoDotGreen"></span>';
          html += '           <span id="redactoDotYellow"></span>';
          html += '           <span id="redactoDotRed"></span>';
          html += "       </span>";
          if (redacto.parameters.cookieslist === true) {
            html += "   </button><!-- @whitespace";
            html +=
              '   --><button type="button" id="redactoCookiesNumber" aria-expanded="false" aria-controls="redactoCookiesListContainer">0</button>';
            html += '   <div id="redactoCookiesListContainer">';
            if (redacto.reloadThePage) {
              html +=
                '       <button type="button" id="redactoClosePanelCookie" aria-label="' +
                redacto.lang.close +
                " (" +
                redacto.lang.reload +
                ')" title="' +
                redacto.lang.close +
                " (" +
                redacto.lang.reload +
                ')">';
            } else {
              html +=
                '       <button type="button" id="redactoClosePanelCookie">';
            }
            html += "           " + redacto.lang.close;
            html += "       </button>";
            html +=
              '       <div class="redactoCookiesListMain" id="redactoCookiesTitle">';
            html +=
              '            <span class="redactoH2" role="heading" aria-level="3" id="redactoCookiesNumberBis">0 cookie</span>';
            html += "       </div>";
            html += '       <div id="redactoCookiesList"></div>';
            html += "    </div>";
          } else {
            html += "   </div>";
          }
          html += "</div>";
        }

        redacto.addInternalScript(
          redacto.cdn + "advertising" + (useMinifiedJS ? ".min" : "") + ".js",
          "",
          function () {
            if (
              redactoNoAdBlocker === true ||
              redacto.parameters.adblocker === false
            ) {
              // create a wrapper container at the same level than redacto so we can add an aria-hidden when redacto is opened
              /*var wrapper = document.createElement('div');
                        wrapper.id = "redactoContentWrapper";

                        while (document.body.firstChild)
                        {
                            wrapper.appendChild(document.body.firstChild);
                        }

                        // Append the wrapper to the body
                        document.body.appendChild(wrapper);*/

              div.id = "redactoRoot";
              if (redacto.parameters.bodyPosition === "top") {
                // Prepend redacto: #redactoRoot first-child of the body for better accessibility
                var bodyFirstChild = body.firstChild;
                body.insertBefore(div, bodyFirstChild);
              } else {
                // Append redacto: #redactoRoot last-child of the body
                body.appendChild(div, body);
              }

              redacto.userInterface.addClass(
                "redactoRoot",
                "redactoSize-" + redacto.parameters.orientation
              );

              div.setAttribute("data-nosnippet", "true");
              div.setAttribute("lang", language);
              div.setAttribute("role", "region");
              div.setAttribute("aria-labelledby", "tac_title");

              div.innerHTML = html;

              //ie compatibility
              var tacRootAvailableEvent;
              if (typeof Event === "function") {
                tacRootAvailableEvent = new Event("tac.root_available");
              } else if (typeof document.createEvent === "function") {
                tacRootAvailableEvent = document.createEvent("Event");
                tacRootAvailableEvent.initEvent(
                  "tac.root_available",
                  true,
                  true
                );
              }
              //end ie compatibility

              if (typeof window.dispatchEvent === "function") {
                window.dispatchEvent(tacRootAvailableEvent);
              }

              if (redacto.job !== undefined) {
                redacto.job = redacto.cleanArray(redacto.job);
                for (index = 0; index < redacto.job.length; index += 1) {
                  redacto.addService(redacto.job[index]);
                }
              } else {
                redacto.job = [];
              }

              if (redacto.job.length === 0) {
                redacto.userInterface.closeAlert();
              }

              redacto.isAjax = true;

              redacto.job.push = function (id) {
                // ie <9 hack
                if (typeof redacto.job.indexOf === "undefined") {
                  redacto.job.indexOf = function (obj, start) {
                    var i,
                      j = this.length;
                    for (i = start || 0; i < j; i += 1) {
                      if (this[i] === obj) {
                        return i;
                      }
                    }
                    return -1;
                  };
                }

                if (redacto.job.indexOf(id) === -1) {
                  Array.prototype.push.call(this, id);
                }
                redacto.launch[id] = false;
                redacto.addService(id);
              };

              if (
                document.location.hash === redacto.hashtag &&
                redacto.hashtag !== ""
              ) {
                redacto.userInterface.openPanel();
              }

              redacto.cookie.number();
              setInterval(redacto.cookie.number, 60000);
            }
          },
          redacto.parameters.adblocker
        );

        if (redacto.parameters.adblocker === true) {
          setTimeout(function () {
            if (redactoNoAdBlocker === false) {
              html =
                '<div id="redactoAlertBig" class="redactoAlertBig' +
                orientation +
                ' redacto-display-block" role="alert" aria-live="polite">';
              html += '   <p id="redactoDisclaimerAlert">';
              html += "       " + redacto.lang.adblock + "<br/>";
              html +=
                "       <strong>" + redacto.lang.adblock_call + "</strong>";
              html += "   </p>";
              html +=
                '   <button type="button" class="redactoCTAButton" id="redactoCTAButton">';
              html += "       " + redacto.lang.reload;
              html += "   </button>";
              html += "</div>";
              html +=
                '<div role="heading" aria-level="2" id="tac_title" class="tac_visually-hidden">' +
                redacto.lang.title +
                "</div>";
              html += '<div id="redactoPremium"></div>';

              div.id = "redactoRoot";
              if (redacto.parameters.bodyPosition === "top") {
                // Prepend redacto: #redactoRoot first-child of the body for better accessibility
                var bodyFirstChild = body.firstChild;
                body.insertBefore(div, bodyFirstChild);
              } else {
                // Append redacto: #redactoRoot last-child of the body
                body.appendChild(div, body);
              }

              div.setAttribute("data-nosnippet", "true");
              div.setAttribute("lang", language);
              div.setAttribute("role", "region");
              div.setAttribute("aria-labelledby", "tac_title");

              div.innerHTML = html;
            }
          }, 1500);
        }
        if (redacto.parameters.closePopup === true) {
          setTimeout(function () {
            var closeElement = document.getElementById("redactoAlertBig"),
              closeButton = document.createElement("button");
            if (closeElement) {
              closeButton.innerHTML =
                '<span aria-hidden="true">X</span><span class="tac_visually-hidden">' +
                redacto.lang.closeBanner +
                "</span>";
              closeButton.setAttribute("id", "redactoCloseCross");
              closeElement.insertAdjacentElement("beforeend", closeButton);
            }
          }, 100);
        }

        if (redacto.parameters.groupServices === true) {
          var tac_group_style = document.createElement("style");
          tac_group_style.innerHTML = ".redactoTitle{display:none}";
          document.head.appendChild(tac_group_style);
          var cats = document.querySelectorAll('[id^="redactoServicesTitle_"]');
          Array.prototype.forEach.call(cats, function (item) {
            var cat = item
              .getAttribute("id")
              .replace(/^(redactoServicesTitle_)/, "");
            if (cat !== "mandatory") {
              var html = "";
              html += '<li  class="redactoLine">';
              html += '   <div class="redactoName">';
              html +=
                '       <span class="redactoH3" role="heading" aria-level="3">' +
                redacto.lang[cat].title +
                "</span>";
              html += "       <span>" + redacto.lang[cat].details + "</span>";
              html +=
                '   <button type="button" aria-expanded="false" class="redacto-toggle-group" id="redacto-toggle-group-' +
                cat +
                '">' +
                redacto.lang.alertSmall +
                ' <span id="redactoCounter-' +
                cat +
                '"></span></button>';
              html += "   </div>";
              html +=
                '   <div class="redactoAsk" id="redacto-group-' + cat + '">';
              html +=
                '       <button type="button" aria-label="' +
                redacto.lang.allow +
                " " +
                redacto.lang[cat].title +
                '" class="redactoAllow" id="redacto-accept-group-' +
                cat +
                '">';
              html +=
                '           <span class="redactoCheck" aria-hidden="true"></span> ' +
                redacto.lang.allow;
              html += "       </button> ";
              html +=
                '       <button type="button" aria-label="' +
                redacto.lang.deny +
                " " +
                redacto.lang[cat].title +
                '" class="redactoDeny" id="redacto-reject-group-' +
                cat +
                '">';
              html +=
                '           <span class="redactoCross" aria-hidden="true"></span> ' +
                redacto.lang.deny;
              html += "       </button>";
              html += "   </div>";
              html += "</li>";
              var ul = document.createElement("ul");
              ul.innerHTML = html;
              item.insertBefore(
                ul,
                item.querySelector("#redactoServices_" + cat + "")
              );
              document.querySelector("#redactoServices_" + cat).style.display =
                "none";
              redacto.addClickEventToId(
                "redacto-toggle-group-" + cat,
                function () {
                  redacto.userInterface.toggle("redactoServices_" + cat);
                  if (
                    document.getElementById("redactoServices_" + cat).style
                      .display == "block"
                  ) {
                    redacto.userInterface.addClass(
                      "redactoServicesTitle_" + cat,
                      "redactoIsExpanded"
                    );
                    document
                      .getElementById("redacto-toggle-group-" + cat)
                      .setAttribute("aria-expanded", "true");
                  } else {
                    redacto.userInterface.removeClass(
                      "redactoServicesTitle_" + cat,
                      "redactoIsExpanded"
                    );
                    document
                      .getElementById("redacto-toggle-group-" + cat)
                      .setAttribute("aria-expanded", "false");
                  }
                  //redacto.initEvents.resizeEvent();
                }
              );
              redacto.addClickEventToId(
                "redacto-accept-group-" + cat,
                function () {
                  redacto.userInterface.respondAll(true, cat);
                }
              );
              redacto.addClickEventToId(
                "redacto-reject-group-" + cat,
                function () {
                  redacto.userInterface.respondAll(false, cat);
                }
              );
            }
          });
        }

        // add info about the services on the main banner
        if (
          redacto.parameters.partnersList === true &&
          (redacto.parameters.orientation === "middle" ||
            redacto.parameters.orientation === "popup")
        ) {
          setTimeout(function () {
            var tacPartnersInfoParent = document.getElementById(
              "redactoDisclaimerAlert"
            );
            if (tacPartnersInfoParent !== null) {
              tacPartnersInfoParent.insertAdjacentHTML(
                "beforeend",
                '<div class="redactoPartnersList"><b>' +
                  redacto.lang.ourpartners +
                  ' <span id="redactoCounter-all"></span></b> <ul id="redactoCounter-list"></ul></div>'
              );
            }
          }, 100);
        }

        // add a save button
        setTimeout(function () {
          var tacSaveButtonParent = document.getElementById("redactoServices");
          if (tacSaveButtonParent !== null) {
            tacSaveButtonParent.insertAdjacentHTML(
              "beforeend",
              '<div id="redactoSave"><button class="redactoAllow" id="redactoSaveButton">' +
                redacto.lang.save +
                "</button></div>"
            );
          }
        }, 100);

        redacto.userInterface.color("", true);

        // add a little timeout to be sure everything is accessible
        setTimeout(function () {
          // Setup events
          redacto.addClickEventToId("redactoCloseCross", function () {
            redacto.userInterface.closeAlert();
          });
          redacto.addClickEventToId("redactoPersonalize", function () {
            redacto.userInterface.openPanel();
          });
          redacto.addClickEventToId("redactoPersonalize2", function () {
            redacto.userInterface.respondAll(true);
          });
          redacto.addClickEventToId("redactoManager", function () {
            redacto.userInterface.openPanel();
          });
          redacto.addClickEventToId("redactoBack", function () {
            redacto.userInterface.closePanel();
          });
          redacto.addClickEventToId("redactoClosePanel", function () {
            redacto.userInterface.closePanel();
          });
          redacto.addClickEventToId("redactoClosePanelCookie", function () {
            redacto.userInterface.closePanel();
          });
          redacto.addClickEventToId("redactoPrivacyUrl", function () {
            document.location = redacto.parameters.privacyUrl;
          });
          redacto.addClickEventToId("redactoPrivacyUrlDialog", function () {
            document.location = redacto.parameters.privacyUrl;
          });
          redacto.addClickEventToId("redactoCookiesNumber", function () {
            redacto.userInterface.toggleCookiesList();
          });
          redacto.addClickEventToId("redactoAllAllowed", function () {
            redacto.userInterface.respondAll(true);
          });
          redacto.addClickEventToId("redactoAllDenied", function () {
            redacto.userInterface.respondAll(false);
          });
          redacto.addClickEventToId("redactoAllDenied2", function () {
            redacto.userInterface.respondAll(false, "", true);
            if (redacto.reloadThePage === true) {
              window.location.reload();
            }
          });
          redacto.addClickEventToId("redactoCloseAlert", function () {
            redacto.userInterface.openPanel();
          });
          redacto.addClickEventToId("redactoCTAButton", function () {
            location.reload();
          });
          redacto.addClickEventToId("redactoSaveButton", function () {
            var timeoutSaveButton = 0;
            redacto.job.forEach(function (id) {
              if (redacto.state[id] !== true && redacto.state[id] !== false) {
                timeoutSaveButton = 500;
                redacto.setConsent(id, false);
              }
            });
            setTimeout(redacto.userInterface.closePanel, timeoutSaveButton);
          });
          var toggleBtns = document.getElementsByClassName("catToggleBtn"),
            i;
          for (i = 0; i < toggleBtns.length; i++) {
            toggleBtns[i].dataset.index = i;
            redacto.addClickEventToElement(toggleBtns[i], function () {
              if (!redacto.parameters.showDetailsOnClick) return false;
              redacto.userInterface.toggle(
                "redactoDetails" + cat[this.dataset.index],
                "redactoInfoBox"
              );
              if (
                document.getElementById(
                  "redactoDetails" + cat[this.dataset.index]
                ).style.display === "block"
              ) {
                this.setAttribute("aria-expanded", "true");
              } else {
                this.setAttribute("aria-expanded", "false");
              }
              return false;
            });
          }

          // accessibility: on click on "Allow" in the site (not in TAC module), move focus to the loaded service's parent
          var allowBtnsInSite = document.querySelectorAll(
            ".tac_activate .redactoAllow"
          );
          for (i = 0; i < allowBtnsInSite.length; i++) {
            redacto.addClickEventToElement(allowBtnsInSite[i], function () {
              if (
                this.closest(".tac_activate") !== null &&
                this.closest(".tac_activate").parentNode !== null
              ) {
                this.closest(".tac_activate").parentNode.setAttribute(
                  "tabindex",
                  "-1"
                );
                this.closest(".tac_activate").parentNode.focus();
              }
            });
          }

          var allowBtns = document.getElementsByClassName("redactoAllow");
          for (i = 0; i < allowBtns.length; i++) {
            redacto.addClickEventToElement(allowBtns[i], function () {
              redacto.userInterface.respond(this, true);
            });
          }
          var denyBtns = document.getElementsByClassName("redactoDeny");
          for (i = 0; i < denyBtns.length; i++) {
            redacto.addClickEventToElement(denyBtns[i], function () {
              redacto.userInterface.respond(this, false);
            });
          }
          if (redacto.events.load) {
            redacto.events.load();
          }
        }, 500);
      });
    });
  },
  addService: function (serviceId) {
    "use strict";
    var html = "",
      s = redacto.services,
      service = s[serviceId];

    if (typeof service === "undefined") {
      var serviceToRemoveIndex = redacto.job.indexOf(serviceId);
      if (serviceToRemoveIndex !== -1) {
        redacto.job.splice(serviceToRemoveIndex, 1);
      }
      return;
    }

    if (redacto.parameters.alwaysNeedConsent === true) {
      service.needConsent = true;
    }

    var cookie = redacto.cookie.read(),
      hostname = document.location.hostname,
      hostRef = document.referrer.split("/")[2],
      isNavigating =
        hostRef === hostname &&
        window.location.href !== redacto.parameters.privacyUrl,
      isAutostart = !service.needConsent,
      isWaiting = cookie.indexOf(service.key + "=wait") >= 0,
      isDenied = cookie.indexOf(service.key + "=false") >= 0,
      isAllowed =
        cookie.indexOf(service.key + "=true") >= 0 ||
        (!service.needConsent && cookie.indexOf(service.key + "=false") < 0),
      isResponded =
        cookie.indexOf(service.key + "=false") >= 0 ||
        cookie.indexOf(service.key + "=true") >= 0,
      isDNTRequested =
        navigator.doNotTrack === "1" ||
        navigator.doNotTrack === "yes" ||
        navigator.msDoNotTrack === "1" ||
        window.doNotTrack === "1",
      currentStatus = isAllowed
        ? redacto.lang.allowed
        : redacto.lang.disallowed,
      state =
        undefined !== service.defaultState
          ? service.defaultState
          : undefined !== redacto.parameters.serviceDefaultState
          ? redacto.parameters.serviceDefaultState
          : "wait";

    if (redacto.added[service.key] !== true) {
      redacto.added[service.key] = true;

      html += '<li id="' + service.key + 'Line" class="redactoLine">';
      html += '   <div class="redactoName">';
      html +=
        '       <span class="redactoH3" role="heading" aria-level="4">' +
        service.name +
        "</span>";
      html += '       <div class="redactoStatusInfo">';
      html +=
        '          <span class="tacCurrentStatus" id="tacCurrentStatus' +
        service.key +
        '">' +
        currentStatus +
        "</span>";
      html += '          <span class="redactoReadmoreSeparator"> - </span>';
      html +=
        '          <span id="tacCL' +
        service.key +
        '" class="redactoListCookies"></span>';
      html += "       </div>";
      if (redacto.parameters.moreInfoLink == true) {
        var link;
        if (redacto.getLanguage() === "fr") {
          link = "#"; // Service link removed for Redacto rebrand
        } else {
          link = "#"; // Service details link removed for Redacto rebrand
        }
        if (service.readmoreLink !== undefined && service.readmoreLink !== "") {
          link = service.readmoreLink;
        }
        if (
          redacto.parameters.readmoreLink !== undefined &&
          redacto.parameters.readmoreLink !== ""
        ) {
          link = redacto.parameters.readmoreLink;
        }
        html +=
          '       <a href="' +
          link +
          '" target="_blank" rel="noreferrer noopener nofollow" title="' +
          redacto.lang.more +
          " : " +
          redacto.lang.cookieDetail +
          " " +
          service.name +
          " " +
          redacto.lang.ourSite +
          " " +
          redacto.lang.newWindow +
          '" class="redactoReadmoreInfo">' +
          redacto.lang.more +
          "</a>";
        html += '       <span class="redactoReadmoreSeparator"> - </span>';
        html +=
          '       <a href="' +
          service.uri +
          '" target="_blank" rel="noreferrer noopener" title="' +
          redacto.lang.source +
          " " +
          service.name +
          " " +
          redacto.lang.newWindow +
          '" class="redactoReadmoreOfficial">' +
          redacto.lang.source +
          "</a>";
      }

      html += "   </div>";
      html += '   <div class="redactoAsk">';
      html +=
        '       <button type="button" aria-label="' +
        redacto.lang.allow +
        " " +
        service.name +
        '" id="' +
        service.key +
        'Allowed" class="redactoAllow">';
      html +=
        '           <span class="redactoCheck" aria-hidden="true"></span> ' +
        redacto.lang.allow;
      html += "       </button> ";
      html +=
        '       <button type="button" aria-label="' +
        redacto.lang.deny +
        " " +
        service.name +
        '" id="' +
        service.key +
        'Denied" class="redactoDeny">';
      html +=
        '           <span class="redactoCross" aria-hidden="true"></span> ' +
        redacto.lang.deny;
      html += "       </button>";
      html += "   </div>";
      html += "</li>";

      redacto.userInterface.css(
        "redactoServicesTitle_" + service.type,
        "display",
        "block"
      );

      if (document.getElementById("redactoServices_" + service.type) !== null) {
        document.getElementById("redactoServices_" + service.type).innerHTML +=
          html;
      }

      redacto.userInterface.css("redactoNoServicesTitle", "display", "none");

      redacto.userInterface.order(service.type);

      redacto.addClickEventToId(service.key + "Allowed", function () {
        redacto.userInterface.respond(this, true);
      });

      redacto.addClickEventToId(service.key + "Denied", function () {
        redacto.userInterface.respond(this, false);
      });
    }

    redacto.pro("!" + service.key + "=" + isAllowed);

    // allow by default for non EU
    if (isResponded === false && redacto.user.bypass === true) {
      isAllowed = true;
      redacto.cookie.create(service.key, true);
    }

    if (
      (!isResponded &&
        (isAutostart || (isNavigating && isWaiting)) &&
        !redacto.highPrivacy) ||
      isAllowed
    ) {
      if (
        !isAllowed ||
        (!service.needConsent && cookie.indexOf(service.key + "=false") < 0)
      ) {
        redacto.cookie.create(service.key, true);
      }
      if (redacto.launch[service.key] !== true) {
        redacto.launch[service.key] = true;
        redacto.sendEvent(service.key + "_consentModeOk");
        if (
          (typeof redactoMagic === "undefined" ||
            redactoMagic.indexOf("_" + service.key + "_") < 0) &&
          redacto.parameters.serverSide !== true
        ) {
          service.js();
        }
        redacto.sendEvent(service.key + "_loaded");
      }
      redacto.state[service.key] = true;
      redacto.userInterface.color(service.key, true);
    } else if (isDenied) {
      if (typeof service.fallback === "function") {
        if (
          (typeof redactoMagic === "undefined" ||
            redactoMagic.indexOf("_" + service.key + "_") < 0) &&
          redacto.parameters.serverSide !== true
        ) {
          service.fallback();
        }
      }
      redacto.state[service.key] = false;
      redacto.userInterface.color(service.key, false);
    } else if (
      !isResponded &&
      isDNTRequested &&
      redacto.handleBrowserDNTRequest
    ) {
      redacto.cookie.create(service.key, "false");
      if (typeof service.fallback === "function") {
        if (
          (typeof redactoMagic === "undefined" ||
            redactoMagic.indexOf("_" + service.key + "_") < 0) &&
          redacto.parameters.serverSide !== true
        ) {
          service.fallback();
        }
      }
      redacto.state[service.key] = false;
      redacto.userInterface.color(service.key, false);
    } else if (!isResponded) {
      redacto.cookie.create(service.key, state);

      if (true === state) {
        redacto.sendEvent(service.key + "_consentModeOk");
      }

      if (
        (typeof redactoMagic === "undefined" ||
          redactoMagic.indexOf("_" + service.key + "_") < 0) &&
        redacto.parameters.serverSide !== true
      ) {
        if (true === state && typeof service.js === "function") {
          service.js();
        } else if (typeof service.fallback === "function") {
          service.fallback();
        }
      }

      if (true === state) {
        redacto.sendEvent(service.key + "_loaded");
      }

      if (true === state || false === state) {
        redacto.state[service.key] = state;
      }
      redacto.userInterface.color(service.key, state);

      if ("wait" === state) {
        redacto.userInterface.openAlert();
      }
    }

    redacto.cookie.checkCount(service.key);
    redacto.sendEvent(service.key + "_added");
  },
  sendEvent: function (event_key) {
    if (event_key !== undefined) {
      //ie compatibility
      var send_event_item;
      if (typeof Event === "function") {
        send_event_item = new Event(event_key);
      } else if (typeof document.createEvent === "function") {
        send_event_item = document.createEvent("Event");
        send_event_item.initEvent(event_key, true, true);
      }
      //end ie compatibility

      document.dispatchEvent(send_event_item);
    }
  },
  cleanArray: function cleanArray(arr) {
    "use strict";
    var i,
      len = arr.length,
      out = [],
      obj = {},
      s = redacto.services;

    for (i = 0; i < len; i += 1) {
      if (!obj[arr[i]]) {
        obj[arr[i]] = {};
        if (redacto.services[arr[i]] !== undefined) {
          out.push(arr[i]);
        }
      }
    }

    out = out.sort(function (a, b) {
      if (s[a].type + s[a].key > s[b].type + s[b].key) {
        return 1;
      }
      if (s[a].type + s[a].key < s[b].type + s[b].key) {
        return -1;
      }
      return 0;
    });

    return out;
  },
  setConsent: function (id, status) {
    if (status === true) {
      redacto.userInterface.respond(
        document.getElementById(id + "Allowed"),
        true
      );
    } else if (status === false) {
      redacto.userInterface.respond(
        document.getElementById(id + "Denied"),
        false
      );
    }
  },
  userInterface: {
    css: function (id, property, value) {
      "use strict";
      if (document.getElementById(id) !== null) {
        if (
          property == "display" &&
          value == "none" &&
          (id == "redacto" || id == "redactoBack" || id == "redactoAlertBig")
        ) {
          document.getElementById(id).style["opacity"] = "0";

          /*setTimeout(function() {*/ document.getElementById(id).style[
            property
          ] = value; /*}, 200);*/
        } else {
          document.getElementById(id).style[property] = value;

          if (
            property == "display" &&
            value == "block" &&
            (id == "redacto" || id == "redactoAlertBig")
          ) {
            document.getElementById(id).style["opacity"] = "1";
          }

          if (
            property == "display" &&
            value == "block" &&
            id == "redactoBack"
          ) {
            document.getElementById(id).style["opacity"] = "0.7";
          }

          if (
            property == "display" &&
            value == "block" &&
            id == "redactoAlertBig" &&
            (redacto.parameters.orientation == "middle" ||
              redacto.parameters.orientation == "popup")
          ) {
            redacto.userInterface.focusTrap("redactoAlertBig");
          }
        }
      }
    },
    addClass: function (id, className) {
      "use strict";
      if (
        document.getElementById(id) !== null &&
        document.getElementById(id).classList !== undefined
      ) {
        document.getElementById(id).classList.add(className);
      }
    },
    removeClass: function (id, className) {
      "use strict";
      if (
        document.getElementById(id) !== null &&
        document.getElementById(id).classList !== undefined
      ) {
        document.getElementById(id).classList.remove(className);
      }
    },
    respondAll: function (status, type, allowSafeAnalytics) {
      "use strict";
      var s = redacto.services,
        service,
        key,
        index = 0;

      for (index = 0; index < redacto.job.length; index += 1) {
        if (
          typeof type !== "undefined" &&
          type !== "" &&
          s[redacto.job[index]].type !== type
        ) {
          continue;
        }

        if (
          allowSafeAnalytics &&
          typeof s[redacto.job[index]].safeanalytic !== "undefined" &&
          s[redacto.job[index]].safeanalytic === true
        ) {
          continue;
        }

        service = s[redacto.job[index]];
        key = service.key;
        if (redacto.state[key] !== status) {
          if (status == true) {
            redacto.sendEvent(key + "_consentModeOk");
          } else {
            redacto.sendEvent(key + "_consentModeKo");
          }

          if (status === false && redacto.launch[key] === true) {
            redacto.reloadThePage = true;
            if (redacto.checkIfExist("redactoClosePanel")) {
              var ariaCloseValue =
                document
                  .getElementById("redactoClosePanel")
                  .textContent.trim() +
                " (" +
                redacto.lang.reload +
                ")";
              document
                .getElementById("redactoClosePanel")
                .setAttribute("aria-label", ariaCloseValue);
              document
                .getElementById("redactoClosePanel")
                .setAttribute("title", ariaCloseValue);
            }
          }
          if (redacto.launch[key] !== true && status === true) {
            redacto.pro("!" + key + "=engage");

            redacto.launch[key] = true;
            if (
              (typeof redactoMagic === "undefined" ||
                redactoMagic.indexOf("_" + key + "_") < 0) &&
              redacto.parameters.serverSide !== true
            ) {
              redacto.services[key].js();
            }
            redacto.sendEvent(key + "_loaded");
          }
          var itemStatusElem = document.getElementById(
            "tacCurrentStatus" + key
          );
          redacto.state[key] = status;
          redacto.cookie.create(key, status);
          redacto.userInterface.color(key, status);
          if (status == true) {
            itemStatusElem.innerHTML = redacto.lang.allowed;
            redacto.sendEvent(key + "_allowed");
          } else {
            itemStatusElem.innerHTML = redacto.lang.disallowed;
            redacto.sendEvent(key + "_disallowed");
          }
        }
      }
    },
    respond: function (el, status) {
      "use strict";
      if (el.id === "") {
        return;
      }
      var key = el.id.replace(new RegExp("(Eng[0-9]+|Allow|Deni)ed", "g"), "");

      if (key.substring(0, 13) === "redacto" || key === "") {
        return;
      }

      // return if same state
      if (redacto.state[key] === status) {
        return;
      }

      if (status == true) {
        redacto.sendEvent(key + "_consentModeOk");
      } else {
        redacto.sendEvent(key + "_consentModeKo");
      }

      if (status === false && redacto.launch[key] === true) {
        redacto.reloadThePage = true;
        if (redacto.checkIfExist("redactoClosePanel")) {
          var ariaCloseValue =
            document.getElementById("redactoClosePanel").textContent.trim() +
            " (" +
            redacto.lang.reload +
            ")";
          document
            .getElementById("redactoClosePanel")
            .setAttribute("aria-label", ariaCloseValue);
          document
            .getElementById("redactoClosePanel")
            .setAttribute("title", ariaCloseValue);
        }
      }

      // if not already launched... launch the service
      if (status === true) {
        if (redacto.launch[key] !== true) {
          redacto.pro("!" + key + "=engage");

          redacto.launch[key] = true;
          redacto.sendEvent(key + "_consentModeOk");
          if (
            (typeof redactoMagic === "undefined" ||
              redactoMagic.indexOf("_" + key + "_") < 0) &&
            redacto.parameters.serverSide !== true
          ) {
            redacto.services[key].js();
          }
          redacto.sendEvent(key + "_loaded");
        }
      }
      var itemStatusElem = document.getElementById("tacCurrentStatus" + key);
      redacto.state[key] = status;
      redacto.cookie.create(key, status);
      redacto.userInterface.color(key, status);
      if (status == true) {
        itemStatusElem.innerHTML = redacto.lang.allowed;
        redacto.sendEvent(key + "_allowed");
      } else {
        itemStatusElem.innerHTML = redacto.lang.disallowed;
        redacto.sendEvent(key + "_disallowed");
      }
    },
    color: function (key, status) {
      "use strict";
      var c = "redacto",
        nbDenied = 0,
        nbPending = 0,
        nbAllowed = 0,
        sum = redacto.job.length,
        index,
        s = redacto.services;

      if (key !== "") {
        redacto.cookie.checkCount(key);

        if (status === true) {
          redacto.userInterface.addClass(key + "Line", "redactoIsAllowed");
          redacto.userInterface.removeClass(key + "Line", "redactoIsDenied");
          document
            .getElementById(key + "Allowed")
            .setAttribute("aria-pressed", "true");
          document
            .getElementById(key + "Denied")
            .setAttribute("aria-pressed", "false");
        } else if (status === false) {
          redacto.userInterface.removeClass(key + "Line", "redactoIsAllowed");
          redacto.userInterface.addClass(key + "Line", "redactoIsDenied");
          document
            .getElementById(key + "Allowed")
            .setAttribute("aria-pressed", "false");
          document
            .getElementById(key + "Denied")
            .setAttribute("aria-pressed", "true");
        } else {
          document
            .getElementById(key + "Allowed")
            .setAttribute("aria-pressed", "false");
          document
            .getElementById(key + "Denied")
            .setAttribute("aria-pressed", "false");
        }

        // check if all services are allowed
        var sumToRemove = 0;
        for (index = 0; index < sum; index += 1) {
          if (
            typeof s[redacto.job[index]].safeanalytic !== "undefined" &&
            s[redacto.job[index]].safeanalytic === true
          ) {
            sumToRemove += 1;
            continue;
          }

          if (redacto.state[redacto.job[index]] === false) {
            nbDenied += 1;
          } else if (redacto.state[redacto.job[index]] === undefined) {
            nbPending += 1;
          } else if (redacto.state[redacto.job[index]] === true) {
            nbAllowed += 1;
          }
        }
        sum -= sumToRemove;

        const percentages = {
          DotGreen: (100 / sum) * nbAllowed,
          DotYellow: (100 / sum) * nbPending,
          DotRed: (100 / sum) * nbDenied,
        };

        for (const [colorKey, value] of Object.entries(percentages)) {
          redacto.userInterface.css(c + colorKey, "width", value + "%");
        }

        if (redacto.parameters.showAlertSmall === true) {
          const percentAllowed = percentages.DotGreen;
          const label =
            redacto.lang.alertSmall +
            " - " +
            percentAllowed +
            "% " +
            redacto.lang.allowed +
            " " +
            redacto.lang.modalWindow;
          const managerEl = document.getElementById(c + "Manager");
          managerEl.setAttribute("aria-label", label);
          managerEl.setAttribute("title", label);
        }

        if (nbDenied === 0 && nbPending === 0) {
          redacto.userInterface.removeClass(c + "AllDenied", c + "IsSelected");
          redacto.userInterface.addClass(c + "AllAllowed", c + "IsSelected");

          redacto.userInterface.addClass(c + "MainLineOffset", c + "IsAllowed");
          redacto.userInterface.removeClass(
            c + "MainLineOffset",
            c + "IsDenied"
          );

          document
            .getElementById(c + "AllDenied")
            .setAttribute("aria-pressed", "false");
          document
            .getElementById(c + "AllAllowed")
            .setAttribute("aria-pressed", "true");
        } else if (nbAllowed === 0 && nbPending === 0) {
          redacto.userInterface.removeClass(c + "AllAllowed", c + "IsSelected");
          redacto.userInterface.addClass(c + "AllDenied", c + "IsSelected");

          redacto.userInterface.removeClass(
            c + "MainLineOffset",
            c + "IsAllowed"
          );
          redacto.userInterface.addClass(c + "MainLineOffset", c + "IsDenied");

          document
            .getElementById(c + "AllDenied")
            .setAttribute("aria-pressed", "true");
          document
            .getElementById(c + "AllAllowed")
            .setAttribute("aria-pressed", "false");
        } else {
          redacto.userInterface.removeClass(c + "AllAllowed", c + "IsSelected");
          redacto.userInterface.removeClass(c + "AllDenied", c + "IsSelected");

          redacto.userInterface.removeClass(
            c + "MainLineOffset",
            c + "IsAllowed"
          );
          redacto.userInterface.removeClass(
            c + "MainLineOffset",
            c + "IsDenied"
          );

          document
            .getElementById(c + "AllDenied")
            .setAttribute("aria-pressed", "false");
          document
            .getElementById(c + "AllAllowed")
            .setAttribute("aria-pressed", "false");
        }

        // close the alert if all service have been reviewed
        if (nbPending === 0) {
          redacto.userInterface.closeAlert();
        }

        if (redacto.services[key].cookies.length > 0 && status === false) {
          redacto.cookie.purge(redacto.services[key].cookies);
        }

        if (status === true) {
          if (document.getElementById("tacCL" + key) !== null) {
            document.getElementById("tacCL" + key).innerHTML = "...";
          }
          setTimeout(function () {
            redacto.cookie.checkCount(key);
          }, 2500);
        } else {
          redacto.cookie.checkCount(key);
        }
      }

      // groups
      var cats = document.querySelectorAll('[id^="redactoServicesTitle_"]');
      Array.prototype.forEach.call(cats, function (item) {
        var cat = item
            .getAttribute("id")
            .replace(/^(redactoServicesTitle_)/, ""),
          total = document.getElementById(
            "redactoServices_" + cat
          ).childElementCount;
        var doc = document.getElementById("redactoServices_" + cat),
          groupdenied = 0,
          groupallowed = 0;
        for (var ii = 0; ii < doc.children.length; ii++) {
          if (doc.children[ii].className == "redactoLine redactoIsDenied") {
            groupdenied++;
          }
          if (doc.children[ii].className == "redactoLine redactoIsAllowed") {
            groupallowed++;
          }
        }
        if (total === groupallowed) {
          redacto.userInterface.removeClass(
            "redacto-group-" + cat,
            "redactoIsDenied"
          );
          redacto.userInterface.addClass(
            "redacto-group-" + cat,
            "redactoIsAllowed"
          );

          if (document.getElementById("redacto-reject-group-" + cat)) {
            document
              .getElementById("redacto-reject-group-" + cat)
              .setAttribute("aria-pressed", "false");
            document
              .getElementById("redacto-accept-group-" + cat)
              .setAttribute("aria-pressed", "true");
          }
        }
        if (total === groupdenied) {
          redacto.userInterface.addClass(
            "redacto-group-" + cat,
            "redactoIsDenied"
          );
          redacto.userInterface.removeClass(
            "redacto-group-" + cat,
            "redactoIsAllowed"
          );

          if (document.getElementById("redacto-reject-group-" + cat)) {
            document
              .getElementById("redacto-reject-group-" + cat)
              .setAttribute("aria-pressed", "true");
            document
              .getElementById("redacto-accept-group-" + cat)
              .setAttribute("aria-pressed", "false");
          }
        }
        if (total !== groupdenied && total !== groupallowed) {
          redacto.userInterface.removeClass(
            "redacto-group-" + cat,
            "redactoIsDenied"
          );
          redacto.userInterface.removeClass(
            "redacto-group-" + cat,
            "redactoIsAllowed"
          );

          if (document.getElementById("redacto-reject-group-" + cat)) {
            document
              .getElementById("redacto-reject-group-" + cat)
              .setAttribute("aria-pressed", "false");
            document
              .getElementById("redacto-accept-group-" + cat)
              .setAttribute("aria-pressed", "false");
          }
        }
        groupdenied = 0;
        groupallowed = 0;

        if (document.getElementById("redactoCounter-" + cat)) {
          document.getElementById("redactoCounter-" + cat).innerHTML =
            "(" +
            document.getElementById("redactoServices_" + cat)
              .childElementCount +
            ")";
        }
      });

      setTimeout(function () {
        if (document.getElementById("redactoCounter-all")) {
          document.getElementById("redactoCounter-all").innerHTML =
            "(" + redacto.job.length + ")";
        }
        if (document.getElementById("redactoCounter-list")) {
          var liPartners = "";
          var redactoPartnersCat = [];
          var titles = [];

          redacto.job.forEach(function (id) {
            if (redactoPartnersCat[redacto.services[id].type] === undefined) {
              redactoPartnersCat[redacto.services[id].type] = true;
              titles.push(redacto.lang[redacto.services[id].type].title);
            }
          });
          titles.sort();
          titles.forEach(function (title) {
            liPartners += "<li>" + title + "</li>";
          });

          document.getElementById("redactoCounter-list").innerHTML = liPartners;
        }
      }, 120);
    },
    openPanel: function () {
      "use strict";

      redacto.userInterface.css("redacto", "display", "block");
      redacto.userInterface.css("redactoBack", "display", "block");
      redacto.userInterface.css(
        "redactoCookiesListContainer",
        "display",
        "none"
      );

      if (redacto.checkIfExist("redactoClosePanel")) {
        document.getElementById("redactoClosePanel").focus();
      }
      if (document.getElementsByTagName("html")[0].classList !== undefined) {
        document
          .getElementsByTagName("html")[0]
          .classList.add("redacto-modal-open-noscroll");
      }
      if (document.getElementsByTagName("body")[0].classList !== undefined) {
        document
          .getElementsByTagName("body")[0]
          .classList.add("redacto-modal-open");
      }
      redacto.userInterface.focusTrap("redacto");
      redacto.userInterface.jsSizing("main");

      //ie compatibility
      var tacOpenPanelEvent;
      if (typeof Event === "function") {
        tacOpenPanelEvent = new Event("tac.open_panel");
      } else if (typeof document.createEvent === "function") {
        tacOpenPanelEvent = document.createEvent("Event");
        tacOpenPanelEvent.initEvent("tac.open_panel", true, true);
      }
      //end ie compatibility

      if (typeof window.dispatchEvent === "function") {
        window.dispatchEvent(tacOpenPanelEvent);
      }
    },
    closePanel: function () {
      "use strict";

      if (document.location.hash === redacto.hashtag) {
        if (window.history) {
          window.history.replaceState(
            "",
            document.title,
            window.location.pathname + window.location.search
          );
        } else {
          document.location.hash = "";
        }
      }
      if (redacto.checkIfExist("redacto")) {
        // accessibility: manage focus on close panel
        if (redacto.checkIfExist("redactoCloseAlert")) {
          document.getElementById("redactoCloseAlert").focus();
        } else if (redacto.checkIfExist("redactoManager")) {
          document.getElementById("redactoManager").focus();
        } else if (
          redacto.customCloserId &&
          redacto.checkIfExist(redacto.customCloserId)
        ) {
          document.getElementById(redacto.customCloserId).focus();
        }
        redacto.userInterface.css("redacto", "display", "none");
      }

      if (
        redacto.checkIfExist("redactoCookiesListContainer") &&
        redacto.checkIfExist("redactoCookiesNumber")
      ) {
        // accessibility: manage focus on close cookies list
        document.getElementById("redactoCookiesNumber").focus();
        document
          .getElementById("redactoCookiesNumber")
          .setAttribute("aria-expanded", "false");
        redacto.userInterface.css(
          "redactoCookiesListContainer",
          "display",
          "none"
        );
      }

      redacto.fallback(
        ["redactoInfoBox"],
        function (elem) {
          elem.style.display = "none";
        },
        true
      );

      if (redacto.reloadThePage === true) {
        window.location.reload();
      } else {
        redacto.userInterface.css("redactoBack", "display", "none");
      }

      if (
        !(
          redacto.parameters.orientation === "middle" &&
          document.getElementById("redactoAlertBig").style.display === "block"
        )
      ) {
        if (document.getElementsByTagName("html")[0].classList !== undefined) {
          document
            .getElementsByTagName("html")[0]
            .classList.remove("redacto-modal-open-noscroll");
        }
      }
      if (document.getElementsByTagName("body")[0].classList !== undefined) {
        document
          .getElementsByTagName("body")[0]
          .classList.remove("redacto-modal-open");
      }

      //ie compatibility
      var tacClosePanelEvent;
      if (typeof Event === "function") {
        tacClosePanelEvent = new Event("tac.close_panel");
      } else if (typeof document.createEvent === "function") {
        tacClosePanelEvent = document.createEvent("Event");
        tacClosePanelEvent.initEvent("tac.close_panel", true, true);
      }
      //end ie compatibility

      if (typeof window.dispatchEvent === "function") {
        window.dispatchEvent(tacClosePanelEvent);
      }
    },
    focusTrap: function (parentElement) {
      "use strict";

      var focusableEls, firstFocusableEl, lastFocusableEl, filtered;

      focusableEls = document
        .getElementById(parentElement)
        .querySelectorAll("a[href], button");
      filtered = [];

      // get only visible items
      for (var i = 0, max = focusableEls.length; i < max; i++) {
        if (focusableEls[i].offsetHeight > 0) {
          filtered.push(focusableEls[i]);
        }
      }

      firstFocusableEl = filtered[0];
      lastFocusableEl = filtered[filtered.length - 1];

      //loop focus inside redacto
      document
        .getElementById(parentElement)
        .addEventListener("keydown", function (evt) {
          if (evt.key === "Tab" || evt.keyCode === 9) {
            if (evt.shiftKey) {
              /* shift + tab */ if (
                document.activeElement === firstFocusableEl
              ) {
                lastFocusableEl.focus();
                evt.preventDefault();
              }
            } /* tab */ else {
              if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                evt.preventDefault();
              }
            }
          }
        });
    },
    openAlert: function () {
      "use strict";
      var c = "redacto";
      redacto.userInterface.css(c + "Percentage", "display", "block");
      redacto.userInterface.css(c + "AlertSmall", "display", "none");
      redacto.userInterface.css(c + "Icon", "display", "none");
      redacto.userInterface.css(c + "AlertBig", "display", "block");
      redacto.userInterface.addClass(c + "Root", "redactoBeforeVisible");
      redacto.userInterface.css("tac_title", "display", "block");

      //ie compatibility
      var tacOpenAlertEvent;
      if (typeof Event === "function") {
        tacOpenAlertEvent = new Event("tac.open_alert");
      } else if (typeof document.createEvent === "function") {
        tacOpenAlertEvent = document.createEvent("Event");
        tacOpenAlertEvent.initEvent("tac.open_alert", true, true);
      }
      //end ie compatibility

      if (
        document.getElementById("redactoAlertBig") !== null &&
        redacto.parameters.orientation === "middle"
      ) {
        document.getElementById("redactoAlertBig").focus();
        if (document.getElementsByTagName("html")[0].classList !== undefined) {
          document
            .getElementsByTagName("html")[0]
            .classList.add("redacto-modal-open-noscroll");
        }
      }

      if (typeof window.dispatchEvent === "function") {
        window.dispatchEvent(tacOpenAlertEvent);
      }
    },
    closeAlert: function () {
      "use strict";
      var c = "redacto";
      redacto.userInterface.css(c + "Percentage", "display", "none");
      redacto.userInterface.css(c + "AlertSmall", "display", "block");
      redacto.userInterface.css(c + "Icon", "display", "block");
      redacto.userInterface.css(c + "AlertBig", "display", "none");
      redacto.userInterface.removeClass(c + "Root", "redactoBeforeVisible");
      redacto.userInterface.jsSizing("box");

      //ie compatibility
      var tacCloseAlertEvent;
      if (typeof Event === "function") {
        tacCloseAlertEvent = new Event("tac.close_alert");
      } else if (typeof document.createEvent === "function") {
        tacCloseAlertEvent = document.createEvent("Event");
        tacCloseAlertEvent.initEvent("tac.close_alert", true, true);
      }
      //end ie compatibility

      if (
        redacto.parameters.showAlertSmall === false &&
        redacto.parameters.showIcon === false
      ) {
        redacto.userInterface.css("tac_title", "display", "none");
      }

      if (document.getElementsByTagName("html")[0].classList !== undefined) {
        document
          .getElementsByTagName("html")[0]
          .classList.remove("redacto-modal-open-noscroll");
      }

      if (typeof window.dispatchEvent === "function") {
        window.dispatchEvent(tacCloseAlertEvent);
      }
    },
    toggleCookiesList: function () {
      "use strict";
      var div = document.getElementById("redactoCookiesListContainer"),
        togglediv = document.getElementById("redactoCookiesNumber");

      if (div === null) {
        return;
      }

      if (div.style.display !== "block") {
        redacto.cookie.number();
        div.style.display = "block";
        togglediv.setAttribute("aria-expanded", "true");
        redacto.userInterface.jsSizing("cookie");
        redacto.userInterface.css("redacto", "display", "none");
        redacto.userInterface.css("redactoBack", "display", "block");
        redacto.fallback(
          ["redactoInfoBox"],
          function (elem) {
            elem.style.display = "none";
          },
          true
        );
      } else {
        div.style.display = "none";
        togglediv.setAttribute("aria-expanded", "false");
        redacto.userInterface.css("redacto", "display", "none");
        redacto.userInterface.css("redactoBack", "display", "none");
      }
    },
    toggle: function (id, closeClass) {
      "use strict";
      var div = document.getElementById(id);

      if (div === null) {
        return;
      }

      if (closeClass !== undefined) {
        redacto.fallback(
          [closeClass],
          function (elem) {
            if (elem.id !== id) {
              elem.style.display = "none";
            }
          },
          true
        );
      }

      if (div.style.display !== "block") {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }
    },
    order: function (id) {
      "use strict";
      var main = document.getElementById("redactoServices_" + id),
        allDivs,
        store = [],
        i;

      if (main === null) {
        return;
      }

      allDivs = main.childNodes;

      if (
        typeof Array.prototype.map === "function" &&
        typeof Enumerable === "undefined"
      ) {
        Array.prototype.map
          .call(main.children, Object)
          .sort(function (a, b) {
            //var mainChildren = Array.from(main.children);
            //mainChildren.sort(function (a, b) {
            if (
              redacto.services[a.id.replace(/Line/g, "")].name >
              redacto.services[b.id.replace(/Line/g, "")].name
            ) {
              return 1;
            }
            if (
              redacto.services[a.id.replace(/Line/g, "")].name <
              redacto.services[b.id.replace(/Line/g, "")].name
            ) {
              return -1;
            }
            return 0;
          })
          .forEach(function (element) {
            main.appendChild(element);
          });
      }
    },
    jsSizing: function (type) {
      "use strict";
      var scrollbarMarginRight = 10,
        scrollbarWidthParent,
        scrollbarWidthChild,
        servicesHeight,
        e = window,
        a = "inner",
        windowInnerHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight,
        mainTop,
        mainHeight,
        closeButtonHeight,
        headerHeight,
        cookiesListHeight,
        cookiesCloseHeight,
        cookiesTitleHeight,
        paddingBox,
        alertSmallHeight,
        cookiesNumberHeight;

      if (type === "box") {
        if (
          document.getElementById("redactoAlertSmall") !== null &&
          document.getElementById("redactoCookiesNumber") !== null
        ) {
          // reset
          redacto.userInterface.css(
            "redactoCookiesNumber",
            "padding",
            "0px 10px"
          );

          // calculate
          alertSmallHeight =
            document.getElementById("redactoAlertSmall").offsetHeight;
          cookiesNumberHeight = document.getElementById(
            "redactoCookiesNumber"
          ).offsetHeight;
          paddingBox = (alertSmallHeight - cookiesNumberHeight) / 2;

          // apply
          redacto.userInterface.css(
            "redactoCookiesNumber",
            "padding",
            paddingBox + "px 10px"
          );
        }
      } else if (type === "main") {
        // get the real window width for media query
        if (window.innerWidth === undefined) {
          a = "client";
          e = document.documentElement || document.body;
        }

        // height of the services list container
        if (
          document.getElementById("redacto") !== null &&
          document.getElementById("redactoClosePanel") !== null &&
          document.getElementById("redactoMainLineOffset") !== null
        ) {
          // reset
          redacto.userInterface.css("redactoServices", "height", "auto");

          // calculate
          mainHeight = document.getElementById("redacto").offsetHeight;
          closeButtonHeight =
            document.getElementById("redactoClosePanel").offsetHeight;

          // apply
          servicesHeight = mainHeight - closeButtonHeight + 4;
          redacto.userInterface.css(
            "redactoServices",
            "height",
            servicesHeight + "px"
          );
          redacto.userInterface.css("redactoServices", "overflow-x", "auto");
        }

        // align the main allow/deny button depending on scrollbar width
        if (
          document.getElementById("redactoServices") !== null &&
          document.getElementById("redactoScrollbarChild") !== null
        ) {
          // media query
          if (e[a + "Width"] <= 479) {
            //redacto.userInterface.css('redactoScrollbarAdjust', 'marginLeft', '11px');
          } else if (e[a + "Width"] <= 767) {
            scrollbarMarginRight = 12;
          }

          scrollbarWidthParent =
            document.getElementById("redactoServices").offsetWidth;
          scrollbarWidthChild = document.getElementById(
            "redactoScrollbarChild"
          ).offsetWidth;
          //redacto.userInterface.css('redactoScrollbarAdjust', 'marginRight', ((scrollbarWidthParent - scrollbarWidthChild) + scrollbarMarginRight) + 'px');
        }

        // center the main panel
        if (document.getElementById("redacto") !== null) {
          // media query
          if (e[a + "Width"] <= 767) {
            mainTop = 0;
          } else {
            mainTop =
              (windowInnerHeight -
                document.getElementById("redacto").offsetHeight) /
                2 -
              21;
          }

          if (document.getElementById("redactoMainLineOffset") !== null) {
            if (
              document.getElementById("redacto").offsetHeight <
              windowInnerHeight / 2
            ) {
              mainTop -= document.getElementById(
                "redactoMainLineOffset"
              ).offsetHeight;
            }
          }

          // correct
          if (mainTop < 0) {
            mainTop = 0;
          }

          // apply
          redacto.userInterface.css("redacto", "top", mainTop + "px");
        }
      } else if (type === "cookie") {
        // put cookies list at bottom
        if (document.getElementById("redactoAlertSmall") !== null) {
          redacto.userInterface.css(
            "redactoCookiesListContainer",
            "bottom",
            document.getElementById("redactoAlertSmall").offsetHeight + "px"
          );
        }

        // height of cookies list
        if (document.getElementById("redactoCookiesListContainer") !== null) {
          // reset
          redacto.userInterface.css("redactoCookiesList", "height", "auto");

          // calculate
          cookiesListHeight = document.getElementById(
            "redactoCookiesListContainer"
          ).offsetHeight;
          cookiesCloseHeight = document.getElementById(
            "redactoClosePanelCookie"
          ).offsetHeight;
          cookiesTitleHeight = document.getElementById(
            "redactoCookiesTitle"
          ).offsetHeight;

          // apply
          redacto.userInterface.css(
            "redactoCookiesList",
            "height",
            cookiesListHeight -
              cookiesCloseHeight -
              cookiesTitleHeight -
              2 +
              "px"
          );
        }
      }
    },
  },
  cookie: {
    owner: {},
    create: function (key, status) {
      "use strict";

      if (redactoForceExpire !== "") {
        // The number of day(s)/hour(s) can't be higher than 1 year
        if (
          (redactoExpireInDay && redactoForceExpire < 365) ||
          (!redactoExpireInDay && redactoForceExpire < 8760)
        ) {
          if (redactoExpireInDay) {
            // Multiplication to tranform the number of days to milliseconds
            timeExpire = redactoForceExpire * 86400000;
          } else {
            // Multiplication to tranform the number of hours to milliseconds
            timeExpire = redactoForceExpire * 3600000;
          }
        }
      }

      var d = new Date(),
        time = d.getTime(),
        expireTime = time + timeExpire, // 365 days
        regex = new RegExp("!" + key + "=(wait|true|false)", "g"),
        cookie = redacto.cookie.read().replace(regex, ""),
        value =
          redacto.parameters.cookieName +
          "=" +
          cookie +
          "!" +
          key +
          "=" +
          status,
        domain =
          redacto.parameters.cookieDomain !== undefined &&
          redacto.parameters.cookieDomain !== ""
            ? "; domain=" + redacto.parameters.cookieDomain
            : "",
        secure = location.protocol === "https:" ? "; Secure" : "";

      d.setTime(expireTime);
      document.cookie =
        value +
        "; expires=" +
        d.toGMTString() +
        "; path=/" +
        domain +
        secure +
        "; samesite=lax";

      redacto.sendEvent("tac.consent_updated");
    },
    read: function () {
      "use strict";
      var nameEQ = redacto.parameters.cookieName + "=",
        ca = document.cookie.split(";"),
        i,
        c;

      for (i = 0; i < ca.length; i += 1) {
        c = ca[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }
      return "";
    },
    purge: function (arr) {
      "use strict";
      var i;

      for (i = 0; i < arr.length; i += 1) {
        var rgxpCookie = new RegExp(
          "^(.*;)?\\s*" + arr[i] + "\\s*=\\s*[^;]+(.*)?$"
        );
        if (document.cookie.match(rgxpCookie)) {
          document.cookie =
            arr[i] + "=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/;";
          document.cookie =
            arr[i] +
            "=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=." +
            location.hostname +
            ";";
          document.cookie =
            arr[i] +
            "=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=." +
            location.hostname.split(".").slice(-2).join(".") +
            ";";
        }
      }
    },
    checkCount: function (key) {
      "use strict";
      var arr = redacto.services[key].cookies,
        nb = arr.length,
        nbCurrent = 0,
        html = "",
        i,
        status = document.cookie.indexOf(key + "=true"),
        cookieLabel = "cookie";

      if (redacto.getLanguage() === "de") {
        cookieLabel = "Cookie";
      }

      if (status >= 0 && nb === 0) {
        html += redacto.lang.useNoCookie;
      } else if (nb > 0) {
        for (i = 0; i < nb; i += 1) {
          if (document.cookie.indexOf(arr[i] + "=") !== -1) {
            nbCurrent += 1;
            if (redacto.cookie.owner[arr[i]] === undefined) {
              redacto.cookie.owner[arr[i]] = [];
            }
            if (
              redacto.cookie.crossIndexOf(
                redacto.cookie.owner[arr[i]],
                redacto.services[key].name
              ) === false
            ) {
              redacto.cookie.owner[arr[i]].push(redacto.services[key].name);
            }
          }
        }

        if (nbCurrent > 0) {
          html +=
            redacto.lang.useCookieCurrent + " " + nbCurrent + " " + cookieLabel;
          if (nbCurrent > 1) {
            html += "s";
          }
          html += ".";
        } else {
          html += redacto.lang.useNoCookie;
        }
      } else if (nb === 0) {
        html = redacto.lang.noCookie;
      } else {
        html += redacto.lang.useCookie + " " + nb + " " + cookieLabel;
        if (nb > 1) {
          html += "s";
        }
        html += ".";
      }

      if (document.getElementById("tacCL" + key) !== null) {
        document.getElementById("tacCL" + key).innerHTML = html;
      }
    },
    crossIndexOf: function (arr, match) {
      "use strict";
      var i;
      for (i = 0; i < arr.length; i += 1) {
        if (arr[i] === match) {
          return true;
        }
      }
      return false;
    },
    number: function () {
      "use strict";
      var cookies = document.cookie.split(";"),
        nb = document.cookie !== "" ? cookies.length : 0,
        html = "",
        i,
        name,
        namea,
        nameb,
        c,
        d,
        s = nb > 1 ? "s" : "",
        savedname,
        regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i,
        regexedDomain =
          redacto.cdn.match(regex) !== null
            ? redacto.cdn.match(regex)[1]
            : redacto.cdn,
        host = redacto.domain !== undefined ? redacto.domain : regexedDomain;

      cookies = cookies.sort(function (a, b) {
        namea = a.split("=", 1).toString().replace(/ /g, "");
        nameb = b.split("=", 1).toString().replace(/ /g, "");
        c =
          redacto.cookie.owner[namea] !== undefined
            ? redacto.cookie.owner[namea]
            : "0";
        d =
          redacto.cookie.owner[nameb] !== undefined
            ? redacto.cookie.owner[nameb]
            : "0";
        if (c + a > d + b) {
          return 1;
        }
        if (c + a < d + b) {
          return -1;
        }
        return 0;
      });

      if (document.cookie !== "") {
        for (i = 0; i < nb; i += 1) {
          name = cookies[i].split("=", 1).toString().replace(/ /g, "");
          if (
            redacto.cookie.owner[name] !== undefined &&
            redacto.cookie.owner[name].join(" // ") !== savedname
          ) {
            savedname = redacto.cookie.owner[name].join(" // ");
            html += '<div class="redactoHidden">';
            html +=
              '     <span class="redactoH3" role="heading" aria-level="4">';
            html += "        " + redacto.cookie.owner[name].join(" // ");
            html += "    </span>";
            html += '</div><ul class="cookie-list">';
          } else if (
            redacto.cookie.owner[name] === undefined &&
            host !== savedname
          ) {
            savedname = host;
            html += '<div class="redactoHidden">';
            html +=
              '     <span class="redactoH3" role="heading" aria-level="4">';
            html += "        " + host;
            html += "    </span>";
            html += '</div><ul class="cookie-list">';
          }
          html += '<li class="redactoCookiesListMain">';
          html +=
            '    <div class="redactoCookiesListLeft"><button type="button" class="purgeBtn" data-cookie="' +
            redacto.fixSelfXSS(cookies[i].split("=", 1)) +
            '"><strong>&times;</strong></button> <strong>' +
            redacto.fixSelfXSS(name) +
            "</strong>";
          html += "    </div>";
          html +=
            '    <div class="redactoCookiesListRight">' +
            redacto.cookie.beautify(cookies[i].split("=").slice(1).join("=")) +
            "</div>";
          html += "</li>";
        }
        html += "</ul>";
      } else {
        html += '<div class="redactoCookiesListMain">';
        html +=
          '    <div class="redactoCookiesListLeft"><strong>-</strong></div>';
        html += '    <div class="redactoCookiesListRight"></div>';
        html += "</div>";
      }

      html += '<div class="redactoHidden redacto-spacer-20"></div>';

      if (document.getElementById("redactoCookiesList") !== null) {
        document.getElementById("redactoCookiesList").innerHTML = html;
      }

      if (document.getElementById("redactoCookiesNumber") !== null) {
        document.getElementById("redactoCookiesNumber").innerHTML = nb;
        document
          .getElementById("redactoCookiesNumber")
          .setAttribute(
            "aria-label",
            nb + " cookie" + s + " - " + redacto.lang.toggleInfoBox
          );
        document
          .getElementById("redactoCookiesNumber")
          .setAttribute(
            "title",
            nb + " cookie" + s + " - " + redacto.lang.toggleInfoBox
          );
      }

      if (document.getElementById("redactoCookiesNumberBis") !== null) {
        document.getElementById("redactoCookiesNumberBis").innerHTML =
          nb + " cookie" + s;
      }

      var purgeBtns = document.getElementsByClassName("purgeBtn");
      for (i = 0; i < purgeBtns.length; i++) {
        redacto.addClickEventToElement(purgeBtns[i], function () {
          redacto.cookie.purge([this.dataset.cookie]);
          redacto.cookie.number();
          redacto.userInterface.jsSizing("cookie");
          return false;
        });
      }

      for (i = 0; i < redacto.job.length; i += 1) {
        redacto.cookie.checkCount(redacto.job[i]);
      }
    },
    beautify: function (v) {
      let beautiful = v;
      try {
        beautiful = decodeURIComponent(decodeURI(v));
      } catch {}
      return redacto.fixSelfXSS(beautiful);
    },
  },
  fixSelfXSS: function (html) {
    return html
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },
  getLanguage: function () {
    "use strict";

    var availableLanguages =
        "ar,bg,ca,cn,cs,da,de,et,el,en,es,fi,fr,hr,hu,it,ja,ko,lb,lt,lv,nl,no,oc,pl,pt,ro,ru,se,sk,sq,sv,tr,uk,vi,zh",
      defaultLanguage = "en";

    if (redactoForceLanguage !== "") {
      if (availableLanguages.indexOf(redactoForceLanguage) !== -1) {
        return redactoForceLanguage;
      }
    }

    // get the html lang
    if (
      document.documentElement.getAttribute("lang") !== undefined &&
      document.documentElement.getAttribute("lang") !== null &&
      document.documentElement.getAttribute("lang") !== ""
    ) {
      if (
        availableLanguages.indexOf(
          document.documentElement.getAttribute("lang").substr(0, 2)
        ) !== -1
      ) {
        return document.documentElement.getAttribute("lang").substr(0, 2);
      }
    }

    if (!navigator) {
      return defaultLanguage;
    }

    var lang =
        navigator.language ||
        navigator.browserLanguage ||
        navigator.systemLanguage ||
        navigator.userLang ||
        null,
      userLanguage = lang ? lang.substr(0, 2) : null;

    if (availableLanguages.indexOf(userLanguage) !== -1) {
      return userLanguage;
    }

    return defaultLanguage;
  },
  getLocale: function () {
    "use strict";
    if (!navigator) {
      return "en_US";
    }

    var lang =
        navigator.language ||
        navigator.browserLanguage ||
        navigator.systemLanguage ||
        navigator.userLang ||
        null,
      userLanguage = lang ? lang.substr(0, 2) : null;

    if (userLanguage === "fr") {
      return "fr_FR";
    } else if (userLanguage === "en") {
      return "en_US";
    } else if (userLanguage === "de") {
      return "de_DE";
    } else if (userLanguage === "es") {
      return "es_ES";
    } else if (userLanguage === "it") {
      return "it_IT";
    } else if (userLanguage === "pt") {
      return "pt_PT";
    } else if (userLanguage === "nl") {
      return "nl_NL";
    } else if (userLanguage === "el") {
      return "el_EL";
    } else {
      return "en_US";
    }
  },
  addScript: function (
    url,
    id,
    callback,
    execute,
    attrName,
    attrVal,
    internal
  ) {
    "use strict";
    var script,
      done = false;

    if (execute === false) {
      if (typeof callback === "function") {
        callback();
      }
    } else {
      script = document.createElement("script");
      if (id !== undefined && id !== "") {
        script.id = id;
      }
      script.async = true;
      script.src = url;

      if (attrName !== undefined && attrVal !== undefined) {
        script.setAttribute(attrName, attrVal);
      }

      if (typeof callback === "function") {
        if (!redacto.parameters.useExternalJs || !internal) {
          script.onreadystatechange = script.onload = function () {
            var state = script.readyState;
            if (!done && (!state || /loaded|complete/.test(state))) {
              done = true;
              callback();
            }
          };
        } else {
          callback();
        }
      }

      if (!redacto.parameters.useExternalJs || !internal) {
        document.getElementsByTagName("head")[0].appendChild(script);
      }
    }
  },
  addInternalScript: function (url, id, callback, execute, attrName, attrVal) {
    redacto.addScript(url, id, callback, execute, attrName, attrVal, true);
  },
  checkIfExist: function (elemId) {
    "use strict";
    return (
      document.getElementById(elemId) !== null &&
      document.getElementById(elemId).offsetWidth !== 0 &&
      document.getElementById(elemId).offsetHeight !== 0
    );
  },
  makeAsync: {
    antiGhost: 0,
    buffer: "",
    init: function (url, id) {
      "use strict";
      var savedWrite = document.write,
        savedWriteln = document.writeln;

      document.write = function (content) {
        redacto.makeAsync.buffer += content;
      };
      document.writeln = function (content) {
        redacto.makeAsync.buffer += content.concat("\n");
      };

      setTimeout(function () {
        document.write = savedWrite;
        document.writeln = savedWriteln;
      }, 20000);

      redacto.makeAsync.getAndParse(url, id);
    },
    getAndParse: function (url, id) {
      "use strict";
      if (redacto.makeAsync.antiGhost > 9) {
        redacto.makeAsync.antiGhost = 0;
        return;
      }
      redacto.makeAsync.antiGhost += 1;
      redacto.addInternalScript(url, "", function () {
        if (document.getElementById(id) !== null) {
          document.getElementById(id).innerHTML +=
            "<span class='redacto-display-none'>&nbsp;</span>" +
            redacto.makeAsync.buffer;
          redacto.makeAsync.buffer = "";
          redacto.makeAsync.execJS(id);
        }
      });
    },
    execJS: function (id) {
      /* not strict because third party scripts may have errors */
      var i, scripts, childId, type;

      if (document.getElementById(id) === null) {
        return;
      }

      scripts = document.getElementById(id).getElementsByTagName("script");
      for (i = 0; i < scripts.length; i += 1) {
        type =
          scripts[i].getAttribute("type") !== null
            ? scripts[i].getAttribute("type")
            : "";
        if (type === "") {
          type =
            scripts[i].getAttribute("language") !== null
              ? scripts[i].getAttribute("language")
              : "";
        }
        if (
          scripts[i].getAttribute("src") !== null &&
          scripts[i].getAttribute("src") !== ""
        ) {
          childId = id + Math.floor(Math.random() * 99999999999);
          document.getElementById(id).innerHTML +=
            '<div id="' + childId + '"></div>';
          redacto.makeAsync.getAndParse(
            scripts[i].getAttribute("src"),
            childId
          );
        } else if (type.indexOf("javascript") !== -1 || type === "") {
          eval(scripts[i].innerHTML);
        }
      }
    },
  },
  fallback: function (matchClass, content, noInner) {
    "use strict";
    var selector = matchClass
      .map(function (cls) {
        return "." + cls;
      })
      .join(", ");

    var elems = document.querySelectorAll(selector);

    for (var i = 0; i < elems.length; i++) {
      var elem = elems[i];

      var width = redacto.getElemAttr(elem, "width"),
        height = redacto.getElemAttr(elem, "height");

      if (width !== "") {
        elem.style.width = redacto.getStyleSize(width);
      }
      if (height !== "") {
        elem.style.height = redacto.getStyleSize(height);
      }

      if (typeof content === "function") {
        if (noInner === true) {
          content(elem);
        } else {
          elem.innerHTML = content(elem);
        }
      } else {
        elem.innerHTML = content;
      }
    }
  },
  engage: function (id) {
    "use strict";
    var html = "",
      r = Math.floor(Math.random() * 100000),
      engage = redacto.services[id].name + " " + redacto.lang.fallback;

    if (redacto.lang["engage-" + id] !== undefined) {
      engage = redacto.lang["engage-" + id];
    }

    html += '<div class="tac_activate tac_activate_' + id + '">';
    html += '   <div class="tac_float">';
    html += "      " + engage;
    html +=
      '      <button aria-label="' +
      redacto.lang.allow +
      " " +
      redacto.services[id].name +
      '" type="button" class="redactoAllow" id="Eng' +
      r +
      "ed" +
      id +
      '">';
    html +=
      '          <span class="redactoCheck" aria-hidden="true"></span> ' +
      redacto.lang.allow;
    html += "       </button>";
    html += "   </div>";
    html += "</div>";

    return html;
  },
  extend: function (a, b) {
    "use strict";
    var prop;
    for (prop in b) {
      if (b.hasOwnProperty(prop)) {
        a[prop] = b[prop];
      }
    }
  },
  proTemp: "",
  proTimer: function () {
    "use strict";
    setTimeout(
      redacto.proPing,
      Math.floor(Math.random() * (1200 - 500 + 1)) + 500
    );
  },
  pro: function (list) {
    "use strict";
    redacto.proTemp += list;
    clearTimeout(redacto.proTimer);
    redacto.proTimer = setTimeout(
      redacto.proPing,
      Math.floor(Math.random() * (1200 - 500 + 1)) + 500
    );
  },
  proPing: function () {
    "use strict";
    if (
      redacto.uuid !== "" &&
      redacto.uuid !== undefined &&
      redacto.proTemp !== "" &&
      redactoStatsEnabled
    ) {
      var div = document.getElementById("redactoPremium"),
        timestamp = new Date().getTime(),
        url = "#"; // Logging URL removed for Redacto rebrand

      if (div === null) {
        return;
      }

      url += "account=" + redacto.uuid + "&";
      url += "domain=" + redacto.domain + "&";
      url += "status=" + encodeURIComponent(redacto.proTemp) + "&";
      url += "_time=" + timestamp;

      div.innerHTML =
        '<img src="' + url + '" class="redacto-display-none" alt="" />';

      redacto.proTemp = "";
    }

    redacto.cookie.number();
  },
  AddOrUpdate: function (source, custom) {
    /**
         Utility function to Add or update the fields of obj1 with the ones in obj2
         */
    for (var key in custom) {
      if (key === "__proto__" || key === "constructor") continue;
      if (custom.hasOwnProperty(key)) {
        if (custom[key] instanceof Object) {
          source[key] = redacto.AddOrUpdate(source[key], custom[key]);
        } else {
          source[key] = custom[key];
        }
      }
    }
    return source;
  },
  getElemWidth: function (elem) {
    return redacto.getElemAttr(elem, "width") || elem.clientWidth;
  },
  getElemHeight: function (elem) {
    return redacto.getElemAttr(elem, "height") || elem.clientHeight;
  },
  getElemAttr: function (elem, attr) {
    var attribute =
      elem.getAttribute("data-" + attr) ||
      elem.getAttribute(attr) ||
      elem.getAttribute(attr.startsWith("data-") ? attr.slice(5) : attr);

    // security: only allow real url on the url attr
    if (
      (attr === "url" || attr === "data-url" || attr === "data-src") &&
      !/^https?:\/\/[^\s]+$/.test(elem.getAttribute(attr))
    ) {
      return "";
    }

    // security: disallow data-srcdoc attr to avoid xss
    if (attr === "srcdoc" || attr === "data-srcdoc") {
      attribute = elem.getAttribute("srcdoc");
    }

    if (typeof attribute === "string") {
      return redacto.fixSelfXSS(attribute);
    }

    return "";
  },
  getStyleSize: function (value) {
    if (value == null) {
      return "auto";
    }

    value = String(value).trim();

    var units = [
      "px",
      "%",
      "em",
      "rem",
      "vh",
      "vw",
      "vmin",
      "vmax",
      "ch",
      "ex",
      "pt",
      "pc",
      "cm",
      "mm",
      "in",
      "q",
    ];
    var pattern = new RegExp("^\\d+(\\.\\d+)?(" + units.join("|") + ")$");

    if (pattern.test(value)) {
      return value;
    }

    if (/^\d+(\.\d+)?$/.test(value)) {
      return value + "px";
    }

    return "auto";
  },
  addClickEventToId: function (elemId, func) {
    redacto.addClickEventToElement(document.getElementById(elemId), func);
  },
  addClickEventToElement: function (e, func) {
    if (e) {
      if (e.addEventListener) {
        e.addEventListener("click", func);
      } else {
        e.attachEvent("onclick", func);
      }
    }
  },
  triggerJobsAfterAjaxCall: function () {
    redacto.job.forEach(function (e) {
      redacto.job.push(e);
    });
    var i;
    var allowBtns = document.getElementsByClassName("redactoAllow");
    for (i = 0; i < allowBtns.length; i++) {
      redacto.addClickEventToElement(allowBtns[i], function () {
        redacto.userInterface.respond(this, true);
      });
    }
    var denyBtns = document.getElementsByClassName("redactoDeny");
    for (i = 0; i < denyBtns.length; i++) {
      redacto.addClickEventToElement(denyBtns[i], function () {
        redacto.userInterface.respond(this, false);
      });
    }
  },
};

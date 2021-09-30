var GLR_BUENAZO = GLR_BUENAZO || {};

(function (namespace) {

  var navigation = {
    scripts: {
      gpt: "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
      cxense: "https://cdn.cxense.com/cx.js",
      tagmanager: `https://www.googletagmanager.com/gtag/js?id=${window.KEY_TAGMANAGER}`,
      pluginPrebid: `/static/prebid/prebid.js`,
      prebid: `/static/prebid/ads-prebid.js`,
      //onesignal: `https://cdn.onesignal.com/sdks/OneSignalSDK.js`
    },
    styles: {
      taboola: [
        'https://vidstat.taboola.com/vpaid/vPlayer/player/v9.9.6/assets/player.css',
        'https://vidstat.taboola.com/vpaid/units/21_5_0/assets/css/cmOsUnit.css',
      ]
    },
    insertHeader: function (content) {
      var contenedorHeader = document.getElementsByTagName("head");
      if ((contenedorHeader = contenedorHeader.length ? contenedorHeader : document.getElementsByTagName("body")).length) {
        var appendContent = contenedorHeader[0];
        appendContent.insertBefore(content, appendContent.firstChild);
      }
    },
    addScript: function (script, callback) {
      var contenedorScript = document.createElement("script");
      contenedorScript.type = "text/javascript";
      contenedorScript.async = true;
      contenedorScript.src = script;

      if (typeof callback != 'undefined') {
        contenedorScript.onload = function () {
          callback();
        };
      }

      this.insertHeader(contenedorScript);
    },
    addStyles: function (style, opt = {}) {
      var that = this;
      if (style.length) {
        style.forEach(function (item) {
          var content = document.createElement("link");

          if (Object.values(opt).length) {
            if (opt.rel) content.rel = opt.rel;
            if (opt.as) content.as = opt.as;
            if (opt.importance) content.importance = opt.importance;
          }

          content.href = item;
          that.insertHeader(content);
        })
      }
    },
    initGoogleTags: function () {
      window.gptadslots = [];
      window.googletag = window.googletag || {};
      window.googletag.cmd = window.googletag.cmd || [];
      googletag.cmd.push(function () {
        googletag.pubads().disableInitialLoad();
      });
    },
    initCxense: function () {
      var cX = window.cX = window.cX || {};
      cX.callQueue = cX.callQueue || [];
      cX.CCE = cX.CCE || {};
      cX.CCE.callQueue = cX.CCE.callQueue || [];
      cX.callQueue.push(["setSiteId", window.KEY_CXENSE]);
      cX.callQueue.push(["cint", "209"]);
      cX.CCE.callQueue.push(["sendPageViewEvent"]);
      cX.callQueue.push(['getUserSegmentIds', {
        persistedQueryId: "7601271c87aebab08201d9c439f9ba287a837a5e",
        callback: function (segments) {
          if (typeof window.localStorage === 'object' && typeof window.localStorage.getItem === 'function') {
            localStorage.setItem("cxSegments", segments.join(","));
          }
        }
      }]);

      window.getUserSegmentIdsLocal = function () {
        var segments = [];
        if (typeof window.localStorage === 'object' && typeof window.localStorage.getItem === 'function' && localStorage.getItem("cxSegments") !== null && localStorage.getItem("cxSegments").length > 0) {
          segments = localStorage.getItem("cxSegments").split(',');
        }
        return segments;
      }
    },
    initTaboola: function () {
      //console.log('agregamos taboola: CSS');
      this.addStyles(navigation.styles.taboola, {
        rel: 'preload',
        as: 'style',
        importance: 'low',
      });
    },
    initTagManager: function () {
      this.addScript(this.scripts.tagmanager, function () {
        function gtag() {
          dataLayer.push(arguments)
        }
        window.dataLayer = window.dataLayer || [], gtag("js", new Date), gtag("config", window.KEY_TAGMANAGER);
      });
      this.addScript(this.scripts.gpt);
    },
    initPluginPrebids: function(){
      this.addScript(this.scripts.pluginPrebid);
    },
    initPrebids: function(){
      //console.log('PREBID---');
      this.addScript(this.scripts.prebid);
    },
    /*initPluginOnesignal: function(){
      this.addScript(this.scripts.onesignal, function () {
        var OneSignal = window.OneSignal || [];
        OneSignal.push(["init", {
          appId: "f4e73c15-07ad-45e0-96a2-eb06e2263d46",
          autoRegister: false,
          subdomainName: 'https://elpopular.onesignal.com',
          httpPermissionRequest: {
            enable: true
          },
          notifyButton: {
            enable: true,
            size: 'large',
            theme: 'default',
            position: 'bottom-right',
            offset: {
              bottom: '75px',
              left: '0px',
              right: '5px'
            },
            prenotify: true,
            showCredit: false,
            text: {
              'tip.state.unsubscribed': 'Suscríbete para recibir notificaciones',
              'tip.state.subscribed': "Estás suscrito a las notificaciones",
              'tip.state.blocked': "You've blocked notifications",
              'message.prenotify': 'Haga clic para suscribirse a las notificaciones',
              'message.action.subscribed': "¡Gracias por suscribirte!",
              'message.action.resubscribed': "Ya estás suscrito a las notificaciones",
              'message.action.unsubscribed': "No volverá a recibir notificaciones",
              'dialog.main.title': 'Elpopular.pe',
              'dialog.main.button.subscribe': 'SUSCRÍBETE',
              'dialog.main.button.unsubscribe': 'DESUSCRÍBETE',
              'dialog.blocked.title': 'Bloquear Notificación',
              'dialog.blocked.message': "Follow these instructions to allow notifications:"
            }
          },
          welcomeNotification: {
            "title": "Elpopular",
            "message": "¡Gracias por suscribirte!, te esperamos con lo mejor en elpopular.pe"
          },
          promptOptions: {
            siteName: 'Elpopular',
            actionMessage: "Nos gustaría mostrarle lo mejor de El popular.",
            autoAcceptTitle: 'Hacer clic en "Permitir"',
            exampleNotificationTitle: 'Notificación de ejemplo',
            exampleNotificationMessage: 'Esta es una notificación de ejemplo',
            exampleNotificationCaption: 'Puede anular su suscripción en cualquier momento',
            acceptButtonText: "PERMITIR",
            cancelButtonText: "NO GRACIAS"
          },
          prenotify: true,
          showCredit: false,
          text: {
            'tip.state.unsubscribed': 'Suscríbete para recibir notificaciones',
            'tip.state.subscribed': "Estás suscrito a las notificaciones",
            'tip.state.blocked': "You've blocked notifications",
            'message.prenotify': 'Haga clic para suscribirse a las notificaciones',
            'message.action.subscribed': "¡Gracias por suscribirte!",
            'message.action.resubscribed': "Ya estás suscrito a las notificaciones",
            'message.action.unsubscribed': "No volverá a recibir notificaciones",
            'dialog.main.title': 'elpopular.pe',
            'dialog.main.button.subscribe': 'SUSCRÍBETE',
            'dialog.main.button.unsubscribe': 'DESUSCRÍBETE',
            'dialog.blocked.title': 'Bloquear Notificación',
            'dialog.blocked.message': "Follow these instructions to allow notifications:"
          }
        }]);
      });
    },*/
    init: function () {
      //console.log('iniciamos script');
      //this.initPluginOnesignal();
      this.initCxense();
      //this.initTaboola();
      this.initGoogleTags();

      this.initPluginPrebids();
      this.initPrebids();

      this.initTagManager();
      // this.initOnesignal();
      //console.log('window.PAGE', window.PAGE);
    }
  };

  namespace.navigation = navigation;

  if (document.addEventListener) {
    window.addEventListener('DOMContentLoaded', function () {
      navigation.init();
    });
    //console.log('addEventListener');
  } else {
    window.attachEvent('onload', function () {
      navigation.init();
    });
    //console.log('attachEvent');
  }

})(GLR_BUENAZO);

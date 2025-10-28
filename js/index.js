/**
 * Redacto v0.0.1 - Cookie Consent with Script Blocking
 * Automatically detects and blocks third-party scripts
 * Scalable pattern for addgaing more services
 */

(function () {
  "use strict";

  // ========================================
  // Configuration - Add new services here
  // ========================================
  const SERVICES = {
    // Google Analytics
    google_analytics: {
      name: "Google Analytics",
      category: "analytics",
      patterns: [
        /google-analytics\.com/i,
        /googletagmanager\.com.*gtag/i,
        /gtag/i,
        /analytics\.js/i,
        /ga\.js/i,
      ],
      inlinePatterns: [
        /gtag\s*\(/i,
        /dataLayer/i,
        /GoogleAnalyticsObject/i,
        /_gaq/i,
        /GA_MEASUREMENT_ID/i,
      ],
      globals: ["gtag", "dataLayer", "ga", "_gaq"],
    },

    hotjar: {
      name: "Hotjar",
      category: "analytics",
      patterns: [/hotjar\.com/i, /static\.hotjar\.com/i],
      inlinePatterns: [/\.hj\s*=/i, /_hjSettings/i, /hotjar/i],
      globals: ["hj", "_hjSettings"],
    },

    mixpanel: {
      name: "Mixpanel",
      category: "analytics",
      patterns: [/mixpanel\.com/i, /cdn\.mxpnl\.com/i],
      inlinePatterns: [/mixpanel\./i, /mixpanel\.init/i],
      globals: ["mixpanel"],
    },

    facebook_pixel: {
      name: "Facebook Pixel",
      category: "advertising",
      patterns: [/facebook\.net\/.*\/fbevents/i, /connect\.facebook\.net/i],
      inlinePatterns: [/fbq\s*\(/i, /_fbq/i, /facebook.*pixel/i],
      globals: ["fbq", "_fbq"],
    },

    google_ads: {
      name: "Google Ads",
      category: "advertising",
      patterns: [
        /doubleclick\.net/i,
        /googlesyndication\.com/i,
        /ads\.google\.com/i,
        /googleadservices\.com/i,
        /googletagmanager\.com\/gtm/i,
      ],
      inlinePatterns: [
        /google_conversion/i,
        /google_trackConversion/i,
        /google_tag_manager/i,
        /GTM-/i,
      ],
      globals: ["google_trackConversion", "google_tag_manager"],
    },

    twitter: {
      name: "Twitter/X Pixel",
      category: "advertising",
      patterns: [/platform\.twitter\.com/i, /analytics\.twitter\.com/i],
      inlinePatterns: [/twttr/i, /twitter.*pixel/i],
      globals: ["twttr"],
    },

    linkedin: {
      name: "LinkedIn Insight",
      category: "advertising",
      patterns: [/platform\.linkedin\.com/i, /snap\.licdn\.com/i],
      inlinePatterns: [/linkedin.*insight/i, /_linkedin_data_partner_id/i],
      globals: ["IN"],
    },
  };

  // Build category mappings
  const CATEGORIES = {
    strictly_necessary: {
      name: "Strictly Necessary Cookies",
      description:
        "These cookies are essential for the website to function properly. They cannot be disabled.",
      required: true,
      services: [],
    },
    analytics: {
      name: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      required: false,
      services: [],
    },
    advertising: {
      name: "Advertising Cookies",
      description:
        "Used to track visitors across websites for advertising purposes",
      required: false,
      services: [],
    },
  };

  // Populate category services
  Object.entries(SERVICES).forEach(([key, service]) => {
    if (CATEGORIES[service.category]) {
      CATEGORIES[service.category].services.push(key);
    }
  });

  // ========================================
  // Configuration
  // ========================================
  const API_BASE_URL = "https://api.redacto.tech";
  const CONFIG = {
    storageKey: "redacto_consent",
    cookieName: "redacto_consent",
    cookieExpiryDays: 365,
    useLocalStorage: true,
    useCookies: true,
    apiEnabled: true,
    organisationUuid: null,
    workspaceUuid: null,
    domainUrl: null,
  };

  // ========================================
  // UI Configuration (Backend Config)
  // ========================================
  const UI_CONFIG = {
    // Default configuration (fallback)
    modalType: "box", // "box" or "bar"
    position: "bottom-right", // "bottom-right", "bottom-left", "top-right", "top-left"
    colors: {
      primary: "#30363c", // --cc-btn-primary-bg
      primaryHover: "#000000", // --cc-btn-primary-hover-bg
      secondary: "#eaeff2", // --cc-btn-secondary-bg
      secondaryHover: "#d4dae0", // --cc-btn-secondary-hover-bg
      background: "#ffffff", // --cc-bg
      textPrimary: "#2c2f31", // --cc-primary-color
      textSecondary: "#5e6266", // --cc-secondary-color

      // Toggle/Switch colors
      toggleOn: "#30363c", // --cc-toggle-on-bg
      toggleOff: "#667481", // --cc-toggle-off-bg
      toggleKnob: "#ffffff", // --cc-toggle-on-knob-bg

      // Overlay and borders
      overlay: "rgba(0, 0, 0, 0.65)", // --cc-overlay-bg
      separator: "#f0f4f7", // --cc-separator-border-color

      // Cookie category blocks
      categoryBlock: "#f0f4f7", // --cc-cookie-category-block-bg
      categoryBlockHover: "#e9eff4", // --cc-cookie-category-block-hover-bg

      // Footer
      footerBg: "#eaeff2", // --cc-footer-bg
      footerBorder: "#e4eaed", // --cc-footer-border-color
    },
    content: {
      title: "Cookie Consent",
      description:
        'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
      acceptAllText: "Accept All",
      personalizeCookiesText: "Personalize Cookies",
      acceptSelectedText: "Accept Selected",
      acceptOnlyNecessaryText: "Accept Only Necessary",
      privacyPolicyLink: "#",
      termsAndConditionsLink: "#",
      contactLink: "#",
    },
    layout: {
      showPersonalizeButton: true,
    },
  };

  // ========================================
  // State Management
  // ========================================
  const state = {
    initialized: false,
    consent: {
      strictly_necessary: true,
      analytics: false,
      advertising: false,
    },
    blockedScripts: [],
    blockedInlineScripts: [],
    observer: null,
    uiConfig: null,
  };

  // ========================================
  // Storage Functions
  // ========================================

  // localStorage functions
  function saveConsentToLocalStorage(consent) {
    if (!CONFIG.useLocalStorage) return;

    try {
      const consentData = {
        consent: consent,
        timestamp: Date.now(),
        version: "0.0.1",
      };
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(consentData));
      console.log("[Redacto] 💾 Consent saved to localStorage:", consent);
    } catch (error) {
      console.warn("[Redacto] ⚠️ Failed to save to localStorage:", error);
    }
  }

  function loadConsentFromLocalStorage() {
    if (!CONFIG.useLocalStorage) return null;

    try {
      const stored = localStorage.getItem(CONFIG.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        console.log(
          "[Redacto] 📖 Consent loaded from localStorage:",
          data.consent
        );
        return data.consent;
      }
    } catch (error) {
      console.warn("[Redacto] ⚠️ Failed to load from localStorage:", error);
    }
    return null;
  }

  // Cookie functions
  function setCookie(name, value, days) {
    if (!CONFIG.useCookies) return;

    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      const cookieValue = encodeURIComponent(JSON.stringify(value));
      document.cookie = `${name}=${cookieValue};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
      console.log("[Redacto] 🍪 Consent saved to cookie:", value);
    } catch (error) {
      console.warn("[Redacto] ⚠️ Failed to save to cookie:", error);
    }
  }

  function getCookie(name) {
    if (!CONFIG.useCookies) return null;

    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          const cookieValue = c.substring(nameEQ.length, c.length);
          const decoded = JSON.parse(decodeURIComponent(cookieValue));
          console.log("[Redacto] 🍪 Consent loaded from cookie:", decoded);
          return decoded;
        }
      }
    } catch (error) {
      console.warn("[Redacto] ⚠️ Failed to load from cookie:", error);
    }
    return null;
  }

  // Combined storage functions
  function saveConsent(consent) {
    saveConsentToLocalStorage(consent);
    setCookie(CONFIG.cookieName, consent, CONFIG.cookieExpiryDays);
  }

  function loadConsent() {
    // Try localStorage first, then cookie as fallback
    let consent = loadConsentFromLocalStorage();
    if (!consent) {
      consent = getCookie(CONFIG.cookieName);
    }
    return consent;
  }

  // ========================================
  // API Functions
  // ========================================

  // Fetch UI configuration from backend
  async function fetchUIConfig() {
    if (
      !CONFIG.apiEnabled ||
      !CONFIG.organisationUuid ||
      !CONFIG.workspaceUuid
    ) {
      console.log(
        "[Redacto] 📡 API disabled or missing configuration, using defaults"
      );
      return UI_CONFIG;
    }

    try {
      const configUrl = `${API_BASE_URL}/consent/public/organisations/${CONFIG.organisationUuid}/workspaces/${CONFIG.workspaceUuid}/cookie-consent/notices/active-config?domain=${CONFIG.domainUrl}`;

      console.log("[Redacto] 📡 Fetching UI configuration from:", configUrl);

      const response = await fetch(configUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const config = data?.detail?.ui_config;
        console.log("[Redacto] ✅ UI configuration loaded:", config);

        // Merge with defaults to ensure all properties exist
        return mergeUIConfig(UI_CONFIG, config);
      } else {
        console.warn(
          "[Redacto] ⚠️ Failed to fetch UI config:",
          response.status,
          response.statusText
        );
        return UI_CONFIG;
      }
    } catch (error) {
      console.warn("[Redacto] ⚠️ Error fetching UI config:", error);
      return UI_CONFIG;
    }
  }

  // Merge UI configuration with defaults
  function mergeUIConfig(defaults, backend) {
    const merged = { ...defaults };

    // Merge colors
    if (backend.colors) {
      merged.colors = { ...defaults.colors, ...backend.colors };
    }

    // Merge content
    if (backend.content) {
      merged.content = { ...defaults.content, ...backend.content };
    }

    // Merge layout
    if (backend.layout) {
      merged.layout = { ...defaults.layout, ...backend.layout };
    }

    // Merge other properties
    if (backend.modalType) merged.modalType = backend.modalType;
    if (backend.position) merged.position = backend.position;

    return merged;
  }

  // Apply dynamic CSS variables based on configuration
  function applyUIConfig(config) {
    const root = document.documentElement;

    // Map UI_CONFIG colors to CSS variables that match SCSS color scheme
    const colorMappings = {
      // Primary colors
      primary: "--cc-btn-primary-bg",
      primaryHover: "--cc-btn-primary-hover-bg",
      secondary: "--cc-btn-secondary-bg",
      secondaryHover: "--cc-btn-secondary-hover-bg",

      // Background and text
      background: "--cc-bg",
      textPrimary: "--cc-primary-color",
      textSecondary: "--cc-secondary-color",

      // Toggle colors
      toggleOn: "--cc-toggle-on-bg",
      toggleOff: "--cc-toggle-off-bg",
      toggleKnob: "--cc-toggle-on-knob-bg",

      // Overlay and borders
      overlay: "--cc-overlay-bg",
      separator: "--cc-separator-border-color",

      // Category blocks
      categoryBlock: "--cc-cookie-category-block-bg",
      categoryBlockHover: "--cc-cookie-category-block-hover-bg",

      // Footer
      footerBg: "--cc-footer-bg",
      footerBorder: "--cc-footer-border-color",
    };

    // Apply color variables using the mapping
    Object.entries(config.colors).forEach(([key, value]) => {
      const cssVar = colorMappings[key];
      if (cssVar && value) {
        root.style.setProperty(cssVar, value);
        console.log(`[Redacto] 🎨 Applied CSS variable: ${cssVar} = ${value}`);
      }
    });

    // Apply modal type and position classes
    document.body.classList.add(`redacto-modal-${config.modalType}`);
    document.body.classList.add(`redacto-position-${config.position}`);

    console.log("[Redacto] 🎨 Applied UI configuration:", config);
  }

  // Parse script src URL to extract API parameters
  function parseScriptUrl() {
    try {
      const scripts = document.querySelectorAll('script[src*="redacto"]');
      for (const script of scripts) {
        const src = script.src;
        if (src && src.includes("redacto")) {
          const url = new URL(src);
          const domain = url.searchParams.get("domain");
          const orgUuid = url.searchParams.get("organisation_uuid");
          const workspaceUuid = url.searchParams.get("workspace_uuid");

          if (domain) CONFIG.domainUrl = domain;
          if (orgUuid) CONFIG.organisationUuid = orgUuid;
          if (workspaceUuid) CONFIG.workspaceUuid = workspaceUuid;

          console.log("[Redacto] 🔗 Parsed script URL:", {
            domain: CONFIG.domainUrl,
            organisationUuid: CONFIG.organisationUuid,
            workspaceUuid: CONFIG.workspaceUuid,
          });

          return true;
        }
      }
    } catch (error) {
      console.warn("[Redacto] ⚠️ Failed to parse script URL:", error);
    }
    return false;
  }

  // Generate random session ID
  function generateSessionId() {
    return (
      "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
    );
  }

  // Generate user ID (can be enhanced with actual user identification)
  function generateUserId() {
    // Try to get existing user ID from localStorage or generate new one
    let userId = localStorage.getItem("redacto_user_id");
    if (!userId) {
      userId =
        "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
      localStorage.setItem("redacto_user_id", userId);
    }
    return userId;
  }

  // Send consent data to API
  async function sendConsentToApi(consent) {
    if (
      !CONFIG.apiEnabled ||
      !CONFIG.organisationUuid ||
      !CONFIG.workspaceUuid
    ) {
      console.log("[Redacto] 📡 API disabled or missing configuration");
      return false;
    }

    try {
      const sessionId = generateSessionId();
      const userId = generateUserId();
      const domainUrl = CONFIG.domainUrl || window.location.origin;

      const requestBody = {
        session_id: sessionId,
        user_id: userId,
        domain_url: domainUrl,
        consent_categories: consent,
        consent_status: "granted",
        consent_version: "0.0.1",
        consent_method: "explicit",
        user_agent: navigator.userAgent,
        biometric_consent: false,
        expires_at: new Date(
          Date.now() + CONFIG.cookieExpiryDays * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      const apiUrl = `${API_BASE_URL}/consent/public/organisations/${CONFIG.organisationUuid}/workspaces/${CONFIG.workspaceUuid}/cookie-consent/records`;

      console.log("[Redacto] 📡 Sending consent to API:", {
        url: apiUrl,
        body: requestBody,
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("[Redacto] ✅ Consent recorded successfully:", result);
        return true;
      } else {
        console.error(
          "[Redacto] ❌ API request failed:",
          response.status,
          response.statusText
        );
        return false;
      }
    } catch (error) {
      console.error("[Redacto] ❌ API request error:", error);
      return false;
    }
  }

  // ========================================
  // Script Detection & Blocking
  // ========================================

  // Check if a URL matches any service pattern
  function getServiceForUrl(url) {
    if (!url) return null;

    for (const [key, service] of Object.entries(SERVICES)) {
      for (const pattern of service.patterns) {
        if (pattern.test(url)) {
          return { serviceKey: key, category: service.category };
        }
      }
    }
    return null;
  }

  // Check if inline script content matches any service pattern
  function getServiceForInlineScript(content) {
    if (!content) return null;

    for (const [key, service] of Object.entries(SERVICES)) {
      if (service.inlinePatterns) {
        for (const pattern of service.inlinePatterns) {
          if (pattern.test(content)) {
            return { serviceKey: key, category: service.category };
          }
        }
      }
    }
    return null;
  }

  // Check if a script should be blocked
  function shouldBlockScript(url, content = "") {
    const serviceFromUrl = getServiceForUrl(url);
    const serviceFromContent = getServiceForInlineScript(content);
    const serviceInfo = serviceFromUrl || serviceFromContent;

    // If no service matched, DON'T block
    if (!serviceInfo) return false;

    // Check if consent exists for this category
    const hasConsent = state.consent[serviceInfo.category];

    console.log(`[Redacto] Should block check:`, {
      url: url || "(inline)",
      content: content ? content.substring(0, 50) + "..." : "",
      serviceKey: serviceInfo.serviceKey,
      category: serviceInfo.category,
      hasConsent: hasConsent,
      willBlock: !hasConsent,
    });

    return !hasConsent;
  }

  // Store blocked script for later execution
  function storeBlockedScript(script, serviceInfo) {
    const content = script.innerHTML || script.textContent || "";

    const scriptInfo = {
      src: script.src,
      innerHTML: content,
      type: script.type,
      async: script.async,
      defer: script.defer,
      charset: script.charset,
      serviceKey: serviceInfo.serviceKey,
      category: serviceInfo.category,
    };

    if (script.src) {
      state.blockedScripts.push(scriptInfo);
      console.log(
        "[Redacto] 🛡️ Blocked external script:",
        script.src,
        "→",
        SERVICES[serviceInfo.serviceKey].name,
        `(${serviceInfo.category})`
      );
    } else if (content) {
      state.blockedInlineScripts.push(scriptInfo);
      console.log(
        "[Redacto] 🛡️ Blocked inline script:",
        content.substring(0, 50) + "...",
        "→",
        SERVICES[serviceInfo.serviceKey].name,
        `(${serviceInfo.category})`
      );
    }
  }

  // Block a script element
  function blockScript(script) {
    // Skip if already blocked
    if (script.hasAttribute("data-redacto-blocked")) {
      console.log("[Redacto] Script already blocked, skipping");
      return false;
    }

    // Skip Redacto's own script
    if (script.src && script.src.includes("redacto")) {
      console.log("[Redacto] Skipping Redacto's own script");
      return false;
    }

    const content = script.innerHTML || script.textContent || "";
    const src = script.src;

    console.log("[Redacto] Checking script:", { src, hasContent: !!content });

    // ONLY block if it matches a known service
    if (shouldBlockScript(src, content)) {
      const serviceInfo =
        getServiceForUrl(src) || getServiceForInlineScript(content);

      console.log("[Redacto] ⚠️ BLOCKING SCRIPT:", {
        src: src || "inline",
        service: serviceInfo.serviceKey,
        category: serviceInfo.category,
      });

      // Store original content BEFORE modifying
      if (content && content.trim()) {
        script.setAttribute("data-original-content", content);
      }

      // Store original src if exists
      if (src) {
        script.setAttribute("data-original-src", src);
      }

      // Change type to prevent execution
      const originalType = script.type || "text/javascript";
      script.setAttribute("data-original-type", originalType);
      script.type = "text/plain";
      script.setAttribute("data-redacto-blocked", serviceInfo.category);
      script.setAttribute("data-redacto-service", serviceInfo.serviceKey);

      // Clear content to prevent execution
      if (content && content.trim()) {
        script.textContent = "";
      }

      // Remove src to prevent loading
      if (src) {
        script.removeAttribute("src");
      }

      // Store for later
      storeBlockedScript(script, serviceInfo);

      // Dispatch blocked event
      document.dispatchEvent(
        new CustomEvent("redacto:blocked", {
          detail: {
            type: src ? "external" : "inline",
            url: src,
            service: serviceInfo.serviceKey,
            category: serviceInfo.category,
          },
        })
      );

      return true;
    } else {
      console.log("[Redacto] ✓ Script allowed (not a tracked service)");
    }

    return false;
  }

  // Override document.createElement to intercept script creation
  function interceptScriptCreation() {
    const originalCreateElement = document.createElement.bind(document);

    document.createElement = function (tagName) {
      const element = originalCreateElement(tagName);

      if (tagName.toLowerCase() === "script") {
        console.log("[Redacto] Script element created via createElement");

        // Store original setAttribute
        const originalSetAttribute = element.setAttribute.bind(element);

        // Intercept setAttribute for src
        element.setAttribute = function (name, value) {
          if (name.toLowerCase() === "src") {
            console.log("[Redacto] setAttribute('src') called with:", value);
            if (shouldBlockScript(value)) {
              console.log(
                "[Redacto] 🛡️ Blocked dynamic script (setAttribute):",
                value
              );
              const serviceInfo = getServiceForUrl(value);
              originalSetAttribute(
                "data-redacto-blocked",
                serviceInfo.category
              );
              originalSetAttribute(
                "data-redacto-service",
                serviceInfo.serviceKey
              );
              originalSetAttribute("type", "text/plain");
              originalSetAttribute("data-original-src", value);
              storeBlockedScript({ src: value }, serviceInfo);
              return;
            }
          }
          return originalSetAttribute(name, value);
        };

        // Intercept src property
        let srcValue = "";
        Object.defineProperty(element, "src", {
          set: function (value) {
            console.log("[Redacto] src property set to:", value);
            if (shouldBlockScript(value)) {
              console.log(
                "[Redacto] 🛡️ Blocked dynamic script (property):",
                value
              );
              const serviceInfo = getServiceForUrl(value);
              element.setAttribute(
                "data-redacto-blocked",
                serviceInfo.category
              );
              element.setAttribute(
                "data-redacto-service",
                serviceInfo.serviceKey
              );
              element.type = "text/plain";
              element.setAttribute("data-original-src", value);
              storeBlockedScript({ src: value }, serviceInfo);
              srcValue = value;
              return;
            }
            srcValue = value;
            originalSetAttribute("src", value);
          },
          get: function () {
            return srcValue;
          },
        });

        // Intercept textContent/innerHTML for inline scripts
        const originalTextContentDescriptor = Object.getOwnPropertyDescriptor(
          Node.prototype,
          "textContent"
        );
        const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(
          Element.prototype,
          "innerHTML"
        );

        Object.defineProperty(element, "textContent", {
          set: function (value) {
            if (value && shouldBlockScript("", value)) {
              console.log(
                "[Redacto] 🛡️ Blocked inline script (textContent):",
                value.substring(0, 50) + "..."
              );
              const serviceInfo = getServiceForInlineScript(value);
              element.setAttribute(
                "data-redacto-blocked",
                serviceInfo.category
              );
              element.setAttribute(
                "data-redacto-service",
                serviceInfo.serviceKey
              );
              element.setAttribute("data-original-content", value);
              element.type = "text/plain";
              storeBlockedScript({ innerHTML: value }, serviceInfo);
              return;
            }
            originalTextContentDescriptor.set.call(element, value);
          },
          get: function () {
            return originalTextContentDescriptor.get.call(element);
          },
        });

        Object.defineProperty(element, "innerHTML", {
          set: function (value) {
            if (value && shouldBlockScript("", value)) {
              console.log(
                "[Redacto] 🛡️ Blocked inline script (innerHTML):",
                value.substring(0, 50) + "..."
              );
              const serviceInfo = getServiceForInlineScript(value);
              element.setAttribute(
                "data-redacto-blocked",
                serviceInfo.category
              );
              element.setAttribute(
                "data-redacto-service",
                serviceInfo.serviceKey
              );
              element.setAttribute("data-original-content", value);
              element.type = "text/plain";
              storeBlockedScript({ innerHTML: value }, serviceInfo);
              return;
            }
            originalInnerHTMLDescriptor.set.call(element, value);
          },
          get: function () {
            return originalInnerHTMLDescriptor.get.call(element);
          },
        });
      }

      return element;
    };

    console.log("[Redacto] ✓ Script creation interceptor installed");
  }

  // Scan and block existing scripts in the page
  function scanAndBlockScripts() {
    const scripts = document.querySelectorAll("script");
    let blockedCount = 0;

    console.log(`[Redacto] Scanning ${scripts.length} scripts...`);

    scripts.forEach((script, index) => {
      console.log(`[Redacto] Checking script ${index + 1}/${scripts.length}`);
      if (blockScript(script)) {
        blockedCount++;
      }
    });

    console.log(
      `[Redacto] 📊 Scanned ${scripts.length} scripts, blocked ${blockedCount}`
    );
  }

  // Block iframe sources
  function blockIframe(iframe) {
    if (iframe.hasAttribute("data-redacto-blocked")) return false;

    const src = iframe.getAttribute("src") || iframe.src;
    if (!src) return false;

    const serviceInfo = getServiceForUrl(src);

    if (serviceInfo && !state.consent[serviceInfo.category]) {
      iframe.setAttribute("data-redacto-src", src);
      iframe.removeAttribute("src");
      iframe.src = "";
      iframe.setAttribute("data-redacto-blocked", serviceInfo.category);
      iframe.setAttribute("data-redacto-service", serviceInfo.serviceKey);
      console.log(
        "[Redacto] 🛡️ Blocked iframe:",
        src,
        "→",
        SERVICES[serviceInfo.serviceKey].name,
        `(${serviceInfo.category})`
      );
      return true;
    }

    return false;
  }

  function scanAndBlockIframes() {
    const iframes = document.querySelectorAll("iframe");
    let blockedCount = 0;

    iframes.forEach((iframe) => {
      if (blockIframe(iframe)) {
        blockedCount++;
      }
    });

    console.log(
      `[Redacto] 📊 Scanned ${iframes.length} iframes, blocked ${blockedCount}`
    );
  }

  // Clean up tracking globals
  function cleanupGlobals() {
    for (const service of Object.values(SERVICES)) {
      if (service.globals) {
        service.globals.forEach((globalVar) => {
          try {
            delete window[globalVar];
          } catch (e) {
            window[globalVar] = undefined;
          }
        });
      }
    }
    console.log("[Redacto] ✓ Cleaned up tracking globals");
  }

  // ========================================
  // Mutation Observer
  // ========================================

  function startMutationObserver() {
    if (state.observer) return;

    state.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check for added nodes
        mutation.addedNodes.forEach((node) => {
          // Block scripts
          if (node.nodeName === "SCRIPT") {
            console.log("[Redacto] New script detected via MutationObserver");
            blockScript(node);
          }

          // Block iframes
          if (node.nodeName === "IFRAME") {
            blockIframe(node);
          }

          // Check children if it's an element
          if (node.nodeType === 1) {
            const scripts = node.querySelectorAll("script");
            scripts.forEach((script) => {
              console.log("[Redacto] New script in added element");
              blockScript(script);
            });

            const iframes = node.querySelectorAll("iframe");
            iframes.forEach((iframe) => blockIframe(iframe));
          }
        });

        // Check for attribute changes on iframes
        if (
          mutation.type === "attributes" &&
          mutation.target.nodeName === "IFRAME" &&
          mutation.attributeName === "src"
        ) {
          blockIframe(mutation.target);
        }
      });
    });

    // Start observing
    state.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    console.log("[Redacto] ✓ Mutation observer started");
  }

  function stopMutationObserver() {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
      console.log("[Redacto] ✓ Mutation observer stopped");
    }
  }

  // ========================================
  // Unblocking & Consent Handling
  // ========================================

  function unblockCategory(categoryName) {
    console.log("[Redacto] 🔓 Unblocking category:", categoryName);

    // Unblock external scripts from stored list
    const scriptsToLoad = state.blockedScripts.filter(
      (s) => s.category === categoryName
    );
    scriptsToLoad.forEach((scriptInfo) => {
      const script = document.createElement("script");
      if (scriptInfo.src) {
        script.src = scriptInfo.src;
      }
      script.async = scriptInfo.async || false;
      script.defer = scriptInfo.defer || false;
      if (scriptInfo.charset) {
        script.charset = scriptInfo.charset;
      }
      document.head.appendChild(script);
      console.log("[Redacto] ✅ Loaded external script:", scriptInfo.src);
    });

    // Unblock inline scripts from stored list
    const inlineScriptsToLoad = state.blockedInlineScripts.filter(
      (s) => s.category === categoryName
    );
    inlineScriptsToLoad.forEach((scriptInfo) => {
      const script = document.createElement("script");
      script.textContent = scriptInfo.innerHTML;
      document.head.appendChild(script);
      console.log("[Redacto] ✅ Executed inline script for:", categoryName);
    });

    // Restore blocked scripts in DOM
    const blockedScripts = document.querySelectorAll(
      `script[data-redacto-blocked="${categoryName}"]`
    );
    blockedScripts.forEach((script) => {
      const newScript = document.createElement("script");

      const originalSrc = script.getAttribute("data-original-src");
      if (originalSrc) {
        newScript.src = originalSrc;
      }

      const originalContent = script.getAttribute("data-original-content");
      if (originalContent) {
        newScript.textContent = originalContent;
      }

      const originalType = script.getAttribute("data-original-type");
      if (originalType) {
        newScript.type = originalType;
      }

      newScript.async = script.async;
      newScript.defer = script.defer;

      script.parentNode.insertBefore(newScript, script);
      script.remove();

      console.log("[Redacto] ✅ Restored blocked script from DOM");
    });

    // Unblock iframes
    const blockedIframes = document.querySelectorAll(
      `iframe[data-redacto-blocked="${categoryName}"]`
    );
    blockedIframes.forEach((iframe) => {
      const src = iframe.getAttribute("data-redacto-src");
      if (src) {
        iframe.src = src;
        iframe.removeAttribute("data-redacto-blocked");
        iframe.removeAttribute("data-redacto-src");
        console.log("[Redacto] ✅ Unblocked iframe:", src);
      }
    });
  }

  function updateConsent(newConsent) {
    const previousConsent = { ...state.consent };
    state.consent = { ...state.consent, ...newConsent };

    // Save consent to storage
    saveConsent(state.consent);

    // Send consent to API
    sendConsentToApi(state.consent);

    // Unblock newly consented categories
    for (const [category, allowed] of Object.entries(newConsent)) {
      if (allowed && !previousConsent[category]) {
        unblockCategory(category);
      }
    }

    console.log("[Redacto] 📋 Consent updated:", state.consent);
  }

  // ========================================
  // UI Management
  // ========================================

  function loadRedactoCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "scss/index.css";
    link.type = "text/css";
    document.head.appendChild(link);
  }

  function showFloatingIcon() {
    // Remove existing floating icon if any
    const existingIcon = document.getElementById("redacto-floating-icon");
    if (existingIcon) {
      existingIcon.remove();
    }

    // Create floating icon
    const floatingIcon = document.createElement("button");
    floatingIcon.id = "redacto-floating-icon";
    floatingIcon.className = "redacto-floating-icon";
    floatingIcon.setAttribute("aria-label", "Open cookie preferences");
    floatingIcon.title = "Cookie Preferences";

    floatingIcon.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.0283 32C13.0832 32 10.3835 31.3015 7.92921 29.9044C5.51269 28.5074 3.58702 26.6006 2.15221 24.1841C0.717403 21.7676 0 19.0301 0 15.9717C0 12.8755 0.717403 10.1381 2.15221 7.7593C3.58702 5.34278 5.51269 3.45487 7.92921 2.09558C10.3457 0.698525 13.0454 0 16.0283 0C19.049 0 21.7487 0.698525 24.1274 2.09558C26.544 3.45487 28.4507 5.34278 29.8478 7.7593C31.2826 10.1381 32 12.8755 32 15.9717C32 19.0679 31.2826 21.8242 29.8478 24.2407C28.413 26.6572 26.4873 28.564 24.0708 29.9611C21.6543 31.3204 18.9735 32 16.0283 32Z" fill="#4961F6"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.5705 7.88996L18.6696 6.71595C18.3491 6.58628 17.9866 6.76014 17.8869 7.09125L15.8567 13.8357L12.2364 7.79913C12.0484 7.4857 11.6229 7.41821 11.3472 7.65808L8.98584 9.71237C8.72513 9.93917 8.7156 10.3409 8.96526 10.5798L13.9104 15.3122L6.90657 15.1203C6.54144 15.1103 6.25593 15.4326 6.30976 15.794L6.77104 18.8905C6.82199 19.2325 7.15572 19.4568 7.49145 19.3747L14.2941 17.7105L10.9688 23.7033C10.7915 24.0228 10.9456 24.4249 11.291 24.5438L14.25 25.5626C14.5768 25.6751 14.9297 25.4823 15.0117 25.1464L16.6075 18.6106L20.3219 24.804C20.5098 25.1174 20.9353 25.1849 21.2111 24.945L23.5724 22.8907C23.8331 22.6639 23.8427 22.2622 23.593 22.0232L18.6586 17.3012L25.6953 17.1828C26.0605 17.1767 26.3315 16.8421 26.2618 16.4834L25.6642 13.4103C25.5982 13.0708 25.2549 12.8615 24.9231 12.9584L17.9312 15.0003L21.8478 8.74631C22.0418 8.43665 21.9091 8.02698 21.5705 7.88996Z" fill="white"/>
  </svg>
  
      `;

    // Add click handler to reopen modal
    floatingIcon.addEventListener("click", function () {
      console.log("[Redacto] 🍪 Floating icon clicked - reopening modal");
      hideFloatingIcon();
      showCookieConsentPopup();
    });

    document.body.appendChild(floatingIcon);

    // Show with animation
    setTimeout(() => {
      floatingIcon.classList.add("show");
    }, 100);

    console.log("[Redacto] 🎯 Floating icon displayed with Redacto logo");
  }

  function hideFloatingIcon() {
    const floatingIcon = document.getElementById("redacto-floating-icon");
    if (floatingIcon) {
      floatingIcon.classList.remove("show");
      setTimeout(() => {
        if (floatingIcon.parentNode) {
          floatingIcon.parentNode.removeChild(floatingIcon);
        }
      }, 300);
      console.log("[Redacto] 🎯 Floating icon hidden");
    }
  }

  function createCookieConsentPopup() {
    const config = state.uiConfig || UI_CONFIG;

    // Generate cookie categories dynamically
    const generateCookieCategories = () => {
      return Object.entries(CATEGORIES)
        .map(
          ([key, category]) => `
               <div class="pm__section--toggle pm__section--expandable">
                  <div class="pm__section-title-wrapper">
                     <button type="button" class="pm__section-title" aria-expanded="false" aria-controls="${key}-desc">${
            category.name
          }${
            category.required
              ? `<span class="pm__badge">Always Enabled</span>`
              : ""
          }</button>
                     <span class="pm__section-arrow">
                        <svg viewBox="0 0 24 24" stroke-width="3.5">
                           <path d="M 21.999 6.94 L 11.639 17.18 L 2.001 6.82 "></path>
                        </svg>
                     </span>
                     <label class="section__toggle-wrapper">
                        <input type="checkbox" class="section__toggle" value="${key}" ${
            category.required ? 'disabled=""' : ""
          }>
                        <span class="toggle__icon" aria-hidden="true">
                           <span class="toggle__icon-circle">
                              <span class="toggle__icon-off">
                                 <svg viewBox="0 0 24 24" stroke-width="3">
                                    <path d="M 19.5 4.5 L 4.5 19.5 M 4.5 4.501 L 19.5 19.5"></path>
                                 </svg>
                              </span>
                              <span class="toggle__icon-on">
                                 <svg viewBox="0 0 24 24" stroke-width="3">
                                    <path d="M 3.572 13.406 L 8.281 18.115 L 20.428 5.885"></path>
                                 </svg>
                              </span>
                           </span>
                        </span>
                        <span class="toggle__label">${category.name}</span>
                     </label>
                  </div>
                  <div class="pm__section-desc-wrapper" aria-hidden="true" id="${key}-desc">
                     <p class="pm__section-desc">${category.description}</p>
                  </div>
               </div>`
        )
        .join("");
    };

    return `
      <div id="cc-main" data-nosnippet="">
   <div class="cm-wrapper cc--anim">
      <div class="cm cm--box cm--${config.position.split("-")[0]} cm--${
      config.position.split("-")[1]
    }" role="dialog" aria-modal="true" aria-hidden="false" aria-describedby="cm__desc" aria-labelledby="cm__title">
         <div tabindex="-1"></div>
         <div class="cm__body">
            <div class="cm__texts">
               <h2 id="cm__title" class="cm__title">${config.content.title}</h2>
               <p id="cm__desc" class="cm__desc">${
                 config.content.description
               }</p>
            </div>
            <div class="cm__btns">
               <div class="cm__btn-group"><button type="button" class="cm__btn" data-role="all"><span>${
                 config.content.acceptAllText
               }</span></button><button type="button" class="cm__btn" data-role="necessary"><span>${
      config.content.acceptOnlyNecessaryText
    }</span></button></div>
               ${
                 config.layout.showPersonalizeButton
                   ? `<div class="cm__btn-group"><button type="button" class="cm__btn cm__btn--secondary" data-role="show"><span>${config.content.personalizeCookiesText}</span></button></div>`
                   : ""
               }
            </div>
         </div>
         <div class="cm__footer">
            <div class="cm__links">
               <div class="cm__link-group">
                ${
                  config.content.privacyPolicyLink
                    ? `<a href="${config.content.privacyPolicyLink}" target="_blank">Privacy Policy</a>`
                    : ""
                }
                ${
                  config.content.termsAndConditionsLink
                    ? `<a href="${config.content.termsAndConditionsLink}" target="_blank">Terms and Conditions</a>`
                    : ""
                }
               </div>
            </div>
         </div>
         <div class="cm__attribution">
            <div class="cm__powered-by">
               <span>Powered by <a href="https://redacto.ai" target="_blank" rel="noopener">Redacto</a></span>
            </div>
         </div>
      </div>
   </div>
   <div class="pm-wrapper cc--anim">
      <div class="pm-overlay"></div>
      <div class="pm pm--bar pm--wide pm--right pm--flip" role="dialog" aria-hidden="true" aria-modal="true" aria-labelledby="pm__title">
         <div tabindex="-1"></div>
         <div class="pm__header">
            <h2 class="pm__title" id="pm__title">Consent Preferences Center</h2>
            <button type="button" class="pm__close-btn" aria-label="Close modal">
               <span>
                  <svg viewBox="0 0 24 24" stroke-width="1.5">
                     <path d="M 19.5 4.5 L 4.5 19.5 M 4.5 4.501 L 19.5 19.5"></path>
                  </svg>
               </span>
            </button>
         </div>
         <div class="pm__body">
            <div class="pm__section">
               <div class="pm__section-title-wrapper">
                  <div class="pm__section-title" role="heading" aria-level="3">Cookie Usage</div>
               </div>
               <div class="pm__section-desc-wrapper">
                  <p class="pm__section-desc">${config.content.description}</p>
               </div>
            </div>
            <div class="pm__section-toggles">
              ${generateCookieCategories()}
            </div>
            ${
              config.content.contactLink
                ? ` <div class="pm__section">
            <div class="pm__section-title-wrapper">
              <div class="pm__section-title" role="heading" aria-level="3">More information</div>
            </div><div class="pm__section-desc-wrapper">
              <p class="pm__section-desc">For any query in relation to our policy on cookies and your choices, please <a class="cc__link" href="${config.content.contactLink}" target="_blank">contact us</a>.</p>
            </div></div>`
                : ""
            }
         </div>
         <div class="pm__footer">
            <div class="pm__btn-group"><button type="button" class="pm__btn" data-role="all">${
              config.content.acceptAllText
            }</button><button type="button" class="pm__btn" data-role="necessary">${
      config.content.acceptOnlyNecessaryText
    }</button></div>
            <div class="pm__btn-group"><button type="button" class="pm__btn pm__btn--secondary" data-role="save">${
              config.content.acceptSelectedText
            }</button></div>
         </div>
         <div class="pm__attribution">
            <div class="pm__powered-by">
               <span>Powered by <a href="https://redacto.ai" target="_blank" rel="noopener">Redacto</a></span>
            </div>
         </div>
      </div>
   </div>
</div>
    `;
  }

  function handleClose() {
    const popup = document.getElementById("cc-main");

    if (popup) {
      document.body.classList.remove("disable--interaction", "show--consent");

      setTimeout(() => {
        popup.remove();
        showFloatingIcon();
      }, 300);
    }
  }

  function handleAcceptAll() {
    console.log("[Redacto] ✅ Accept All clicked");

    const newConsent = { strictly_necessary: true };
    Object.keys(CATEGORIES).forEach((key) => {
      newConsent[key] = true;
    });

    updateConsent(newConsent);
    handleClosePreferences();
    handleClose();

    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("redacto:accept", {
          detail: state.consent,
        })
      );
    }, 100);
  }

  function handleAcceptOnlyNecessary() {
    console.log("[Redacto] ✅ Accept Only Necessary clicked");

    const newConsent = { strictly_necessary: true };
    Object.keys(CATEGORIES).forEach((key) => {
      newConsent[key] = CATEGORIES[key].required || false;
    });

    updateConsent(newConsent);
    handleClosePreferences();
    handleClose();

    // Dispatch event to notify the page
    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("redacto:accept", {
          detail: state.consent,
        })
      );
    }, 100);
  }

  function handleAcceptSelected() {
    console.log("[Redacto] ✅ Accept Selected clicked");

    const newConsent = { strictly_necessary: true };

    // Get current toggle states from the UI
    Object.keys(CATEGORIES).forEach((key) => {
      const checkbox = document.querySelector(
        `.section__toggle[value="${key}"]`
      );
      const isChecked = checkbox && checkbox.checked;
      newConsent[key] = isChecked;
      console.log(
        `[Redacto] Category ${key}: ${isChecked ? "enabled" : "disabled"}`
      );
    });

    updateConsent(newConsent);
    handleClosePreferences();
    handleClose();

    // Dispatch event to notify the page
    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("redacto:accept", {
          detail: state.consent,
        })
      );
    }, 100);
  }

  function handleToggle(event) {
    const checkbox = event.currentTarget;

    if (checkbox.disabled) {
      return;
    }

    const category = checkbox.value;
    const isChecked = checkbox.checked;

    console.log(`[Redacto] 🔄 Toggle ${category}: ${isChecked}`);

    // Update the state immediately for real-time feedback
    state.consent[category] = isChecked;
  }

  function handlePersonalizeCookies() {
    console.log("[Redacto] 🎯 Personalize Cookies clicked");
    document.body.classList.add("show--preferences");

    Object.keys(CATEGORIES).forEach((key) => {
      const checkbox = document.querySelector(
        `.section__toggle[value="${key}"]`
      );
      if (checkbox) {
        checkbox.checked =
          state.consent[key] || CATEGORIES[key].required || false;
        console.log(
          `[Redacto] Updated checkbox for ${key}: ${checkbox.checked}`
        );
      }
    });
  }

  function handleClosePreferences() {
    console.log("[Redacto] 🎯 Close Preferences clicked");
    document.body.classList.remove("show--preferences");
  }

  function handlePreferenceCategorySectionToggle(event) {
    const section = event.currentTarget;
    const isExpanded = section.classList.contains("is-expanded");
    section.classList.toggle("is-expanded", !isExpanded);
  }

  function showCookieConsentPopup() {
    hideFloatingIcon();

    // Remove existing popup if any
    const existingPopup = document.getElementById("cc-main");
    if (existingPopup) {
      existingPopup.remove();
    }

    const popupContainer = document.createElement("div");
    popupContainer.innerHTML = createCookieConsentPopup();
    document.body.appendChild(popupContainer);

    // Add classes to show the popup
    document.body.classList.add("show--consent");

    // Add event listeners for the new button structure
    document.querySelectorAll("[data-role='all']").forEach((button) => {
      button.addEventListener("click", handleAcceptAll);
    });
    document.querySelectorAll("[data-role='necessary']").forEach((button) => {
      button.addEventListener("click", handleAcceptOnlyNecessary);
    });
    document.querySelectorAll("[data-role='show']").forEach((button) => {
      button.addEventListener("click", handlePersonalizeCookies);
    });

    document.querySelectorAll(".pm__section--toggle").forEach((title) => {
      title.addEventListener("click", handlePreferenceCategorySectionToggle);
    });

    document
      .querySelector(".pm__close-btn")
      ?.addEventListener("click", handleClosePreferences);

    document
      .querySelector(".pm-overlay")
      ?.addEventListener("click", function (e) {
        if (e.target === this) {
          handleClosePreferences();
        }
      });

    // Add event listeners for toggle checkboxes
    document.querySelectorAll(".section__toggle").forEach((checkbox) => {
      checkbox.addEventListener("change", handleToggle);
    });

    // Add event listener for save button
    document.querySelectorAll("[data-role='save']").forEach((button) => {
      button.addEventListener("click", handleAcceptSelected);
    });

    console.log("[Redacto] 🍪 Cookie consent popup displayed");
  }

  // ========================================
  // Initialization
  // ========================================

  async function initialize() {
    if (state.initialized) return;

    console.log("[Redacto] 🚀 Initializing...");
    console.log("[Redacto] Active services:", Object.keys(SERVICES));

    // Step 1: Parse script URL for API configuration
    parseScriptUrl();

    // Step 2: Fetch UI configuration from backend
    try {
      state.uiConfig = await fetchUIConfig();
      applyUIConfig(state.uiConfig);
      console.log("[Redacto] 🎨 UI configuration applied");
    } catch (error) {
      console.warn(
        "[Redacto] ⚠️ Failed to load UI config, using defaults:",
        error
      );
      state.uiConfig = UI_CONFIG;
      applyUIConfig(state.uiConfig);
    }

    // Step 3: Check for existing consent
    const savedConsent = loadConsent();
    if (savedConsent) {
      console.log("[Redacto] 📖 Found saved consent:", savedConsent);
      state.consent = { ...state.consent, ...savedConsent };
    } else {
      console.log("[Redacto] 📝 No saved consent found, will show popup");
    }

    console.log("[Redacto] Current consent state:", state.consent);

    // Step 4: Intercept future script creation FIRST
    interceptScriptCreation();

    // Step 5: Clean up any existing tracking globals
    cleanupGlobals();

    // Step 6: Scan and block existing scripts
    scanAndBlockScripts();

    // Step 7: Block iframes
    scanAndBlockIframes();

    // Step 8: Start mutation observer
    startMutationObserver();

    // Step 9: Load UI
    loadRedactoCSS();

    // Step 10: Show popup only if no consent exists
    if (!savedConsent) {
      setTimeout(() => {
        showCookieConsentPopup();
      }, 500);
    } else {
      // If we have saved consent, apply it immediately
      console.log("[Redacto] ✅ Applying saved consent preferences");
      Object.keys(state.consent).forEach((category) => {
        if (state.consent[category] && category !== "strictly_necessary") {
          unblockCategory(category);
        }
      });

      // Show floating icon so user can reopen modal to change preferences
      setTimeout(() => {
        showFloatingIcon();
      }, 1000);
    }

    state.initialized = true;

    document.dispatchEvent(new CustomEvent("redacto:initialized"));

    console.log("[Redacto] ✅ Initialization complete");
    console.log("[Redacto] 📊 Stats:", {
      blockedScripts: state.blockedScripts.length,
      blockedInlineScripts: state.blockedInlineScripts.length,
      consent: state.consent,
    });
  }

  // ========================================
  // Public API
  // ========================================

  window.Redacto = {
    acceptAll: function () {
      const newConsent = { strictly_necessary: true };
      Object.keys(CATEGORIES).forEach((key) => {
        newConsent[key] = true;
      });
      updateConsent(newConsent);
    },

    acceptOnlyNecessary: function () {
      const newConsent = { strictly_necessary: true };
      Object.keys(CATEGORIES).forEach((key) => {
        newConsent[key] = false;
      });
      updateConsent(newConsent);
    },

    acceptSelected: function () {
      const newConsent = { strictly_necessary: true };

      // Get current toggle states from the UI
      Object.keys(CATEGORIES).forEach((key) => {
        const checkbox = document.querySelector(
          `.section__toggle[value="${key}"]`
        );
        const isChecked = checkbox && checkbox.checked;
        newConsent[key] = isChecked;
      });

      updateConsent(newConsent);
    },

    updateConsent: function (consent) {
      updateConsent(consent);
    },

    getConsent: function () {
      return { ...state.consent };
    },

    getState: function () {
      return {
        consent: { ...state.consent },
        blockedScripts: [...state.blockedScripts],
        blockedInlineScripts: [...state.blockedInlineScripts],
      };
    },

    getServices: function () {
      return SERVICES;
    },

    getCategories: function () {
      return CATEGORIES;
    },

    // Storage management
    saveConsent: function (consent) {
      saveConsent(consent);
    },

    loadConsent: function () {
      return loadConsent();
    },

    clearConsent: function () {
      try {
        if (CONFIG.useLocalStorage) {
          localStorage.removeItem(CONFIG.storageKey);
        }
        if (CONFIG.useCookies) {
          document.cookie = `${CONFIG.cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        }
        console.log("[Redacto] 🗑️ Consent cleared from storage");
      } catch (error) {
        console.warn("[Redacto] ⚠️ Failed to clear consent:", error);
      }
    },

    getConfig: function () {
      return { ...CONFIG };
    },

    setConfig: function (newConfig) {
      Object.assign(CONFIG, newConfig);
      console.log("[Redacto] ⚙️ Configuration updated:", CONFIG);
    },

    // API management
    sendConsentToApi: function (consent) {
      return sendConsentToApi(consent);
    },

    parseScriptUrl: function () {
      return parseScriptUrl();
    },

    generateSessionId: function () {
      return generateSessionId();
    },

    generateUserId: function () {
      return generateUserId();
    },

    // Floating icon management
    showFloatingIcon: function () {
      showFloatingIcon();
    },

    hideFloatingIcon: function () {
      hideFloatingIcon();
    },

    // UI Configuration management
    getUIConfig: function () {
      return state.uiConfig || UI_CONFIG;
    },

    setUIConfig: function (config) {
      state.uiConfig = mergeUIConfig(UI_CONFIG, config);
      applyUIConfig(state.uiConfig);
      console.log("[Redacto] ⚙️ UI configuration updated:", state.uiConfig);
    },

    fetchUIConfig: function () {
      return fetchUIConfig();
    },

    applyUIConfig: function (config) {
      applyUIConfig(config);
    },

    // Force refresh UI configuration
    refreshUIConfig: async function () {
      try {
        state.uiConfig = await fetchUIConfig();
        applyUIConfig(state.uiConfig);
        console.log("[Redacto] 🔄 UI configuration refreshed");
        return state.uiConfig;
      } catch (error) {
        console.warn("[Redacto] ⚠️ Failed to refresh UI config:", error);
        return null;
      }
    },
  };

  // ========================================
  // Start - Execute immediately
  // ========================================

  // Initialize as early as possible - IMMEDIATELY
  console.log("[Redacto] Script loaded, starting initialization...");

  // Run initialization synchronously
  initialize();

  // Also re-scan when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("[Redacto] 🔄 DOMContentLoaded - Re-scanning...");
      scanAndBlockScripts();
      scanAndBlockIframes();
    });
  }
})();

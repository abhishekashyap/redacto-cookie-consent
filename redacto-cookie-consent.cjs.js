'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class DOMUtils {
    static createElement(tag, className, id) {
        const element = document.createElement(tag);
        if (className)
            element.className = className;
        if (id)
            element.id = id;
        return element;
    }
    static createButton(text, className, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        if (className)
            button.className = className;
        if (onClick)
            button.addEventListener("click", onClick);
        return button;
    }
    static createDiv(className, content) {
        const div = document.createElement("div");
        if (className)
            div.className = className;
        if (content)
            div.innerHTML = content;
        return div;
    }
    static createSpan(className, content) {
        const span = document.createElement("span");
        if (className)
            span.className = className;
        if (content)
            span.textContent = content;
        return span;
    }
    static createParagraph(className, content) {
        const p = document.createElement("p");
        if (className)
            p.className = className;
        if (content)
            p.textContent = content;
        return p;
    }
    static createHeading(level, className, content) {
        const heading = document.createElement(`h${level}`);
        if (className)
            heading.className = className;
        if (content)
            heading.textContent = content;
        return heading;
    }
    static createLink(href, text, className, target) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = text;
        if (className)
            link.className = className;
        if (target)
            link.target = target;
        return link;
    }
    static createCheckbox(id, checked = false, disabled = false) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked = checked;
        checkbox.disabled = disabled;
        return checkbox;
    }
    static createLabel(forId, text, className) {
        const label = document.createElement("label");
        label.htmlFor = forId;
        label.textContent = text;
        if (className)
            label.className = className;
        return label;
    }
    static addStyles(element, styles) {
        Object.assign(element.style, styles);
    }
    static addClass(element, className) {
        element.classList.add(className);
    }
    static removeClass(element, className) {
        element.classList.remove(className);
    }
    static toggleClass(element, className) {
        element.classList.toggle(className);
    }
    static hasClass(element, className) {
        return element.classList.contains(className);
    }
    static show(element) {
        element.style.display = "block";
    }
    static hide(element) {
        element.style.display = "none";
    }
    static isVisible(element) {
        return element.style.display !== "none" && element.offsetParent !== null;
    }
    static getElementById(id) {
        return document.getElementById(id);
    }
    static getElementsByClassName(className) {
        return document.getElementsByClassName(className);
    }
    static querySelector(selector) {
        return document.querySelector(selector);
    }
    static querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    }
    static appendChild(parent, child) {
        parent.appendChild(child);
    }
    static removeChild(parent, child) {
        if (parent.contains(child)) {
            parent.removeChild(child);
        }
    }
    static insertBefore(parent, newChild, referenceChild) {
        parent.insertBefore(newChild, referenceChild);
    }
    static replaceChild(parent, newChild, oldChild) {
        parent.replaceChild(newChild, oldChild);
    }
    static addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
    }
    static removeEventListener(element, event, handler) {
        element.removeEventListener(event, handler);
    }
    static createStyleSheet(css) {
        const style = document.createElement("style");
        style.textContent = css;
        return style;
    }
    static injectCSS(css, id) {
        const style = this.createStyleSheet(css);
        if (id)
            style.id = id;
        document.head.appendChild(style);
        return style;
    }
    static removeStyleSheet(id) {
        const style = document.getElementById(id);
        if (style) {
            style.remove();
        }
    }
    static getViewportSize() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight,
        };
    }
    static isMobile() {
        return window.innerWidth <= 768;
    }
    static isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }
    static isDesktop() {
        return window.innerWidth > 1024;
    }
    static getDeviceType() {
        if (this.isMobile())
            return "mobile";
        if (this.isTablet())
            return "tablet";
        return "desktop";
    }
    static debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
    static throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }
    static escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
    static sanitizeHtml(html) {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    }
}

class CookieManager {
    static getInstance() {
        if (!CookieManager.instance) {
            CookieManager.instance = new CookieManager();
        }
        return CookieManager.instance;
    }
    setCookie(name, value, days = 365, domain, path = "/") {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            const cookieString = [
                `${name}=${encodeURIComponent(value)}`,
                `expires=${expires.toUTCString()}`,
                `path=${path}`,
                domain ? `domain=${domain}` : "",
                "SameSite=Lax",
                window.location.protocol === "https:" ? "Secure" : "",
            ]
                .filter(Boolean)
                .join("; ");
            document.cookie = cookieString;
        }
        catch (error) {
            console.warn("Failed to set cookie:", error);
        }
    }
    getCookie(name) {
        try {
            const nameEQ = name + "=";
            const ca = document.cookie.split(";");
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === " ")
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
                }
            }
            return null;
        }
        catch (error) {
            console.warn("Failed to get cookie:", error);
            return null;
        }
    }
    deleteCookie(name, domain, path = "/") {
        try {
            const cookieString = [
                `${name}=`,
                "expires=Thu, 01 Jan 1970 00:00:00 GMT",
                `path=${path}`,
                domain ? `domain=${domain}` : "",
            ]
                .filter(Boolean)
                .join("; ");
            document.cookie = cookieString;
        }
        catch (error) {
            console.warn("Failed to delete cookie:", error);
        }
    }
    getAllCookies() {
        try {
            const cookies = {};
            const cookieArray = document.cookie.split(";");
            for (let cookie of cookieArray) {
                const [name, value] = cookie.trim().split("=");
                if (name && value) {
                    cookies[name] = decodeURIComponent(value);
                }
            }
            return cookies;
        }
        catch (error) {
            console.warn("Failed to get all cookies:", error);
            return {};
        }
    }
    setConsentData(cookieName, consentData, expiryDays = 365) {
        try {
            const consentString = JSON.stringify(consentData);
            this.setCookie(cookieName, consentString, expiryDays);
        }
        catch (error) {
            console.warn("Failed to set consent data:", error);
        }
    }
    getConsentData(cookieName) {
        try {
            const consentString = this.getCookie(cookieName);
            if (!consentString)
                return null;
            const consentData = JSON.parse(consentString);
            // Validate consent data structure
            if (!consentData.timestamp ||
                !consentData.preferences ||
                !consentData.complianceType) {
                return null;
            }
            return consentData;
        }
        catch (error) {
            console.warn("Failed to get consent data:", error);
            return null;
        }
    }
    clearConsentData(cookieName) {
        this.deleteCookie(cookieName);
    }
    isConsentExpired(consentData, expiryDays) {
        const now = Date.now();
        const consentTime = consentData.timestamp;
        const expiryTime = consentTime + expiryDays * 24 * 60 * 60 * 1000;
        return now > expiryTime;
    }
    getDomain() {
        try {
            return window.location.hostname;
        }
        catch (error) {
            return "localhost";
        }
    }
    getRootDomain() {
        try {
            const hostname = window.location.hostname;
            const parts = hostname.split(".");
            if (parts.length <= 2) {
                return hostname;
            }
            return parts.slice(-2).join(".");
        }
        catch (error) {
            return "localhost";
        }
    }
}

class ConsentManager {
    constructor() {
        this.cookieManager = CookieManager.getInstance();
    }
    generateConsentId() {
        return ("consent_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now());
    }
    createConsentData(preferences, complianceType, services = {}) {
        const consentId = this.generateConsentId();
        return {
            timestamp: Date.now(),
            version: "1.0.0",
            preferences,
            services,
            complianceType,
            consentId,
        };
    }
    getDefaultPreferences() {
        return {
            necessary: true, // Always true as it's required
            functional: false,
            analytics: false,
            advertising: false,
            social: false,
            other: false,
        };
    }
    validatePreferences(preferences) {
        const defaultPrefs = this.getDefaultPreferences();
        return {
            necessary: true, // Always true
            functional: preferences.functional ?? defaultPrefs.functional,
            analytics: preferences.analytics ?? defaultPrefs.analytics,
            advertising: preferences.advertising ?? defaultPrefs.advertising,
            social: preferences.social ?? defaultPrefs.social,
            other: preferences.other ?? defaultPrefs.other,
        };
    }
    hasConsentForCategory(consentData, category) {
        if (!consentData)
            return false;
        // Necessary cookies are always allowed
        if (category === "necessary")
            return true;
        return consentData.preferences[category] === true;
    }
    hasConsentForService(consentData, serviceId) {
        if (!consentData)
            return false;
        const serviceConsent = consentData.services[serviceId];
        return serviceConsent === "granted";
    }
    isConsentValid(consentData, expiryDays) {
        if (!consentData)
            return false;
        return !this.cookieManager.isConsentExpired(consentData, expiryDays);
    }
    mergeConsentData(existing, newPreferences, complianceType) {
        const validatedPreferences = this.validatePreferences(newPreferences);
        if (existing && this.isConsentValid(existing, 365)) {
            return {
                ...existing,
                timestamp: Date.now(),
                preferences: validatedPreferences,
                complianceType,
            };
        }
        return this.createConsentData(validatedPreferences, complianceType);
    }
    getConsentSummary(consentData) {
        if (!consentData) {
            return {
                hasConsent: false,
                categories: this.getDefaultPreferences(),
                totalServices: 0,
                consentedServices: 0,
            };
        }
        const services = Object.values(consentData.services);
        const consentedServices = services.filter((state) => state === "granted").length;
        return {
            hasConsent: true,
            categories: consentData.preferences,
            totalServices: services.length,
            consentedServices,
        };
    }
    // DPDPA specific compliance checks
    isDPDPACompliant(consentData) {
        if (!consentData || consentData.complianceType !== "DPDPA") {
            return false;
        }
        // DPDPA requires explicit consent for all non-necessary categories
        const { preferences } = consentData;
        // Check if user has made explicit choices for all categories
        const hasExplicitConsent = Object.entries(preferences).every(([category, granted]) => {
            if (category === "necessary")
                return true; // Always required
            return granted !== undefined; // Must have explicit choice
        });
        return hasExplicitConsent;
    }
    // GDPR specific compliance checks
    isGDPRCompliant(consentData) {
        if (!consentData || consentData.complianceType !== "GDPR") {
            return false;
        }
        // GDPR requires explicit consent for all non-necessary categories
        const { preferences } = consentData;
        // Check if user has made explicit choices for all categories
        const hasExplicitConsent = Object.entries(preferences).every(([category, granted]) => {
            if (category === "necessary")
                return true; // Always required
            return granted !== undefined; // Must have explicit choice
        });
        return hasExplicitConsent;
    }
    // CCPA specific compliance checks
    isCCPACompliant(consentData) {
        if (!consentData || consentData.complianceType !== "CCPA") {
            return false;
        }
        // CCPA allows opt-out for sale of personal information
        // For now, we consider it compliant if consent data exists
        return true;
    }
    getComplianceStatus(consentData) {
        if (!consentData) {
            return {
                isCompliant: false,
                complianceType: null,
                issues: ["No consent data found"],
            };
        }
        const issues = [];
        let isCompliant = false;
        switch (consentData.complianceType) {
            case "DPDPA":
                isCompliant = this.isDPDPACompliant(consentData);
                if (!isCompliant) {
                    issues.push("DPDPA compliance requirements not met");
                }
                break;
            case "GDPR":
                isCompliant = this.isGDPRCompliant(consentData);
                if (!isCompliant) {
                    issues.push("GDPR compliance requirements not met");
                }
                break;
            case "CCPA":
                isCompliant = this.isCCPACompliant(consentData);
                if (!isCompliant) {
                    issues.push("CCPA compliance requirements not met");
                }
                break;
            default:
                issues.push("Unknown compliance type");
        }
        return {
            isCompliant,
            complianceType: consentData.complianceType,
            issues,
        };
    }
}

class ConsentBanner {
    constructor(config) {
        this.bannerElement = null;
        this.isVisible = false;
        this.config = config;
    }
    create() {
        const banner = DOMUtils.createElement("div", "redacto-banner");
        DOMUtils.addClass(banner, this.config.banner.position);
        // Apply custom styles
        this.applyBannerStyles(banner);
        // Create banner content
        const content = this.createBannerContent();
        DOMUtils.appendChild(banner, content);
        this.bannerElement = banner;
        return banner;
    }
    createBannerContent() {
        const content = DOMUtils.createElement("div", "redacto-banner-content");
        // Add icon if enabled
        if (this.config.banner.showIcon) {
            const icon = this.createIcon();
            DOMUtils.appendChild(content, icon);
        }
        // Add text content
        const textContent = this.createTextContent();
        DOMUtils.appendChild(content, textContent);
        // Add action buttons
        const actions = this.createActionButtons();
        DOMUtils.appendChild(content, actions);
        return content;
    }
    createIcon() {
        const icon = DOMUtils.createElement("div", "redacto-banner-icon");
        icon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
      </svg>
    `;
        return icon;
    }
    createTextContent() {
        const textContent = DOMUtils.createElement("div", "redacto-banner-text");
        const title = DOMUtils.createElement("h3", "redacto-banner-title");
        title.textContent = this.config.texts.bannerTitle;
        DOMUtils.appendChild(textContent, title);
        const description = DOMUtils.createElement("p", "redacto-banner-description");
        description.textContent = this.config.texts.bannerDescription;
        DOMUtils.appendChild(textContent, description);
        return textContent;
    }
    createActionButtons() {
        const actions = DOMUtils.createElement("div", "redacto-banner-actions");
        // Accept All button
        const acceptButton = DOMUtils.createButton(this.config.texts.acceptAllText, "redacto-banner-button primary", () => this.onAcceptAll());
        DOMUtils.appendChild(actions, acceptButton);
        // Reject All button
        const rejectButton = DOMUtils.createButton(this.config.texts.rejectAllText, "redacto-banner-button secondary", () => this.onRejectAll());
        DOMUtils.appendChild(actions, rejectButton);
        // Manage Preferences button
        const manageButton = DOMUtils.createButton(this.config.texts.managePreferencesText, "redacto-banner-button outline", () => this.onManagePreferences());
        DOMUtils.appendChild(actions, manageButton);
        return actions;
    }
    applyBannerStyles(banner) {
        const styles = {
            backgroundColor: this.config.banner.backgroundColor,
            color: this.config.banner.textColor,
            borderRadius: this.config.banner.borderRadius,
            fontSize: this.config.banner.fontSize,
            fontFamily: this.config.banner.fontFamily,
            padding: this.config.banner.padding,
            margin: this.config.banner.margin,
            zIndex: this.config.banner.zIndex.toString(),
        };
        DOMUtils.addStyles(banner, styles);
        // Apply button styles
        this.applyButtonStyles(banner);
    }
    applyButtonStyles(banner) {
        const acceptButton = banner.querySelector(".redacto-banner-button.primary");
        const rejectButton = banner.querySelector(".redacto-banner-button.secondary");
        const manageButton = banner.querySelector(".redacto-banner-button.outline");
        if (acceptButton) {
            DOMUtils.addStyles(acceptButton, {
                backgroundColor: this.config.banner.acceptButtonColor,
                color: this.config.banner.acceptButtonTextColor,
            });
        }
        if (rejectButton) {
            DOMUtils.addStyles(rejectButton, {
                backgroundColor: this.config.banner.rejectButtonColor,
                color: this.config.banner.rejectButtonTextColor,
            });
        }
        if (manageButton) {
            DOMUtils.addStyles(manageButton, {
                color: this.config.banner.manageButtonTextColor,
                borderColor: this.config.banner.manageButtonTextColor,
            });
        }
    }
    show() {
        if (!this.bannerElement) {
            this.create();
        }
        if (this.bannerElement && !this.isVisible) {
            document.body.appendChild(this.bannerElement);
            this.isVisible = true;
            // Trigger animation
            if (this.config.banner.animation !== "none") {
                this.animateIn();
            }
            // Call callback
            if (this.config.onBannerShow) {
                this.config.onBannerShow();
            }
        }
    }
    hide() {
        if (this.bannerElement && this.isVisible) {
            if (this.config.banner.animation !== "none") {
                this.animateOut(() => {
                    this.removeBanner();
                });
            }
            else {
                this.removeBanner();
            }
        }
    }
    removeBanner() {
        if (this.bannerElement && this.bannerElement.parentNode) {
            this.bannerElement.parentNode.removeChild(this.bannerElement);
            this.isVisible = false;
            // Call callback
            if (this.config.onBannerHide) {
                this.config.onBannerHide();
            }
        }
    }
    animateIn() {
        if (!this.bannerElement)
            return;
        const animationClass = this.getAnimationClass("in");
        DOMUtils.addClass(this.bannerElement, animationClass);
        setTimeout(() => {
            if (this.bannerElement) {
                DOMUtils.removeClass(this.bannerElement, animationClass);
            }
        }, this.config.banner.animationDuration);
    }
    animateOut(callback) {
        if (!this.bannerElement)
            return;
        const animationClass = this.getAnimationClass("out");
        DOMUtils.addClass(this.bannerElement, animationClass);
        setTimeout(() => {
            callback();
        }, this.config.banner.animationDuration);
    }
    getAnimationClass(direction) {
        const position = this.config.banner.position;
        const animation = this.config.banner.animation;
        if (direction === "in") {
            switch (animation) {
                case "slide":
                    return position === "top" ? "slideInDown" : "slideInUp";
                case "fade":
                    return "fadeIn";
                default:
                    return "";
            }
        }
        else {
            switch (animation) {
                case "slide":
                    return position === "top" ? "slideOutUp" : "slideOutDown";
                case "fade":
                    return "fadeOut";
                default:
                    return "";
            }
        }
    }
    onAcceptAll() {
        const preferences = {
            necessary: true,
            functional: true,
            analytics: true,
            advertising: true,
            social: true,
            other: true,
        };
        this.triggerConsentChange(preferences);
        this.hide();
    }
    onRejectAll() {
        const preferences = {
            necessary: true, // Always required
            functional: false,
            analytics: false,
            advertising: false,
            social: false,
            other: false,
        };
        this.triggerConsentChange(preferences);
        this.hide();
    }
    onManagePreferences() {
        this.hide();
        // This will be handled by the main consent manager
        if (this.config.onModalShow) {
            this.config.onModalShow();
        }
    }
    triggerConsentChange(preferences) {
        // This will be handled by the main consent manager
        if (this.config.onConsentChange) {
            // Create a mock consent data for the callback
            const consentData = {
                timestamp: Date.now(),
                version: "1.0.0",
                preferences,
                services: {},
                complianceType: this.config.complianceType,
                consentId: "banner_" + Date.now(),
            };
            this.config.onConsentChange(consentData);
        }
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (this.bannerElement) {
            // Recreate banner with new config
            this.hide();
            this.bannerElement = null;
            this.show();
        }
    }
    destroy() {
        this.hide();
        this.bannerElement = null;
    }
    isBannerVisible() {
        return this.isVisible;
    }
}

class ConsentModal {
    constructor(config) {
        this.modalElement = null;
        this.overlayElement = null;
        this.isVisible = false;
        this.config = config;
        this.currentPreferences = {
            necessary: true,
            functional: false,
            analytics: false,
            advertising: false,
            social: false,
            other: false,
        };
    }
    create() {
        const overlay = DOMUtils.createElement("div", "redacto-modal-overlay");
        this.applyOverlayStyles(overlay);
        const modal = DOMUtils.createElement("div", "redacto-modal");
        this.applyModalStyles(modal);
        // Create modal content
        const header = this.createModalHeader();
        const content = this.createModalContent();
        const footer = this.createModalFooter();
        DOMUtils.appendChild(modal, header);
        DOMUtils.appendChild(modal, content);
        DOMUtils.appendChild(modal, footer);
        DOMUtils.appendChild(overlay, modal);
        this.overlayElement = overlay;
        this.modalElement = modal;
        return overlay;
    }
    createModalHeader() {
        const header = DOMUtils.createElement("div", "redacto-modal-header");
        const title = DOMUtils.createElement("h2", "redacto-modal-title");
        title.textContent = this.config.texts.modalTitle;
        DOMUtils.appendChild(header, title);
        const description = DOMUtils.createElement("p", "redacto-modal-description");
        description.textContent = this.config.texts.modalDescription;
        DOMUtils.appendChild(header, description);
        return header;
    }
    createModalContent() {
        const content = DOMUtils.createElement("div", "redacto-modal-content");
        // Create category sections
        const categories = [
            "necessary",
            "functional",
            "analytics",
            "advertising",
            "social",
            "other",
        ];
        categories.forEach((category) => {
            const categoryElement = this.createCategorySection(category);
            DOMUtils.appendChild(content, categoryElement);
        });
        // Add links section
        const links = this.createLinksSection();
        DOMUtils.appendChild(content, links);
        return content;
    }
    createCategorySection(category) {
        const categoryDiv = DOMUtils.createElement("div", "redacto-category");
        const header = DOMUtils.createElement("div", "redacto-category-header");
        const checkbox = DOMUtils.createCheckbox(`category-${category}`, this.currentPreferences[category], category === "necessary" // Necessary cookies are always required
        );
        DOMUtils.addClass(checkbox, "redacto-category-checkbox");
        DOMUtils.appendChild(header, checkbox);
        const title = DOMUtils.createElement("h4", "redacto-category-title");
        title.textContent = this.getCategoryTitle(category);
        DOMUtils.appendChild(header, title);
        DOMUtils.appendChild(categoryDiv, header);
        const description = DOMUtils.createElement("p", "redacto-category-description");
        description.textContent = this.getCategoryDescription(category);
        DOMUtils.appendChild(categoryDiv, description);
        // Add services for this category
        const services = this.config.services.filter((service) => service.category === category);
        if (services.length > 0) {
            const servicesDiv = this.createServicesSection(services);
            DOMUtils.appendChild(categoryDiv, servicesDiv);
        }
        // Add event listener for checkbox
        checkbox.addEventListener("change", (e) => {
            const target = e.target;
            this.currentPreferences[category] = target.checked;
            this.updateServicesState(category, target.checked);
        });
        return categoryDiv;
    }
    createServicesSection(services) {
        const servicesDiv = DOMUtils.createElement("div", "redacto-services");
        services.forEach((service) => {
            const serviceDiv = DOMUtils.createElement("div", "redacto-service");
            const checkbox = DOMUtils.createCheckbox(`service-${service.id}`, this.currentPreferences[service.category]);
            DOMUtils.addClass(checkbox, "redacto-service-checkbox");
            DOMUtils.appendChild(serviceDiv, checkbox);
            const name = DOMUtils.createElement("span", "redacto-service-name");
            name.textContent = service.name;
            DOMUtils.appendChild(serviceDiv, name);
            if (service.description) {
                const description = DOMUtils.createElement("p", "redacto-service-description");
                description.textContent = service.description;
                DOMUtils.appendChild(serviceDiv, description);
            }
            DOMUtils.appendChild(servicesDiv, serviceDiv);
        });
        return servicesDiv;
    }
    createLinksSection() {
        const linksDiv = DOMUtils.createElement("div", "redacto-links");
        if (this.config.privacyUrl) {
            const privacyLink = DOMUtils.createLink(this.config.privacyUrl, this.config.texts.privacyPolicyText, "redacto-link", "_blank");
            DOMUtils.appendChild(linksDiv, privacyLink);
        }
        if (this.config.cookiePolicyUrl) {
            const cookieLink = DOMUtils.createLink(this.config.cookiePolicyUrl, this.config.texts.cookiePolicyText, "redacto-link", "_blank");
            DOMUtils.appendChild(linksDiv, cookieLink);
        }
        return linksDiv;
    }
    createModalFooter() {
        const footer = DOMUtils.createElement("div", "redacto-modal-footer");
        const saveButton = DOMUtils.createButton(this.config.texts.savePreferencesText, "redacto-banner-button primary", () => this.onSavePreferences());
        DOMUtils.appendChild(footer, saveButton);
        const cancelButton = DOMUtils.createButton("Cancel", "redacto-banner-button outline", () => this.hide());
        DOMUtils.appendChild(footer, cancelButton);
        return footer;
    }
    applyOverlayStyles(overlay) {
        const styles = {
            backgroundColor: this.config.modal.overlayColor,
            zIndex: this.config.modal.zIndex.toString(),
        };
        DOMUtils.addStyles(overlay, styles);
    }
    applyModalStyles(modal) {
        const styles = {
            backgroundColor: this.config.modal.backgroundColor,
            color: this.config.modal.textColor,
            borderRadius: this.config.modal.borderRadius,
            fontSize: this.config.modal.fontSize,
            fontFamily: this.config.modal.fontFamily,
            padding: this.config.modal.padding,
            maxWidth: this.config.modal.maxWidth,
            maxHeight: this.config.modal.maxHeight,
        };
        DOMUtils.addStyles(modal, styles);
    }
    getCategoryTitle(category) {
        switch (category) {
            case "necessary":
                return this.config.texts.necessaryTitle;
            case "functional":
                return this.config.texts.functionalTitle;
            case "analytics":
                return this.config.texts.analyticsTitle;
            case "advertising":
                return this.config.texts.advertisingTitle;
            case "social":
                return this.config.texts.socialTitle;
            case "other":
                return this.config.texts.otherTitle;
            default:
                return category.charAt(0).toUpperCase() + category.slice(1);
        }
    }
    getCategoryDescription(category) {
        switch (category) {
            case "necessary":
                return this.config.texts.necessaryDescription;
            case "functional":
                return this.config.texts.functionalDescription;
            case "analytics":
                return this.config.texts.analyticsDescription;
            case "advertising":
                return this.config.texts.advertisingDescription;
            case "social":
                return this.config.texts.socialDescription;
            case "other":
                return this.config.texts.otherDescription;
            default:
                return `Description for ${category} cookies.`;
        }
    }
    updateServicesState(category, enabled) {
        const services = this.modalElement?.querySelectorAll(`.redacto-service input[type="checkbox"]`);
        services?.forEach((checkbox) => {
            const input = checkbox;
            if (input.id.startsWith(`service-`)) {
                const serviceId = input.id.replace("service-", "");
                const service = this.config.services.find((s) => s.id === serviceId);
                if (service && service.category === category) {
                    input.checked = enabled;
                }
            }
        });
    }
    show(preferences) {
        if (!this.overlayElement) {
            this.create();
        }
        if (this.overlayElement && !this.isVisible) {
            // Set initial preferences
            if (preferences) {
                this.currentPreferences = { ...preferences };
                this.updateCheckboxes();
            }
            document.body.appendChild(this.overlayElement);
            this.isVisible = true;
            // Trigger animation
            if (this.config.modal.animation !== "none") {
                this.animateIn();
            }
            // Call callback
            if (this.config.onModalShow) {
                this.config.onModalShow();
            }
        }
    }
    hide() {
        if (this.overlayElement && this.isVisible) {
            if (this.config.modal.animation !== "none") {
                this.animateOut(() => {
                    this.removeModal();
                });
            }
            else {
                this.removeModal();
            }
        }
    }
    removeModal() {
        if (this.overlayElement && this.overlayElement.parentNode) {
            this.overlayElement.parentNode.removeChild(this.overlayElement);
            this.isVisible = false;
            // Call callback
            if (this.config.onModalHide) {
                this.config.onModalHide();
            }
        }
    }
    animateIn() {
        if (!this.overlayElement || !this.modalElement)
            return;
        const animationClass = this.getAnimationClass("in");
        DOMUtils.addClass(this.overlayElement, animationClass);
        DOMUtils.addClass(this.modalElement, animationClass);
        setTimeout(() => {
            if (this.overlayElement)
                DOMUtils.removeClass(this.overlayElement, animationClass);
            if (this.modalElement)
                DOMUtils.removeClass(this.modalElement, animationClass);
        }, this.config.modal.animationDuration);
    }
    animateOut(callback) {
        if (!this.overlayElement || !this.modalElement)
            return;
        const animationClass = this.getAnimationClass("out");
        DOMUtils.addClass(this.overlayElement, animationClass);
        DOMUtils.addClass(this.modalElement, animationClass);
        setTimeout(() => {
            callback();
        }, this.config.modal.animationDuration);
    }
    getAnimationClass(direction) {
        const animation = this.config.modal.animation;
        if (direction === "in") {
            switch (animation) {
                case "slide":
                    return "slideInUp";
                case "fade":
                    return "fadeIn";
                case "scale":
                    return "scaleIn";
                default:
                    return "";
            }
        }
        else {
            switch (animation) {
                case "slide":
                    return "slideOutDown";
                case "fade":
                    return "fadeOut";
                case "scale":
                    return "scaleOut";
                default:
                    return "";
            }
        }
    }
    updateCheckboxes() {
        Object.entries(this.currentPreferences).forEach(([category, enabled]) => {
            const checkbox = this.overlayElement?.querySelector(`#category-${category}`);
            if (checkbox) {
                checkbox.checked = enabled;
            }
        });
    }
    onSavePreferences() {
        // Collect all preferences from checkboxes
        const preferences = {
            necessary: true, // Always true
            functional: false,
            analytics: false,
            advertising: false,
            social: false,
            other: false,
        };
        Object.keys(preferences).forEach((category) => {
            if (category !== "necessary") {
                const checkbox = this.overlayElement?.querySelector(`#category-${category}`);
                if (checkbox) {
                    preferences[category] = checkbox.checked;
                }
            }
        });
        // Trigger consent change
        if (this.config.onConsentChange) {
            const consentData = {
                timestamp: Date.now(),
                version: "1.0.0",
                preferences,
                services: {},
                complianceType: this.config.complianceType,
                consentId: "modal_" + Date.now(),
            };
            this.config.onConsentChange(consentData);
        }
        this.hide();
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (this.overlayElement) {
            // Recreate modal with new config
            this.hide();
            this.overlayElement = null;
            this.modalElement = null;
            this.show(this.currentPreferences);
        }
    }
    destroy() {
        this.hide();
        this.overlayElement = null;
        this.modalElement = null;
    }
    isModalVisible() {
        return this.isVisible;
    }
}

const defaultBannerConfig = {
    position: "bottom",
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#374151",
    acceptButtonColor: "#3b82f6",
    acceptButtonTextColor: "#ffffff",
    rejectButtonColor: "#6b7280",
    rejectButtonTextColor: "#ffffff",
    manageButtonColor: "transparent",
    manageButtonTextColor: "#3b82f6",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: "16px",
    margin: "16px",
    zIndex: 999999,
    showIcon: true,
    iconPosition: "left",
    animation: "slide",
    animationDuration: 300,
};
const defaultModalConfig = {
    backgroundColor: "#ffffff",
    overlayColor: "rgba(0, 0, 0, 0.5)",
    textColor: "#374151",
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280",
    borderRadius: "12px",
    fontSize: "14px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: "24px",
    maxWidth: "600px",
    maxHeight: "80vh",
    zIndex: 1000000,
    animation: "scale",
    animationDuration: 300,
};
const defaultTexts = {
    bannerTitle: "Cookie Consent",
    bannerDescription: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
    acceptAllText: "Accept All",
    rejectAllText: "Reject All",
    managePreferencesText: "Manage Preferences",
    modalTitle: "Cookie Preferences",
    modalDescription: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. You can choose which categories of cookies to allow.",
    necessaryTitle: "Necessary Cookies",
    necessaryDescription: "These cookies are essential for the website to function properly. They cannot be disabled.",
    functionalTitle: "Functional Cookies",
    functionalDescription: "These cookies enable enhanced functionality and personalization, such as remembering your preferences.",
    analyticsTitle: "Analytics Cookies",
    analyticsDescription: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    advertisingTitle: "Advertising Cookies",
    advertisingDescription: "These cookies are used to deliver advertisements more relevant to you and your interests.",
    socialTitle: "Social Media Cookies",
    socialDescription: "These cookies are set by social media services that we have added to the site to enable you to share our content.",
    otherTitle: "Other Cookies",
    otherDescription: "These are cookies that have not been categorized yet.",
    savePreferencesText: "Save Preferences",
    privacyPolicyText: "Privacy Policy",
    cookiePolicyText: "Cookie Policy",
    poweredByText: "Powered by Redacto",
};
const defaultServices = [
    {
        id: "google-analytics",
        name: "Google Analytics",
        category: "analytics",
        description: "Google Analytics helps us understand how visitors interact with our website.",
        cookies: ["_ga", "_ga_*", "_gid", "_gat"],
        purpose: "Website analytics and performance measurement",
        retention: "2 years",
        thirdParty: true,
        thirdPartyName: "Google LLC",
        thirdPartyUrl: "https://policies.google.com/privacy",
    },
    {
        id: "google-tag-manager",
        name: "Google Tag Manager",
        category: "analytics",
        description: "Google Tag Manager helps us manage and deploy marketing and analytics tags.",
        cookies: ["_gtm", "_gtag"],
        purpose: "Tag management and analytics",
        retention: "2 years",
        thirdParty: true,
        thirdPartyName: "Google LLC",
        thirdPartyUrl: "https://policies.google.com/privacy",
    },
];
const createDefaultConfig = (complianceType = "DPDPA") => ({
    complianceType,
    cookieName: "redacto-consent",
    privacyUrl: "",
    cookiePolicyUrl: "",
    dataProcessorUrl: "",
    banner: defaultBannerConfig,
    modal: defaultModalConfig,
    texts: defaultTexts,
    services: defaultServices,
    showBannerOnFirstVisit: true,
    showBannerOnConsentChange: false,
    autoHideBanner: false,
    autoHideDelay: 0,
    rememberConsent: true,
    consentExpiry: 365,
    enableGoogleConsentMode: true,
    enableBingConsentMode: false,
    enableDataLayer: false,
    dataLayerName: "dataLayer",
    enableSoftConsent: false,
    enableDoNotTrack: false,
    debug: false,
});

class RedactoConsentManager {
    constructor() {
        this.isInitialized = false;
        this.consentData = null;
        this.config = createDefaultConfig();
        this.cookieManager = CookieManager.getInstance();
        this.consentUtils = new ConsentManager();
        this.banner = new ConsentBanner(this.config);
        this.modal = new ConsentModal(this.config);
        this.injectStyles();
        this.setupEventListeners();
    }
    init(userConfig = {}) {
        try {
            // Merge user config with defaults
            this.config = { ...this.config, ...userConfig };
            // Update banner and modal with new config
            this.banner.updateConfig(this.config);
            this.modal.updateConfig(this.config);
            // Load existing consent data
            this.loadConsentData();
            // Check if we need to show the banner
            this.checkConsentStatus();
            this.isInitialized = true;
            if (this.config.debug) {
                console.log("Redacto Cookie Consent initialized:", this.config);
            }
        }
        catch (error) {
            console.error("Failed to initialize Redacto Cookie Consent:", error);
        }
    }
    injectStyles() {
        // Inject CSS styles
        const css = `
      /* Redacto Cookie Consent Widget Styles */
      .redacto-consent-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #374151;
        box-sizing: border-box;
      }
      .redacto-consent-widget * {
        box-sizing: border-box;
      }
      
      /* Banner Styles */
      .redacto-banner {
        position: fixed;
        left: 0;
        right: 0;
        z-index: 999999;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 16px;
        margin: 16px;
        border-radius: 8px;
        max-width: calc(100% - 32px);
        animation: slideInUp 0.3s ease-out;
      }
      
      .redacto-banner.top {
        top: 0;
        bottom: auto;
      }
      
      .redacto-banner.bottom {
        bottom: 0;
        top: auto;
      }
      
      .redacto-banner.center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        bottom: auto;
        right: auto;
        max-width: 600px;
        width: calc(100% - 32px);
      }
      
      .redacto-banner-content {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        flex-wrap: wrap;
      }
      
      .redacto-banner-icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        margin-top: 2px;
      }
      
      .redacto-banner-text {
        flex: 1;
        min-width: 0;
      }
      
      .redacto-banner-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #111827;
      }
      
      .redacto-banner-description {
        font-size: 14px;
        margin: 0 0 16px 0;
        color: #6b7280;
        line-height: 1.5;
      }
      
      .redacto-banner-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
      }
      
      .redacto-banner-button {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 36px;
        white-space: nowrap;
      }
      
      .redacto-banner-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .redacto-banner-button:active {
        transform: translateY(0);
      }
      
      .redacto-banner-button.primary {
        background: #3b82f6;
        color: #ffffff;
      }
      
      .redacto-banner-button.primary:hover {
        background: #2563eb;
      }
      
      .redacto-banner-button.secondary {
        background: #6b7280;
        color: #ffffff;
      }
      
      .redacto-banner-button.secondary:hover {
        background: #4b5563;
      }
      
      .redacto-banner-button.outline {
        background: transparent;
        color: #3b82f6;
        border: 1px solid #3b82f6;
      }
      
      .redacto-banner-button.outline:hover {
        background: #3b82f6;
        color: #ffffff;
      }
      
      /* Modal Styles */
      .redacto-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        animation: fadeIn 0.3s ease-out;
      }
      
      .redacto-modal {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        max-width: 600px;
        max-height: 80vh;
        width: 100%;
        overflow: hidden;
        animation: scaleIn 0.3s ease-out;
      }
      
      .redacto-modal-header {
        padding: 24px 24px 0 24px;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .redacto-modal-title {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #111827;
      }
      
      .redacto-modal-description {
        font-size: 14px;
        margin: 0 0 24px 0;
        color: #6b7280;
        line-height: 1.5;
      }
      
      .redacto-modal-content {
        padding: 24px;
        max-height: 60vh;
        overflow-y: auto;
      }
      
      .redacto-modal-footer {
        padding: 0 24px 24px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        flex-wrap: wrap;
      }
      
      /* Category Styles */
      .redacto-category {
        margin-bottom: 24px;
        padding: 16px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #f9fafb;
      }
      
      .redacto-category-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }
      
      .redacto-category-checkbox {
        width: 18px;
        height: 18px;
        accent-color: #3b82f6;
      }
      
      .redacto-category-checkbox:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .redacto-category-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        color: #111827;
      }
      
      .redacto-category-description {
        font-size: 14px;
        margin: 0 0 12px 0;
        color: #6b7280;
        line-height: 1.5;
      }
      
      .redacto-category-details {
        font-size: 12px;
        color: #9ca3af;
        margin: 0;
      }
      
      /* Services Styles */
      .redacto-services {
        margin-top: 12px;
      }
      
      .redacto-service {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .redacto-service:last-child {
        border-bottom: none;
      }
      
      .redacto-service-checkbox {
        width: 16px;
        height: 16px;
        accent-color: #3b82f6;
      }
      
      .redacto-service-name {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
      }
      
      .redacto-service-description {
        font-size: 12px;
        color: #6b7280;
        margin-left: 24px;
      }
      
      /* Links */
      .redacto-links {
        display: flex;
        gap: 16px;
        margin-top: 16px;
        flex-wrap: wrap;
      }
      
      .redacto-link {
        color: #3b82f6;
        text-decoration: none;
        font-size: 14px;
      }
      
      .redacto-link:hover {
        text-decoration: underline;
      }
      
      /* Powered by */
      .redacto-powered-by {
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
      }
      
      /* Animations */
      @keyframes slideInUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slideInDown {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes scaleIn {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      @keyframes slideOutDown {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100%);
          opacity: 0;
        }
      }
      
      @keyframes slideOutUp {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(-100%);
          opacity: 0;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
      
      @keyframes scaleOut {
        from {
          transform: scale(1);
          opacity: 1;
        }
        to {
          transform: scale(0.9);
          opacity: 0;
        }
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .redacto-banner {
          margin: 8px;
          padding: 12px;
          max-width: calc(100% - 16px);
        }
        
        .redacto-banner-content {
          flex-direction: column;
          gap: 12px;
        }
        
        .redacto-banner-actions {
          width: 100%;
          justify-content: stretch;
        }
        
        .redacto-banner-button {
          flex: 1;
          min-width: 0;
        }
        
        .redacto-modal {
          margin: 16px;
          max-height: calc(100vh - 32px);
        }
        
        .redacto-modal-content {
          max-height: calc(100vh - 200px);
        }
        
        .redacto-modal-footer {
          flex-direction: column;
        }
        
        .redacto-modal-footer .redacto-banner-button {
          width: 100%;
        }
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .redacto-banner {
          background: #1f2937;
          border-color: #374151;
          color: #f9fafb;
        }
        
        .redacto-banner-title {
          color: #f9fafb;
        }
        
        .redacto-banner-description {
          color: #d1d5db;
        }
        
        .redacto-modal {
          background: #1f2937;
          color: #f9fafb;
        }
        
        .redacto-modal-title {
          color: #f9fafb;
        }
        
        .redacto-modal-description {
          color: #d1d5db;
        }
        
        .redacto-category {
          background: #111827;
          border-color: #374151;
        }
        
        .redacto-category-title {
          color: #f9fafb;
        }
        
        .redacto-category-description {
          color: #d1d5db;
        }
        
        .redacto-service-name {
          color: #f9fafb;
        }
        
        .redacto-service-description {
          color: #d1d5db;
        }
      }
      
      /* High contrast mode */
      @media (prefers-contrast: high) {
        .redacto-banner {
          border-width: 2px;
        }
        
        .redacto-banner-button {
          border-width: 2px;
        }
        
        .redacto-category {
          border-width: 2px;
        }
      }
      
      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .redacto-banner,
        .redacto-modal-overlay,
        .redacto-modal {
          animation: none;
        }
        
        .redacto-banner-button {
          transition: none;
        }
      }
    `;
        DOMUtils.injectCSS(css, "redacto-consent-styles");
    }
    setupEventListeners() {
        // Handle modal show from banner
        this.config.onModalShow = () => {
            this.showModal();
        };
        // Handle consent changes
        this.config.onConsentChange = (consentData) => {
            this.handleConsentChange(consentData);
        };
    }
    loadConsentData() {
        this.consentData = this.cookieManager.getConsentData(this.config.cookieName);
        if (this.consentData &&
            this.consentUtils.isConsentValid(this.consentData, this.config.consentExpiry)) {
            if (this.config.debug) {
                console.log("Loaded existing consent data:", this.consentData);
            }
        }
        else {
            this.consentData = null;
            if (this.config.debug) {
                console.log("No valid consent data found");
            }
        }
    }
    checkConsentStatus() {
        if (!this.consentData && this.config.showBannerOnFirstVisit) {
            this.showBanner();
        }
        else if (this.consentData && this.config.showBannerOnConsentChange) {
            this.showBanner();
        }
    }
    handleConsentChange(consentData) {
        this.consentData = consentData;
        // Save consent data
        if (this.config.rememberConsent) {
            this.cookieManager.setConsentData(this.config.cookieName, consentData, this.config.consentExpiry);
        }
        // Update Google Consent Mode
        if (this.config.enableGoogleConsentMode) {
            this.updateGoogleConsentMode(consentData);
        }
        // Update Bing Consent Mode
        if (this.config.enableBingConsentMode) {
            this.updateBingConsentMode(consentData);
        }
        // Update Data Layer
        if (this.config.enableDataLayer) {
            this.updateDataLayer(consentData);
        }
        // Execute service scripts
        this.executeServiceScripts(consentData);
        if (this.config.debug) {
            console.log("Consent changed:", consentData);
        }
    }
    updateGoogleConsentMode(consentData) {
        try {
            if (typeof window !== "undefined" && window.gtag) {
                const gtag = window.gtag;
                gtag("consent", "update", {
                    ad_storage: consentData.preferences.advertising
                        ? "granted"
                        : "denied",
                    analytics_storage: consentData.preferences.analytics
                        ? "granted"
                        : "denied",
                    functionality_storage: consentData.preferences.functional
                        ? "granted"
                        : "denied",
                    personalization_storage: consentData.preferences.functional
                        ? "granted"
                        : "denied",
                    security_storage: "granted",
                });
            }
        }
        catch (error) {
            console.warn("Failed to update Google Consent Mode:", error);
        }
    }
    updateBingConsentMode(consentData) {
        try {
            if (typeof window !== "undefined" && window.uetq) {
                const uetq = window.uetq;
                uetq("consent", consentData.preferences.advertising ? "granted" : "denied");
            }
        }
        catch (error) {
            console.warn("Failed to update Bing Consent Mode:", error);
        }
    }
    updateDataLayer(consentData) {
        try {
            if (typeof window !== "undefined") {
                const dataLayer = window[this.config.dataLayerName] || [];
                dataLayer.push({
                    event: "consent_update",
                    consent_data: consentData,
                });
            }
        }
        catch (error) {
            console.warn("Failed to update data layer:", error);
        }
    }
    executeServiceScripts(consentData) {
        this.config.services.forEach((service) => {
            const hasConsent = this.consentUtils.hasConsentForCategory(consentData, service.category);
            if (hasConsent && service.onAccept) {
                try {
                    service.onAccept();
                }
                catch (error) {
                    console.warn(`Failed to execute onAccept for service ${service.id}:`, error);
                }
            }
            else if (!hasConsent && service.onReject) {
                try {
                    service.onReject();
                }
                catch (error) {
                    console.warn(`Failed to execute onReject for service ${service.id}:`, error);
                }
            }
        });
    }
    // Public API methods
    showBanner() {
        this.banner.show();
    }
    hideBanner() {
        this.banner.hide();
    }
    showModal() {
        const preferences = this.consentData?.preferences ||
            this.consentUtils.getDefaultPreferences();
        this.modal.show(preferences);
    }
    hideModal() {
        this.modal.hide();
    }
    acceptAll() {
        const preferences = {
            necessary: true,
            functional: true,
            analytics: true,
            advertising: true,
            social: true,
            other: true,
        };
        const consentData = this.consentUtils.createConsentData(preferences, this.config.complianceType);
        this.handleConsentChange(consentData);
    }
    rejectAll() {
        const preferences = {
            necessary: true, // Always required
            functional: false,
            analytics: false,
            advertising: false,
            social: false,
            other: false,
        };
        const consentData = this.consentUtils.createConsentData(preferences, this.config.complianceType);
        this.handleConsentChange(consentData);
    }
    savePreferences(preferences) {
        const validatedPreferences = this.consentUtils.validatePreferences(preferences);
        const consentData = this.consentUtils.mergeConsentData(this.consentData, validatedPreferences, this.config.complianceType);
        this.handleConsentChange(consentData);
    }
    getConsent() {
        return this.consentData;
    }
    hasConsent(category) {
        return this.consentUtils.hasConsentForCategory(this.consentData, category);
    }
    hasServiceConsent(serviceId) {
        return this.consentUtils.hasConsentForService(this.consentData, serviceId);
    }
    resetConsent() {
        this.cookieManager.clearConsentData(this.config.cookieName);
        this.consentData = null;
        if (this.config.showBannerOnConsentChange) {
            this.showBanner();
        }
    }
    destroy() {
        this.banner.destroy();
        this.modal.destroy();
        DOMUtils.removeStyleSheet("redacto-consent-styles");
        this.isInitialized = false;
    }
}

// Create the global Redacto instance
const redacto = new RedactoConsentManager();
// Make it available globally
if (typeof window !== "undefined") {
    window.redacto = redacto;
}
// Auto-initialize if config is provided via data attributes
if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        const script = document.querySelector("script[data-redacto-config]");
        if (script) {
            try {
                const configAttr = script.getAttribute("data-redacto-config");
                if (configAttr) {
                    const config = JSON.parse(configAttr);
                    redacto.init(config);
                }
            }
            catch (error) {
                console.warn("Failed to parse Redacto config from data attribute:", error);
            }
        }
    });
}

exports.default = redacto;
exports.redacto = redacto;
//# sourceMappingURL=redacto-cookie-consent.cjs.js.map

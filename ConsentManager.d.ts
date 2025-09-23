import { RedactoConfig, ConsentData, ConsentPreferences, CookieCategory, RedactoInstance } from "./types";
export declare class RedactoConsentManager implements RedactoInstance {
    private config;
    private cookieManager;
    private consentUtils;
    private banner;
    private modal;
    private isInitialized;
    private consentData;
    constructor();
    init(userConfig?: Partial<RedactoConfig>): void;
    private injectStyles;
    private setupEventListeners;
    private loadConsentData;
    private checkConsentStatus;
    private handleConsentChange;
    private updateGoogleConsentMode;
    private updateBingConsentMode;
    private updateDataLayer;
    private executeServiceScripts;
    showBanner(): void;
    hideBanner(): void;
    showModal(): void;
    hideModal(): void;
    acceptAll(): void;
    rejectAll(): void;
    savePreferences(preferences: Partial<ConsentPreferences>): void;
    getConsent(): ConsentData | null;
    hasConsent(category: CookieCategory): boolean;
    hasServiceConsent(serviceId: string): boolean;
    resetConsent(): void;
    destroy(): void;
}
//# sourceMappingURL=ConsentManager.d.ts.map
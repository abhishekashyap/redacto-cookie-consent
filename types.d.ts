export type ComplianceType = "GDPR" | "DPDPA" | "CCPA";
export type BannerPosition = "top" | "bottom" | "center";
export type CookieCategory = "necessary" | "functional" | "analytics" | "advertising" | "social" | "other";
export type ConsentState = "granted" | "denied" | "pending";
export interface CookieService {
    id: string;
    name: string;
    category: CookieCategory;
    description: string;
    cookies: string[];
    purpose: string;
    retention: string;
    thirdParty?: boolean;
    thirdPartyName?: string;
    thirdPartyUrl?: string;
    script?: string;
    onAccept?: () => void;
    onReject?: () => void;
}
export interface ConsentPreferences {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    advertising: boolean;
    social: boolean;
    other: boolean;
}
export interface ConsentData {
    timestamp: number;
    version: string;
    preferences: ConsentPreferences;
    services: Record<string, ConsentState>;
    complianceType: ComplianceType;
    consentId: string;
}
export interface BannerConfig {
    position: BannerPosition;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    acceptButtonColor: string;
    acceptButtonTextColor: string;
    rejectButtonColor: string;
    rejectButtonTextColor: string;
    manageButtonColor: string;
    manageButtonTextColor: string;
    borderRadius: string;
    fontSize: string;
    fontFamily: string;
    padding: string;
    margin: string;
    zIndex: number;
    showIcon: boolean;
    iconPosition: "left" | "right";
    animation: "slide" | "fade" | "none";
    animationDuration: number;
}
export interface ModalConfig {
    backgroundColor: string;
    overlayColor: string;
    textColor: string;
    primaryColor: string;
    secondaryColor: string;
    borderRadius: string;
    fontSize: string;
    fontFamily: string;
    padding: string;
    maxWidth: string;
    maxHeight: string;
    zIndex: number;
    animation: "slide" | "fade" | "scale" | "none";
    animationDuration: number;
}
export interface TextConfig {
    bannerTitle: string;
    bannerDescription: string;
    acceptAllText: string;
    rejectAllText: string;
    managePreferencesText: string;
    modalTitle: string;
    modalDescription: string;
    necessaryTitle: string;
    necessaryDescription: string;
    functionalTitle: string;
    functionalDescription: string;
    analyticsTitle: string;
    analyticsDescription: string;
    advertisingTitle: string;
    advertisingDescription: string;
    socialTitle: string;
    socialDescription: string;
    otherTitle: string;
    otherDescription: string;
    savePreferencesText: string;
    privacyPolicyText: string;
    cookiePolicyText: string;
    poweredByText: string;
}
export interface RedactoConfig {
    complianceType: ComplianceType;
    cookieName: string;
    privacyUrl: string;
    cookiePolicyUrl?: string;
    dataProcessorUrl?: string;
    banner: BannerConfig;
    modal: ModalConfig;
    texts: TextConfig;
    services: CookieService[];
    showBannerOnFirstVisit: boolean;
    showBannerOnConsentChange: boolean;
    autoHideBanner: boolean;
    autoHideDelay: number;
    rememberConsent: boolean;
    consentExpiry: number;
    enableGoogleConsentMode: boolean;
    enableBingConsentMode: boolean;
    enableDataLayer: boolean;
    dataLayerName: string;
    enableSoftConsent: boolean;
    enableDoNotTrack: boolean;
    onConsentChange?: (consent: ConsentData) => void;
    onBannerShow?: () => void;
    onBannerHide?: () => void;
    onModalShow?: () => void;
    onModalHide?: () => void;
    debug: boolean;
}
export interface RedactoInstance {
    init: (config: Partial<RedactoConfig>) => void;
    showBanner: () => void;
    hideBanner: () => void;
    showModal: () => void;
    hideModal: () => void;
    acceptAll: () => void;
    rejectAll: () => void;
    savePreferences: (preferences: Partial<ConsentPreferences>) => void;
    getConsent: () => ConsentData | null;
    hasConsent: (category: CookieCategory) => boolean;
    hasServiceConsent: (serviceId: string) => boolean;
    resetConsent: () => void;
    destroy: () => void;
}
declare global {
    interface Window {
        redacto: RedactoInstance;
    }
}
//# sourceMappingURL=types.d.ts.map
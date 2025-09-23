import { ConsentData, ConsentPreferences, CookieCategory, ComplianceType } from "../types";
export declare class ConsentManager {
    private cookieManager;
    constructor();
    generateConsentId(): string;
    createConsentData(preferences: ConsentPreferences, complianceType: ComplianceType, services?: Record<string, boolean>): ConsentData;
    getDefaultPreferences(): ConsentPreferences;
    validatePreferences(preferences: Partial<ConsentPreferences>): ConsentPreferences;
    hasConsentForCategory(consentData: ConsentData | null, category: CookieCategory): boolean;
    hasConsentForService(consentData: ConsentData | null, serviceId: string): boolean;
    isConsentValid(consentData: ConsentData | null, expiryDays: number): boolean;
    mergeConsentData(existing: ConsentData | null, newPreferences: Partial<ConsentPreferences>, complianceType: ComplianceType): ConsentData;
    getConsentSummary(consentData: ConsentData | null): {
        hasConsent: boolean;
        categories: Record<CookieCategory, boolean>;
        totalServices: number;
        consentedServices: number;
    };
    isDPDPACompliant(consentData: ConsentData | null): boolean;
    isGDPRCompliant(consentData: ConsentData | null): boolean;
    isCCPACompliant(consentData: ConsentData | null): boolean;
    getComplianceStatus(consentData: ConsentData | null): {
        isCompliant: boolean;
        complianceType: ComplianceType | null;
        issues: string[];
    };
}
//# sourceMappingURL=consent.d.ts.map
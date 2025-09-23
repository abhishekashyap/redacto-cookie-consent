import { ConsentData } from "../types";
export declare class CookieManager {
    private static instance;
    static getInstance(): CookieManager;
    setCookie(name: string, value: string, days?: number, domain?: string, path?: string): void;
    getCookie(name: string): string | null;
    deleteCookie(name: string, domain?: string, path?: string): void;
    getAllCookies(): Record<string, string>;
    setConsentData(cookieName: string, consentData: ConsentData, expiryDays?: number): void;
    getConsentData(cookieName: string): ConsentData | null;
    clearConsentData(cookieName: string): void;
    isConsentExpired(consentData: ConsentData, expiryDays: number): boolean;
    getDomain(): string;
    getRootDomain(): string;
}
//# sourceMappingURL=cookies.d.ts.map
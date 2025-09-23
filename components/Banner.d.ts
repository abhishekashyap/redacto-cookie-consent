import { RedactoConfig } from "../types";
export declare class ConsentBanner {
    private config;
    private bannerElement;
    private isVisible;
    constructor(config: RedactoConfig);
    create(): HTMLElement;
    private createBannerContent;
    private createIcon;
    private createTextContent;
    private createActionButtons;
    private applyBannerStyles;
    private applyButtonStyles;
    show(): void;
    hide(): void;
    private removeBanner;
    private animateIn;
    private animateOut;
    private getAnimationClass;
    private onAcceptAll;
    private onRejectAll;
    private onManagePreferences;
    private triggerConsentChange;
    updateConfig(newConfig: Partial<RedactoConfig>): void;
    destroy(): void;
    isBannerVisible(): boolean;
}
//# sourceMappingURL=Banner.d.ts.map
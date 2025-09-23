import { RedactoConfig, ConsentPreferences } from "../types";
export declare class ConsentModal {
    private config;
    private modalElement;
    private overlayElement;
    private isVisible;
    private currentPreferences;
    constructor(config: RedactoConfig);
    create(): HTMLElement;
    private createModalHeader;
    private createModalContent;
    private createCategorySection;
    private createServicesSection;
    private createLinksSection;
    private createModalFooter;
    private applyOverlayStyles;
    private applyModalStyles;
    private getCategoryTitle;
    private getCategoryDescription;
    private updateServicesState;
    show(preferences?: ConsentPreferences): void;
    hide(): void;
    private removeModal;
    private animateIn;
    private animateOut;
    private getAnimationClass;
    private updateCheckboxes;
    private onSavePreferences;
    updateConfig(newConfig: Partial<RedactoConfig>): void;
    destroy(): void;
    isModalVisible(): boolean;
}
//# sourceMappingURL=Modal.d.ts.map
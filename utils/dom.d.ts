export declare class DOMUtils {
    static createElement(tag: string, className?: string, id?: string): HTMLElement;
    static createButton(text: string, className?: string, onClick?: () => void): HTMLButtonElement;
    static createDiv(className?: string, content?: string): HTMLDivElement;
    static createSpan(className?: string, content?: string): HTMLSpanElement;
    static createParagraph(className?: string, content?: string): HTMLParagraphElement;
    static createHeading(level: 1 | 2 | 3 | 4 | 5 | 6, className?: string, content?: string): HTMLHeadingElement;
    static createLink(href: string, text: string, className?: string, target?: string): HTMLAnchorElement;
    static createCheckbox(id: string, checked?: boolean, disabled?: boolean): HTMLInputElement;
    static createLabel(forId: string, text: string, className?: string): HTMLLabelElement;
    static addStyles(element: HTMLElement, styles: Record<string, string>): void;
    static addClass(element: HTMLElement, className: string): void;
    static removeClass(element: HTMLElement, className: string): void;
    static toggleClass(element: HTMLElement, className: string): void;
    static hasClass(element: HTMLElement, className: string): boolean;
    static show(element: HTMLElement): void;
    static hide(element: HTMLElement): void;
    static isVisible(element: HTMLElement): boolean;
    static getElementById(id: string): HTMLElement | null;
    static getElementsByClassName(className: string): HTMLCollectionOf<Element>;
    static querySelector(selector: string): Element | null;
    static querySelectorAll(selector: string): NodeListOf<Element>;
    static appendChild(parent: HTMLElement, child: HTMLElement): void;
    static removeChild(parent: HTMLElement, child: HTMLElement): void;
    static insertBefore(parent: HTMLElement, newChild: HTMLElement, referenceChild: HTMLElement): void;
    static replaceChild(parent: HTMLElement, newChild: HTMLElement, oldChild: HTMLElement): void;
    static addEventListener(element: HTMLElement, event: string, handler: EventListener): void;
    static removeEventListener(element: HTMLElement, event: string, handler: EventListener): void;
    static createStyleSheet(css: string): HTMLStyleElement;
    static injectCSS(css: string, id?: string): HTMLStyleElement;
    static removeStyleSheet(id: string): void;
    static getViewportSize(): {
        width: number;
        height: number;
    };
    static isMobile(): boolean;
    static isTablet(): boolean;
    static isDesktop(): boolean;
    static getDeviceType(): "mobile" | "tablet" | "desktop";
    static debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
    static throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
    static escapeHtml(text: string): string;
    static sanitizeHtml(html: string): string;
}
//# sourceMappingURL=dom.d.ts.map
export class Check {
    processSelection({ type, items, event, useCache, isSelectable }: {
        type: any;
        items: any;
        event: any;
        useCache: any;
        isSelectable: any;
    }): {
        ok: boolean;
        auto: boolean;
    };
    button(event: any, useCache: any): {
        ok: boolean;
        auto: boolean;
    };
    card(event: any, useCache: any): {
        ok: boolean;
        auto: boolean;
    };
    target(event: any, useCache: any): {
        ok: boolean;
        auto: boolean;
    };
    skill(event: any): void;
    confirm(event: any, confirm: any): void;
}

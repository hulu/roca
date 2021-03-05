type Hooks = "";
declare module "tap-parser" {
    class TapParser {
        on(method: string, callback: (args?: any) => void): void;
    }
    export = TapParser;
}

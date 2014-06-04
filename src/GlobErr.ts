module GlobErr{

    export interface IInitOptions{

    }

    export interface IErrorEnvArgs{
        language: string;
        documentMode: number;
        browserWidth: number;
        browserHeight: number;
        screenWidth: number;
        screenHeight: number;
        ua: string;
        cookieEnabled: boolean;
        platform: string;
    }

    export interface IErrorArgs{
        type: string;
        occurredOn: Date;
        message: string;
        url: string;
        env: IErrorEnvArgs;
    }

    export interface IErrorOperation{
        raise(args: IErrorArgs): void;
        createArgs(errorType: string): IErrorArgs;
    }

    function isFunc(value: any): boolean{
        return Object.prototype.toString.call(value) === "[object Function]";
    }

    function toArray(args: any): any[]{
        return Array.prototype.slice.call(args);
    }

    function getBrowserSize(): {width: number; height: number} {
        var e = document.documentElement,
            g = document.getElementsByTagName('body')[0],
            x = window.innerWidth || e.clientWidth || g.clientWidth,
            y = window.innerHeight || e.clientHeight || g.clientHeight;
        return { width: x, height: y };
    }

    class ErrOperation implements IErrorOperation{
        constructor(private _callback: (err:IErrorArgs)=> void = () => {}) {}

        raise(args: IErrorArgs): void{
            this._callback(args);
        }

        createArgs(errorType: string = "unknown"): IErrorArgs{
            var browserSize = getBrowserSize();
            return {
                type: errorType,
                occurredOn: new Date(),
                message: "",
                url: location.href,
                env: {
                    language: navigator.language || navigator.userLanguage || navigator.browserLanguage,
                    documentMode: document.documentMode,
                    browserWidth: browserSize.width,
                    browserHeight: browserSize.height,
                    screenWidth: screen.width,
                    screenHeight: screen.height,
                    ua: navigator.userAgent,
                    cookieEnabled: navigator.cookieEnabled,
                    platform: navigator.platform
                }
            };
        }
    }

    var handlers: {[key:string]: (e: IErrorOperation) => void} = {};
    var initialized = false;

    export function init(callback: (err:IErrorArgs)=> void = () => {}, opts: IInitOptions = {}): void {
        if(initialized){
            return;
        }
        var op = new ErrOperation(callback);

        for(var key in handlers){
            if(handlers.hasOwnProperty(key)){
                handlers[key](op);
            }
        }
        initialized = true;
    }

    export function setup(key: string, initializer: (e: IErrorOperation) => void){
        if(initialized){
            return;
        }
        handlers[key] = initializer;
    }

    setup("windowerror", (eo) => {
        window.onerror = () => {
            var args = toArray(arguments),
                errArg = eo.createArgs("Window Error");
            errArg.message = (args[0] || "").toString();
            eo.raise(errArg);

        };
    });
}
type SocketConnectOpts = import("net").SocketConnectOpts;
type AddressInfo = import("net").AddressInfo;
type Direction = import("tty").Direction;

declare module "tap-parser" {
    class TapParser implements NodeJS.WriteStream {
        constructor();
        addListener(event: string, listener: (...args: any[]) => void): this;
        addListener(event: "resize", listener: () => void): this;
        emit(event: string | symbol, ...args: any[]): boolean;
        emit(event: "resize"): boolean;
        on(event: string, listener: (...args: any[]) => void): this;
        on(event: "resize", listener: () => void): this;
        once(event: string, listener: (...args: any[]) => void): this;
        once(event: "resize", listener: () => void): this;
        prependListener(
            event: string,
            listener: (...args: any[]) => void
        ): this;
        prependListener(event: "resize", listener: () => void): this;
        prependOnceListener(
            event: string,
            listener: (...args: any[]) => void
        ): this;
        prependOnceListener(event: "resize", listener: () => void): this;
        clearLine(dir: Direction, callback?: () => void): boolean;
        clearScreenDown(callback?: () => void): boolean;
        cursorTo(x: number, y?: number, callback?: () => void): boolean;
        cursorTo(x: number, callback: () => void): boolean;
        moveCursor(dx: number, dy: number, callback?: () => void): boolean;
        getColorDepth(env?: {}): number;
        hasColors(depth?: number): boolean;
        hasColors(env?: {}): boolean;
        hasColors(depth: number, env?: {}): boolean;
        getWindowSize(): [number, number];
        columns: number;
        rows: number;
        isTTY: boolean;
        write(buffer: string | Uint8Array, cb?: (err?: Error) => void): boolean;
        write(
            str: string | Uint8Array,
            encoding?: BufferEncoding,
            cb?: (err?: Error) => void
        ): boolean;
        connect(
            options: SocketConnectOpts,
            connectionListener?: () => void
        ): this;
        connect(
            port: number,
            host: string,
            connectionListener?: () => void
        ): this;
        connect(port: number, connectionListener?: () => void): this;
        connect(path: string, connectionListener?: () => void): this;
        setEncoding(encoding?: BufferEncoding): this;
        pause(): this;
        resume(): this;
        setTimeout(timeout: number, callback?: () => void): this;
        setNoDelay(noDelay?: boolean): this;
        setKeepAlive(enable?: boolean, initialDelay?: number): this;
        address(): string | AddressInfo;
        unref(): this;
        ref(): this;
        bufferSize: number;
        bytesRead: number;
        bytesWritten: number;
        connecting: boolean;
        destroyed: boolean;
        localAddress: string;
        localPort: number;
        remoteAddress?: string | undefined;
        remoteFamily?: string | undefined;
        remotePort?: number | undefined;
        end(cb?: () => void): void;
        end(buffer: string | Uint8Array, cb?: () => void): void;
        end(
            str: string | Uint8Array,
            encoding?: BufferEncoding,
            cb?: () => void
        ): void;
        writable: boolean;
        writableEnded: boolean;
        writableFinished: boolean;
        writableHighWaterMark: number;
        writableLength: number;
        writableObjectMode: boolean;
        writableCorked: number;
        _write(
            chunk: any,
            encoding: BufferEncoding,
            callback: (error?: Error | null) => void
        ): void;
        _destroy(
            error: Error | null,
            callback: (error: Error | null) => void
        ): void;
        _final(callback: (error?: Error | null) => void): void;
        setDefaultEncoding(encoding: BufferEncoding): this;
        cork(): void;
        uncork(): void;
        readable: boolean;
        readableEncoding:
            | "ascii"
            | "utf8"
            | "utf-8"
            | "utf16le"
            | "ucs2"
            | "ucs-2"
            | "base64"
            | "latin1"
            | "binary"
            | "hex"
            | null;
        readableEnded: boolean;
        readableFlowing: boolean | null;
        readableHighWaterMark: number;
        readableLength: number;
        readableObjectMode: boolean;
        _read(size: number): void;
        read(size?: number): void;
        isPaused(): boolean;
        unpipe(destination?: NodeJS.WritableStream): this;
        unshift(chunk: any, encoding?: BufferEncoding): void;
        wrap(oldStream: NodeJS.ReadableStream): this;
        push(chunk: any, encoding?: BufferEncoding): boolean;
        destroy(error?: Error): void;
        removeListener(event: "close", listener: () => void): this;
        removeListener(event: "data", listener: (chunk: any) => void): this;
        removeListener(event: "end", listener: () => void): this;
        removeListener(event: "error", listener: (err: Error) => void): this;
        removeListener(event: "pause", listener: () => void): this;
        removeListener(event: "readable", listener: () => void): this;
        removeListener(event: "resume", listener: () => void): this;
        removeListener(
            event: string | symbol,
            listener: (...args: any[]) => void
        ): this;
        [Symbol.asyncIterator](): AsyncIterableIterator<any>;
        pipe<T extends NodeJS.WritableStream>(
            destination: T,
            options?: { end?: boolean | undefined }
        ): T;
        off(event: string | symbol, listener: (...args: any[]) => void): this;
        removeAllListeners(event?: string | symbol): this;
        setMaxListeners(n: number): this;
        getMaxListeners(): number;
        listeners(event: string | symbol): Function[];
        rawListeners(event: string | symbol): Function[];
        listenerCount(type: string | symbol): number;
        eventNames(): (string | symbol)[];
        runner: {
            testResults: any;
        };
    }
    export = TapParser;
}

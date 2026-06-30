import "react-native-url-polyfill/auto";
import { randomUUID } from "expo-crypto";

// crypto.randomUUID — not available in older Hermes
if (!Object.hasOwn(global, "crypto")) {
	Object.defineProperty(global, "crypto", {
		configurable: true,
		writable: true,
		value: { randomUUID },
	});
} else if (!Object.hasOwn(global.crypto, "randomUUID")) {
	Object.defineProperty(global.crypto, "randomUUID", {
		configurable: true,
		writable: true,
		value: randomUUID,
	});
}

// AbortSignal.timeout
if (typeof AbortSignal !== "undefined" && !AbortSignal.timeout) {
	AbortSignal.timeout = (ms: number) => {
		const controller = new AbortController();
		setTimeout(() => controller.abort(new Error("TimeoutError")), ms);
		return controller.signal;
	};
}

// AbortSignal.prototype.throwIfAborted — not available in Hermes
if (typeof AbortSignal !== "undefined" && !Object.hasOwn(AbortSignal.prototype, "throwIfAborted")) {
	Object.defineProperty(AbortSignal.prototype, "throwIfAborted", {
		configurable: true,
		writable: true,
		value: function (this: AbortSignal): void {
			if (this.aborted) {
				const reason = this.reason;

				if (!reason) {
					throw reason;
				}

				const err = new Error("signal is aborted without reason");
				err.name = "AbortError";

				throw err;
			}
		},
	});
}

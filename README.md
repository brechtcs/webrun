# WebRun
A custom module loader and global shim for Node to make it compatible with the browser.

The goal is to make code that works in browsers first, but can also run anywhere that Node runs.

You can use `require` to load node modules, but please consider opening an issue for adding a Web API that performs the same function if one exists. This is bound to be buggy

**Warning:** This is still in development. Use at your own risk!

Bug reports welcome!

## Usage:

```bash
# Install the CLI
npm install -g @rangermauve/webrun

# Load a module from the web and log to the console
webrun "https://rangermauve.hashbase.io/example.js"

# Run a local file
webrun ./example.js
```

Then in your JS:

```javascript
import example from "https://rangermauve.hashbase.io/esm.js";
import p2pexample from "dat://rangermauve.hashbase.io/esm.js";

example();
p2pexample();
```

You can start a REPL using:

```
webrun
```

Please note that because of a [pending Node.js bug](https://github.com/nodejs/node/pull/22381) the REPL can't use `import` yet.

## Help it's not working!

- Delete the `.webrun` folder in the current directory. This will clear the cache
- If that doesn't work, raise an issue.

## How it works:

The new experimental-modules feature in Node.js is great, but it currently only works with `file:` URLs.

This means that modules made for the web are totally incompatible with Node. As a result, there's now four environments to code against: The legacy web with script tags, the web with ESM, Legacy CommonJS modules, and ESM in Node.js.

Luckily, node's [vm](https://nodejs.org/api/vm.html#vm_module_link_linker) builtin module now has support for custom ESM loaders. This means that we can now create a context that's separated from Node's globals and use anything we want for loading the contents of modules.

That's exactly how this works. It intercepts calls to `https://` imports, downloads the content to the `./.webrun/web-cache` folder, and loads it with the VM module.

Some browser APIs have been added to the global scope so hopefully a lot of modules made for browsers should work here, too. Feel free to open an issue to add your favorite missing browser API.

In addition to loading content from `https://` URLs, this loader also supports `dat://` URLs. This way you can download code right from the peer to peer web!

You can still load Node modules by using `require`, but this should only be done for APIs that you absolutely can't get on the web because otherwise your code won't be portable.

PRs for additional protocols are welcome! All you need is an async function that takes a URL, and returns the file content string.

## Progress:

- [x] Able to load from the filesystem
- [x] Able to load HTTPS URLs
- [x] Able to load Dat URLs
- [ ] [Browser APIs](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)
	- [x] console.*
	- [x] timers
	- [x] [atob and btoa](https://www.npmjs.com/package/abab)
	- [x] [fetch](https://www.npmjs.com/package/node-fetch)
	- [x] [websocket](https://www.npmjs.com/package/ws)
	- [x] [localStorage](https://www.npmjs.com/package/node-localstorage) (Persists to `./.webrun/localstorage`)
	- [ ] [indexDB](https://www.npmjs.com/package/fake-indexeddb) (Doesn't persist, removed)
	- [x] crypto.randomBytes() using node's crypto module.
	- [ ] [SubtleCrypto](https://github.com/PeculiarVentures/node-webcrypto-p11) (or with [this](https://github.com/PeculiarVentures/node-webcrypto-ossl))
	- [x] [TextEncoder / TextDecoder](https://github.com/modulesio/text-encoder)
	- [ ] WebRTC
	- [ ] Cache Storage
	- [ ] [self.navigator](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/navigator)
	- [ ] [self.location](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/location)
	- [x] [WindowEventHandlers](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers)
	- [x] [self.close()](https://developer.mozilla.org/en-US/docs/Web/API/Window/close)
	- [x] self.postMessage / self.onmessage
	- [x] [EventTarget](https://github.com/WebReflection/event-target)
	- [ ] [libdweb APIs](https://github.com/mozilla/libdweb)
- [x] Dat protocol support
	- [x] Load from Dat URLs
	- [x] DatArchive global
	- [ ] Experimental Beaker APIs (does it make sense?)
		- [ ] DatPeers [Issue](https://github.com/beakerbrowser/dat-node/issues/3)
		- [ ] Library
- [ ] IPFS
	- [ ] Load from IPFS / IPNS URLs
	- [ ] ipfs global
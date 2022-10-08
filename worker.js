// importScripts("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js");
// xhr-shim to allow XMLHttpRequest in service worker
// importScripts("https://cdn.jsdelivr.net/npm/xhr-shim@0.1.3/src/index.min.js");

// Uncomment the importScripts calls below to use local versions.
// Pyodide's npm package doesn't have everything we need.
// To get a local version run:
//   wget https://github.com/pyodide/pyodide/releases/download/0.21.3/pyodide-build-0.21.3.tar.bz2
//   tar -xzvf pyodide-build-0.21.3.tar.bz2
//   rm pyodide-build-0.21.3.tar.bz2
importScripts("./pyodide/pyodide.js");
importScripts("./node_modules/xhr-shim/src/index.js");

self.XMLHttpRequest = self.XMLHttpRequestShim;

let pyodide, loaded;
const cookies = {};

const setupPython = async () => {
  pyodide = await loadPyodide();
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("tzdata");
  await micropip.install("/wheel/django_webassembly-0.1.0-py3-none-any.whl");
  pyodide.runPython(await (await fetch("/init.py")).text());
  loaded = true;
};

self.addEventListener("install", event => {
  event.waitUntil(setupPython());
});

const djangoRequest = async request => {
  let cookie = "";
  for (const key in cookies) {
    const val = `${key}=${cookies[key]}`;
    cookie += cookie ? `; ${val}` : val;
  }
  const reqHeaders = {
    ...request.headers,
    Cookie: cookie,
  };
  console.log(reqHeaders);

  const method = request.method.toLowerCase();
  let params = "";
  if (method === "post") {
    params = await request.text();
  }

  const response = pyodide.runPython(`
      response = app.${method}(
          "${request.url}",
          params="${params}",
          headers=${JSON.stringify(reqHeaders)},
          expect_errors=True,
      )
      try:
          body = response.text
      except UnicodeDecodeError:
          body = response.body
      body`
  );
  const headersPy = pyodide.runPython(`
      import json
      json.dumps(dict(response.headers))`);
  const respHeaders = JSON.parse(headersPy);
  const setCookie = respHeaders["Set-Cookie"];
  if (setCookie) {
    // only setting first one right now
    const nameValue = setCookie.split(";")[0].split("=");
    cookies[nameValue[0].trim()] = nameValue[1];
  }
  if (respHeaders["Content-Type"] === "application/octet-stream" && request.url.endsWith(".woff")) {
    respHeaders["Content-Type"] = "application/font-woff";
  }
  const status = pyodide.runPython("response.status_code");

  return new Response(response, {headers: respHeaders, status: status});
};

self.addEventListener("fetch", event => {
  if (!loaded) {
    event.respondWith(
      Promise.reject("Python code isn't set up yet, try again in a bit"),
    );
  } else {
    event.respondWith(djangoRequest(event.request));
  }
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

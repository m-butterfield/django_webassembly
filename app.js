const main = async () => {
  const pyodide = await loadPyodide(); // eslint-disable-line no-undef
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("/wheel/django_webassembly-0.1.0-py3-none-any.whl");
  pyodide.runPython(await (await fetch("/init.py")).text());
  pyodide.runPython(`
    from django.test import Client
    c = Client()`);

  window.fetch = async (path, _params) => {
    const code = `
      response = c.get("${path}")
      response.content.decode()`;
    const response = pyodide.runPython(code);

    return new Response(response);
  };

  fetchPolls().catch((e) => {
    alert(`Error: ${e}`);
  });
};

main().catch((e) => {
  alert(`Error: ${e}`);
});

const fetchPolls = async () => {
  const response = await fetch("/polls/");
  document.getElementById("content").innerHTML = await response.text();
};

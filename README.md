# Django Webassembly

Running Django in the browser.

*tested and working on desktop Google Chrome*

<a href="https://django-webassembly.mattbutterfield.com">Live example hosted directly from this repo on Github Pages.</a>

### What is happening?

With webassembly, it is possible to run Python code in the browser using [Pyodide](https://pyodide.org/).
With [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), we are able to intercept all http requests made by the browser, modify them, pass them through without doing anything, or create and return a new response of our own without ever actually calling out to the internet.
Putting these concepts together, and heavily inspired by a similar approach with [wordpress](https://make.wordpress.org/core/2022/09/23/client-side-webassembly-wordpress-with-no-server/) recently,  I was able to get a very basic Django application and the Django admin running entirely in the browser.

### What does this mean?

It means you can host a Django application using only static files, like the example linked above using Github Pages.
Of course, there's no shared database, just a local SQLite db that lives in your browser.
Perhaps that could also be staticly hosted and shared somewhere 🤷‍♂️.
A more immediate practical use could be to make a Django app work offline, sending updates back to the server when the connection is restored.

### How does this work?

This repo contains the `django_webassembly` app.
This can can be run like any other django app (`python manage.py runserver`), or you can simply host the static files.
The easiest way to do this is to run `python -m http.server` and open [http://localhost:8000](http://localhost:8000).
When running this way, the app is loaded and installed as a [wheel](https://packaging.python.org/en/latest/glossary/#term-Wheel), so you have to rebuild the wheel if you want to see your changes.
You can do that by running `make wheel`.
The service worker also needs to be reloaded.

The details of how this works can be seen in `app.js`, which loads the service worker, and `worker.js` which contains the service worker code.
The service worker loads Pyodide, installs Python dependencies and the django_webassembly app, then runs some setup code in `init.py`.
When this is done, the page reloads and all further requests are intercepted by the service worker.
Each request is turned into Python code that calls an app client for django_webassembly, and the return value is converted back into a Javascript response that is returned to the browser.

### What happens now?

I've always liked the idea of running Python in the browser, and I really just did this as a proof of concept out of curiousity.
It's pretty finicky to use and develop so far, and I haven't done much testing or tried to run anything complicated.
Navigating to links doesn't seem to work on my phone or in Safari, so browser support is questionable.
That being said, I think there are some interesting experiments that can come out of this.
I'm also interested in trying to run other languages in the browser.
How about a Go webserver in the browser? 🤔

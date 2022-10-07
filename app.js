if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/worker.js").then((registration) => {
    console.log("Service worker registration succeeded:", registration);
    registration.installing?.addEventListener('statechange', (event) => {
      if (event.target.state === "activated") {
        location.reload();
      }
    });
  }, (error) => {
    alert(`Service worker registration failed: ${error}`);
  });
} else {
  alert("Service workers are not supported in this browser.");
}

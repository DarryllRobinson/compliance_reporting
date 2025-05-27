export const loadGoogleMapsApi = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve();
      return;
    }

    const scriptId = "google-maps-script";
    if (document.getElementById(scriptId)) {
      document.getElementById(scriptId).addEventListener("load", resolve);
      return;
    }

    console.log(
      "process.env.REACT_APP_GOOGLE_API_KEY:",
      process.env.REACT_APP_GOOGLE_API_KEY
    );

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

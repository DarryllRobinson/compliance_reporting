import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import "./GoogleAddressStyling.css";

const stateNameToCode = {
  "Australian Capital Territory": "ACT",
  "Northern Territory": "NT",
  "New South Wales": "NSW",
  Queensland: "QLD",
  "South Australia": "SA",
  Tasmania: "TAS",
  Victoria: "VIC",
  "Western Australia": "WA",
};
const getStateCode = (name) => stateNameToCode[name] || "";

let googleMapsApiPromise = null;
function loadGoogleMapsApi() {
  if (googleMapsApiPromise) {
    return googleMapsApiPromise;
  }

  googleMapsApiPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is undefined"));
      return;
    }
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve(window.google);
      return;
    }

    const existingScript = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve(window.google);
        } else {
          reject(
            new Error(
              "Google Maps API loaded but places library is not available"
            )
          );
        }
      });
      existingScript.addEventListener("error", (error) => {
        reject(error);
      });
      return;
    }

    const script = document.createElement("script");
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY || "";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve(window.google);
      } else {
        reject(
          new Error(
            "Google Maps API loaded but places library is not available"
          )
        );
      }
    };
    script.onerror = (error) => {
      reject(error);
    };

    document.head.appendChild(script);
  });

  return googleMapsApiPromise;
}

export default function GoogleAddressAutocomplete() {
  const { setValue } = useFormContext();
  const containerRef = useRef(null);
  const placeAutocompleteRef = useRef(null);

  useEffect(() => {
    let placeAutocomplete;
    const container = containerRef.current;
    let scriptElement = null;

    loadGoogleMapsApi()
      .then(() => {
        if (typeof window !== "undefined" && window.google && container) {
          if (!placeAutocompleteRef.current) {
            placeAutocomplete =
              new window.google.maps.places.PlaceAutocompleteElement();
            container.appendChild(placeAutocomplete);
            placeAutocompleteRef.current = placeAutocomplete;

            placeAutocomplete.addEventListener(
              "gmp-select",
              async ({ placePrediction }) => {
                const place = placePrediction.toPlace();
                await place.fetchFields({
                  fields: [
                    "displayName",
                    "formattedAddress",
                    "addressComponents",
                  ],
                });
                const placeData = place.toJSON();

                // Update form fields
                setValue("googleAddress", placeData.formattedAddress || "");
                const components = placeData.addressComponents || [];
                const get = (type) =>
                  components.find((c) => c.types.includes(type))?.longText ||
                  "";
                const getShort = (type) =>
                  components.find((c) => c.types.includes(type))?.shortText ||
                  "";

                const streetNumber = get("street_number");
                const route = get("route");
                let addressline1 = "";
                if (streetNumber && route) {
                  addressline1 = `${streetNumber} ${route}`;
                } else if (route) {
                  addressline1 = route;
                } else if (streetNumber) {
                  addressline1 = streetNumber;
                }
                setValue("addressline1", addressline1);

                const subpremise = get("subpremise");
                setValue("addressline2", subpremise);

                const premise = get("premise");
                const floor = get("floor");
                let addressline3 = "";
                if (floor && premise) {
                  addressline3 = `${floor}, ${premise}`;
                } else if (premise) {
                  addressline3 = premise;
                } else if (floor) {
                  addressline3 = floor;
                }
                setValue("addressline3", addressline3);

                setValue("city", get("locality"));
                const stateName = get("administrative_area_level_1");
                const stateCode =
                  getStateCode(stateName) ||
                  getShort("administrative_area_level_1");
                setValue("state", stateCode);
                setValue("postcode", get("postal_code"));
                setValue("country", get("country"));
              }
            );
          }
        }
      })
      .catch((error) => {
        console.error("Failed to load Google Maps API:", error);
      });

    // Cleanup function to remove script if needed
    return () => {
      const script = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );
      if (script) {
        script.remove();
        googleMapsApiPromise = null;
      }
      if (placeAutocompleteRef.current && container) {
        container.removeChild(placeAutocompleteRef.current);
        placeAutocompleteRef.current = null;
      }
    };
  }, [setValue]);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="autocomplete-container">Address Lookup</label>
      <div
        id="autocomplete-container"
        className="widget-container"
        ref={containerRef}
        // Remove inline styles in favor of CSS class
      />
    </div>
  );
}

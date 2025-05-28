import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { loadGoogleMapsApi } from "../../lib/utils";
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

export default function GoogleAddressAutocomplete() {
  const { setValue } = useFormContext();
  const containerRef = useRef(null);

  useEffect(() => {
    let placeAutocomplete;
    const container = containerRef.current;

    loadGoogleMapsApi().then(() => {
      if (typeof window !== "undefined" && window.google) {
        placeAutocomplete =
          new window.google.maps.places.PlaceAutocompleteElement();

        if (container) {
          container.appendChild(placeAutocomplete);

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
                components.find((c) => c.types.includes(type))?.longText || "";
              const getShort = (type) =>
                components.find((c) => c.types.includes(type))?.shortText || "";

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
    });

    return () => {
      if (container && placeAutocomplete) {
        container.removeChild(placeAutocomplete);
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

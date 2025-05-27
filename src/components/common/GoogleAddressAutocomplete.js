import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTheme } from "@mui/material";

export default function GoogleAddressAutocomplete() {
  const { setValue } = useFormContext();

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn("Google Maps API not loaded.");
      return;
    }

    const placeAutocomplete =
      new window.google.maps.places.PlaceAutocompleteElement();

    // Restrict to Australia
    placeAutocomplete.componentRestrictions = { country: ["au"] };

    const container = document.getElementById("autocomplete-container");

    if (container) {
      container.appendChild(placeAutocomplete);

      placeAutocomplete.addEventListener(
        "gmp-select",
        async ({ placePrediction }) => {
          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ["displayName", "formattedAddress", "addressComponents"],
          });
          const placeData = place.toJSON();

          // State name to code mapping helper
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

          // Update form fields
          setValue("googleAddress", placeData.formattedAddress || "");
          const components = placeData.addressComponents || [];
          const get = (type) =>
            components.find((c) => c.types.includes(type))?.longText || "";
          const getShort = (type) =>
            components.find((c) => c.types.includes(type))?.shortText || "";

          // Compose address lines from components
          // addressline1: street number + route
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

          // addressline2: subpremise (unit, apartment, etc.)
          const subpremise = get("subpremise");
          setValue("addressline2", subpremise);

          // addressline3: any "premise" or "floor"
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
            getStateCode(stateName) || getShort("administrative_area_level_1");
          setValue("state", stateCode);
          setValue("postcode", get("postal_code"));
          setValue("country", get("country"));
        }
      );
    }

    return () => {
      if (container && placeAutocomplete) {
        container.removeChild(placeAutocomplete);
      }
    };
  }, [setValue]);

  const theme = useTheme();

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="autocomplete-container">Address Lookup</label>
      <div
        id="autocomplete-container"
        style={{
          width: "100%",
          border: `1px solid ${theme.palette.text.primary}`, // Matches TextField border color
          borderRadius: theme.shape.borderRadius,
          padding: "16.5px 14px", // Matches TextField input padding
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body1.fontSize,
        }}
      />
    </div>
  );
}

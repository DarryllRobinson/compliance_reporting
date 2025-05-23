import { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function AddressAutocomplete() {
  const inputRef = useRef(null);
  const {
    setValue,
    register,
    formState: { errors },
  } = useFormContext();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!window.google || !window.google.maps?.places) {
      console.warn(
        "Google Places API not available. Falling back to manual entry."
      );
      setFallback(true);
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["address"], componentRestrictions: { country: "au" } }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const components = place.address_components;

      const get = (type) =>
        components.find((c) => c.types.includes(type))?.long_name || "";

      setValue(
        "addressline1",
        `${get("street_number")} ${get("route")}`.trim()
      );
      setValue("city", get("locality"));
      setValue("state", get("administrative_area_level_1"));
      setValue("postcode", get("postal_code"));
      setValue("country", get("country"));
    });
  }, [setValue]);

  return fallback ? (
    <TextField
      label="Address Line 1"
      fullWidth
      {...register("addressline1")}
      error={!!errors.addressline1}
      helperText={errors.addressline1?.message}
    />
  ) : (
    <TextField
      label="Address Line 1"
      inputRef={inputRef}
      fullWidth
      {...register("addressline1")}
      error={!!errors.addressline1}
      helperText={errors.addressline1?.message}
    />
  );
}

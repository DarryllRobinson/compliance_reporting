import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import { publicService } from "../../services/public.services";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { bookingService } from "../../services/booking.service";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Booking = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [booked, setBooked] = useState({});
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .min(5, "Please provide at least five characters")
      .required("Name is required"),
    email: yup
      .string()
      .trim()
      .email("Please enter a valid email address")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
    reason: yup
      .string()
      .trim()
      .min(10, "Please provide at least 10 characters")
      .max(1000, "Message is too long (max 1000 characters)")
      .required("Reason is required"),
    date: yup
      .string()
      .required("Please select a slot above")
      .test(
        "valid-date",
        "Please select a valid date",
        (val) => !!val && /^\d{4}-\d{2}-\d{2}$/.test(val)
      ),
    time: yup
      .string()
      .required("Please select a time")
      .test(
        "valid-time",
        "Please select a valid time",
        (val) => !!val && /^(0[9]|1[0-1]|0[1-3]):00 (AM|PM)$/.test(val)
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      reason: "",
      date: "",
      time: "",
    },
  });

  const watchDate = watch("date");
  const watchTime = watch("time");

  const timeslots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
  ];

  const days = Array.from({ length: 10 }, (_, i) =>
    addDays(new Date(), i)
  ).filter((day) => day.getDay() !== 0 && day.getDay() !== 6);

  const scrollRef = useRef();

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 2 - 400;
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -160 : 160,
        behavior: "smooth",
      });
    }
  };

  const loadBookings = async () => {
    try {
      const data = await bookingService.getAll();
      const map = {};
      data.forEach((b) => {
        if (!map[b.date]) map[b.date] = [];
        map[b.date].push(b.time);
      });
      setBooked(map);
      // Remove pre-selection of date and time here:
      // const todayBookings = map[todayStr] || [];
      // const firstAvailable = timeslots.find(
      //   (slot) => !todayBookings.includes(slot)
      // );
      // if (firstAvailable) {
      //   setValue("date", todayStr);
      //   setValue("time", firstAvailable);
      // }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await bookingService.create(data);
      await publicService.sendEmail({
        to: data.email,
        bcc: "darryllrobinson@icloud.com",
        subject: "Booking Confirmation",
        message: `Hi ${data.name},\n\nYour booking for ${data.date} at ${data.time} has been confirmed.\n\nThank you,\nMonochrome Team`,
        from: "darryllrobinson@icloud.com",
      });
      await publicService.sendEmail({
        to: "darryllrobinson@icloud.com",
        subject: "New Booking Submitted",
        message: `New booking from ${data.name} (${data.email}) for ${data.date} at ${data.time}.\n\nReason: ${data.reason}`,
        from: "darryllrobinson@icloud.com",
      });
      await loadBookings();
      setSuccess("Booking submitted successfully.");
      navigate("/thankyou-booking");
    } catch (err) {
      setError("There was an error submitting your booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h5" gutterBottom>
        Book an Appointment
      </Typography>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Select a Time Slot
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pb: 2,
        }}
      >
        <IconButton onClick={() => scroll("left")}>
          <ArrowBackIosIcon />
        </IconButton>
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
            flexWrap: "nowrap",
            minWidth: 800,
            mx: "auto",
          }}
        >
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            return (
              <Box
                key={dateStr}
                sx={{
                  width: 160,
                  flex: "0 0 auto",
                  border:
                    dateStr === todayStr
                      ? `2px solid ${theme.palette.primary.main}`
                      : undefined,
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                  {dateStr === todayStr ? "Today" : format(day, "EEE dd MMM")}
                </Typography>
                {timeslots.map((slot) => {
                  const isPastSlot =
                    dateStr === todayStr &&
                    new Date(`${dateStr} ${slot}`) < new Date();
                  if (isPastSlot) return null;
                  const isUnavailable = booked[dateStr]?.includes(slot);
                  const isSelected =
                    dateStr === (watchDate || todayStr) &&
                    slot === (watchTime || "");
                  return (
                    <Button
                      key={slot}
                      fullWidth
                      variant={isSelected ? "contained" : "outlined"}
                      disabled={isUnavailable}
                      sx={{
                        my: 0.5,
                        ...(isUnavailable && {
                          color: theme.palette.secondary.contrastText,
                          backgroundColor: theme.palette.secondary.main,
                        }),
                      }}
                      onClick={() => {
                        setValue("date", dateStr);
                        setValue("time", slot);
                      }}
                    >
                      {slot}
                    </Button>
                  );
                })}
              </Box>
            );
          })}
        </Box>
        <IconButton onClick={() => scroll("right")}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Fade in={!!success}>
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      </Fade>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        fullWidth
        margin="normal"
        label="Full Name"
        name="name"
        required
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        required
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
      />
      {/* Selected Date & Time display with button and validation message */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <TextField
            label="Selected Date & Time"
            value={
              watchDate && watchTime
                ? `${watchDate} at ${watchTime}`
                : "No slot selected"
            }
            disabled
            fullWidth
            sx={{ flex: 1 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                height: 48,
                minWidth: 110,
                fontWeight: "bold",
                boxShadow: 2,
                ml: 1,
              }}
              onClick={() => {
                // Find the first available slot from today onwards
                for (const day of days) {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const bookedSlots = booked[dateStr] || [];
                  const firstAvailable = timeslots.find(
                    (slot) => !bookedSlots.includes(slot)
                  );
                  if (firstAvailable) {
                    setValue("date", dateStr);
                    setValue("time", firstAvailable);
                    break;
                  }
                }
              }}
            >
              Earliest
            </Button>
          </Box>
        </Box>
        {(errors.date || errors.time) && (
          <Typography
            variant="caption"
            color="error"
            sx={{ pl: 1, mt: "-20px" }}
          >
            {errors.date?.message || errors.time?.message}
          </Typography>
        )}
      </Box>
      <TextField
        fullWidth
        required
        margin="normal"
        label="Reason"
        name="reason"
        multiline
        rows={3}
        {...register("reason")}
        error={!!errors.reason}
        helperText={errors.reason?.message}
        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Booking"}
      </Button>
    </Box>
  );
};

export default Booking;

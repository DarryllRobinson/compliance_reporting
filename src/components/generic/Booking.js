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
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const [form, setForm] = useState({
    name: "John Doe",
    email: "darryll@stillproud.com",
    date: todayStr,
    time: "10:00 AM",
    reason: "Test appointment booking",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [booked, setBooked] = useState({});

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
      const todayBookings = map[todayStr] || [];
      const firstAvailable = timeslots.find(
        (slot) => !todayBookings.includes(slot)
      );
      if (firstAvailable) {
        setForm((f) => ({ ...f, date: todayStr, time: firstAvailable }));
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.date || !form.time) {
      setError("Please select an available time slot.");
      return;
    }
    try {
      setError("");
      setSuccess("");
      const payload = {
        ...form,
      };
      await bookingService.create(payload);
      // Send confirmation email to user and cc internal address
      await publicService.sendEmail({
        to: form.email,
        bcc: "darryllrobinson@icloud.com",
        // cc: "team@monochrome.au",
        subject: "Booking Confirmation",
        message: `Hi ${form.name},\n\nYour booking for ${form.date} at ${form.time} has been confirmed.\n\nThank you,\nMonochrome Team`,
        from: "darryllrobinson@icloud.com",
      });
      // Send internal notification
      await publicService.sendEmail({
        to: "darryllrobinson@icloud.com",
        subject: "New Booking Submitted",
        message: `New booking from ${form.name} (${form.email}) for ${form.date} at ${form.time}.\n\nReason: ${form.reason}`,
        from: "darryllrobinson@icloud.com",
      });
      await loadBookings();
      setSuccess("Booking submitted successfully.");
      setForm({ name: "", email: "", date: "", time: "", reason: "" });
      navigate("/thankyou-booking");
    } catch (err) {
      setError("There was an error submitting your booking.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
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
                    form.date === dateStr && form.time === slot;
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
                      onClick={() =>
                        setForm((f) => ({ ...f, date: dateStr, time: slot }))
                      }
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
        value={form.name}
        onChange={handleChange}
        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        required
        value={form.email}
        onChange={handleChange}
        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
      />
      <TextField
        fullWidth
        required
        margin="normal"
        label="Reason"
        name="reason"
        value={form.reason}
        onChange={handleChange}
        multiline
        rows={3}
        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Submit Booking
      </Button>
    </Box>
  );
};

export default Booking;

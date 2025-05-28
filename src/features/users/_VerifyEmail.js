import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { userService } from "../../services";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { publicService } from "../../services";
import { Grid, TextField } from "@mui/material";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const EmailStatus = {
    Verifying: "Verifying",
    Failed: "Failed",
    Valid: "Valid",
  };

  const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      console.error("Token not found in URL");
      setEmailStatus(EmailStatus.Failed);
      return;
    }

    userService
      .verifyEmail(token)
      .then(async (user) => {
        // Send welcome email
        const userData = {
          topic: "User Created",
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          subject: "User Created",
          company: user.clientId,
          message: "",
          to: user.email,
          from: "contact@monochrome-compliance.com",
        };
        await publicService.sendSesEmail(userData);
        setEmailStatus(EmailStatus.Valid);
      })
      .catch((error) => {
        console.error("Token validation failed:", error);
        setEmailStatus(EmailStatus.Failed);
      });
  }, [EmailStatus.Failed, EmailStatus.Valid, token]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(
      Yup.object({
        password: Yup.string()
          .min(8, "Must be at least 10 characters")
          .matches(/[A-Z]/, "Must include an uppercase letter")
          .matches(/[a-z]/, "Must include a lowercase letter")
          .matches(/[0-9]/, "Must include a number")
          .matches(/[@$!%*?&#]/, "Must include a special character")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Please confirm your password"),
      })
    ),
  });

  const onSubmit = async (values) => {
    try {
      await userService.setPassword({ token, ...values });
      navigate("/user/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  function getBody() {
    switch (emailStatus) {
      case EmailStatus.Verifying:
        return <div>Verifying...</div>;
      case EmailStatus.Failed:
        return (
          <div>
            Verification failed. You can also verify your account using the{" "}
            <Link to="/user/forgot-password">forgot password</Link> page.
          </div>
        );
      case EmailStatus.Valid:
        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Grid item xs={6}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  required
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message:
                        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  required
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords must match",
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Grid>
            </div>
            <button type="submit" disabled={isSubmitting}>
              Set Password
            </button>
          </form>
        );
      default:
        return <div>Something went wrong. Please try again later.</div>;
    }
  }

  return (
    <div>
      <h3 className="card-header">Verify Email</h3>
      <div className="card-body">{getBody()}</div>
    </div>
  );
}

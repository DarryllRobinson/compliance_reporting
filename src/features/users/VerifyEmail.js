import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { userService } from "./user.service";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const EmailStatus = {
    Verifying: "Verifying",
    Failed: "Failed",
  };

  const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      console.error("Token not found in URL");
      setEmailStatus(EmailStatus.Failed);
      return;
    }

    userService
      .verifyEmail(token)
      .then(() => {
        console.log("Verification successful!");
        navigate("/user/signin", { replace: true });
      })
      .catch((error) => {
        console.error("Verification failed:", error);
        setEmailStatus(EmailStatus.Failed);
      });
  }, [EmailStatus.Failed, navigate, searchParams]);

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

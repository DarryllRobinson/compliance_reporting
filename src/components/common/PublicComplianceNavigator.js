import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Radio,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  LinearProgress,
  TextField,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { entityService, userService } from "../../services";
import { Alert } from "@mui/material";
import { handlePdf } from "../../utils/pdfUtils";
import { sendSummaryByEmail } from "../../utils/emailUtils";

// Yup validation schema for Entity Details
const entitySchema = yup.object().shape({
  entityName: yup
    .string()
    .trim()
    .min(5, "Please provide at least five characters")
    .required("Entity name is required"),
  entityABN: yup
    .string()
    .matches(/^\d{11}$/, {
      message: "ABN must be exactly 11 digits",
      excludeEmptyString: true,
    })
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

// Yup validation schema for Contact Details
const contactSchema = yup.object().shape({
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
  companyName: yup
    .string()
    .trim()
    .min(5, "Please provide at least five characters")
    .required("Company name is required"),
  position: yup
    .string()
    .trim()
    .min(5, "Please provide at least five characters")
    .required("Your position is required"),
});

const steps = [
  "Entity Details",
  "Start at Highest-Level Entity",
  "Confirm Reporting Requirement",
  "Constitutionally Covered Entity",
  "Charity Status",
  "Connection to Australia",
  "Revenue Threshold",
  "Controlled by Reporting Entity",
  "Summary",
  "Contact Details", // Added Contact Details as the final step
];

const flowQuestions = [
  {
    key: "entityDetails",
    question: "Please enter the entity details",
    type: "form",
    fields: [
      { name: "entityName", label: "Entity Name", required: true },
      { name: "entityABN", label: "ABN (optional)", required: false },
    ],
    help: "These details will be used to track submissions and ensure audit compliance.",
  },
  {
    key: "startEntity",
    question: "Are you starting with the highest-level entity in the group?",
    options: ["Yes", "No"],
    help: "Begin with the parent/holding entity, then assess others if needed.",
  },
  {
    key: "section7",
    question:
      "Has this entity been assessed under Section 7 of the Payment Times Reporting Act 2020?",
    options: ["Yes", "No"],
    help: "Only entities meeting the criteria in Section 7 are required to report.",
  },
  {
    key: "cce",
    question: "Is the entity a Constitutionally Covered Entity (CCE)?",
    options: ["Yes", "No"],
    help: "CCE includes trading, financial, and foreign corporations.",
  },
  {
    key: "charity",
    question: "Is the entity a registered charity?",
    options: ["Yes", "No"],
    help: "Charities are excluded from PTRS reporting. See Section 6(1)(e) of the Payment Times Reporting Act 2020.",
  },
  {
    key: "connectionToAustralia",
    question: "Does the entity have a connection to Australia?",
    type: "checkbox",
    subOptions: [
      "Incorporated in Australia",
      "Carries on business in Australia",
      "Central management and control in Australia",
      "Majority voting power controlled by Australian shareholders",
      "All of the above",
      "None of the above",
    ],
    help: "Tick any that apply — only one is required. If none apply, select 'None of the above'.",
  },
  {
    key: "revenue",
    question:
      "Did the entity have consolidated revenue of more than A$100 million in the last financial year?",
    options: ["Yes", "No"],
    help: "Entities below this threshold are excluded.",
  },
  {
    key: "controlled",
    question:
      "Is the entity controlled by another entity that is a reporting entity?",
    options: ["Yes", "No"],
    help: "Controlled entities are included in the parent entity's report.",
  },
  {
    key: "contactDetails",
    question: "Please provide your contact details",
    type: "form",
    fields: [
      { name: "name", label: "Your Name", required: true },
      { name: "email", label: "Your Email", required: true },
      { name: "companyName", label: "Company Name", required: true },
      { name: "position", label: "Your Position", required: true },
    ],
    help: "We'll use these details to send you a summary and follow up if needed.",
  },
];

export default function PublicComplianceNavigator() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if the form has been submitted
  const [loading, setLoading] = useState(false); // Track loading state for Submit button
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  // Auto-clear alert after 4 seconds
  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  // React-hook-form for Contact Details step
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetContactForm,
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      position: "",
    },
  });

  // React-hook-form for Entity Details step
  const {
    control: entityControl,
    handleSubmit: handleEntitySubmit,
    formState: { errors: entityErrors },
  } = useForm({
    resolver: yupResolver(entitySchema),
    defaultValues: {
      entityName: "",
      entityABN: "",
    },
  });

  const current = flowQuestions[activeStep] || {}; // Safeguard to ensure current is always defined

  // Submission handler for Contact Details with form validation
  const confirmSubmission = async (contactData) => {
    // Defensive trim of contact input before processing
    contactData.name = contactData.name.trim();
    contactData.email = contactData.email.trim();
    contactData.companyName = contactData.companyName.trim();
    contactData.position = contactData.position.trim();
    setLoading(true);
    try {
      // Structure the data for saving to the backend
      const dataToSave = {
        entityName: answers.entityDetails?.entityName || "",
        entityABN: answers.entityDetails?.entityABN || "",
        startEntity: answers.startEntity || "",
        section7: answers.section7 || "",
        cce: answers.cce || "",
        charity: answers.charity || "",
        connectionToAustralia: Array.isArray(answers.connectionToAustralia)
          ? answers.connectionToAustralia.join(", ")
          : answers.connectionToAustralia || "",
        revenue: answers.revenue || "",
        controlled: answers.controlled || "",
        contactDetails: contactData || {},
        completed: true,
        timestamp: new Date().toISOString(),
      };

      // Create the record in the backend
      const response = await entityService.create(dataToSave);
      const recordId = response.id;

      // Generate the PDF with the recordId
      const pdfBlob = await handlePdf(recordId, answers, flowQuestions);

      // Send the PDF via email
      await sendSummaryByEmail({
        pdfBlob,
        recordId,
        contactData,
        answers,
        entityService,
        setAlert,
      });
      setAlert({
        type: "success",
        message: "Email sent successfully! Please check your inbox.",
      });
      setTimeout(() => setAlert(null), 4000);

      // Navigate to the solution page
      navigate("/ptr-solution");
    } catch (error) {
      console.error("Failed to complete submission", error);
      setAlert({
        type: "error",
        message: "Failed to complete submission. Please try again.",
      });
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  const handleNext = async (contactFormData) => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else if (activeStep === steps.length - 1) {
      // Only submit via react-hook-form handler for Contact Details step
      if (contactFormData) {
        // Save to answers state for consistency
        setAnswers((prev) => ({
          ...prev,
          contactDetails: contactFormData,
        }));
        await confirmSubmission(contactFormData);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (key) => (e) => {
    const { name, value } = e.target;

    // Prevent non-numeric input for the entityABN field
    if (
      key === "entityDetails" &&
      name === "entityABN" &&
      !/^[0-9]*$/.test(value)
    ) {
      return;
    }

    setAnswers({
      ...answers,
      [key]: { ...answers[key], [name]: value },
    });
  };

  const isStepValid = (stepIndex) => {
    const q = flowQuestions[stepIndex];
    if (!q) return true; // Skip validation for steps like "Summary" that have no corresponding question
    const val = answers[q.key];
    if (q.type === "form") {
      return q.fields.every(
        (field) =>
          !field.required ||
          (val && val[field.name] && val[field.name].trim() !== "")
      );
    }
    return val && (Array.isArray(val) ? val.length > 0 : true);
  };

  const handleStepClick = (step) => {
    if (
      step <= activeStep ||
      flowQuestions.slice(0, step).every((_, i) => isStepValid(i))
    ) {
      setActiveStep(step);
    }
  };

  const handleRadioChange = (key) => (e) =>
    setAnswers({ ...answers, [key]: e.target.value });

  const handleCheckboxChange = (key, value) => (e) => {
    const allOptions = [
      "Incorporated in Australia",
      "Carries on business in Australia",
      "Central management and control in Australia",
      "Majority voting power controlled by Australian shareholders",
      "All of the above",
      "None of the above",
    ];

    const individualOptions = allOptions.filter(
      (opt) => opt !== "All of the above" && opt !== "None of the above"
    );

    // Ensure `answers[key]` is treated as an array
    const prev = Array.isArray(answers[key]) ? answers[key] : [];

    let updated = [];

    if (value === "None of the above") {
      updated = e.target.checked
        ? ["None of the above"]
        : prev.filter((v) => v !== "None of the above");
    } else if (value === "All of the above") {
      updated = e.target.checked
        ? [...individualOptions, "All of the above"]
        : prev.filter(
            (v) => !individualOptions.includes(v) && v !== "All of the above"
          );
    } else {
      if (e.target.checked) {
        updated = [...prev.filter((v) => v !== "None of the above"), value];
        const allSelected = individualOptions.every((opt) =>
          updated.includes(opt)
        );
        if (allSelected) updated.push("All of the above");
      } else {
        updated = prev.filter((v) => v !== value && v !== "All of the above");
      }
    }

    // Update the state with the new checkbox values
    setAnswers({ ...answers, [key]: updated });
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeStep < steps.length - 1) {
        handleNext();
      }
      // On Contact Details, Enter is handled by react-hook-form's handleSubmit
    }
  };

  const completion =
    activeStep === 0 ? 0 : Math.round((activeStep / steps.length) * 100);

  return (
    <Box sx={{ p: 4 }} onKeyUp={handleKeyUp}>
      <Typography variant="h5" gutterBottom>
        PTRS Eligibility Navigator
      </Typography>

      <Box sx={{ mb: 2 }}>
        <LinearProgress variant="determinate" value={completion} />
        <Typography variant="caption">{completion}% complete</Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label, index) => {
          const isEnabled =
            index <= activeStep ||
            flowQuestions.slice(0, index).every((_, i) => isStepValid(i));
          const tooltip = isEnabled
            ? "Click to jump to this step"
            : "Please complete prior steps before accessing this one.";
          const stepLabel = label; // Keep the label as is
          return (
            <Step key={index}>
              <Tooltip title={tooltip} arrow>
                <StepLabel
                  onClick={() => isEnabled && handleStepClick(index)}
                  style={{
                    cursor: isEnabled ? "pointer" : "not-allowed",
                    opacity: isEnabled ? 1 : 0.4, // Ensure inactive steps are visually distinct
                  }}
                >
                  {stepLabel}
                </StepLabel>
              </Tooltip>
            </Step>
          );
        })}
      </Stepper>

      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Card
        sx={{
          maxWidth: 700,
          margin: "0 auto",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <CardContent>
          {activeStep === steps.length - 2 ? ( // Show Summary of Responses on the second-to-last step
            <>
              <Typography variant="h6" gutterBottom>
                Summary of Responses
              </Typography>
              <Box sx={{ mb: 2 }}>
                {flowQuestions
                  .filter((q) => q.key !== "contactDetails")
                  .map((q) => (
                    <Box key={q.key} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">{q.question}</Typography>
                      <Box
                        sx={{
                          color: "text.secondary",
                          fontSize: "body2.fontSize",
                        }}
                      >
                        {Array.isArray(answers[q.key]) ? (
                          answers[q.key].join(", ")
                        ) : typeof answers[q.key] === "object" &&
                          answers[q.key] !== null ? (
                          <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                            {Object.entries(answers[q.key]).map(([k, v]) => (
                              <li key={k}>
                                <strong>{k}:</strong> {v || "—"}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          answers[q.key] || "No answer"
                        )}
                      </Box>
                    </Box>
                  ))}
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              </Box>
            </>
          ) : activeStep === steps.length - 1 ? ( // Show Contact Details on the final step
            <>
              <Typography variant="h6" gutterBottom>
                {current.question || "Contact Details"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {current.help || "Please provide your contact details."}
              </Typography>
              <form
                noValidate
                onSubmit={handleSubmit(handleNext)}
                autoComplete="off"
                style={{ width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  {flowQuestions
                    .find((q) => q.key === "contactDetails")
                    ?.fields.map((field) => (
                      <Controller
                        key={field.name}
                        name={field.name}
                        control={control}
                        defaultValue={
                          answers.contactDetails?.[field.name] || ""
                        }
                        render={({ field: controllerField }) => (
                          <TextField
                            {...controllerField}
                            label={field.label}
                            required={field.required}
                            error={!!errors[field.name]}
                            helperText={errors[field.name]?.message}
                          />
                        )}
                      />
                    ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeStep === 0 || loading}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Box>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                {current.question}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {current.help}
              </Typography>
              {current.type === "form" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  {activeStep === 0
                    ? current.fields.map((field) => (
                        <Controller
                          key={field.name}
                          name={field.name}
                          control={entityControl}
                          defaultValue={
                            answers[current.key]?.[field.name] || ""
                          }
                          render={({ field: controllerField }) => (
                            <TextField
                              {...controllerField}
                              label={field.label}
                              required={field.required}
                              error={!!entityErrors[field.name]}
                              helperText={entityErrors[field.name]?.message}
                            />
                          )}
                        />
                      ))
                    : current.fields.map((field) => (
                        <TextField
                          key={field.name}
                          name={field.name}
                          label={field.label}
                          value={answers[current.key]?.[field.name] || ""}
                          onChange={handleInputChange(current.key)}
                          required={field.required}
                          error={false}
                          helperText=""
                        />
                      ))}
                </Box>
              ) : current.type === "checkbox" ? (
                <FormGroup>
                  {current.subOptions.map((option, index) => {
                    if (option === "None of the above") {
                      return (
                        <React.Fragment key={option}>
                          <Box
                            sx={{
                              borderBottom: "1px solid #ccc",
                              my: 1,
                              mx: 0,
                              width: "100%",
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={(answers[current.key] || []).includes(
                                  option
                                )}
                                onChange={handleCheckboxChange(
                                  current.key,
                                  option
                                )}
                              />
                            }
                            label={option}
                          />
                        </React.Fragment>
                      );
                    }

                    return (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={(answers[current.key] || []).includes(
                              option
                            )}
                            onChange={handleCheckboxChange(current.key, option)}
                          />
                        }
                        label={option}
                      />
                    );
                  })}
                </FormGroup>
              ) : (
                <RadioGroup
                  value={answers[current.key] || ""}
                  onChange={handleRadioChange(current.key)}
                >
                  {current.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              )}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
                {activeStep === 0 ? (
                  <Button
                    variant="contained"
                    onClick={handleEntitySubmit((data) => {
                      setAnswers((prev) => ({
                        ...prev,
                        entityDetails: data,
                      }));
                      handleNext();
                    })}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      current.type === "checkbox"
                        ? !(answers[current.key]?.length > 0)
                        : !answers[current.key]
                    }
                  >
                    Next
                  </Button>
                )}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

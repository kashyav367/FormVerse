import { randomBytes, createHmac } from "node:crypto";
import db from "./index";
import { usersTable } from "./models/user";
import { formTable } from "./models/form";
import { formsFields } from "./models/form-field";
import { formSubmissions } from "./models/form-submission";
import { analyticsEventsTable } from "./models/analytics-event";
import { responseAnswersTable } from "./models/response-answer";

async function seed() {
  console.log("🌱 Starting FormVerse database seeding...");

  // 1. Seed Demo User
  const demoEmail = "demo@formverse.com";
  const demoPassword = "Password123!";
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(demoPassword).digest("hex");

  let [user] = await db
    .insert(usersTable)
    .values({
      fullName: "FormVerse Demo Creator",
      email: demoEmail,
      emailVerified: true,
      salt: salt,
      password: hash,
    })
    .onConflictDoNothing()
    .returning();

  if (!user) {
    const existing = await db.query?.usersTable?.findFirst?.({
      where: (u: any, { eq }: any) => eq(u.email, demoEmail),
    });
    user = existing;
  }

  const userId = user?.id;
  if (!userId) {
    console.log("⚠️ Could not retrieve demo user ID, skipping forms seeding.");
    return;
  }

  console.log(`✅ Demo user seeded: ${demoEmail} / ${demoPassword}`);

  // 2. Create Sample Form: Product Feedback & Feature Request
  const [form1] = await db
    .insert(formTable)
    .values({
      title: "Customer Product Experience Survey 2026",
      description: "Help us shape the future of FormVerse! Share your thoughts on our UI, features, and overall user experience.",
      createdBy: userId,
      isPublished: true,
      visibility: "PUBLIC",
      theme: "Aurora",
      category: "Feedback",
      icon: "⚡",
      closedMessage: "This survey is currently closed. Thank you for your interest!",
    })
    .returning();

  if (form1) {
    console.log(`✅ Seeded Form 1: ${form1.title}`);

    // Add fields to Form 1
    const [field1] = await db
      .insert(formsFields)
      .values({
        formId: form1.id,
        label: "Your Full Name",
        labelKey: "full_name",
        type: "TEXT",
        index: 0,
        placeholder: "e.g. Alex Morgan",
        description: "Please enter your first and last name",
        isRequired: true,
        validationRules: { minLength: 2, maxLength: 50 },
      })
      .returning();

    const [field2] = await db
      .insert(formsFields)
      .values({
        formId: form1.id,
        label: "Work Email Address",
        labelKey: "work_email",
        type: "EMAIL",
        index: 1,
        placeholder: "alex@company.com",
        isRequired: true,
      })
      .returning();

    const [field3] = await db
      .insert(formsFields)
      .values({
        formId: form1.id,
        label: "Overall Satisfaction Rating (1-10)",
        labelKey: "satisfaction_score",
        type: "NUMBER",
        index: 2,
        placeholder: "10",
        isRequired: true,
        validationRules: { minValue: 1, maxValue: 10 },
      })
      .returning();

    const [field4] = await db
      .insert(formsFields)
      .values({
        formId: form1.id,
        label: "Which primary features do you use most?",
        labelKey: "primary_features",
        type: "CHECKBOX",
        index: 3,
        options: ["Dynamic Form Builder", "tRPC API Integration", "Scalar API Docs", "Analytics Dashboard"],
        isRequired: true,
      })
      .returning();

    const [field5] = await db
      .insert(formsFields)
      .values({
        formId: form1.id,
        label: "Detailed Feedback & Ideas",
        labelKey: "feedback_text",
        type: "TEXTAREA",
        index: 4,
        placeholder: "What features or improvements would you love to see next?",
        isRequired: false,
        validationRules: { maxLength: 500 },
      })
      .returning();

    // 3. Seed Submissions & EAV Answers for Form 1
    const sampleSubmissions = [
      {
        full_name: "Sarah Connor",
        work_email: "sarah@cyberdyne.io",
        satisfaction_score: "9",
        primary_features: ["Dynamic Form Builder", "Scalar API Docs"],
        feedback_text: "The drag-and-drop dynamic validation engine is incredibly fast! Love the UI theme options.",
      },
      {
        full_name: "David Miller",
        work_email: "david.m@techcorp.com",
        satisfaction_score: "10",
        primary_features: ["tRPC API Integration", "Analytics Dashboard"],
        feedback_text: "Full type safety end-to-end with tRPC saves us hours of integration effort.",
      },
      {
        full_name: "Elena Rostova",
        work_email: "elena@designhub.org",
        satisfaction_score: "8",
        primary_features: ["Dynamic Form Builder", "Analytics Dashboard"],
        feedback_text: "Super smooth glassmorphism design! CSV exports and real-time charts are top-notch.",
      },
    ];

    for (const sub of sampleSubmissions) {
      const [submission] = await db
        .insert(formSubmissions)
        .values({
          formId: form1.id,
          responseData: sub,
          submitterIpHash: "seed_ip_hash_demo",
          completionTimeSeconds: 45,
        })
        .returning();

      if (submission && field1 && field2 && field3 && field4 && field5) {
        await db.insert(responseAnswersTable).values([
          { submissionId: submission.id, fieldId: field1.id, fieldKey: "full_name", valueText: sub.full_name },
          { submissionId: submission.id, fieldId: field2.id, fieldKey: "work_email", valueText: sub.work_email },
          { submissionId: submission.id, fieldId: field3.id, fieldKey: "satisfaction_score", valueNumber: parseFloat(sub.satisfaction_score) },
          { submissionId: submission.id, fieldId: field4.id, fieldKey: "primary_features", valueJson: sub.primary_features },
          { submissionId: submission.id, fieldId: field5.id, fieldKey: "feedback_text", valueText: sub.feedback_text },
        ]);
      }
    }

    // 4. Seed Analytics Events for Form 1
    await db.insert(analyticsEventsTable).values([
      { formId: form1.id, eventType: "VIEW", ipHash: "ip_1" },
      { formId: form1.id, eventType: "VIEW", ipHash: "ip_2" },
      { formId: form1.id, eventType: "VIEW", ipHash: "ip_3" },
      { formId: form1.id, eventType: "VIEW", ipHash: "ip_4" },
      { formId: form1.id, eventType: "VIEW", ipHash: "ip_5" },
      { formId: form1.id, eventType: "START", ipHash: "ip_1" },
      { formId: form1.id, eventType: "START", ipHash: "ip_2" },
      { formId: form1.id, eventType: "START", ipHash: "ip_3" },
      { formId: form1.id, eventType: "SUBMIT", ipHash: "ip_1" },
      { formId: form1.id, eventType: "SUBMIT", ipHash: "ip_2" },
      { formId: form1.id, eventType: "SUBMIT", ipHash: "ip_3" },
    ]);
  }

  console.log("🎉 Seeding completed successfully!");
}

seed()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });

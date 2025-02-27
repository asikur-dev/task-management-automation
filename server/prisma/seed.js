const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  // Create companies
  const company1 = await prisma.companies.create({
    data: {
      company_name: "Tech Innovations",
      admin_email: "admin@techinnovations.com",
      password_hash: "hashedpassword123",
      logo_url: "https://techinnovations.com/logo.png",
      color_scheme: "#FF5733",
      subscription_plan: "Premium",
      managers: {
        create: [
          {
            name: "Alice Smith",
            email: "alice@techinnovations.com",
            password_hash: "hashedpassword456",
            employees: {
              create: [
                {
                  name: "John Doe",
                  email: "john@techinnovations.com",
                  password: "pass123",
                  time_zone: "UTC",
                  check_in_time: "8:00",
                  check_out_time: "8:00",
                },
                {
                  name: "Jane Doe",
                  email: "jane@techinnovations.com",
                  password: "pass123",
                  time_zone: "UTC",
                  check_in_time: "8:00",
                  check_out_time: "8:00",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Create non-working days
  await prisma.non_working_days.create({
    data: {
      company_id: company1.id,
      date_value: new Date("2025-12-25"),
      day_of_week: 5,
      description: "Christmas Day",
    },
  });

  // Fetch employees
  const employee1 = await prisma.employees.findFirst({
    where: { email: "john@techinnovations.com" },
  });
  const employee2 = await prisma.employees.findFirst({
    where: { email: "jane@techinnovations.com" },
  });

  // Create check-in sessions
  const checkin1 = await prisma.checkin_sessions.create({
    data: {
      employee_id: employee1.id,
      session_type: "morning",
      session_date: new Date(),
    },
  });

  const checkin2 = await prisma.checkin_sessions.create({
    data: {
      employee_id: employee2.id,
      session_type: "evening",
      session_date: new Date(),
    },
  });

  // Create tasks assigned to employees
  await prisma.tasks.createMany({
    data: [
      {
        checkin_session_id: checkin1.id,
        employee_id: employee1.id,
        task_title: "Fix server issues",
        task_details: "Resolve ongoing server downtime problems.",
        status: "pending",
      },
      {
        checkin_session_id: checkin2.id,
        employee_id: employee2.id,
        task_title: "Update security patches",
        task_details: "Install and verify the latest security patches.",
        status: "pending",
      },
    ],
  });

  console.log(" Seed data created successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

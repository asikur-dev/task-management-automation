const cron = require("node-cron");
const moment = require("moment-timezone");
const { v4: uuidv4 } = require("uuid");
const prisma = require("../config/prisma");
const { sendEmail } = require("./emailService");

async function dynamicCheckIns() {
  try {
    const utcNow = moment.utc();
    const currentHour = parseInt(utcNow.format("HH"), 10);
    const currentMinute = parseInt(utcNow.format("mm"), 10);

    console.log({ currentHour, currentMinute });

    // Fetch employees whose check-in/check-out time matches current UTC hour and minute
    const employees = await prisma.$queryRaw`
      SELECT e.id, e.email, e.time_zone, e.check_in_time, e.check_out_time, m.company_id
      FROM employees e
      LEFT JOIN managers m ON e.manager_id = m.id
      WHERE (EXTRACT(HOUR FROM e.check_in_time) = ${currentHour} AND 
             EXTRACT(MINUTE FROM e.check_in_time) = ${currentMinute})
         OR (EXTRACT(HOUR FROM e.check_out_time) = ${currentHour} AND 
             EXTRACT(MINUTE FROM e.check_out_time) = ${currentMinute})
    `;

    if (employees.length === 0) {
      console.log("🔹 No employees scheduled for check-in at this time.");
      return;
    }

    for (const employee of employees) {
      const checkInTime = moment.utc(employee.check_in_time, "HH:mm");
      const checkOutTime = moment.utc(employee.check_out_time, "HH:mm");

      const checkInHour = checkInTime.hour();
      const checkInMinute = checkInTime.minute();
      const checkOutHour = checkOutTime.hour();
      const checkOutMinute = checkOutTime.minute();

      console.log(
        `✅ Processing check-in for ${employee.email} at UTC ${currentHour}:${currentMinute}`
      );

      if (currentHour === checkInHour && currentMinute === checkInMinute) {
        await handleCheckIn(employee, "morning");
      }

      if (currentHour === checkOutHour && currentMinute === checkOutMinute) {
        await handleCheckIn(employee, "evening");
      }
    }
  } catch (err) {
    console.error("❌ Error in dynamicCheckIns:", err);
  }
}

async function handleCheckIn(employee, sessionType) {
  try {
    const today = moment.utc();
    const todayISO = today.format("YYYY-MM-DD");
    const todayDateTime = today.toISOString();
    const companyId = employee.company_id;

    // Check if it's a non-working day
    if (companyId) {
      const dayOfWeek = today.day();
      const todayStart = today.startOf("day").toISOString();
      const todayEnd = today.endOf("day").toISOString();

      const isNonWorkingDay = await prisma.non_working_days.findFirst({
        where: {
          company_id: companyId,
          OR: [
            {
              date_value: {
                gte: todayStart,
                lte: todayEnd,
              },
            },
            {
              day_of_week: dayOfWeek,
            },
          ],
        },
      });

      if (isNonWorkingDay) {
        console.log(
          `🚫 Skipping check-in for ${employee.email}, it's a holiday or weekend.`
        );
        return;
      }
    }

    // Check if the employee is on leave
    const isOnLeave = await prisma.employee_leaves.findFirst({
      where: {
        employee_id: employee.id,
        start_date: { lte: todayDateTime },
        end_date: { gte: todayDateTime },
      },
    });

    if (isOnLeave) {
      console.log(`🚫 Skipping check-in for ${employee.email}, employee is on leave.`);
      return;
    }

    // Define the time range for today
    const startOfDay = moment.utc().startOf("day").toISOString();
    const endOfDay = moment.utc().endOf("day").toISOString();

    // Find an existing session for today
    const existingSession = await prisma.checkin_sessions.findFirst({
      where: {
        employee_id: employee.id,
        session_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    let sessionIdToUse;
    let shouldSendEmail = false;

    if (existingSession) {
      sessionIdToUse = existingSession.id;

      if (sessionType === "evening") {
        // For evening, only update if it hasn't been marked as evening yet
        if (existingSession.session_type === "morning") {
          const isTaskAssigned = await prisma.tasks.findFirst({
            where: {
              checkin_session_id:existingSession?.id
            },
          })
          if(!isTaskAssigned){
            console.log(`🚫 Skipping check-in for ${employee.email} at ${sessionType}, employee has no tasks assigned!`);
          }
          if (isTaskAssigned) {
            await prisma.checkin_sessions.update({
              where: { id: existingSession.id },
              data: {
                session_type: "evening",
                email_sending_time: new Date().toISOString(),
              },
            });
            shouldSendEmail = true;
         }
        }
      } else if (sessionType === "morning" && !existingSession.email_sending_time) {
        // For morning, only update if email hasn't been sent
        await prisma.checkin_sessions.update({
          where: { id: existingSession.id },
          data: {
            email_sending_time: new Date().toISOString(),
          },
        });
        shouldSendEmail = true;
      }
    } else {
      // Create new session only for morning check-ins
      if (sessionType === "morning") {
        const result = await prisma.checkin_sessions.create({
          data: {
            employee_id: employee.id,
            session_type: sessionType,
            session_date: todayDateTime,
            email_sending_time: new Date().toISOString(),
          },
        });
        sessionIdToUse = result.id;
        shouldSendEmail = true;
      }
    }

    // Send email only if necessary
    if (shouldSendEmail && sessionIdToUse) {
      await sendEmail({
        to: employee.email,
        subject: `${
          sessionType.charAt(0).toUpperCase() + sessionType.slice(1)
        } Check-In for ${todayISO}`,
        html: `<p>Hello! Please <a href="${process.env.CLIENT_URL}/chat/${sessionIdToUse}/${sessionType}">click here</a> to complete your ${sessionType} check-in.</p>`,
      });
      console.log(`✅ Check-in email sent to ${employee.email} for ${sessionType}.`);
    } else {
      console.log(
        `🔹 Skipping email for ${employee.email} (${sessionType}) - already processed.`
      );
    }
  } catch (err) {
    console.error(`❌ Error in handleCheckIn (${sessionType}):`, err);
  }
}

// Schedule the tasks
function startCronJobs() {
  // Run dynamicCheckIns every minute
  cron.schedule("* * * * *", dynamicCheckIns);
}

module.exports = { startCronJobs, dynamicCheckIns, handleCheckIn };

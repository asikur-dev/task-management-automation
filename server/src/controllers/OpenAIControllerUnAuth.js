//const { getPublicIP } = require("../utils/getPublicIP");
// // Instantiate OpenAI
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// module.exports = {
//   async chat(req, res) {
//     try {
//       const { sessionId, messages, macAddress, sessionType } = req.body; // Add sessionType to distinguish morning/evening
//       let ipAddress = await getPublicIP();

//       if (ipAddress.includes(",")) {
//         ipAddress = ipAddress.split(",")[0].trim(); // Get the first IP address
//       }

//       if (ipAddress.includes(",")) {
//         ipAddress = ipAddress.split(",")[0].trim(); // Get the first IP address
//       }

//       const userAgent = req.headers["user-agent"];

//       // Construct full device info
//       const deviceInfo = {
//         userAgent,
//         ipAddress,
//         macAddress: macAddress || "Not Available", // Use provided MAC address or fallback
//       };

//       if (!Array.isArray(messages) || messages.length === 0) {
//         return res.status(400).json({ message: "Messages array is required." });
//       }

//       if (!sessionId) {
//         return res.status(400).json({ message: "Session ID is required." });
//       }

//       // Fetch session details including employee and manager IDs
//       const session = await prisma.checkin_sessions.findUnique({
//         where: { id: sessionId },
//         include: {
//           employee: {
//             select: {
//               id: true,
//               manager_id: true,
//             },
//           },
//         },
//       });

//       if (!session) {
//         return res.status(400).json({ message: "Session ID does not exist or expired" });
//       }

//       const { employee } = session;
//       const employeeId = employee.id;
//       const managerId = employee.manager_id;

//       // Fetch all tasks associated with the session
//       const tasks = await prisma.tasks.findMany({
//         where: { checkin_session_id: sessionId },
//       });

//       if (sessionType === "morning") {
//         // Morning Session Logic
//         const gptSystemCommandMorning = `
//           You are a structured task manager. Extract and format task-related content ONLY from the user's input.
//           Ignore unrelated conversation. Respond STRICTLY in JSON format like this:
//           [
//             { "title": "Task Title 1", "details": "Optional details about the task" },
//             { "title": "Task Title 2", "details": null }
//           ]
//           Instructions:
//           - Extract NEW tasks ONLY from the user's input.
//           - Do NOT create duplicate tasks if they already exist in the provided list of existing tasks.
//           - If no tasks exist yet, create new tasks based on the user's input.
//           - If the user provides incomplete or unclear tasks, organize them into complete titles and descriptions.
//           - Handle edge cases such as typos, missing details, or ambiguous inputs by making reasonable assumptions.
//           - Your job is to create tasks ONLY. Do NOT format responses beyond the specified JSON structure.
//         `;

//         const gptResponse = await openai.chat.completions.create({
//           model: "gpt-3.5-turbo",
//           messages: [
//             { role: "system", content: gptSystemCommandMorning },
//             {
//               role: "system",
//               content: `Existing tasks:\n${tasks
//                 .map(
//                   (task) =>
//                     `- ID: ${task.id}, Title: ${task.task_title}, Details: ${
//                       task.task_details || "None"
//                     }`
//                 )
//                 .join("\n")}`,
//             },
//             ...messages,
//           ],
//         });

//         let structuredTasks;
//         try {
//           const rawJson = gptResponse.choices[0].message.content
//             .trim()
//             .replace(/^```json|```$/g, "");
//           // Validate JSON before parsing
//           if (!isValidJSON(rawJson)) {
//             throw new Error("Invalid JSON format.");
//           }
//           structuredTasks = JSON.parse(rawJson);
//         } catch (error) {
//           console.error("GPT JSON Parse Error:", error);
//           return res.status(500).json({ message: "Error processing tasks." });
//         }

//         // Store tasks in the database
//         for (const task of structuredTasks) {
//           const existingTask = tasks.find(
//             (t) => t.task_title?.toLowerCase() === task.title.toLowerCase()
//           );
//           if (!existingTask) {
//             await prisma.tasks.create({
//               data: {
//                 employee_id: employeeId,
//                 checkin_session_id: sessionId,
//                 task_title: task.title,
//                 task_details: task.details || null,
//               },
//             });
//           }
//         }

//         // Update session with device info and IP address
//         await prisma.checkin_sessions.update({
//           where: { id: sessionId },
//           data: {
//             ip_address: ipAddress,
//             device_info: deviceInfo, // Store full device info as JSON
//           },
//         });

//         const updatedTasks = await prisma.tasks.findMany({
//           where: { checkin_session_id: sessionId },
//         });

//         return res.json({
//           message: "Tasks stored successfully. Session closed.",
//           tasks: updatedTasks,
//         });
//       } else if (sessionType === "evening") {
//         // Evening Session Logic
//         const gptSystemCommandEvening = `
//           You are a task updater. Extract and format task updates ONLY from the user's input.
//           Ignore unrelated conversation. Respond STRICTLY in JSON format like this:
//           [
//             { "taskId": 1, "status": "completed", "title": "Task Title 1", "details": "Optional details about the task" },
//             { "taskId": 2, "status": "updated", "title": "Task Title 2", "details": "Updated progress: 20%" }
//           ]
//           Instructions:
//           - Compare the user's input with the provided list of existing tasks.
//           - Update task statuses, add progress percentages, or modify details as per the user's input.
//           - If the user mentions percentages (e.g., "60%", "halfway"), update the status accordingly (e.g., "60% completed").
//           - If the user wants to mark all tasks as a specific status (e.g., "mark all as completed"), apply the change to all tasks.
//           - Ensure the output is ALWAYS in the specified JSON format, even if no updates are found.
//           - Handle ambiguous inputs by prioritizing the most likely interpretation.
//           - Accept any custom string as a status (e.g., "in progress", "on hold", "almost done").
//           - Your job is to update tasks ONLY. Do NOT format responses beyond the specified JSON structure.
//         `;

//         const gptResponse = await openai.chat.completions.create({
//           model: "gpt-3.5-turbo",
//           messages: [
//             { role: "system", content: gptSystemCommandEvening },
//             {
//               role: "system",
//               content: `Existing tasks:\n${tasks
//                 .map(
//                   (task) =>
//                     `- ID: ${task.id}, Title: ${task.task_title}, Details: ${
//                       task.task_details || "None"
//                     }, Status: ${task.status || "Not Started"}`
//                 )
//                 .join("\n")}`,
//             },
//             ...messages,
//           ],
//         });

//         let structuredUpdates;
//         try {
//           const rawJson = gptResponse.choices[0].message.content
//             .trim()
//             .replace(/^```json|```$/g, "");
//           // Validate JSON before parsing
//           if (!isValidJSON(rawJson)) {
//             throw new Error("Invalid JSON format.");
//           }
//           structuredUpdates = JSON.parse(rawJson);
//         } catch (error) {
//           console.error("GPT JSON Parse Error:", error);
//           return res.status(500).json({ message: "Error processing task updates." });
//         }

//         // Update tasks in the database based on GPT response
//         for (const update of structuredUpdates) {
//           await prisma.tasks.update({
//             where: { id: update.taskId },
//             data: {
//               status: update.status, // Accepts any string, including percentages
//               task_details: update.details || null,
//             },
//           });
//         }

//         // Update session with device info and IP address
//         await prisma.checkin_sessions.update({
//           where: { id: sessionId },
//           data: {
//             ip_address: ipAddress,
//             device_info: deviceInfo, // Store full device info as JSON
//           },
//         });

//         const updatedTasks = await prisma.tasks.findMany({
//           where: { checkin_session_id: sessionId },
//         });

//         return res.json({ message: "Tasks updated successfully.", updatedTasks });
//       }

//       return res.status(400).json({ message: "Invalid session type." });
//     } catch (err) {
//       console.error("Error occurred:", err);
//       res.status(500).json({ message: "Server error." });
//     }
//   },

//   async chatOnly(req, res) {
//     try {
//       const { messages } = req.body;
//       if (!Array.isArray(messages) || messages.length === 0) {
//         return res.status(400).json({ message: "Messages array is required." });
//       }

//       res.setHeader("Content-Type", "text/event-stream");
//       res.setHeader("Cache-Control", "no-cache");
//       res.setHeader("Connection", "keep-alive");

//       const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages,
//         stream: true,
//       });

//       for await (const chunk of response) {
//         const text = chunk.choices[0]?.delta?.content || "";
//         if (text) {
//           res.write(text); // Send chunked response
//         }
//       }

//       res.end(); // Close the stream
//     } catch (err) {
//       console.error("Error occurred:", err);
//       res.status(500).json({ message: "GPT error." });
//     }
//   },

//   async getChatHistory(req, res) {
//     try {
//       const { sessionId } = req.params;
//       let { cursor } = req.query; // Cursor for pagination
//       const LIMIT = 15;

//       let messages = await prisma.conversation_messages.findMany({
//         where: { checkin_session_id: sessionId },
//         take: LIMIT,
//         skip: cursor ? 1 : 0, // Skip the cursor if it's present
//         cursor: cursor ? { id: parseInt(cursor) } : undefined,
//         orderBy: {
//           id: "desc",
//         },
//       });

//       // Reverse order for frontend (oldest at top)
//       messages.reverse();
//       const nextCursor = messages.length > 0 ? messages[0].id : null;

//       res.json({ messages, nextCursor });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error." });
//     }
//   },
// };

// // Helper function to validate JSON
// function isValidJSON(jsonString) {
//   try {
//     JSON.parse(jsonString);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }
const { OpenAI } = require("openai");
const prisma = require("../config/prisma");
const moment = require("moment-timezone");
const { getPublicIP } = require("../utils/utils");

// Instantiate OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
  async chat(req, res) {
    try {
      const { sessionId, messages, macAddress, sessionType } = req.body; // Add sessionType to distinguish morning/evening
      let ipAddress = await getPublicIP();

      if (ipAddress.includes(",")) {
        ipAddress = ipAddress.split(",")[0].trim(); // Get the first IP address
      }

      const userAgent = req.headers["user-agent"];
      const userId = req.userId;

      // Construct full device info
      const deviceInfo = {
        userAgent,
        ipAddress,
        macAddress: macAddress || "Not Available", // Use provided MAC address or fallback
      };

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: "Messages array is required." });
      }

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required." });
      }

      // Fetch session details including employee and manager IDs
      const session = await prisma.checkin_sessions.findUnique({
        where: { id: sessionId },
        include: {
          employee: {
            select: {
              id: true,
              time_zone: true, // Fetch employee's timezone
            },
          },
        },
      });

      if (!session) {
        return res.status(400).json({ message: "Session ID does not exist or expired" });
      }

      const { employee } = session;
      const employeeId = employee.id;
      const employeeTimeZone = employee.time_zone || "UTC"; // Default to UTC if no timezone is set

      // Validate session type and timing based on employee's timezone
      const now = moment().tz(employeeTimeZone);
      const isMorning = now.hours() < 12; // Morning is before 12 PM
      const isEvening = now.hours() >= 12; // Evening is after 12 PM

      // if (
      //   (sessionType === "morning" && !isMorning) ||
      //   (sessionType === "evening" && !isEvening)
      // ) {
      //   return res.status(400).json({
      //     message: `Invalid session type for this time of day. Please use "${
      //       isMorning ? "morning" : "evening"
      //     }".`,
      //   });
      // }

      // Check if the session type already exists in the device_info table
      const existingDeviceInfo = await prisma.device_info.findFirst({
        where: {
          checkin_session_id: sessionId,
          session_type: sessionType,
        },
      });

      if (existingDeviceInfo) {
        console.log(`Device info for ${sessionType} session already exists.`);
        // Do nothing if the record already exists
      } else {
        // Create a new device_info record for the session type
        await prisma.device_info.create({
          data: {
            checkin_session_id: sessionId,
            session_type: sessionType,
            device_info: deviceInfo, // Store full device info as JSON
          },
        });
        console.log(`Created new device info for ${sessionType} session.`);
      }

      // Fetch all tasks associated with the session
      const tasks = await prisma.tasks.findMany({
        where: { checkin_session_id: sessionId },
      });

      if (sessionType === "morning") {
        // Morning Session Logic
        const gptSystemCommandMorning = `
          You are a structured task manager. Extract and format task-related content ONLY from the user's input.
          Ignore unrelated conversation. Respond STRICTLY in JSON format like this:
          [
            { "title": "🔥 Task Title 1", "details": "Optional details about the task" },
            { "title": "🚀 Task Title 2", "details": null }
          ]
          Instructions:
                    - User given anything else convert as human readable task by guessing

          - Extract NEW tasks ONLY from the user's input
          - Use emojis to represent task titles
          - if user message includes web related anything like web design,development then must create them in word user given messages just convert to task if not exists
          - Do NOT create duplicate tasks if they already exist in the provided list of existing tasks.
          - If no tasks exist yet, create new tasks based on the user's input.
          - If the user provides incomplete or unclear tasks, organize them into complete titles and descriptions.
          - Handle edge cases such as typos, missing details, or ambiguous inputs by making reasonable assumptions.
          - Your job is to create tasks ONLY. Do NOT format responses beyond the specified JSON structure.
          - const emojis = ["🌟", "🔥", "🚀", "💡", "🎯", "📌", "📋", "✨", "🎉", "🌈"]; use any type of emoji to create title

        `;

        const gptResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: gptSystemCommandMorning },
            {
              role: "system",
              content: `Existing tasks:\n${tasks
                .map(
                  (task) =>
                    `- ID: ${task.id}, Title: ${task.task_title}, Details: ${
                      task.task_details || "None"
                    }`
                )
                .join("\n")}`,
            },
            ...messages,
          ],
        });
        console.log({ messages, gptResponse: gptResponse.choices[0].message.content });
        if(JSON.parse(gptResponse.choices[0].message.content).length === 0){
          return res.status(500).json({ message: "NO TASKS FOUND, could you please rephrase your task" });
        }
        let structuredTasks;
        try {
          const rawJson = gptResponse.choices[0].message.content
            .trim()
            .replace(/^```json|```$/g, "");
          // Validate JSON before parsing
          if (!isValidJSON(rawJson)) {
            throw new Error("Invalid JSON format.");
          }
          structuredTasks = JSON.parse(rawJson);
        } catch (error) {
          console.error("GPT JSON Parse Error:", error);
          return res.status(500).json({ message: "Error processing tasks." });
        }



        // Store tasks in the database
        for (const task of structuredTasks) {
          const existingTask = tasks.find(
            (t) => t.task_title?.toLowerCase() === task.title.toLowerCase()
          );
          if (!existingTask) {
            await prisma.tasks.create({
              data: {
                employee_id: employeeId,
                checkin_session_id: sessionId,
                task_title: task.title,
                task_details: task.details || null,
              },
            });
          }
        }

        const updatedTasks = await prisma.tasks.findMany({
          where: { checkin_session_id: sessionId },
          orderBy: { created_at: "desc" },
        });

        return res.json({
          message: "Tasks stored successfully.",
          tasks: updatedTasks,
        });
      } else if (sessionType === "evening") {
        // Evening Session Logic
        const gptSystemCommandEvening = `
          You are a task updater. Extract and format task updates ONLY from the user's input.
          Ignore unrelated conversation. Respond STRICTLY in JSON format like this:
          [
            { "taskId": 1, "status": "🚀 completed", "title": "Task Title 1", "details": "Optional details about the task" },
            { "taskId": 2, "status": "🔥 updated", "title": "Task Title 2", "details": "Updated progress: 20%" }
          ]
          Instructions:
          - User given anything else find top matched task and convert as human readable task status by guessing  form existing task and task Id 
          - Compare the user's input with the provided list of existing tasks.
          - Update task statuses, add progress percentages, or modify details as per the user's input.
          - If the user mentions errors on a task then mark it as "🔥 failed" or 'error" or else based on user input write custom string status to update  and why failed update descriptions
          - If the user mentions percentages (e.g., "60%", "halfway"), update the status accordingly (e.g., "60% completed").
          - If the user wants to mark all tasks as a specific status (e.g., "mark all as completed"), apply the change to all tasks.
          - Ensure the output is ALWAYS in the specified JSON format, even if no updates are found.
          - Handle ambiguous inputs by prioritizing the most likely interpretation.
          - Accept any custom string as a status (e.g., "in progress", "on hold", "almost done").
          - Your job is to update tasks ONLY. Do NOT format responses beyond the specified JSON structure.
                    - const emojis = ["🌟", "🔥", "🚀", "💡", "🎯", "📌", "📋", "✨", "🎉", "🌈"]; use any type of emoji to update status

        `;

        const gptResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: gptSystemCommandEvening },
            {
              role: "system",
              content: `Existing tasks:\n${tasks
                .map(
                  (task) =>
                    `- ID: ${task.id}, Title: ${task.task_title}, Details: ${
                      task.task_details || "None"
                    }, Status: ${task.status || "Not Started"}`
                )
                .join("\n")}`,
            },
            ...messages,
          ],
        });
        console.log({messages,gptResponse:gptResponse.choices[0].message.content});
        //if empty array then return empty message
        if(!JSON.parse(gptResponse.choices[0].message.content).length){
          return res.json({ message: "No updates found." });
        }
        let structuredUpdates;
        try {
          const rawJson = gptResponse.choices[0].message.content
            .trim()
            .replace(/^```json|```$/g, "");
          // Validate JSON before parsing
          if (!isValidJSON(rawJson)) {
            throw new Error("Invalid JSON format.");
          }
          structuredUpdates = JSON.parse(rawJson);
        } catch (error) {
          console.error("GPT JSON Parse Error:", error);
          return res.status(500).json({ message: "Error processing task updates." });
        }

        // Update tasks in the database based on GPT response
        for (const update of structuredUpdates) {
          await prisma.tasks.update({
            where: { id: update.taskId },
            data: {
              status: update.status, // Accepts any string, including percentages
              task_details: update.details || null,
            },
          });
        }

        const updatedTasks = await prisma.tasks.findMany({
          where: { checkin_session_id: sessionId },
          orderBy: { created_at: "desc" },
        });

        return res.json({ message: "Tasks updated successfully.", updatedTasks });
      }

      return res.status(400).json({ message: "Invalid session type." });
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  async chatOnly(req, res) {
    try {
      const { messages } = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: "Messages array is required." });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        stream: true,
      });

      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          res.write(text); // Send chunked response
        }
      }

      res.end(); // Close the stream
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ message: "GPT error." });
    }
  },

  async getChatHistory(req, res) {
    try {
      const { sessionId } = req.params;
      let { cursor } = req.query; // Cursor for pagination
      const LIMIT = 15;

      let messages = await prisma.conversation_messages.findMany({
        where: { checkin_session_id: sessionId },
        take: LIMIT,
        skip: cursor ? 1 : 0, // Skip the cursor if it's present
        cursor: cursor ? { id: parseInt(cursor) } : undefined,
        orderBy: {
          id: "desc",
        },
      });

      // Reverse order for frontend (oldest at top)
      messages.reverse();
      const nextCursor = messages.length > 0 ? messages[0].id : null;

      res.json({ messages, nextCursor });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  },
};

// Helper function to validate JSON
function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

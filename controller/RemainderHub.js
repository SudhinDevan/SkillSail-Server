import { cancelJob, scheduleJob } from "node-schedule";
import { mailSender } from "../config/sendMail.js";

const formatDateTime = (date, time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const formattedDate = new Date(date);
  formattedDate.setUTCHours(hours, minutes, seconds);
  return formattedDate.toISOString().replace("Z", "+05:30");
};

const remainderHub = async (req, res) => {
  try {
    const { email, message, startDate, selectedTime } = req.body;
    const formattedStartDate = formatDateTime(startDate, selectedTime);

    const schedule = scheduleJob(formattedStartDate, async () => {
      const emailRecipients = { email, message };
      const verify = await mailSender(emailRecipients);
      cancelJob(schedule);
    });

    res.status(200).json({ message: "Message scheduled successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export { remainderHub };

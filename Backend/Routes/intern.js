const express = require('express');
const User = require('../Models/User');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
app.use(express.json());
const fetchuser = require('../middleware/fetchuser');
const Mentor = require('../Models/Mentor');
const Tasks = require('../Models/Tasks');

router.post('/internFirstlogin', fetchuser, async (req, res) => {

  const saltRounds = await bcrypt.genSalt(10);
  let secPass = await bcrypt.hash(req.body.pass, saltRounds)
  const userId = req.user;
  try {
    const response = await User.findById(userId);
    if (response.passChanged === false) {
      await User.findByIdAndUpdate(userId, { pass: secPass, passChanged: true });
    }
    return res.json({ message: 'First Time password changed successfully' });
  } catch (error) {
    console.error(error);
    res.json({ message: 'Error: ' + error });
  }
});

router.post('/internGetdetails', fetchuser, async (req, res) => {
  const userId = req.user; // Get the user ID from the URL parameter

  try {
    const response = await User.findById(userId)
    console.log(response);
    res.json({ users: response });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

router.post("/internGettask", async (req, res) => {
  const userId = req.user; // Get the user ID from the URL parameter
  let taskId = req.body.taskId;
  try {
    const response = await Tasks.find({_id:taskId})
    console.log(response)
    res.json(response)
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
})

router.post("/internAlltasks",fetchuser,async(req,res) =>{
  const userId = req.user; // Get the user ID from the URL parameter
  try {
    // Get pending tasks (not completed)
    const pendingTasks = await Tasks.find({ assigned_to: userId, task_completed: false });

    // Get submitted tasks (completed)
    const submittedTasks = await Tasks.find({ assigned_to: userId, task_completed: true });

    // Calculate overdue tasks
    const currentDate = new Date(); // Get the current date and time

    const overdueTasks = pendingTasks.filter((task) => {
      const submissionDate = new Date(task.submission_by);
      return submissionDate < currentDate; // Filter tasks where submission date is in the past
    });

    res.json({
      pendingTasks: pendingTasks,
      submittedTasks: submittedTasks,
      overdueTasks: overdueTasks,
    });
  } catch (error) {
    console.log(error);
  }
})

router.post('/internSubmittask', fetchuser, async (req, res) => {
  const userId = req.user;
  const taskId = req.body.taskId;

  try {
    // Set the user as free
    const userResponse = await User.findByIdAndUpdate(userId, { isFree: true });
    const userr = await User.findById(userId);
    // Find the task and mentor associated with it
    const task = await Tasks.findById(taskId);
    const mentor = await Mentor.findById(task.assigned_by);

    // Create a notification object
    const notification = {
      heading: "Task Submitted",
      message: `Task submitted by ${userr.first_name} ${userr.last_name} `, // Customize this message as needed
      taskId: taskId,
      createdAt: new Date(),
    };

    // Append the notification to the mentor's notifications array
    const notificationUpdate = await Mentor.findByIdAndUpdate(
      mentor._id,
      { $push: { notifications: notification } },
      { new: true }
    );

    // Update the task as completed and set submission date
    const taskResponse = await Tasks.findByIdAndUpdate(taskId, {
      intern_submission_desc: req.body.intern_desc,
      task_completed: true,
      submission_on: new Date(),
    });

    if (userResponse && taskResponse) {
      res.json({ message: 'Task Submitted Successfully' });
    }
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
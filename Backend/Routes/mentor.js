const express = require('express');
const User = require('../Models/User');
const app = express();
const router = express.Router();
const path = require('path');
app.use(express.json());
const nodemailer = require('nodemailer');
const Tasks = require('../Models/Tasks');
const fetchmentor = require('../middleware/fetchmentor');
const Notification = require('../Models/Notification');
const Mentor = require('../Models/Mentor');

router.post('/mentorGetinterns/:id?', async (req, res) => {
  const cookieValue = req.cookies.working_field; // Get the value of the 'working_field' cookie
  const userId = req.params.id; // Get the user ID from the URL parameter

  let query = { working_field: cookieValue };

  if (userId) {
    query._id = userId; // Add the user ID to the query if it's provided
  }

  try {
    const response = await User.find(query);
    console.log(response);
    res.json({ users: response });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});


router.post('/mentorResumedownload', async (req, res) => {
  try {
    let id = req.body.id;
    let user = await User.findById(id);
    if (!user) {
      // If the proposal is not found, return an appropriate response
      return res.status(404).json({ error: 'User not found' });
    }
    const filePath = user.resume_file_path;
    const absolutePath = path.join('C:\\Users\\tg210\\OneDrive\\Desktop\\Codes\\Sem 4\\CDAC\\management\\management\\Backend\\uploadResume', '', filePath);
    const fileName = path.basename(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    // Set the 'Content-Disposition' header to specify the filename when downloading
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Send the file in the response
    res.sendFile(absolutePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/mentorAcceptintern', async (req, res) => {
  try {
    let id = req.body.id;
    let user = await User.findByIdAndUpdate(id, { approval_mentor: true })
    if (!user) {
      // If the proposal is not found, return an appropriate response
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: "true", message: "Intern accepted successfully... Waiting for mentor" }).status(200);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.put('/mentorRejectintern', async (req, res) => {
  try {
    let id = req.body.id;
    let user = await User.findByIdAndUpdate(id, { rejected: true })
    if (!user) {
      // If the proposal is not found, return an appropriate response
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: "true" }).status(200);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.post('/mentorCountreqapproved',fetchmentor, async (req, res) => {
  const mentorId = req.mentor;

  try {
    const approvedRes = await User.find({assigned_mentor:mentorId, approval_mentor: true, rejected: false })
    const rejectedRes = await User.find({ assigned_mentor:mentorId,rejected: true, approval_mentor: false })
    const pendingRes = await User.find({ assigned_mentor:mentorId, rejected: false, approval_mentor: false })
    const countApproved = approvedRes.length;
    const countRejected = rejectedRes.length;
    const countPending = pendingRes.length;

    const counts = {
      approved: countApproved,
      rejected: countRejected,
      pending: countPending
    };
    return res.status(200).json({ count: counts })
  } catch (error) {
    console.log(error);
    res.json({ error: error }).status(500);
  }
});

router.post('/finalInterns',fetchmentor, async (req, res) => {
  try {
    let mentorId = req.mentor;
    let response = await User.find({ rejected: false, approval_director: true, approval_mentor: true, assigned_mentor: mentorId });
    res.json({ user: response })
  } catch (error) {
    console.log(error)
  }
})

router.post('/mentorassignTask', fetchmentor, async (req, res) => {
  try {
    // deadline && desc
    let deadline = req.body.deadline;
    const actualDate = new Date(deadline);
    let mentorId = req.mentor;
    let id = req.body.tempid;

    const intern = await User.findByIdAndUpdate(id, {
      $inc: { taskAssigned: 1 }, // Increment taskAssigned by 1
      isFree: false // Set isFree to false
    });

    let response = await Tasks.create({
      assigned_by: mentorId,
      assigned_to: id,
      working_field: intern.working_field,
      task_description: req.body.task_desc,
      submission_by: actualDate
    })

    if (response) {
      res.json({ message: "Task Assigned Successfully" }).status(200)
      console.log("Tassk Assigned Succesfully")
      console.log("assigned to ", id);
      console.log("assigned by " ,mentorId);
    }
  } catch (error) {
    res.json({ message: "Task Assignment failed ", error: error })
    console.log(error)
  }
})

router.post('/mentorFetchtask', fetchmentor, async (req, res) => {
  let mentorId = req.mentor;
  let intern = req.body.userId;
  // console.log("assigned to ", intern)
  // console.log("assigned by ", mentorId)

  try {
    let response = await Tasks.find({ assigned_to: intern, assigned_by: mentorId })
    res.json({ taskss: response })
    // console.log(response)
  } catch (error) {
    console.log(error)
    res.json({ Messsage: error })
  }
})


router.post('/mentorAlertintern', fetchmentor, async (req, res) => {
  let taskid = req.body.taskId

  try {
    let response = await Tasks.findById(taskid);
    let sendNotification = await Notification.create({
      sent_to: response.assigned_to,
      sent_by: response.assigned_by,
      message: req.body.notification_message,
      $inc: { count: 1 },
      isSeen: false
    });

    if (sendNotification) {
      res.json({ success: true, message: "Notification sent Successfully" })
    }

  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }

})

router.post('/mentorGetidleinterns', fetchmentor, async (req, res) => {
  let mentorId = req.mentor
  try {
    let idleresponse = await User.find({ assigned_mentor: mentorId, isFree: true, passChanged:true, rejected:false,isExpired:false });
    let engagedresponse = await User.find({ assigned_mentor: mentorId, isFree: false,rejected:false,passChanged:true });
    let mentorNotification = await Mentor.findOne({ _id: mentorId }).select('notifications');
    const finalResponse = {
      idleresponse,
      engagedresponse,
      mentorNotification
    }
    res.json(finalResponse);

  } catch (error) {
    res.json({ message: error });
    console.log(true);
  }
})


router.post('/mentorGetlasttask', fetchmentor, async (req, res) => {
  const mentorId = req.mentor;
  const userIds = req.body.userIds; // Use plural for the variable name
  console.log(userIds)
  try {
    const tasks = await Tasks.find({ assigned_by: mentorId, assigned_to: { $in: userIds }, task_completed: false }); // Use $in operator to match multiple user IDs
    console.log("I am last task", tasks)
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/mentorCreatetodolist', fetchmentor,async(req,res) => {
  const mentorId = req.mentor;
  try {
    const mentorDetails = await Mentor.findById(mentorId)
    const response = await Tasks.create({
      assigned_by: mentorId,
      working_field: mentorDetails.working_field,
      task_description: req.body.task_descc,
      to_do: true,
      remarks: req.body.mentor_remarks
    })

    res.json(response).status(200);
    console.log("to do task is created")
  } catch (error) {
    console.log(error);
  }
})

router.post('/mentorGettodolist', fetchmentor,async(req,res) => {
  const mentorId = req.mentor;
  try {
    const response = await Tasks.find({assigned_by: mentorId, to_do: true, task_completed: false})
    res.json(response).status(200);

  } catch (error) {
    console.log(error);
  }
})

router.put('/mentorUpdateTodolist',async(req,res) => {
  let taskId = req.body.task_id
  try {
    const response = await Tasks.findByIdAndUpdate(taskId,{to_do: false})
    res.json(response).status(200);

  } catch (error) {
    console.log(error);
  }
})

router.delete('/mentorDeletetodolisttask', async(req,res) => {
  let taskId = req.body.task_id;
  try {
    const response = await Tasks.findByIdAndDelete(taskId)
    res.json(response).status(200);
    console.log('Task deleted Successfully')
  } catch (error) {
    console.log(error);
  }
});
router.put('/mentorDeleteNotification', fetchmentor, async (req, res) => {
  const taskId = req.body.task_id;
  const mentorId = req.mentor;
  
  try {
    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    for (let i = 0; i < mentor.notifications.length; i++) {
      if (mentor.notifications[i].taskId === taskId) {
        mentor.notifications.splice(i, 1); // Remove the notification at index i
        await mentor.save();
        return res.status(200).json({ message: 'Notification deleted successfully' });
      }
    }

    // If the loop completes without finding a matching notification
    return res.status(404).json({ message: 'Notification not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/mentorDisableinternacc', fetchmentor, async(req,res) => {
  let userId = req.body.userId;
  try {
    const userDetails = await User.findByIdAndUpdate(userId,{isExpired:true});
    res.json(userDetails);
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;

const express = require('express');
const User = require('../Models/User');
const app = express();
const router = express.Router();
app.use(express.json());
const nodemailer = require('nodemailer')
const Mentor = require('../Models/Mentor');
const bcrypt = require('bcrypt');
var x = 1;
function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}


router.post('/directorGetinterns/:id?', async (req, res) => {
    const userId = req.params.id; // Get the user ID from the URL parameter
    const query = {}; // Initialize an empty query object

    if (userId) {
        query._id = userId; // Add the user ID to the query if it's provided
    }

    try {
        const response = await User.find({ approval_mentor: true, rejected: false, ...query });
        console.log(response);
        res.json({ users: response });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

router.put('/directorAcceptintern', async (req, res) => {
    try {
        
        let id = req.body.id;
        const saltRounds = await bcrypt.genSalt(10);
        const newPassword = generatePassword(12); // Generate a password with a length of 12 characters
        console.log(newPassword)
        let secPass = await bcrypt.hash(newPassword, saltRounds)
        let userDetails = await User.findById(id);
        let user = await User.findByIdAndUpdate(id, { approval_director: true, rejected: false, pass: secPass });
        const notification = {
          message: `${userDetails.first_name} ${userDetails.last_name} Joined `, // Customize this message as needed
          taskId : x,
          createdAt: new Date(),
        };

        const notificationUpdate = await Mentor.findByIdAndUpdate(
          userDetails.assigned_mentor,
          { $push: { notifications: notification } },
          { new: true }
        );

        const email = user.email
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'cdac@gmail.com',
<<<<<<< HEAD
                pass: 'cdac password'
=======
                pass: 'your password'
>>>>>>> 48124fe391766d0e1b24eaf46a821700b2c94438
            }
        });

        const message = {
            from: 'CDAC',
            to: email,
            subject: 'Your Application Approved',
            text: `Go to the official website and login using the following credentials`,
            html: `<body>
            <div class='parentpass'>
            <div class='passcont' style="padding: 10px 30px 10px 30px;background: beige;">
            <p>Dear ${user.first_name} <br>
            We are pleased to inform you that your application has been approved. You can now log in to your account using the following credentials:<br/>

            Username: ${user.email}<br/>
            Temporary Password: ${newPassword}<br/>

            Please note that for security reasons, we recommend that you reset your password after your first login. To reset your password, log in to your account and navigate to the "Account Settings" section. Follow the prompts to set a new password of your choice.

            If you have any questions or need further assistance, please don't hesitate to contact our support team.<br/>

            Thank you.<br/>
            </body> <br></div>
            </div>
`
        };


        // Send the email with nodemailer
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error sending email' });
            } else {
                console.log('Email sent: ', info.response);
                res.status(200).json({success: true});
            }
        });

        // console.log(setUserToken);

        // res.json({ success: "true", message: "Intern accepted successfully" }).status(200);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/directorRejectintern', async(req,res) => {
    try {
      let id = req.body.id;
      let user = await User.findByIdAndUpdate(id,{ rejected: true, rejected_by : 'Director'})
      if (!user) {
        // If the proposal is not found, return an appropriate response
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({success: "true"}).status(200);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.post('/directorCountreqapproved', async (req, res) => {

    try {
      const approvedRes = await User.find({approval_director: true})
      const rejectedRes = await User.find({rejected: true, approval_director: false, approval_mentor: true})
      const pendingRes = await User.find({rejected: false, approval_director: false, approval_mentor: true})
      const countApproved = approvedRes.length;
      const countRejected = rejectedRes.length;
      const countPending = pendingRes.length;
  
      const counts = {
        approved: countApproved,
        rejected: countRejected,
        pending: countPending
      };
      return res.status(200).json({count : counts})
    } catch (error) {
      console.log(error);
      res.json({ error: error }).status(500);
    }
  });
  

  


module.exports = router

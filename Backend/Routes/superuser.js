const express = require('express');
const app = express();
const user = require('../Models/User');
const router = express.Router();
const director = require('../Models/Director');
const mentor = require('../Models/Mentor');
const nodemailer = require('nodemailer')
app.use(express.json());
const bcrypt = require('bcrypt');
const fetchsuperuser = require('../middleware/fetchsuperuser');
const Tasks = require('../Models/Tasks');

function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}


router.post('/superuserFetchall', fetchsuperuser, async (req, res) => {
    try {
        const User = await user.find({ rejected: false, approval_mentor: true, approval_director: true, isExpired: false });
        const Director = await director.find();
        const Mentor = await mentor.find();
        const response = {
            userr: User,
            directorr: Director,
            mentorr: Mentor
        }
        res.json(response);
    }
    catch (error) {
        console.log(error)
    }

})

router.put('/superuserResetpassword', async (req, res) => {
    let type = req.body.model;
    let id = req.body.reqid;
    console.log(type);
    const saltRounds = await bcrypt.genSalt(10);
    const newPassword = generatePassword(12); // Generate a password with a length of 12 characters
    console.log(newPassword);
    let secPass = await bcrypt.hash(newPassword, saltRounds);

    try {
        let userDetails = await user.findById(id);
        if (type === 'user') {
            const User = await user.findByIdAndUpdate(id, { pass: secPass });
            if (User) {

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'tg21014@gmail.com',
                        pass: 'zledunxbgapjexhc'
                    }

                });
                const email = userDetails.email

                const message = {
                    from: 'CDAC',
                    to: email,
                    subject: 'Your Application Approved',
                    text: `Go to the official website and login using the following credentials`,
                    html: `<body>
                <div class='parentpass'>
                <div class='passcont' style="padding: 10px 30px 10px 30px;background: beige;">
                <p>Dear ${userDetails.first_name} <br>
                We are pleased to inform you that your application has been approved. You can now log in to your account using the following credentials:<br/>
    
                Username: ${userDetails.email}<br/>
                Temporary Password: ${newPassword}<br/>
    
                Please note that for security reasons, we recommend that you reset your password after your first login. To reset your password, log in to your account and navigate to the "Account Settings" section. Follow the prompts to set a new password of your choice.
    
                If you have any questions or need further assistance, please don't hesitate to contact our support team.<br/>
    
                Thank you.<br/>
                </body> <br></div>
                </div>`
                };

                transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.error(error);
                        res.status(500).json({ message: 'Error sending email' });
                    } else {
                        console.log('Email sent: ', info.response);
                        res.status(200).json({ success: true });
                    }
                });
            }

            else {
                res.json({ message: "No user found" })
            }
        }
        else if (type === 'mentor') {
            let userDetails = await mentor.findById(id);
            const User = await mentor.findByIdAndUpdate(id, { pass: secPass });
            if (User) {

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'tg21014@gmail.com',
                        pass: 'zledunxbgapjexhc'
                    }

                });
                const email = userDetails.email

                const message = {
                    from: 'CDAC',
                    to: email,
                    subject: 'Your Application Approved',
                    text: `Go to the official website and login using the following credentials`,
                    html: `<body>
                <div class='parentpass'>
                <div class='passcont' style="padding: 10px 30px 10px 30px;background: beige;">
                <p>Dear ${userDetails.first_name} <br>
                We are pleased to inform you that your application has been approved. You can now log in to your account using the following credentials:<br/>
    
                Username: ${userDetails.email}<br/>
                Temporary Password: ${newPassword}<br/>
    
                Please note that for security reasons, we recommend that you reset your password after your first login. To reset your password, log in to your account and navigate to the "Account Settings" section. Follow the prompts to set a new password of your choice.
    
                If you have any questions or need further assistance, please don't hesitate to contact our support team.<br/>
    
                Thank you.<br/>
                </body> <br></div>
                </div>`
                };

                transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.error(error);
                        res.status(500).json({ message: 'Error sending email' });
                    } else {
                        console.log('Email sent: ', info.response);
                        res.status(200).json({ success: true });
                    }
                });
            }

            else {
                res.json({ message: "No mentor found" })
            }
        }

    } catch (error) {
        console.log(error)
    }
})


router.post('/superuserFetchtask', fetchsuperuser, async (req, res) => {
    let mentorId = req.superuser;
    let intern = req.body.userId;
    // console.log("assigned to ", intern)
    // console.log("assigned by ", mentorId)

    try {
        let response = await Tasks.find({ assigned_to: intern })
        res.json({ taskss: response })
        // console.log(response)
    } catch (error) {
        console.log(error)
        res.json({ Messsage: error })
    }
})

router.get('/superuserFetchoverview', async (req, res) => {
    try {

        const numberofusers = await user.find({ rejected: false }).countDocuments();
        const numberofmentor = await mentor.countDocuments();
        const numberofdirector = await director.countDocuments();
        const ans = {
            userss: numberofusers,
            directorr: numberofdirector,
            mentorr: numberofmentor
        }
        res.json(ans);
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;
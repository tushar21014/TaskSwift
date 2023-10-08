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
        const ans = {
            userss: numberofusers,
            mentorr: numberofmentor
        }
        res.json(ans);
    } catch (error) {
        console.log(error);
    }
})

router.get('/superuserFetchActiveinterns', async (req, res) => {
    try {

        const active = await user.find({ rejected: false, isExpired: false }).countDocuments();
        const inactive = await user.find({ rejected: false, isExpired: true }).countDocuments();
        const ans = {
            activeuserss: active,
            inactiveuserss: inactive
        }
        res.json(ans);
    } catch (error) {
        console.log(error);
    }
})

router.get('/superuserFetchUserWorkingFields', async (req, res) => {
    try {
        const workingFields = await user.aggregate([
            // Filter users who are not rejected or not expired
            {
                $match: {
                    $and: [
                        { rejected: { $ne: true } }, // User is not rejected
                        { isExpired: { $ne: true } } // User is not expired
                    ]
                }
            },
            { $group: { _id: '$working_field', count: { $sum: 1 } } },
        ]);

        // Create the dynamic dataset based on the workingFields array
        const dataset = {
            labels: [],
            data: [],
            backgroundColor: ['#FF6384', '#FFCE56', "#96f", '#ff9f40'], // You can customize colors here
            links: [], // Initialize an empty array for links
        };

        workingFields.forEach((field) => {
            dataset.labels.push(`${field._id}`);
            dataset.data.push(field.count);
            dataset.links.push(`Intern${field._id}`); // Add dynamic links
        });

        const internsubChartData = {
            labels: dataset.labels,
            datasets: [
                {
                    data: dataset.data,
                    backgroundColor: dataset.backgroundColor,
                    links: dataset.links, // Assign the links to the dataset
                },
            ],
        };

        res.json(internsubChartData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/superuserFetchDifferentMentorFields', async (req, res) => {
    try {
        const mentorFields = await mentor.aggregate([
            {
                $group: {
                    _id: '$working_field',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(mentorFields);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/superuserDisableacc', async (req, res) => {
    const userId = req.body.userid; // Assuming you're sending 'userid' in the request body
    try {
        const response = await user.findByIdAndUpdate(userId, { isExpired: true });
        if (response) {
            console.log("Account disabled successfully");
            res.json({ message: 'account disabled successfully' });
        } else {
            console.log("User not found");
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
const express = require('express');
const User = require('../Models/User');
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Signature = 'Tushar'
app.use(express.json());
const nodemailer = require('nodemailer')
const multer = require('multer');
const Mentor = require('../Models/Mentor');
const director = require('../Models/Director');
const superuser = require('../Models/Superuser')
// const user = require('../Models/User');
var globalfilePath = "";
const moment = require('moment');
var x = 2024;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploadResume');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //   const proposalId = req.body.proposalId; // Get the proposalId from the request body
    const filename = file.fieldname + '-' + Date.now() + '-' + file.originalname;
    globalfilePath = filename;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage }); // Use the disk storage



// Route to create a user 
router.post('/createuser', upload.single('uploadedResume'), [
  body('email', 'Please enter a valid email').isEmail()
], async (req, res) => {



  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(402).json({ errors: errors.array() });
    console.log({ errors })
  }

  const formData = req.body;
  const userExist = await User.findOne({ email: formData.email });
  if (userExist) {
    console.log("This user exists.... Please use different Email id")
    return res.status(400).json({ error: 'This email id is in use with another account.', submit: false });
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are zero-based, so we add 1 to get the correct month
  const day = today.getDate();
  // const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const currentDate = moment(formData.date);
  const estimatedEndDate = currentDate.add(formData.internshipPeriod, 'months');
  const formattedEndDate = estimatedEndDate.format('YYYY-MM-DD');


  const currentTimezone = 'Asia/Kolkata';
  const exactTime = new Date().toLocaleString('en-US', { timeZone: currentTimezone });
  console.log(exactTime);
  const assigned_mentor = await Mentor.findOne({ working_field: formData.working_field })
  // console.log("I am assigned Mentor" , assigned_mentor)
  try {
    await User.create({
      role: "User",
      salutation: formData.salutation,
      assigned_mentor: assigned_mentor._id,
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      e_rollno: formData.e_rollno,
      college: formData.college,
      address1: formData.address1,
      address2: formData.address2,
      zipCode: formData.zipCode,
      state: formData.state,
      year: formData.year,
      sem: formData.sem,
      course: formData.course,
      working_field: formData.working_field,
      specialization: formData.specialization,
      resume_file_time: exactTime,
      resume_file_path: globalfilePath,
      period: formattedEndDate
    })

    const notification = {
      message: `${formData.first_name} requested for an internship `, // Customize this message as needed
      taskId : x,
      createdAt: new Date(),
    };

    const notificationUpdate = await Mentor.findByIdAndUpdate(
      assigned_mentor._id,
      { $push: { notifications: notification } },
      { new: true }
    );
    res.json({ success: true })
    console.log("Request Submitted!! Form under review")


  } catch (error) {
    console.log(error)
    res.json({ success: false })
  }

});



// Route to create a mentor for specific working_field
router.post('/creatementor',async (req, res) => {
  try {
    const {credentials} = req.body
    // console.log(credentials)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(402).json({ errors: errors.array() });
    }
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(credentials.pass, saltRounds);
    console.log(hashedPass)

    const directorIds = await director.distinct('_id');
    await Mentor.create({
      assigned_director: directorIds,
      working_field: credentials.working_field,
      salutation: credentials.salutation,
      first_name: credentials.first_name,
      middle_name: credentials.middle_name,
      last_name: credentials.last_name,
      email: credentials.email,
      pass: hashedPass, // Use the hashed password
      phone: credentials.phone,
      address1: credentials.address1,
      address2: credentials.address2,
      city: credentials.city,
      zipCode: credentials.zipCode,
      state: credentials.state,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

router.post('/createDirector', [
  body('email', 'Please enter a valid email').isEmail(),
  // body('phone').isMobilePhone,
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(402).json({ errors: errors.array() });
    console.log({ errors })
  }

  const saltRounds = await bcrypt.genSalt(10);
  let secPass = await bcrypt.hash(req.body.pass, saltRounds)

  try {
    await director.create({
      salutation: req.body.salutation,
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      email: req.body.email,
      pass: secPass,
      phone: req.body.phone,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      zipCode: req.body.zipCode,
      state: req.body.state,
    })

    res.json({ success: true })
    console.log("Director Account Created")


  } catch (error) {
    console.log(error)
    res.json({ success: false })
  }

});


router.post('/createSuperuser', [
  body('email', 'Please enter a valid email').isEmail(),
  // body('phone').isMobilePhone,
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(402).json({ errors: errors.array() });
    console.log({ errors })
  }

  const saltRounds = await bcrypt.genSalt(10);
  let secPass = await bcrypt.hash(req.body.pass, saltRounds)

  try {
    await superuser.create({
      salutation: req.body.salutation,
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      email: req.body.email,
      pass: secPass,
      phone: req.body.phone,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      zipCode: req.body.zipCode,
      state: req.body.state,
    })

    res.json({ success: true })
    console.log("Superuser Account Created")


  } catch (error) {
    console.log(error)
    res.json({ success: false })
  }

});




// Login the user
router.post('/login', [
  // body('pass', 'Password length should be minimum 5 letters').isLength({ min: 5 }),
], async (req, res) => {


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    console.log(errors)
  }
  const { email, pass } = req.body
  try {

    const user = await User.findOne({ email: email, isExpired: false });
    const mentor = await Mentor.findOne({ email: email });
    const Director = await director.findOne({ email: email });
    const Superuser = await superuser.findOne({ email: email });

    //   console.log("I am user" , user);

    if (!user && !mentor && !Director && !Superuser) {
      return res.status(400).json({ errors: "You don't have an account" });
    }

    if (user) {
      
      if (user.role == "User") {
        if (!user.pass) {
          return res.status(400).json({ errors: "Your id is under review" });
        }
        const pwdCompare = await bcrypt.compare(pass, user.pass)
        if (!pwdCompare) {
          console.log(pwdCompare)
          return res.status(402).json({ errors: "Incorrect Password" })
        }

        const data = {
          userr: {
            id: user._id
          }
        }

        const authToken = jwt.sign(data, Signature)

        res.json({ success: true, authToken: authToken, role: "user",working_field: user.working_field  })
        console.log("User Logged in SuccessFully")

      }
    }


    else if (mentor) {

      if (mentor.role == "Mentor") {
        const pwdCompare = await bcrypt.compare(pass, mentor.pass)
        if (!pwdCompare) {
          console.log(pwdCompare)
          return res.status(402).json({ errors: "Incorrect Password" })
        }

        const data = {
          mentorr: {
            id: mentor._id
          }
        }

        const authToken = jwt.sign(data, Signature)

        res.json({ success: true, authToken: authToken, role: "mentor", working_field: mentor.working_field }).status(200)
        console.log("Mentor Logged in SuccessFully")
      }

    }

    else if (Director) {

      if (Director.role == "Director") {
        const pwdCompare = await bcrypt.compare(pass, Director.pass)
        if (!pwdCompare) {
          console.log(pwdCompare)
          return res.status(402).json({ errors: "Incorrect Password" })
        }

        const data = {
          directorr: {
            id: Director._id
          }
        }
        const authToken = jwt.sign(data, Signature)

        res.json({ success: true, authToken: authToken, role: "director"}).status(200)
        console.log("Mentor Logged in SuccessFully")
      }

    }

    else if (Superuser) {

      if (Superuser.role == "superuser") {
        const pwdCompare = await bcrypt.compare(pass, Superuser.pass)
        if (!pwdCompare) {
          console.log(pwdCompare)
          return res.status(402).json({ errors: "Incorrect Password" })
        }

        const data = {
          superuserr: {
            id: Superuser._id
          }
        }
        const authToken = jwt.sign(data, Signature)

        res.json({ success: true, authToken: authToken, role: "superuser"}).status(200)
        console.log("Superuser Logged in SuccessFully")
      }

    }
  } catch (error) {
    console.log(error)
    res.json({ success: false })
  }

});



router.post('/sendLink', async (req, res) => {
  const email = req.body.email;

  if (!email) {
    res.status(401).json({ status: 401, message: "Enter your email" });
  }
  else {

    try {
      const ans = await User.findOne({ "email": email });
      if (ans) {
        const token = jwt.sign({ _id: ans.id }, Signature, {
          expiresIn: '300s'
        });
        console.log(token);
        res.status(200).json(ans);

        const setUserToken = await User.findByIdAndUpdate({ _id: ans.id }, { verify_token: token }, { new: true })


        // Set up a nodemailer SMTP transporter with your email credentials
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          port: 25,
          secure: false,
          auth: {
            user: 'tg21014@gmail.com',
            pass: 'dmtulilbljlvwqbo'
          }
        });

        const message = {
          from: 'CDAC',
          to: email,
          subject: 'Password Reset Link',
          text: `Click the following link to reset your password: https://zomaggy-383610.web.app/Resetpassword/${ans.id}/${token}`,
          html: `<body>
          <div class='parentpass'>
          <div class='passcont' style="padding: 10px 30px 10px 30px;background: beige;">
          <p>Dear ${ans.name} <br>
          We just received a request to reset your password. This link will take you to the password reset page, and you can proceed from there.
          If you did not attempt to reset your password, please ignore this email. No changes will be made to your login information.
          Click the following link to reset your password:</p>
          <a href="https://zomaggy-383610.web.app/Resetpassword/${ans.id}/${token}"> Reset Password</a><br> 
          <b><p>Note: This link is valid for only 5 minutes</p></b></body> <br></div>
          </div>
          Thank You`
        };


        // Send the email with nodemailer
        transporter.sendMail(message, (error, info) => {
          if (error) {
            console.error(error);
            res.status(500).json({ message: 'Error sending email' });
          } else {
            console.log('Email sent: ', info.response);
            res.status(200).json(ans);
          }
        });

        console.log(setUserToken);


      }
      else {
        res.status(401).send({ "message": "User not found", "success": false });
      }

    } catch (error) {
      console.error(error);
    }
  }
})

// Route to change password
router.put('/changePass/:id/:token', async (req, res) => {
  try {
    const { id, token } = req.params;

    // Check for valid user and token
    const validUser = await User.findOne({ _id: id, verify_token: token });

    if (!validUser) {
      res.status(401).send({ message: 'Invalid User or Token' });
      return;
    }

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, Signature);
    } catch (error) {
      res.status(401).send({ message: 'Authentication failed!' });
      return;
    }

    const { pass } = req.body;
    const saltRounds = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(pass, saltRounds);

    const response = await User.findByIdAndUpdate(id, { pass: secPass });

    if (response) {
      res.status(200).send({ message: 'Password Changed successfully' });
      console.log('Password Changed Successfully');
    } else {
      res.status(500).send({ message: 'Error while changing password' });
      console.log('Problem while changing pass');
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/clearCookies', (req, res) => {
  // Get the list of cookies from the request
  const cookies = req.cookies;
  try {
    
    // Iterate through all cookies and set them to expire immediately
    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        res.clearCookie(cookieName);
      }
    }
    
    res.json({message: 'All cookies have been cleared.'});
  } catch (error) {
    console.log(error);
  }
});

router.get('/fetchFields', async (req, res) => {
  try {
    const workingFields = await Mentor.distinct('working_field');
    res.json(workingFields).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const proposal = require('../Models/Proposals');
const app = express();
const router = express.Router();
app.use(express.json());
const multer = require('multer');
const reproposal = require('../Models/ReProposal');
const user = require('../Models/User');
const jwt = require('jsonwebtoken')
// const upload = multer();

const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        // Reject non-PDF files
        cb(new Error('Only PDF files are allowed'));
        //   return res.json({message:"Only Pdf files are allowed"}).status(500)
    }
};

var globalfilePath = "";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        //   const proposalId = req.body.proposalId; // Get the proposalId from the request body
        const filename = file.fieldname + '-' + Date.now() + '-' + file.originalname;
        globalfilePath = filename;
        cb(null, filename);
    },
});


const upload = multer({ storage: storage, fileFilter: pdfFilter }); // Use the disk storage

router.post('/userSubmission', fetchuser, upload.single('uploadedFile'), async (req, res) => {
    try {
        const formData = req.body;
        let userId = req.user;

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // Months are zero-based, so we add 1 to get the correct month
        const day = today.getDate();
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const existingProposal = await proposal.findOne({
            user: userId,
            project_title: formData.project_title,
        });


        if (existingProposal) {
            return res.status(400).json({ error: 'Project title must be unique for each user', submit: false });
        }

        const currentTimezone = 'Asia/Kolkata';
const exactTime = new Date().toLocaleString('en-US', { timeZone: currentTimezone });
console.log(exactTime);


        await proposal.create({
            user: userId,
            proposalId: Date.now(),
            organization_name: formData.organization_name,
            category: formData.category,
            project_title: formData.project_title,
            cid_name: formData.cid_name,
            cid_designation: formData.cid_designation,
            cid_department: formData.cid_department,
            cid_email: formData.cid_email,
            cid_phone: formData.cid_phone,
            proposal_file_time:exactTime,
            proposal_file_path: globalfilePath
            // proposal_file_path: formData.uploadedFile ? formData.uploadedFile.path : null


        })

        res.json({ success: true, submit: true })
        console.log("Proposal Submitted ")

    } catch (error) {
        console.log(error)
        res.json({ error: error }).status(500)
    }

})

router.post('/userGetProposals', fetchuser, async (req, res) => {
    try {

        let userId = req.user;
        const pro = await proposal.find({ user: userId });

        // console.log(pro);
        res.send(pro).status(200);
    } catch (error) {
        console.error(error);
        res.json(error).status(500)

    }

})


router.post('/userResubmit', fetchuser, upload.single('uploadedFile'), async (req, res) => {
    try {
        const formData = req.body;
        let userId = req.user;

        const currentTimezone = 'Asia/Kolkata';
const exactTime = new Date().toLocaleString('en-US', { timeZone: currentTimezone });
console.log(exactTime);


        await reproposal.create({
            parentProposal: formData.parentProposal,
            user: userId,
            proposalId: Date.now(),
            proposal_file_time: exactTime,
            proposal_file_path: globalfilePath,

        })
        const pro = await proposal.findByIdAndUpdate(formData.parentProposal, { proposal_access: false, proposal_resubmit: true });

        if (pro) {
            res.json({ success: true, submit: true });
            console.log("Proposal Submitted ");
        }

    } catch (error) {
        console.log(error)
        res.json({ error: error }).status(500)
    }

})
router.post('/userProfile', fetchuser, async (req, res) => {
    try {
        let userId = req.user;
        let userProfile = await user.findById(userId); // Renamed the variable to userProfile
        console.log(userProfile);
        res.json({ data: userProfile });
    } catch (error) {
        console.log(error);
        return res.json({ error: error }).status(500);
    }
});



module.exports = router;
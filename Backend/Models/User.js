const mongoose = require('mongoose');

const { Schema } = mongoose;


const userSchema = new Schema({
    role: {
        type: String,
        default: "User",
        required : true
    },
    assigned_mentor:{
        type: Schema.Types.ObjectId,
        ref: 'mentor',
        // required: true
    },
    salutation: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true
    },
    middle_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    e_rollno: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
    },
    zipCode: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    sem: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    working_field: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    approval_mentor: {
        type: Boolean,
        required: true,
        default: false
    },
    approval_director: {
        type: Boolean,
        required: true,
        default: false
    },
    approval_admin: {
        type: Boolean,
        required: true,
        default: false
    },
    resume_file_time:{
        type:String
        // type:Int32Array,
        // default: Date.now
    },
    resume_file_path:{
        type:String
    },
    rejected:{
        type: Boolean,
        default: false,
        required: true
    },
    rejected_by:{
        type: String
    },
    pass:{
        type: String
    },
    passChanged:{
        type: Boolean,
        default: false
    },
    tasksAssigned:{
        type:Number,
        default: 0
    },
    isFree:{
        type:Boolean,
        default:true
    },
    date: {
        type: Date,
        default: Date.now
    },
    period:{
        type: String,
        required: true
    },
    starting_period:{
        type: String,
        required: true
    },
    isExpired:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

const user = mongoose.model('Users', userSchema)
module.exports = user;
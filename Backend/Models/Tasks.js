const mongoose = require('mongoose');

const { Schema } = mongoose;
const tasksSchema = new Schema({
    assigned_by:{
        type: Schema.Types.ObjectId,
        ref: 'mentor',
    },
    assigned_to:{
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    working_field:{
        type: String,
        required: true,
    },
    task_description:{
        type:String,
        required: true
    },
    assigned_on:{
        type:Date,
        default: Date.now()
    },
    task_completed:{
        type:Boolean,
        default:false
    },
    intern_submission_desc:{
        type:String,
    },
    submission_on:{
        type: Date
    },
    submission_by:{
        type: Date
    },
    to_do:{
        type:Boolean
    },
    remarks:{
        type:String
    }

}, { timestamps: true });
const tasks = mongoose.model('tasks', tasksSchema)
module.exports = tasks;
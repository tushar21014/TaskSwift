const mongoose = require('mongoose');

const { Schema } = mongoose;
const notificationSchema = new Schema({
    sent_to:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    sent_by:{
        type: Schema.Types.ObjectId,
        ref: 'mentor',
        required: true
    },
    message:{
        type: String,
        required: true
    },
    count:{
        type:Number,
        default:0,
    },
    isSeen:{
        type: Boolean,
        default: false
    }
});

const notification = mongoose.model('notification', notificationSchema)
module.exports = notification;
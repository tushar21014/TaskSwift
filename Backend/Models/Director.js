const mongoose = require('mongoose');

const { Schema } = mongoose;
const directorSchema = new Schema({
    role: {
        type: String,
        default: "Director",
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
    pass: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
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
    notifications:{
        type: Array
    }

}, { timestamps: true });
const director = mongoose.model('director', directorSchema)
module.exports = director;
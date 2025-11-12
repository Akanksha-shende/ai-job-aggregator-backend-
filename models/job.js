const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
}, {
    timestamps: true // This adds createdAt and updatedAt fields automatically
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;

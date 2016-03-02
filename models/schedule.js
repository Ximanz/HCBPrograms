var mongoose = require('mongoose');
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var scheduleSchema = new Schema({
    name: String,
    finishTime: {type: Date },
    scheduleItems: [{ name: String, duration: Number, live: Boolean }]
});

module.exports = mongoose.model('Schedule', scheduleSchema);
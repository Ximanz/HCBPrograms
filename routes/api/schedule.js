var Schedule = require('../../models/schedule');

var schedules = {
    readAll: function(req, res) {
        Schedule.find().exec(function (err, schedules) {
            if (err) {
                console.log(err);
                res.json({ "status": 500, "messages": [{ "type": "exception", "content": err }] });
            }

            if (!schedules) {
                console.log('No schedules found.');
                res.json({ "status": 404, "messages": [{ "type": "error", "content": "No schedules found" }] });
            } else {
                console.log('Schedules found.');
                res.json({ "status": 200, "data": schedules });
            }
        });
    },

    readOne: function(req, res) {
        Schedule.findById(req.params.id).exec(function (err, schedule) {
            if (err) {
                console.log(err);
                res.json({ "status": 500, "messages": [{ "type": "exception", "content": err }] });
            }

            if (!schedule) {
                console.log('Schedule cannot be found.');
                res.json({ "status": 404, "messages": [{ "type": "error", "content": "Schedule cannot be found" }] });
            } else {
                console.log('Schedule found.');
                res.json({ "status": 200, "data": schedule });
            }
        });
    },

    createOne: function(req, res) {
        var createSchedule = function(){
            var schedule = new Schedule();

            if (req.body.name) schedule.name = req.body.name;
            else res.json({ "status": 400, "messages": [{ "type": "error", "content": "A schedule name is required" }] });

            if (req.body.finishTime) schedule.finishTime = req.body.finishTime;
            else schedule.finishTime = Date.now().setHours(18);

            if (req.body.scheduleItems && req.body.scheduleItems.length > 0) schedule.scheduleItems = req.body.scheduleItems.slice();
            else res.json({ "status": 400, "messages": [{ "type": "error", "content": "There are no items in this schedule" }] });

            schedule.save(function(err) {
                if (err) {
                    console.log(err);
                    res.json({ "status": 500, "messages": [{ "type": "exception", "content": err }] });
                }

                res.json({ "status": 200, "messages": [{ "type": "success", "content": "Schedule created" }], "data": schedule });
            });
        };

        if (req.body.name){
            Schedule.findOne({name: req.body.name}).exec(function(err, schedule) {
                if(schedule){
                    console.log('A schedule by this name already exists');
                    res.json({ "status": 400, "messages": [{ "type": "error", "content": "A schedule by the name " + req.body.name + " already exists" }] });
                } else {
                    createSchedule();
                }
            });
        } else {
            createSchedule();
        }
    },

    deleteOne: function(req, res) {
        Schedule.findById(req.params.id, function (err, schedule) {
            if (err) {
                console.log(err);
                res.json({ "status": 500, "messages": [{ "type": "exception", "content": err }] });
            }

            if (!schedule) {
                console.log('Cannot find schedule to delete');
                res.json({ "status": 404, "messages": [{ "type": "error", "content": "Cannot find schedule to delete" }] });
            } else {
                schedule.remove(function (err) {
                    if (err) {
                        res.json({ "status": 500, "messages": [{ "type": "exception", "content": err }] });
                    }

                    res.json({ "status": 200, "messages": [{ "type": "success", "content": "Schedule deleted" }] });
                })
            }
        });
    }
};


module.exports = schedules;
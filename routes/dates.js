var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server("ds045157.mongolab.com", 45157, {auto_reconnect:true});
db = new Db('heroku_app9915870', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        db.authenticate('heroku_app9915870', 'v9hmr0nbm2bp70mblr9if19hmo', function(err, success) {
            console.log("Connected to 'heroku_app9915870' database");
            db.collection('dates', {safe:true}, function(err, collection) {
                if (err) {
                    console.log("The 'dates' collection doesn't exist. Creating it with sample data...");
                    populateDB();
                }
            });
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving dates: ' + id);
    db.collection('dates', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('dates', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addDate = function(req, res) {
    var date = req.body;
    console.log('Adding date: ' + JSON.stringify(date));
    db.collection('dates', function(err, collection) {
        collection.insert(date, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateDate = function(req, res) {
    var id = req.params.id;
    var date = req.body;
    delete date._id;
    console.log('Updating date: ' + id);
    console.log(JSON.stringify(date));
    db.collection('dates', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, date, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating date: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(date);
            }
        });
    });
};

exports.deleteDate = function(req, res) {
    var id = req.params.id;
    console.log('Deleting date: ' + id);
    db.collection('dates', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    var dates = [
        {
            title: 'All Day Event',
            start: new Date(y, m, 1)
        },
        {
            title: 'Long Event',
            start: new Date(y, m, d-5),
            end: new Date(y, m, d-2)
        },
        {
            title: 'Repeating Event',
            start: new Date(y, m, d-3, 16, 0),
            allDay: false
        },
        {
            title: 'Repeating Event',
            start: new Date(y, m, d+4, 16, 0),
            allDay: false
        },
        {
            title: 'Meeting',
            start: new Date(y, m, d, 10, 30),
            allDay: false
        },
        {
            title: 'Lunch',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false
        },
        {
            title: 'Birthday Party',
            start: new Date(y, m, d+1, 19, 0),
            end: new Date(y, m, d+1, 22, 30),
            allDay: false
        },
        {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }
    ];

    db.collection('dates', function(err, collection) {
        collection.insert(dates, {safe:true}, function(err, result) {});
    });

};
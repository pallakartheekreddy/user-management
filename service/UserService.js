var express = require('express');

//TODO: Need to move Db connections into model folder
//var connection = require('../model/db');

var router = express.Router();
var bodyParser= require('body-parser')

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())

//Db Connection block start
var mongodb = require('mongodb');
// Connection URL 
var url = 'mongodb://localhost:27017/testemp';
var MongoClient = mongodb.MongoClient;
var db;
MongoClient.connect(url, function(err, dbObj) {
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		db = dbObj;
	}	
});

/*
 * add user
 */
router.post('/adduser', function(req, res) {

    db.collection('users').find({"email" : req.body.email}).count(function (e, count) {       
        if(count == 0){
            //db.collection('items').find().count(function (e, count) {   
                db.collection('items').insert([{"id": parseInt(count+1), "name": req.body.name, "age" : parseInt(req.body.age)}], function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        //res.json(result);
                        res.send({ status: 'SUCCESS' });
                    }
                });
            //});    
        }
    });
})

/*
 * update user list
 */
router.post('/updateuser', function(req, res) {
	
	db.collection('items').update({"id": parseInt(req.body.id)}, {$set: {"name": req.body.name, "age" : parseInt(req.body.age)}}, function (err, numUpdated) {
		if (err) {
			console.log(err);
		} else if (numUpdated) {
			console.log('Updated Successfully %d document(s).', numUpdated);
            res.send({ status: 'SUCCESS' });
		} else {
			console.log('No document found with defined "find" criteria!');
		}
	});
});



/*
 * GET userlist.
 */
router.get('/users', function(req, res) {
	
	db.collection('items').find().toArray(function (err, result) {
		if (err) {
			console.log(err);
		} else if (result) {
			console.log('Found:', result);
			res.json(result);
		} else {
			console.log('No document(s) found with defined "find" criteria!');
		}
	});
});

/*
 * get Specific user
 */
router.get('/getuserinfo/:id', function(req, res) {
	var user_id = req.params.id;
	console.log(user_id);
	db.collection('items').findOne({id: parseInt(user_id)}, function(err, result) {
       
		if (err) {
			console.log(err);
		} else if (result) {
			console.log('Found:', result);
            res.send({ status: 'SUCCESS' , data: result});
			//res.s(result);
		} else {
			console.log('No document(s) found with defined "find" criteria!');
		}
	});
});

/*
 * Delete user.
 */
router.delete('/deleteuser/:id', function(req, res) {
	var user_id = req.params.id;
    console.log(user_id);
	//_id: ObjectID(user_id)
	db.collection('items').remove({id: parseInt(user_id)}, function(err, result) {
		if (err) {
			console.log(err);
		} else if (result) {
			console.log('Found:', result);
			res.send({ status: 'SUCCESS'});
		} else {
			console.log('No document(s) found with defined "find" criteria!');
		}
	});
});

module.exports = router;
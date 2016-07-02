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
var url = 'mongodb://localhost:27017/usermanagement';
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
		console.log('count '+count);
        if(count == 0){
           //db.collection('users').find().count(function (e, count) {   
			var user = {"id": new Date().getTime(), 
						 "name": req.body.name, 
						 "email" : req.body.email,
						 "username" : req.body.username,
						 "password" : req.body.password,
						 "age": req.body.age,
						 "gender": req.body.gender,
						 "dob" : req.body.dob
						 };
			console.log(user);
                db.collection('users').insert([user], function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        //res.json(result);
                        res.send({ status: 'SUCCESS' });
                    }
                });
            //});    
        }else{
			res.send({ status: 'Fail', 'message': 'Email alreddy exsist' });
		}
    });
})

/*
 * update user list
 */
router.post('/updateuser', function(req, res) {
	var user = {};

	if(req.body.name != ''){
		user['name'] = req.body.name;
	}
	if(req.body.email != ''){
		user['email'] = req.body.email;
	}
	/*if(req.body.username != ''){
		user['username'] = req.body.username;
	}
	if(req.body.password != ''){
		user['password'] = req.body.password;
	}*/
	if(req.body.age != ''){
		user['age'] = req.body.age;
	}
	if(req.body.gender != ''){
		user['gender'] = req.body.gender;
	}
	if(req.body.dob != ''){
		user['dob'] = req.body.dob;
	}
	db.collection('users').update({"id": req.body.id}, {$set: user}, function (err, numUpdated) {
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
	
	db.collection('users').find().toArray(function (err, result) {
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
	db.collection('users').findOne({id: parseInt(user_id)}, function(err, result) {
       
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
	db.collection('users').remove({"id": user_id}, function(err, result) {
		if (err) {
			console.log(err);
		} else if (result) {
			//console.log('Found:', result);
			res.send({ status: 'SUCCESS'});
		} else {
			console.log('No document(s) found with defined "find" criteria!');
		}
	});
});

module.exports = router;
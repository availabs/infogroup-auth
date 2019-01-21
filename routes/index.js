var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();
var uuid = require('uuid/v4');
var session = require('express-session');
//var FileStore = require('session-file-store')(session);
var passport = require('passport');
//var bodyParser = require('body-parser');
//var LocalStrategy = require('passport-local').Strategy;

let byZip = require('../controllers/byZip');
let byId = require('../controllers/byId');
let byCounty = require('../controllers/byCounty');
let byMpo = require('../controllers/byMpo');
let byMun = require('../controllers/byMun');
let byDistance = require('../controllers/byDistance');
let byRectangle= require('../controllers/byRectangle');

let getIndustries = require('../controllers/getIndustries');
let getSalesVolume = require('../controllers/getSalesVolume');
let getEmpSize = require('../controllers/getEmpSize');
let getSqFoot = require('../controllers/getSqFoot');
let getZip = require('../controllers/getZip');
let getCounty = require('../controllers/getCounty');
let getMpo = require('../controllers/getMpo');
let getMun = require('../controllers/getMun');
let getSic_AutoComplete = require('../controllers/getSic');
let getSic = require('../controllers/getSic');

let advancedSearch = require('../controllers/advancedSearch')

let editBusiness = require('../controllers/editing/editBusiness');
let approveBusiness = require('../controllers/editing/approveBusiness');


//API ROUTES
router.get('/api/byzip/:zipcode', byZip);
router.get('/api/byid/:id', byId);
router.get('/api/bycounty/:county', byCounty);
router.get('/api/bympo/:mpo', byMpo);
router.get('/api/bymun/:mun', byMun);
router.get('/api/bydistance', byDistance);
router.get('/api/byrectangle', byRectangle);

router.get('/api/getindustries', getIndustries);
router.get('/api/getsalesvolume', getSalesVolume);
router.get('/api/getempsize', getEmpSize);
router.get('/api/getsqfoot', getSqFoot);
router.get('/api/getzip/:zip', getZip);
router.get('/api/getcounty/:county', getCounty);
router.get('/api/getmpo/:mpo', getMpo);
router.get('/api/getmun/:mun', getMun);
router.get('/api/getsic/:sic', getSic_AutoComplete);
router.get('/api/getsic', getSic);

router.get('/api/advancedSearch', advancedSearch);


//EDIT ROUTES
//TODO: check for auth and permission
// router.post('/edit/:bus_id', editBusiness);
// router.put('/:audit_id', approveBusiness);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
    console.log('Inside the homepage callback function');
    console.log(req.sessionID);
    res.send(`You got home page!\n`)
});

router.get('*', function(req, res, next) {
    console.log('this is a 404')
    res.sendFile(path.join(__dirname, '../public//404.html'));
});

router.get('/Login', function(req, res, next) {
    let uniqueId = uuid();
    res.send(`Hit home page. Received the unique id: ${uniqueId}\n`);
    console.log({uniqueId});
    res.sendFile(path.join(__dirname, '../public/Login/index.html'));
});


router.post('/Login',function(req, res,next) {
    console.log('Inside POST /login callback');
    passport.authenticate('local', (err, user, info) => {
        console.log('Inside passport.authenticate() callback');
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
        console.log(`req.user: ${JSON.stringify(req.user)}`);
        req.login(user, (err) => {
            console.log('Inside req.login() callback');
            console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
            console.log(`req.user: ${JSON.stringify(req.user)}`);
            return res.send({status: 'logged in'});
        })
    })(req, res, next);
});


router.get('/authrequired',function(req, res,next) {
    console.log('Inside auth');
    console.log('Inside GET /authrequired callback');
    console.log(`User authenticated? ${req.isAuthenticated()}`);
    if(req.isAuthenticated()) {
        res.send(`you hit the authentication endpoint 123\n ${JSON.stringify(req.user)}`)
    } else {
        res.redirect('/')
    }

});


module.exports = router;



var express = require('express');
var path = require('path');
var passport = require('passport');
var router = express.Router();
var uuid = require('uuid/v4');
//var session = require('express-session');
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
    //console.log('Inside the homepage callback function')
    //console.log(req.sessionID);
    if(req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '../public/home.html'));
    } else {
        res.redirect('/login')
    }
    // res.send(`You hit home page!\n`)

});

router.get('/login', function(req, res, next) {
    console.log('Inside GET /login callback function');
    console.log(req.sessionID);
    // res.send(`You got the login page!\n`);
    res.sendFile(path.join(__dirname, '../public/login_files/index.html'));
});


router.post('/login',function(req, res,next) {
    console.log('Inside POST /login callback');
    passport.authenticate('local', (err, user, info) => {
        console.log('authenticated', err, user, info);
        if(info) {return res.json(info.message)}
        if (err) { return next(err); }
        if (!user) { return res.json('not authenticated'); }
        req.login(user, (err) => {
            if (err) {
                res.status(200).json({
                    message: 'Welcome to the project infogroup'
                });
                return next(err);
            }
            else {
                return res.json({status: 'logged in'});

            }
            })
        .catch((error) => {
                console.log(error);

        })
    })(req, res, next);
});



router.get('/authrequired',function(req, res,next) {
    if(req.isAuthenticated()) {
        res.send('you hit the authentication endpoint\n');
    } else {
        res.redirect('/')
    }

});

router.get('/logout',function(req, res,next){
    if (req.session){
        req.session.destroy(function(err){
            if(err) {
                return next(err);
            } else {
                console.log('you are logged out, Please log in again!\n')
                return res.redirect('/login');
            }
        });
    }
});

router.get('*', function(req, res, next) {
    console.log('this is a 404');
    res.sendFile(path.join(__dirname, '../public//404.html'));
});


module.exports = router;



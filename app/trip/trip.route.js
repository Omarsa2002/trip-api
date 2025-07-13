
const express 			= require('express');
const router 			= express.Router();
const tripRoute =require("./trip.controller.js")
const {validation} = require('../middleware/validation.js')
const validators = require('./trip.validation.js')
const auth = require("../middleware/authentcation.js");



router.get('/all-tripss', auth.requireAdminDummyAuth,tripRoute.getAllTrips);
router.post('/create-trips', auth.requireAdminDummyAuth, validation(validators.creaTetrip), tripRoute.createTrips);
router.patch('/update-trip/:tripId', auth.requireAdminDummyAuth, validation(validators.updatetrip), tripRoute.updateTrip);
router.delete("/delete-trip/:tripId", auth.requireAdminDummyAuth, validation(validators.deletetrip), tripRoute.deleteTrip)





module.exports = router;

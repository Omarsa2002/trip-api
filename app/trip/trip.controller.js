const triptModel = require("../db/models/trip.schema.js");

const { sendResponse, paginationWrapper } = require("../utils/util.service.js");
const constants=require("../utils/constants.js")




const getAllTrips = async (req, res, next) => {
    try {
        const allTrips = await triptModel.find().select('-_id -__v')

        sendResponse(res, constants.RESPONSE_SUCCESS, "Tripss retrieved successfully", allTrips, []);
    } catch (error) {
        sendResponse(res, constants.RESPONSE_INT_SERVER_ERROR, error.message, "", constants.UNHANDLED_ERROR);
    }
}


const createTrips = async (req, res, next) => {
    try {
        const { trips } = req.body;

        const newTrips = trips.map(trip => {
            return new triptModel({
                tripName: trip.tripName,
                fromCity: trip.fromCity,
                toCity: trip.toCity,
                date: trip.date,
                price: trip.price,
                seats: trip.seats
            });
        });

        const savedTrips = [];
        const dbFailures = [];

        for (let i = 0; i < newTrips.length; i++) {
            try {
                const savedTrip = await newTrips[i].save();
                savedTrips.push(savedTrip);
            } catch (error) {
                dbFailures.push({
                    tripIndex: i,
                    tripData: {
                        tripName: trips[i].tripName,
                        fromCity: trips[i].fromCity,
                        toCity: trips[i].toCity,
                        date: trips[i].date,
                        price: trips[i].price,
                        seats: trips[i].seats
                    },
                    error: error.message,
                });
            }
        }

        const response = {
            totalTrips: trips.length,
            successCount: savedTrips.length,
            failureCount: dbFailures.length,
            savedTrips: savedTrips,
            failures: dbFailures
        };

        if (savedTrips.length === trips.length) {
            // All trips created successfully
            sendResponse(res, constants.RESPONSE_SUCCESS, "All trips created successfully", response, []);
        } else if (savedTrips.length > 0) {
            // Partial success
            sendResponse(res, constants.RESPONSE_PARTIAL_SUCCESS, "Some trips created successfully", response, []);
        } else {
            // All trips failed
            sendResponse(res, constants.RESPONSE_BAD_REQUEST, "All trips failed to create", response, dbFailures);
        }
    } catch (error) {
        sendResponse(res, constants.RESPONSE_INT_SERVER_ERROR, error.message, {}, constants.UNHANDLED_ERROR);
    }
};


const updateTrip = async (req, res, next) => {
    try {
        const { tripId } = req.params;
        const updateData = req.body;

        // Check if update data is provided
        if (!updateData || Object.keys(updateData).length === 0) {
            return sendResponse(res, constants.RESPONSE_BAD_REQUEST, "No update data provided", {}, []);
        }

        // Check if trip exists
        const existingTrip = await triptModel.findOne({ tripId });
        if (!existingTrip) {
            return sendResponse(res, constants.RESPONSE_BAD_REQUEST, "Trip not found", {}, []);
        }

        // If trip is in the past, prevent updates
        if (existingTrip.date < new Date()) {
            return sendResponse(res, constants.RESPONSE_BAD_REQUEST, "Cannot update data for past trips", {}, []);
        }

        // Check for duplicate tripName if being updated
        if (updateData.tripName && updateData.tripName !== existingTrip.tripName) {
            const duplicateTrip = await triptModel.findOne({ 
                tripName: updateData.tripName,
                tripId: { $ne: tripId }
            });
            if (duplicateTrip) {
                return sendResponse(res, constants.RESPONSE_CONFLICT, "Trip name already exists", {}, []);
            }
        }

        // Check for duplicate route-date combination if relevant fields are being updated
        if (updateData.fromCity || updateData.toCity || updateData.date) {
            const checkFromCity = updateData.fromCity || existingTrip.fromCity;
            const checkToCity = updateData.toCity || existingTrip.toCity;
            const checkDate = updateData.date || existingTrip.date;

            const duplicateRoute = await triptModel.findOne({
                fromCity: checkFromCity,
                toCity: checkToCity,
                date: checkDate,
                tripId: { $ne: tripId }
            });

            if (duplicateRoute) {
                return sendResponse(res, constants.RESPONSE_CONFLICT, "A trip with the same route and date already exists", {}, []);
            }
        }

        const updatedTrip = await triptModel.findOneAndUpdate(
            { tripId },
            updateData,
            { 
                new: true,
                runValidators: true // Run mongoose validators
            }
        );

        if (!updatedTrip) {
            return sendResponse(res, constants.RESPONSE_NOT_FOUND, "Trip not found during update", {}, []);
        }

        const response = {
            tripId: updatedTrip.tripId,
            updatedTrip: updatedTrip,
            lastModified: updatedTrip.updatedAt
        };

        sendResponse(res, constants.RESPONSE_SUCCESS, "Trip updated successfully", response, []);

    } catch (error) {
        sendResponse(res,constants.RESPONSE_INT_SERVER_ERROR,error.message,"", constants.UNHANDLED_ERROR);
    }
};


const deleteTrip = async (req, res, next) => {
    try{
        const { tripId } = req.params
        await triptModel.deleteOne({tripId});
        sendResponse(res, constants.RESPONSE_NO_CONTENT, "trip deleted successfully", {}, []);
    }catch(error){
        sendResponse(res,constants.RESPONSE_INT_SERVER_ERROR,error.message,"", constants.UNHANDLED_ERROR);
    }
}






module.exports={
    getAllTrips,
    createTrips,
    updateTrip,
    deleteTrip
}
const { Schema, model } = require("mongoose");
const addPrefixedIdPlugin = require("../db.helper.js");

const tripSchema = new Schema({
    tripId: {
        type: String,
        required: true,
        unique: true
    },
    tripName: {
        type: String,
        required: [true, "tripName is required"],
        unique: true,
        trim: true,
        minlength: [2, "minimum length 2 characters"],
        maxlength: [20, "maximum length 20 characters"],
    },
    fromCity: {
        type: String,
        required: [true, "fromCity is required"],
        trim: true,
        minlength: [2, "minimum length 2 characters"],
        maxlength: [20, "maximum length 20 characters"],
    },
    toCity: {
        type: String,
        required: [true, "toCity is required"],
        trim: true,
        minlength: [2, "minimum length 2 characters"],
        maxlength: [20, "maximum length 20 characters"],
    },
    date: {
        type: Date,
        required: [true, "date is required"],
    },
    price: {
        type: Number,
        required: [true, "price is required"],
        min: [0, "price must be a positive number"],
    },
    seats: {
        type: Number,
        required: [true, "seats is required"],
        min: [1, "seats must be at least 1"],
    },
}, {
    timestamps: true,
});

tripSchema.plugin(addPrefixedIdPlugin, { prefix: 'Trip', field: 'tripId' })


const tripModel = model("Trip", tripSchema);
module.exports= tripModel;

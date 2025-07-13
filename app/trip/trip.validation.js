const joi = require("joi");

// Create trip validation schema
const creaTetrip = {
    body: joi.object().required().keys({
        trips: joi.array()
        .items(joi.object().keys({
            tripName: joi.string()
                .trim()
                .min(2)
                .max(20)
                .required()
                .messages({
                    'string.base': 'trip name must be a string.',
                    'string.min': 'trip name must be at least 2 characters long.',
                    'string.max': 'trip name cannot exceed 20 characters.',
                    'string.empty': 'trip name is required.'
                }),
            fromCity: joi.string()
                .required()
                .messages({
                    'string.base': 'fromCity must be a string.',
                    'string.empty': 'fromCity is required.'
                }),
            toCity: joi.string()
                .required()
                .messages({
                    'string.base': 'fromCity must be a string.',
                    'string.empty': 'fromCity is required.'
                }),
            date: joi.date()
                .required()
                .messages({
                    'date.base': 'date must be a date.',
                    'date.empty': 'date is required.'
                }),
            price: joi.number()
                .min(0)
                .required()
                .messages({
                    'number.base': 'Price must be a number.',
                    'number.min': 'Price cannot be negative.'
                }),
            seats: joi.number()
                .min(0)
                .required()
                .messages({
                    'number.base': 'seats must be a number.',
                    'number.min': 'seats cannot be negative.'
                }),
        }))
    })
};

// Update trip validation schema
const updatetrip = {
    body: joi.object().required().keys({
        tripName: joi.string()
            .trim()
            .min(2)
            .max(20)
            .optional()
            .messages({
                'string.base': 'trip name must be a string.',
                'string.min': 'trip name must be at least 2 characters long.',
                'string.max': 'trip name cannot exceed 20 characters.',
                'string.empty': 'trip name is required.'
            }),
        fromCity: joi.string()
            .optional()
            .messages({
                'string.base': 'fromCity must be a string.',
                'string.empty': 'fromCity is required.'
            }),
        toCity: joi.string()
            .optional()
            .messages({
                'string.base': 'fromCity must be a string.',
                'string.empty': 'fromCity is required.'
            }),
        date: joi.date()
            .optional()
            .messages({
                'date.base': 'date must be a date.',
                'date.empty': 'date is required.'
            }),
        price: joi.number()
            .min(0)
            .optional()
            .messages({
                'number.base': 'Price must be a number.',
                'number.min': 'Price cannot be negative.'
            }),
        seats: joi.number()
            .min(0)
            .optional()
            .messages({
                'number.base': 'seats must be a number.',
                'number.min': 'seats cannot be negative.'
            }),
    })
};


// Validation for deleting trip
const deletetrip = {
    params: joi.object().required().keys({
        tripId: joi.string().required().messages({
            'string.base': 'trip ID must be a string.',
            'string.empty': 'trip ID is required.'
        })
    })
};

module.exports = {
    creaTetrip,
    updatetrip,
    deletetrip
};
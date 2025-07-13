module.exports = {
    v1routes: function (app) {
        app.use('/api/v1/trip', require('./trip/trip.route'));

    }
};
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = require('./dbConn').db();

/**
 * Service represents a TDAF project that will be offered to our customers. It stores information on the
 * stable versions offered and the different sizes it can be deployed with (size descriptions will
 * depend on the service itself).
 *
 * @type {Schema}
 */
var Notifier = new Schema({
    id: String,
    service: String,
    pushType: String,
    credentials: String
});

module.exports = db.model('Notifier', Notifier);
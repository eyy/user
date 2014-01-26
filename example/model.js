var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = Schema.Types,
    pw = require('password-hash');

var schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, password: true, editable: false, set: pw.generate }
});

module.exports = mongoose.model('users', schema);
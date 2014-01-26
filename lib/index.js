/*
    node-user
 */

module.exports = function(app, users) {
    require('./passport')(app, users);
    require('./routes')(app, users);
};
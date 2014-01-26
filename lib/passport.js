var passport = require('passport'),
    pw = require('password-hash'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(app, users) {
    // LocalStrategy: check user against the database
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, cb) {
            users.findOne({ email: email }, function (err, user) {
                if (err) return cb(err);
                if (!user || !pw.verify(password, user.password))
                    return cb(null, false, { message: 'Incorrect username or password.' });
                if (!user.approved)
                    return cb(null, false, { message: 'Your account has not been approved yet.'});
                console.log(user);
                return cb(null, user);
            });
        }
    ));

    passport.serializeUser(function (user, cb) {
        cb(null, user._id);
    });
    passport.deserializeUser(function (id, cb) {
        users.findById(id, cb);
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
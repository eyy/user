var passport = require('passport');

module.exports = function(app, users) {
    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: ['email'] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    app.get('/login', function(req, res) {
        if (req.isAuthenticated())
            res.redirect('/settings');

        res.locals.login_error = req.session.messages;
        req.session.messages = '';

        res.render('login', {
            title: 'login'
        });
    });
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureMessage: true
    }));
    app.post('/register', function(req, res){
        var user = new users({
            email: req.body.email,
            password: req.body.password
        });
        user.save(function (err, user) {
            if (err)
                return res.render('login', {
                    title: 'Login',
                    register_error: 'The email you specified is already in use. Please sign up with a different email account.'
                });
            res.redirect('/');
        });
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('*', function(req, res, next) {
        if (req.isAuthenticated())
            res.locals.user = req.user;

        next();
    });
};
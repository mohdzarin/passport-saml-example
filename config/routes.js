module.exports = function (app, config, passport) {

  app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
      res.render('home',
        {
          user: req.user
        });
    } else {
      res.render('home',
        {
          user: null
        });
    }
  });

  app.get('/login',
    passport.authenticate(config.passport.strategy,
      {
        successRedirect: '/',
        failureRedirect: '/login'
      })
  );

  app.post(config.passport.saml.path,
    passport.authenticate(config.passport.strategy,
      {
        failureRedirect: '/',
        failureFlash: true
      }),
    function (req, res) {
      res.redirect('/');
    }
  );

  app.get('/signup', function (req, res) {
    res.render('signup');
  });

  app.get('/profile', function (req, res) {
    if (req.isAuthenticated()) {
      res.render('profile',
        {
          user: req.user
        });
    } else {
      res.redirect('/login');
    }
  });

  app.get('/logout', function (req, res) {
    req.logout();
    // TODO: invalidate session on IP
    res.redirect('/');
  });

  // https://stackoverflow.com/questions/25271072/logging-out-using-passport-saml-req-logout-or-strategy-logout-or-both
  app.post('/auth/saml/logout/callback', passport.logoutSamlCallback);


  // Dahlia's
  app.get('/metadata', function(req, res) {
	const fs = require('fs');
	const decryptionCert = fs.readFileSync('config/our.key', 'utf-8');
	const https_cert = fs.readFileSync('config/our.cer', 'utf-8');
	const https_pvk = fs.readFileSync('config/our.key', 'utf-8');
	const saml = require('passport-saml');
	const idp_signing = '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';
	const idp_encryption = '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';
	
//	const multiSamlStrategy = require('passport-saml/multiSamlStrategy');
	
	const saml_strategy = new saml.Strategy(
		{
			'callbackUrl': 'http://mzsamltest:3001/login/callback',
			'entryPoint': 'https://10.4.107.58/idpaa/saml2/idp/SSOService.php',
			'issuer': 'passport-saml-mz',
			'logoutUrl': 'https://10.4.107.58/idpaa/saml2/idp/SingleLogoutService.php',
			'logoutCallbackUrl': 'http://mzsamltest:3001/logout',
			'decryptionPvk': https_pvk,
                        'privateCert': https_pvk,
                        'authnContext': 'urn:oasis:names:tc:SAML:2.0:ac:classes:Kerberos',
                        'signatureAlgorithm': 'sha256'

		},
		function (profile, done) 
		{
			console.log('passport.use() profile: %s \n', JSON.stringify(profile));
			return done(
				null,
				{ 
					'nameIDFormat': profile.nameIDFormat, 
					'nameID': profile.nameID 
				}
			);
		}
	);
	res.type('application/xml');
	res.send((saml_strategy.generateServiceProviderMetadata(https_cert, https_cert)));
  });

};

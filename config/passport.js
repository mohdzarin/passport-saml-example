const SamlStrategy = require('passport-saml').Strategy;

module.exports = function (passport, config) {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(new SamlStrategy(
    {
      path: config.passport.saml.path,
      entryPoint: config.passport.saml.entryPoint,
      issuer: config.passport.saml.issuer,
      cert: config.passport.saml.cert,
      privateCert: config.passport.saml.privateCert,
      identifierFormat: config.passport.saml.identifierFormat,
      signatureAlgorithm: config.passport.saml.signatureAlgorithm,
      decryptionPvk: config.passport.saml.decryptionPvk,
      decryptionCert: config.passport.saml.decryptionCert,
      authnContext: config.passport.saml.authnContext,
      logoutCallbackUrl: config.passport.saml.logoutCallbackUrl,
      logoutUrl: config.passport.saml.logoutUrl
    },
    function (profile, done) {
      return done(null,
        {
          id: profile.uid,
          email: profile.email,
          displayName: profile.cn,
          firstName: profile.givenName,
          lastName: profile.sn,
          nameIDFormat: profile.nameIDFormat,
          nameID: profile.nameID
       });

//          // ref: https://stackoverflow.com/questions/25271072/logging-out-using-passport-saml-req-logout-or-strategy-logout-or-both
//          var user = {};
//          //user.saml = {};
//          user.saml.nameID = profile.nameID;
//          user.saml.nameIDFormat = profile.nameIDFormat;
//
//          //Do save
    })
  );

  // https://stackoverflow.com/questions/25271072/logging-out-using-passport-saml-req-logout-or-strategy-logout-or-both
  passport.logoutSaml = function(req, res) {
    //Here add the nameID and nameIDFormat to the user if you stored it someplace.
//    req.user.nameID = req.user.saml.nameID;
//    req.user.nameIDFormat = req.user.saml.nameIDFormat;


    SamlStrategy.logout(req, function(err, request){
        if(!err){
            //redirect to the IdP Logout URL
            res.redirect(request);
        }
    });
  };

  passport.logoutSamlCallback = function(req, res){
    req.logout();
    res.redirect('/');
  }

};

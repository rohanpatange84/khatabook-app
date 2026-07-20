const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(`👤 Google Auth profile received: ${profile.displayName} (${profile.id})`);

        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || `${profile.id}@google.user`;
        const avatar = (profile.photos && profile.photos[0] && profile.photos[0].value) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || 'User')}&background=0D8ABC&color=fff`;

        // Check if a user with this email already exists (from another login)
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          if (avatar) user.avatar = avatar;
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName || 'Google User',
          email: email,
          avatar: avatar,
        });

        return done(null, user);
      } catch (err) {
        console.error('❌ Passport Google Strategy error:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

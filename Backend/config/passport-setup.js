// backend/config/passport-setup.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';
import crypto from 'crypto';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Callback ini berjalan setelah user berhasil login dengan Google
      try {
        // Cek apakah user sudah ada di database kita
        let user = await User.findOne({ email: profile._json.email });

        if (user) {
          // Jika user sudah ada, lanjutkan
          return done(null, user);
        } else {
          // Jika user belum ada, buat user baru
          const newUser = await User.create({
            name: profile._json.name,
            email: profile._json.email,
            // Karena password 'required', kita buat password acak untuk user OAuth
            password: crypto.randomBytes(16).toString('hex'),
          });
          return done(null, newUser);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Ini diperlukan oleh express-session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

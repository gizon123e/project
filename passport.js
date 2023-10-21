const passport = require('passport');
const LocalStrategy = require('passport-local');
const CryptoJS = require("crypto-js");
const { User } = require('./model'); // Import model Password
const connect = require('./db')

const verifyCallback = async (username, password, done) => {
  const connection = await connect();
  const found = await User.findOne({
    username,
  })
  .then((user)=>{
    if(!user){
      console.log(`Username ${username} tidak ada`)
      return done(null, false)
    }else{
      const decrypted = CryptoJS.AES.decrypt(user.password, 'secret key 123').toString(CryptoJS.enc.Utf8)
      if(decrypted === password){
        return done(null, user)
      }else{
        return done(null, false)
      }
    }
  })
  .catch((error)=>{
    console.log(error)
  })

}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  // Dalam hal ini, Anda hanya perlu mencari pengguna berdasarkan id
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

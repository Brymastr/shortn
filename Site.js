const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
mongoose.Promise = Promise;


module.exports = mongoose.model('Site', Schema({
  url: String,
  code: String,
  views: {type: Number, default: 0},
  date_created: {type: Date, default: new Date()},

  user_agent: String,
  user_ip: String,
  user_cookie: String
}));
var mongoose = require('mongoose')
// 聊天记录模型
var CountrySchema = new mongoose.Schema({
  country: String,
  update_time: {
    type: Date,
    default: Date.now()
  },
  K: Number,
  water: Number,
  fire: Number,
  wood: Number,
  stone: Number,
  seed: Number
})

module.exports = CountrySchema

const { model, Schema } = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  favoriteGenre: {
    type: String,
  },
})

schema.plugin(uniqueValidator)

module.exports = model('User', schema)
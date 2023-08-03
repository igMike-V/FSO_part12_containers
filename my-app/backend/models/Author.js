const { model, Schema } = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
  },
  bookCount: {
    type: Number,
  },
})

schema.plugin(uniqueValidator)

module.exports = model('Author', schema)
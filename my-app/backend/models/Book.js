const { model, Schema } = require('mongoose')

// you must install this library
const uniqueValidator = require('mongoose-unique-validator')

const schema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    {type: String}
  ]
})

schema.set('toJson', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

schema.plugin(uniqueValidator)

module.exports = model('Book', schema)
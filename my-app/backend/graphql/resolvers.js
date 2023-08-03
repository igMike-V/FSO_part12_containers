const Author = require('../models/Author')
const Book = require('../models/Book')
const User = require('../models/User')
const { bookCountLoader } = require('../loaders')

const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require(`graphql-subscriptions`)
const pubsub = new PubSub()

module.exports = {
  Author: {
    bookCount: async (parent) => {
      const books = await bookCountLoader.load(parent._id)
      return books.length
    }
  },
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (_, {author, genre}) => {
      const bookReturn = await Book.find({})
        .populate('author')
      let filteredBooks = [...bookReturn]
      if (author) {
        filteredBooks = filteredBooks.filter(book => book.author.name === author)
      }
      if (genre) {
        filteredBooks = filteredBooks.filter(book => book.genres.find(element => element === genre))
      }
      return filteredBooks
    },
    allAuthors: async () => {
      return await Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, {title, author, published, genres, ...args}, context) => {
      // get logged in user
      const currentUser = context.currentUser
      
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      // check for author
      let authorRef = await Author.findOne({ name: author })
      console.log(authorRef)
      if(!authorRef) {
        // Create a new author
        authorRef = new Author({ name: author, born: null })
        console.log(authorRef)
        authorRef = await authorRef.save()
      }

      // Create the book
      const book = new Book({
        title, 
        author: authorRef._id,
        published,
        genres
      })
      try {
        const savedBook = await book.save()
        const bookToPublish = await Book.findById(savedBook._id).populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: bookToPublish })
        
        return bookToPublish

      } catch ( error ) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      
    },
    editAuthor: async (_, { name, setBornTo }, context) => {
      const currentUser = context.currentUser
      // Fail if not authorized
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOne({ name })
      if (author) {
        author.born = setBornTo
        try {
          const editedAuthor = await author.save()
          return editedAuthor
        } catch (error) {
          throw new GraphQLError('Editing date failed', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              invalidArgs: name,
              error
            }
          })
        }
      } else {
        throw new GraphQLError('date edit failed, invalid author name', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: name,
          }
        })
      }
    },
    createUser: async (_, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre})
      try {
        const savedUser = await user.save()
        return savedUser
      } catch (error) {
        throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
      }
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username })

      if (!user || password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT'}
        })
      }
      
      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  },
}
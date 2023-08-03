const DataLoader = require('dataloader')
const Book = require('./models/Book')

const batchBooksByAuthor = async (authors) => {
  // Find all the books
  const books = await Book.find({ author: { $in: authors } })
  
  // group books into author ids
  const bookLists = authors.map((id) =>
    books.filter((book) => {
      return book.author.toString() === id.toString()
    })
  )

  return bookLists
}

const bookCountLoader = new DataLoader(batchBooksByAuthor)

module.exports = {
  bookCountLoader,
}
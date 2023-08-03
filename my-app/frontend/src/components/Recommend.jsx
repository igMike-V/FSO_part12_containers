import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = () => {
  const user = useQuery(ME)

  const result = useQuery(ALL_BOOKS)

  if (result.loading || user.loading) {
    return <div>loading...</div>
  }

  const allBooks = result.data.allBooks
  const userGenre = user.data.me.favoriteGenre
  
  const bookList = (allBooks) => {
    let sortedBooks = allBooks.filter(book => book.genres.find(g => g === userGenre))

    return sortedBooks.map(book => {
      return (
        <tr key={book.id}>
          <td>{book.title}</td>
          <td>{book.author.name}</td>
          <td>{book.published}</td>
        </tr>
      )
    })
  }

  return (
    <div>
      <h2>Recommended {userGenre} Books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookList(allBooks)}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend

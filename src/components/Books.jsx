import { useState, useMemo } from "react";
import { FILTERED_BOOKS } from "../queries";
import { gql, useQuery, useApolloClient } from "@apollo/client";

const Books = ({ books, show, currentUser }) => {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const genres = useMemo(() => {
    const uniqueGenres = new Set(books.flatMap((book) => book.genres));
    return ["All", ...Array.from(uniqueGenres).sort()];
  }, [books]);

  // Filter books based on selected genre
  // const filteredBooks = useMemo(() => {
  //   if (selectedGenre === "All") return books;
  //   return books.filter((book) => book.genres.includes(selectedGenre));
  // }, [selectedGenre, books]);

  const result = useQuery(FILTERED_BOOKS, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
  });

  let filteredBooks;

  if (selectedGenre === "All") filteredBooks = books;
  else if (selectedGenre && result.data) {
    filteredBooks = result.data.filteredBooks;
  } else {
    filteredBooks = books;
  }

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
              <td>
                {a.genres.map((genre) => (
                  <span
                    key={genre}
                    variant={genre === selectedGenre ? "default" : "secondary"}
                  >
                    {genre}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre) => (
        <button
          key={genre}
          variant={selectedGenre === genre ? "default" : "outline"}
          onClick={() => setSelectedGenre(genre)}
        >
          {genre}
        </button>
      ))}
      <button onClick={() => setSelectedGenre(currentUser.favoriteGenre)}>
        recommended
      </button>
      {filteredBooks.length === 0 && (
        <tr>
          <td colSpan={3}>No books found for this genre</td>
        </tr>
      )}
    </div>
  );
};

export default Books;

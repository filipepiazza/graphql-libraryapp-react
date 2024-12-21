import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from "../graphql/queries";
// import { updateCacheBook } from "../App";
// updateCacheBook;

const uniqByName = (a) => {
  let seen = new Set();
  return a.filter((item) => {
    let k = item.title;
    return seen.has(k) ? false : seen.add(k);
  });
};

const updateCacheBook = (cache, query, addedBook) => {
  console.log("addedbook", addedbook);

  // helper that is used to eliminate saving same person twicE
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const NewBook = ({ setError, show }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(0);
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    //refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      console.log("error", error);
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      setError(messages);
    },
    update: (cache, response) => {
      updateCacheBook(cache, { query: ALL_BOOKS }, response.data.addBook);

      // cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
      //   return {
      //     allBooks: allBooks.concat(response.data.addBook),
      //   };
      // });
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.concat(response.data.addBook.author),
        };
      });
    },
  });

  if (!show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
    let numberPublish = Number(published);
    console.log(title, author, published, genres);

    createBook({
      variables: {
        title,
        author,
        published: numberPublish,
        genres,
      },
    });

    console.log("add book...");

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;

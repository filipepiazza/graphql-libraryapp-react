// import { gql, useQuery } from "@apollo/client";
//import PersonForm from "./components/PersonComponents/PersonForm";
//import Notify from "./components/Notify";
// import { ALL_PERSONS } from "./queries";
//import PhoneForm from "./components/PersonComponents/PhoneForm";
// const App = () => {
//   const [errorMessage, setErrorMessage] = useState(null);

//   const result = useQuery(ALL_PERSONS); //, {
//   //   pollInterval: 2000, //have to poll server to update screen
//   // });

//   if (result.loading) {
//     return <div>loading...</div>;
//   }

//   const notify = (message) => {
//     setErrorMessage(message);
//     setTimeout(() => {
//       setErrorMessage(null);
//     }, 10000);
//   };

//   return (
//     <div>
//       <Notify errorMessage={errorMessage} />
//       <Persons persons={result.data.allPersons} />
//       <PersonForm setError={notify} />
//       <PhoneForm setError={notify} />
//     </div>
//   );
// };

// export default App;

import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  BOOK_ADDED,
  CURRENT_USER,
  PERSON_ADDED,
} from "./graphql/queries";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";

const uniqByName = (a) => {
  let seen = new Set();
  return a.filter((item) => {
    let k = item.title;
    return seen.has(k) ? false : seen.add(k);
  });
};

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedPerson) => {
  // helper that is used to eliminate saving same person twicE
  cache.updateQuery(query, ({ allPersons }) => {
    return {
      allPersons: uniqByName(allPersons.concat(addedPerson)),
    };
  });
};

// function that takes care of manipulating cache
export const updateCacheBook = (cache, query, addedBook) => {
  console.log("addedBook", addedBook);

  // helper that is used to eliminate saving same person twicE
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: allBooks.concat(addedBook),
    };
  });
};

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);

  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const currentUser = useQuery(CURRENT_USER);

  useSubscription(PERSON_ADDED, {
    onData: ({ data, client }) => {
      const addedPerson = data.data.personAdded;
      notify(`${addedPerson.name} added`);
      updateCache(client.cache, { query: ALL_PERSONS }, addedPerson);
    },
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      console.log("data", data);

      notify(`${addedBook.title} added`);
      updateCacheBook(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  console.log("currentuser", currentUser);

  console.log("authorsResult", authorsResult);
  console.log("booksResult", booksResult);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore(); // clears apollo cahe, some saved query results are login-requred
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 1000);
  };

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    );
  }

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>
      <Notify errorMessage={errorMessage} />
      {token && <button onClick={logout}>logout</button>}
      <Authors
        authors={authorsResult.data.allAuthors}
        show={page === "authors"}
        setError={notify}
      />

      <Books
        books={booksResult.data.allBooks}
        show={page === "books"}
        currentUser={currentUser.data.me}
      />

      <NewBook setError={notify} show={page === "add"} />
    </div>
  );
};

export default App;

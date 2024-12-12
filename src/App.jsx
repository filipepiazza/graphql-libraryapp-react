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
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, CURRENT_USER } from "./queries";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);

  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const currentUser = useQuery(CURRENT_USER);

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
    }, 10000);
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

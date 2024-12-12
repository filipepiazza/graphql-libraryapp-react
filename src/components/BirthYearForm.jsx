import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from "../queries";

import Select from "react-select";

const BirthYearForm = ({ authors, setError }) => {
  const [born, setBorn] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const [changeBirthYear, result] = useMutation(EDIT_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      setError(messages);
    },
  });

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError("author not found");
    }
  }, [result.data]);

  const options = authors.map((author) => {
    return { value: author.name, label: author.name };
  });

  const submit = (event) => {
    event.preventDefault();
    const numberYear = Number(born);
    changeBirthYear({
      variables: { name: selectedOption.value, born: numberYear },
    });

    setSelectedOption(null);
    setBorn("");
  };

  return (
    <div>
      <h2>change birth year</h2>

      <form onSubmit={submit}>
        <Select
          value={selectedOption}
          onChange={setSelectedOption}
          options={options}
          placeholder={"select availble author"}
        />
        <div>
          born{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">change year</button>
      </form>
    </div>
  );
};

export default BirthYearForm;

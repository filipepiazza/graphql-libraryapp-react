import BirthYearForm from "./BirthYearForm";

const Authors = ({ authors, show, setError }) => {
  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.booksByAuthor}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BirthYearForm authors={authors} setError={setError} />
    </div>
  );
};

export default Authors;

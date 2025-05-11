export const formatDescription = (description) => {
  const lines = description.split("\n");

  return lines.map((line, index) => (
    <div key={index}>
      {line}
      <br />
    </div>
  ));
};

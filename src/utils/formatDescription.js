const formatDescription = (description) => {
  const lines = description.split("\n");

  const formattedDescription = lines.map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return formattedDescription;
};

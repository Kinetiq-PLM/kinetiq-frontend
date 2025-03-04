import React from "react";

const SearchBar = () => {
  return (
    <div style={styles.container}>
      <img src="/icons/search.svg" alt="Search" style={styles.icon} />
      <input type="text" placeholder="Search..." style={styles.input} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F7F9FB",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    width: "100%",
    maxWidth: "300px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  icon: {
    width: "20px",
    height: "20px",
    marginRight: "0.5rem",
  },
  input: {
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    flex: 1,
    fontSize: "1rem",
  },
};

export default SearchBar;

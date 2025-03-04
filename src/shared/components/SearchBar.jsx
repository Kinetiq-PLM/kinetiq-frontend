import React from "react";

const SearchBar = () => {
  return (
    <div style={styles.container}>
      <img src="/icons/search-icon.png" alt="Search" style={styles.icon} />
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
    maxWidth: "20rem",
  },
  icon: {
    width: "1rem",
    height: "1rem",
    marginRight: "0.5rem",
  },
  input: {
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    flex: 1,
    fontSize: "1rem",
    color:"#787878"
  },
};

export default SearchBar;

import { AlignCenter } from "lucide-react";
import React, { useState } from "react";

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      style={{
        ...styles.container,
        //border: isFocused ? "1px solid rgba(11, 129, 125, 0.62)" : "none", // Add border on focus
        boxShadow: isFocused ? "0 0 5px rgba(0, 155, 149, 0.61)" : "none", // Add glow effect
      }}
    >
      <img src="/icons/search-icon.png" alt="Search" style={styles.icon} />
      <input
        type="text"
        placeholder="Search..."
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    backgroundColor: "#F7F9FB",
    border: "1px solid rgb(239, 239, 239)",
    borderRadius: "0.5rem",
    width: "100%",
    height: "2rem",
    maxWidth: "40rem",
    justifyContent: "center",
    transition: "border 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
    alignItems: "center",
    paddingLeft: "0.5rem",
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
    fontSize: "0.8rem",
    color: "#787878",
    height: "100%",
    margin: "0rem",
  },
};

export default SearchBar;

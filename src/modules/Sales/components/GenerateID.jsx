export const generateRandomID = (prefix) => {
  const characters = "0123456789ABCDEF";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return prefix + "-" + result;
};

export default generateRandomID;

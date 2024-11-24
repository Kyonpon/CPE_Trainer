const TextComponent = ({ text }) => {
  console.log("TextComponent received text:", text);
  return <p>{text}</p>;
};
export default TextComponent;

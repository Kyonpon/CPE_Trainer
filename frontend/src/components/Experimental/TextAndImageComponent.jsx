const TextAndImageComponent = ({ text, imageUrl, altText }) => {
  return (
    <div>
      <p>{text}</p>
      <img src={imageUrl} alt={altText} style={{ maxWidth: "100%" }} />
    </div>
  );
};

export default TextAndImageComponent;

const ImageComponent = ({ imageUrl, altText }) => {
  return <img src={imageUrl} alt={altText} style={{ maxWidth: "100%" }} />;
};

export default ImageComponent;

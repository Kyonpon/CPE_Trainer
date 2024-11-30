import { useParams } from "react-router-dom";
//import GetCBById from "../components/Experimental/GetCBById";
import { useCBCircuits } from "../hooks/zustandCBCircuit";
import { useEffect, useState } from "react";
import TextAndImageComponent from "../components/Experimental/TextAndImageComponent";
import TextComponent from "../components/Experimental/TextComponent";
import ImageComponent from "../components/Experimental/ImageComponent";
import { Box } from "@chakra-ui/react";

function Activitiescircuitpages() {
  const { id } = useParams();
  const { fetchSingleCBCircuit } = useCBCircuits();
  const [fetchedCircuitContent, setFetchedCircuitContent] = useState([]);
  const [fetchedCircuit, setFetchedCircuit] = useState(null);

  useEffect(() => {
    const fetchCircuit = async () => {
      if (!id) {
        console.error("Wrong URL Format");
        return;
      }

      try {
        const fetchedData = await fetchSingleCBCircuit(id);
        console.log("Fetched Data:", fetchedData);

        // Check if the response contains valid circuit and content
        if (fetchedData?.content && fetchedData.content.length > 0) {
          setFetchedCircuit(fetchedData); // Set fetched data
          setFetchedCircuitContent(fetchedData.content); // Set the content
        } else {
          console.error("No content found in the fetched circuit.");
        }
      } catch (error) {
        console.error("Error in fetching circuit:", error);
      }
    };

    fetchCircuit();
  }, [id]);

  const renderContent = (contentItem) => {
    switch (contentItem.type) {
      case "Text":
        return <TextComponent key={contentItem._id} text={contentItem.text} />;
      case "Image":
        return (
          <ImageComponent
            key={contentItem._id}
            imageUrl={contentItem.imageUrl}
            altText={contentItem.altText}
          />
        );
      case "TextAndImage":
        return (
          <TextAndImageComponent
            key={contentItem._id}
            text={contentItem.text}
            imageUrl={contentItem.imageUrl}
            altText={contentItem.altText}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Activity Page</h1>
      <p>Activity ID: {id}</p>

      {/* Pass the ID as a prop to child components */}
      {/* <GetCBById id={id} /> */}
      <Box>{fetchedCircuitContent.map((item) => renderContent(item))}</Box>
    </div>
  );
}

export default Activitiescircuitpages;

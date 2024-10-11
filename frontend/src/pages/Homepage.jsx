import { Box } from "@chakra-ui/react";
import HomeCards from "../components/HomeCards";

const Homepage = () => {
  return (
    <Box pl={4}>
      <p>Homepage</p>
      <Box display="flex" justifyContent="center" gap="20px" flexFlow="wrap">
        <HomeCards
          url="/ulcircuitsHome"
          imgurl="https://picsum.photos/250"
          imgurlalt="This is a picture"
          title="Universal Logic Circuit"
        />
        <HomeCards
          url="/cbcircuitsHome"
          imgurl="https://picsum.photos/250"
          imgurlalt="This is a picture"
          title="Combinational Logic Circuits"
        />
        <HomeCards
          url="/74lstesterhome"
          imgurl="https://picsum.photos/250"
          imgurlalt="This is a picture"
          title="74LS Series IC Tester"
        />
        <HomeCards
          url="/logicciruittesterhome"
          imgurl="https://picsum.photos/250"
          imgurlalt="This is a picture"
          title="Circuit Tester"
        />
        <HomeCards
          url="/abouthome"
          imgurl="https://picsum.photos/250"
          imgurlalt="This is a picture"
          title="About"
        />
      </Box>
    </Box>
  );
};

export default Homepage;

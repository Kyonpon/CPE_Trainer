import { Box } from "@chakra-ui/react";
import HomeCards from "../components/HomeCards";
import { useLogin } from "../hooks/zustandUsers";
import { useEffect } from "react";

const Homepage = () => {
  const { admin, showEdit, setAdmin } = useLogin();

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const userID = localStorage.getItem("userID");
      if (!userID) {
        console.log("User ID not found in localStorage");
        return;
      }
      const isAdmin = await showEdit(userID); // Wait for the promise to resolve
      console.log("Admin status:", isAdmin); // Log the admin status
      setAdmin(isAdmin); // Set the admin state
    };

    fetchAdminStatus(); // Call the function to fetch admin status
  }, [showEdit, setAdmin]); // Dependencies include only stable functions

  console.log("Admin State:", admin);
  return (
    <Box pl={4}>
      <p>Homepage</p>
      <Box display="flex" justifyContent="center" gap="20px" flexFlow="wrap">
        <HomeCards
          url="/microprocessorHome"
          imgurl="https://picsum.photos/250"
          imgurlalt="This is a picture"
          title="Microprocessors"
        />
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

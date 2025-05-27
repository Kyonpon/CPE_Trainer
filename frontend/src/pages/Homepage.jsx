import { Box } from "@chakra-ui/react";
import HomeCards from "../components/HomeCards";
import { useLogin } from "../hooks/zustandUsers";
import { useEffect } from "react";

const Homepage = () => {
  const { admin, showEdit, setAdmin } = useLogin();

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const userID = localStorage.getItem("userID");

      if (!userID || userID === "undefined" || userID === null) {
        console.log("User is not logged in; no userID in localStorage.");
        setAdmin(false); // Ensure admin state is set to false
        return; // Exit early if no userID is found
      }

      try {
        const isAdmin = await showEdit(userID); // Call the backend if userID exists
        console.log("Admin status:", isAdmin);
        setAdmin(isAdmin); // Update admin state
      } catch (error) {
        console.error("Error fetching admin status:", error);
      }
    };

    fetchAdminStatus();
  }, [showEdit, setAdmin]);

  console.log("Admin State:", admin);
  return (
    <Box pl={4}>
      <p>Homepage</p>
      <Box display="flex" justifyContent="center" gap="20px" flexFlow="wrap">
        {/* <HomeCards
          url="/microprocessorHome"
          imgurl="https://picsum.photos/250"
          imgurlalt="This is a picture"
          title="Microprocessors"
        /> */}
        <HomeCards
          url="/ulcircuitsHome"
          imgurl="public/images/activities/universal/nand/card.png"
          imgurlalt="This is a picture"
          title="Universal Logic Circuit"
        />
        <HomeCards
          url="/cbcircuitsHome"
          imgurl="public/images/activities/combinational/full_adder/card.png"
          imgurlalt="This is a picture"
          title="Combinational Logic Circuits"
        />
        <HomeCards
          url="/74lstesterhome"
          imgurl="public/images/ic_tester.png"
          imgurlalt="This is a picture"
          title="74LS Series IC Tester"
        />
        <HomeCards
          url="/logicciruittesterhome"
          imgurl="public/images/circuit_checker.png"
          imgurlalt="This is a picture"
          title="Circuit Tester"
        />
        {/* <HomeCards
          url="/abouthome"
          imgurl="https://picsum.photos/250"
          imgurlalt="This is a picture"
          title="About"
        /> */}
      </Box>
    </Box>
  );
};

export default Homepage;

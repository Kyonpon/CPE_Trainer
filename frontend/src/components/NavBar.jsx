import {
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { CiSquarePlus } from "react-icons/ci";
import { SlLogin, SlLogout } from "react-icons/sl";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/zustandUsers";

const NavBar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode(); // Corrected here
  const { setAdmin, admin } = useLogin();

  const bgColor = colorMode === "dark" ? "gray.700 " : "#ababaf";

  const handleLogout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    setAdmin(false);
    navigate("/login");
    console.log("Admin State: ", admin);
  };

  return (
    <Container maxW={"1140px"} px={4} bg={bgColor} maxWidth="100%">
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400,blue.500)"}
          bgClip={"text"}
        >
          <Link to={"/"}>MCU BASED: LOGIC CIRCUIT TRAINER</Link>
        </Text>

        <HStack spacing={3} alignItems={"center"}>
          {!cookies.access_token ? (
            <Link to="/login">
              <SlLogin fontSize={30} />
            </Link>
          ) : (
            <button onClick={handleLogout}>
              <Link>
                <SlLogout fontSize={30} />
              </Link>
            </button>
          )}
          {/* <Link to={"/create"}>
            <CiSquarePlus fontSize={40} />
          </Link> */}
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? "🌙" : "☀️"} {/* Corrected here */}
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
};

export default NavBar;

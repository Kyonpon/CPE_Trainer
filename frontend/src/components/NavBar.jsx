import {
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { CiSquarePlus } from "react-icons/ci";
import { SlLogin } from "react-icons/sl";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Corrected here

  return (
    <Container maxW={"1140px"} px={4}>
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
          <Link to={"/"}>CPE-4B</Link>
        </Text>

        <HStack spacing={3} alignItems={"center"}>
          <Link to="/login">
            <SlLogin fontSize={30} />
          </Link>
          <Link to={"/create"}>
            <CiSquarePlus fontSize={40} />
          </Link>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? "🌙" : "☀️"} {/* Corrected here */}
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
};

export default NavBar;

import { Box } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

function LoginComp() {
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          username: regUsername,
          password: regPassword,
        }
      );
      console.log(response);
      if (response.data.success) {
        navigate("/");
        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID);
      } else {
        alert("Wrong password or username");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box bgColor="blue.800" p={3} borderRadius={"xl"}>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <VStack mb={3}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              placeholder="Username"
              type="text"
              id="lusername"
              value={regUsername}
              onChange={(event) => setRegUsername(event.target.value)}
            />

            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              placeholder="password"
              type="password"
              id="lpassword"
              value={regPassword}
              onChange={(event) => setRegPassword(event.target.value)}
            />
          </VStack>
          <Button type="submit">Login</Button>
        </FormControl>
      </form>
    </Box>
  );
}

export default LoginComp;

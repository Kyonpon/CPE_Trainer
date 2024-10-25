import { Box } from "@chakra-ui/react";
import CreateCard from "../components/CreateCard";
import { useCBCircuits } from "../hooks/zustandCBCircuit";
import { useEffect } from "react";
import UniversalLogicCard from "../components/UniversalLogicCard";

function Combinationallogicmenupage() {
  const { fetchCBCircuits, combiLogicCircuit } = useCBCircuits();

  useEffect(() => {
    // Only fetch circuits if the array is empty
    if (combiLogicCircuit.length === 0) {
      fetchCBCircuits();
    }
  }, [fetchCBCircuits, combiLogicCircuit.length]);

  console.log("CB Circuits", combiLogicCircuit);
  return (
    <Box p={4}>
      <h1>Combinational Logic Circuits</h1>
      <Box display="flex" justifyContent="center" gap="20px" flexFlow="wrap">
        {combiLogicCircuit.map((combiLogic) => (
          <UniversalLogicCard
            key={combiLogic._id} // Use combiLogic._id or combiLogic.id based on your data structure
            url={`/circuit/${combiLogic._id}`} // Assuming the URL uses the circuit's ID
            imgurl={combiLogic.imageUrl}
            imgurlalt={combiLogic.combiLogicCircuitName}
            title={combiLogic.combiLogicCircuitName}
          />
        ))}
        <CreateCard url="/createcb" title="Create New Circuit"></CreateCard>
      </Box>
    </Box>
  );
}

export default Combinationallogicmenupage;

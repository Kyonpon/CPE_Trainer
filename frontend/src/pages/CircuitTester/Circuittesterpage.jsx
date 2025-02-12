import { Box, Button } from "@chakra-ui/react";
import CombiCheckModule from "../../components/CircuitTesterComponents/CombiCheckModule";
import { useModuleInstances } from "../../hooks/circuitTesterGlobalStates/zustandModuleInstances";
import { useEffect, useState } from "react";

function Circuittesterpage() {
  const { ModuleInstances, addModule, removeModule } = useModuleInstances();
  const [moduleTracker, setModuleTracker] = useState([]);

  const handleAddModule = () => {
    addModule();
  };

  const handleDebug = () => {
    console.log(ModuleInstances);
  };

  useEffect(() => {
    setModuleTracker(Object.keys(ModuleInstances));
  }, [ModuleInstances]);

  return (
    <Box>
      <Button onClick={handleAddModule}>Add ESP-1</Button>
      <Button onClick={handleDebug}> Debug Modules</Button>
      {moduleTracker.map((module) => (
        <CombiCheckModule
          key={module}
          moduleName={module}
          onDeleteModule={() => removeModule(module)}
        />
      ))}
    </Box>
  );
}

export default Circuittesterpage;

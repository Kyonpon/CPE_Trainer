import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
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
      {/* {moduleTracker.map((module) => (
        <CombiCheckModule
          key={module}
          moduleName={module}
          onDeleteModule={() => removeModule(module)}
        />
      ))} */}
      <Tabs>
        <TabList>
          {moduleTracker.map((module) => (
            <Tab key={module}>{module}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {moduleTracker.map((module) => (
            <TabPanel key={module}>
              <CombiCheckModule
                moduleName={module}
                onDeleteModule={() => removeModule(module)}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Circuittesterpage;

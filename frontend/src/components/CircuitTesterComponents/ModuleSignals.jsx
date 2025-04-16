import { VStack } from "@chakra-ui/react";
import SignalChart from "./SignalChart";

function ModuleSignals({ signals }) {
  return (
    <VStack>
      {Object.entries(signals).map(([label, data]) => (
        <SignalChart
          key={label}
          title={label}
          data={data}
          showToggleLines={true}
        />
      ))}
    </VStack>
  );
}

export default ModuleSignals;

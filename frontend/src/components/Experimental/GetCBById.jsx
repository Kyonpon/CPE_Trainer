import { useEffect } from "react";
import { useCBCircuits } from "../../hooks/zustandCBCircuit";
import PropTypes from "prop-types";

function GetCBById(props) {
  const { fetchSingleCBCircuit } = useCBCircuits();

  useEffect(() => {
    const fetchCircuit = async () => {
      if (!props.id) {
        console.error("No circuit ID provided");
        return;
      }

      const circuit = await fetchSingleCBCircuit(props.id);
      if (circuit) {
        console.log("Fetched Circuit:", circuit);
      } else {
        console.error("Failed to fetch the circuit.");
      }
    };

    fetchCircuit();
  }, [props.id, fetchSingleCBCircuit]);
  return <div>Check the console for circuit details!</div>;
}

GetCBById.propTypes = {
  id: PropTypes.string,
};

export default GetCBById;

import { useParams } from "react-router-dom";
import GetCBById from "../components/Experimental/GetCBById";

function Activitiescircuitpages() {
  const { id } = useParams();

  return (
    <div>
      <h1>Activity Page</h1>
      <p>Activity ID: {id}</p>

      {/* Pass the ID as a prop to child components */}
      <GetCBById id={id} />
    </div>
  );
}

export default Activitiescircuitpages;

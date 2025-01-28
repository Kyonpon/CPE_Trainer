import { generateKMap } from "../../utils/BoolUtils";
import PropTypes from "prop-types";

const BoolKmap = ({ variables, minTerms }) => {
  if (!minTerms || variables.length < 2 || variables.length > 6) return null;

  const kmapHTML = generateKMap(minTerms, variables);

  return (
    <div>
      <div style={{ fontWeight: "500", padding: "16px" }}>Karnaugh Map:</div>
      <div dangerouslySetInnerHTML={{ __html: kmapHTML }} />
    </div>
  );
};

BoolKmap.propTypes = {
  variables: PropTypes.array.isRequired,
  minTerms: PropTypes.array.isRequired,
};
export default BoolKmap;

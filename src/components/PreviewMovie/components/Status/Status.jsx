import { getStatus } from "../../../../utils/getStatus";

export const Status = ({ status }) => {
  return (
    <div>
      <span>Status: </span>
      <span>{getStatus(status)}</span>
    </div>
  );
};

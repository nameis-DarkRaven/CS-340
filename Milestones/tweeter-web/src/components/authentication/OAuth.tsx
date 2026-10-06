import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useMessageActions } from "../toaster/MessageHooks";
import { IconName } from "@fortawesome/fontawesome-svg-core";

const OAuth = ({ platform }: { platform: string }) => {
  const { displayInfoMessage } = useMessageActions();
  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };
  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={() =>
        displayInfoMessageWithDarkBackground(
          `${platform} registration is not implemented.`,
        )
      }
    >
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`${platform.toLowerCase()}Tooltip`}>{platform}</Tooltip>
        }
      >
        <FontAwesomeIcon
          icon={["fab", `${platform.toLowerCase() as IconName}`]}
        />
      </OverlayTrigger>
    </button>
  );
};

export default OAuth;

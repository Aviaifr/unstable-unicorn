import { useContext, useEffect, useRef, useState } from "react";
import { Box } from "@material-ui/core";
import useClasses from "../../hooks/useClasses";
import { styles } from "./style";
import { IPlayingCard, emptyCard} from "components/gameTypes";
import cardback from "../../resources/cardback.jpg";
import babyback from "../../resources/babyback.png";
import ActivatableList from "../context/ActivateableCardsContext";
import TargetedCards from "../context/TargetableCardsContext";
import socketContext from "components/socketContext";
import ActivateOptionDialog from "components/ActivateOptionDialog";
import { SERVER_RCS_URL } from "services/services";
import classNames from "classnames";

type Props = {
  onClickHandler: (cardData?: IPlayingCard) => void;
  cardData: IPlayingCard;
  selected?: boolean;
};

export default function Card({ onClickHandler, cardData, selected }: Props) {
  // const isSelected = selected === undefined ? false : selected;
  const classes = useClasses(styles);
  const { name, slug, text, type, uid } = cardData;
  const activatables = useContext(ActivatableList);
  const targetedList = useContext(TargetedCards);
  const socket = useContext(socketContext);
  const [activatable, setActivatable] = useState(false);
  const [targeted, setTargeted] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const onClick = useRef(onClickHandler);
  const [mainCardClass, setMainCardClass] = useState("");

  useEffect(() => {
    let className = selected ? " " + classes.selected : "";
    className += activatable ? " " + classes.activatable : "";
    className += targeted ? " " + classes.targeted : "";

    setMainCardClass(className);
  }, [activatable, classes, selected, targeted]);

  useEffect(() => {
    if (targetedList.targets.includes(uid ?? "")) {
      setTargeted(true);
      onClick.current = () => {
        socket?.emit("pendingAction", targetedList.targetContext, uid);
      };
    } else {
      setTargeted(false);
      onClick.current = onClickHandler;
    }
  }, [onClickHandler, socket, targetedList, uid]);

  useEffect(() => {
    if (activatables.includes(uid ?? "")) {
      setActivatable(true);
      onClick.current = () => {
        setActivateDialogOpen(true);
      };
    } else {
      setActivatable(false);
    }
  }, [activatables, uid]);

  return (
    <>
      {activatable && (
        <ActivateOptionDialog
          setResponse={(selection) => {
            selection
              ? socket?.emit("pendingAction", uid, "y")
              : console.log("no");
            setActivateDialogOpen(false);
          }}
          open={activateDialogOpen}
          yesText={"Yes"}
          noText={"No"}
        >
          <Box>
            Would you like to activate {cardData.name} effect
            <br />
            <b>{cardData.text}</b>?
          </Box>
        </ActivateOptionDialog>
      )}
      {name ? (
        <Box
          onClick={(e) => {
            onClick.current(!selected ? cardData ?? emptyCard : emptyCard); // ?? part needed?
          }}
          className={classNames(classes.card, mainCardClass)}
          data-carduid={uid}
        >
          <img
            src={`${SERVER_RCS_URL}/typeIcons/${cardData.type}.gif`}
            className={classes.icon}
            alt="typeIcon"
          />
          <p
            className={classNames(
              classes.title,
              name.length > 16 && classes.smallerTitle
            )}
          >
            {cardData.name}
          </p>
          <img src={`${SERVER_RCS_URL}/images/${slug}.jpg`} alt="art" />
          <p className={classNames(classes.type, type && classes[type])}>
            Card Type: {type}
          </p>
          <p className={classes.text}>{text}</p>
        </Box>
      ) : (
        <Box
          className={classes.card}
          data-carduid={uid}
          onClick={() => onClick.current()}
        >
          <img
            src={type === "baby" ? babyback : cardback}
            alt="anonymousCard"
            className={classNames(
              classes.anonymousCard,
              selected && classes.selected
            )}
          />
        </Box>
      )}
    </>
  );
}

import React, { useState } from "react";
import AddFriendOverlayBox from "./AddFriendOverlayBox";
import { useSelector } from "react-redux";
import DirectMessages from "./DirectMessages";
import PendingInvites from "./PendingInvites";

function MainSideBar(props) {
  const [showAddFriendBox, setShowAddFriendBox] = useState(false);
  const [visibleContent, setVisibleContent] = useState("directMessages");
  const userId = useSelector((state) => state.user.data?.id);

  const handleAddFriendClick = () => {
    setShowAddFriendBox(true);
  };

  const handleAddFriendClose = () => {
    setShowAddFriendBox(false);
  };

  return (
    <div className="bar MainSideBar">
      <div className="content-wrapper">
        <header>
          <button className="add-friend-button" onClick={handleAddFriendClick}>
            ADD FRIEND
          </button>
          <div className="button-group">
            <button onClick={() => setVisibleContent("directMessages")}>
              Direct Message
            </button>
            <button onClick={() => setVisibleContent("pendingInvites")}>
              Pending Invites
            </button>
          </div>
          <div className="underline"></div>
        </header>
        {visibleContent === "directMessages" && <DirectMessages />}
        {visibleContent === "pendingInvites" && <PendingInvites />}
      </div>
      {showAddFriendBox && (
        <AddFriendOverlayBox onClose={handleAddFriendClose} userId={userId} />
      )}
    </div>
  );
}

export default MainSideBar;





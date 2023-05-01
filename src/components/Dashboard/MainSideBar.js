import React, { useState } from "react";
import AddFriendOverlayBox from "./AddFriendOverlayBox";
import { useSelector } from "react-redux";
import DirectMessages from "./DirectMessages";
import PendingInvites from "./PendingInvites";
import socket from '../../socketConnect/socket';

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
          <button
            className="bg-purple-500 text-white font-bold py-2 px-4 mt-5 w-full h-12"
            onClick={handleAddFriendClick}
          >
            ADD FRIEND
          </button>
          <div className="button-group">
            <button className="bg-white text-black py-2 px-4 mt-3 mb-10 h-10" onClick={() => setVisibleContent("directMessages")}>
              Direct Message
            </button>
            <button className="bg-white text-black py-2 px-4 mt-3 mb-10 w-100 h-10" onClick={() => setVisibleContent("pendingInvites")}>
              Pending Invites
            </button>
          </div>
          <div className="underline"></div>
        </header>
        {visibleContent === "directMessages" && <DirectMessages />}
        {visibleContent === "pendingInvites" && <PendingInvites socket={socket} />}
      </div>
      {showAddFriendBox && (
        <AddFriendOverlayBox onClose={handleAddFriendClose} userId={userId} socket={socket} />
      )}
    </div>
  );
}

export default MainSideBar;

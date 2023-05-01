import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectActiveConversation } from "../../features/activeConversationSlice";
import Avatar from "react-avatar";
import { sendMessage, fetchMessages, selectMessages } from "../../features/messagesSlice";
import { selectUser } from "../../features/userSlice";
import { useDispatch } from "react-redux";
import socket from '../../socketConnect/socket'


function ChatBox() {
  const [inputMessage, setInputMessage] = useState("");
  const activeConversation = useSelector(selectActiveConversation);
  const user = useSelector(selectUser);
  const messages = useSelector(selectMessages);
  const dispatch = useDispatch();




  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  useEffect(() => {
    if (activeConversation && user) {
      dispatch(fetchMessages({ senderId: user.id, receiverId: activeConversation.friendData.id }));

      // Subscribe to the message event from the server
      socket.on("message", () => {
        dispatch(fetchMessages({ senderId: user.id, receiverId: activeConversation.friendData.id }));
      });
    }

    // Clean up the subscription on unmount
    return () => {
      socket.off("message");
    };
  }, [dispatch, activeConversation, user]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "") {
      const messageData = {
        senderId: user.id,
        receiverId: activeConversation.friendData.id,
        content: inputMessage,
        senderData: {
          avatar: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };

      await dispatch(sendMessage(messageData));
      setInputMessage("");

      // Emit sendMessage event to the server
      socket.emit("sendMessage", messageData);

      // Fetch messages after sending a message
      dispatch(fetchMessages({ senderId: user.id, receiverId: activeConversation.friendData.id }));
    }
  };




  return (
    <div className="bar ChatBox relative">
<header className="flex items-center gap-4 py-2 px-4 text-white h-10px ">
  {activeConversation && activeConversation.friendData ? (
    <div className="flex items-center gap-4">
      <Avatar
        src={activeConversation.friendData.avatar}
        size="60px"
        round={true}
        style={{ marginRight: "10px" }}
      />

        <h1 className="font-bold text-lg">
          {activeConversation.friendData.firstName}  {activeConversation.friendData.lastName}
        </h1>

    </div>
  ) : (
    <h3 className="text-white text-center text-3xl pt-10"> Click On </h3>
  )}
</header>


<div className="chat-history">
  {activeConversation ? (
    <div className="chat-messages">
      {/* Display chat messages here */}
      {messages.map((message, index) => (
  message.sender && (
    <div
      key={index}
      className={
        message.senderId === user.id ? "sent-message" : "received-message"
      }
    >
      <div className="flex items-center">
  <div className="message-avatar">
    <Avatar
      src={message.sender.avatar}
      size="48"
      round={true}
      className="mr-2"
    />
  </div>
  <div className="message-info">
    <p className="text-white font-bold">
      {message.sender.firstName} {message.sender.lastName}
      <small className="text-xs text-gray-500 ml-2">
        {new Date(message.timestamp).toLocaleString()}
      </small>
    </p>
    <p className="message-content">{message.content}</p>
  </div>
</div>
    </div>
  )
))}


    </div>
  ) : (
    <div className="beginning-of-message-history">
    <h3 className="text-white text-center text-3xl pt-10"> Friend To Start Chatting</h3>
    </div>
        )}

      </div>
      <footer className="absolute bottom-0 w-full z-50">
      <div className="chat-input rounded-md overflow-hidden">
      <input
      type="text"
      placeholder="Type your message here"
      className="chat-input-field border-none focus:outline-none px-4 py-2 w-full"
      value={inputMessage}
      onChange={handleInputChange}
      />
      <button
      className="bg-purple-500 text-white px-4 py-2 "
      onClick={handleSendMessage}
      >
    Send
  </button>
</div>
      </footer>
    </div>
  );
}

export default ChatBox;




// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { selectActiveConversation } from "../../features/activeConversationSlice";
// import Avatar from "react-avatar";
// import { sendMessage, fetchMessages, selectMessages } from "../../features/messagesSlice";
// import { selectUser } from "../../features/userSlice";
// import { useDispatch } from "react-redux";
// import socket from '../../socketConnect/socket'


// function ChatBox() {
//   const [inputMessage, setInputMessage] = useState("");
//   const activeConversation = useSelector(selectActiveConversation);
//   const user = useSelector(selectUser);
//   const messages = useSelector(selectMessages);
//   const dispatch = useDispatch();




//   const handleInputChange = (event) => {
//     setInputMessage(event.target.value);
//   };

//   useEffect(() => {
//     if (activeConversation && user) {
//       dispatch(fetchMessages({ senderId: user.id, receiverId: activeConversation.friendData.id }));

//       // Subscribe to the message event from the server
//       socket.on("message", () => {
//         dispatch(fetchMessages({ senderId: user.id, receiverId: activeConversation.friendData.id }));
//       });
//     }

//     // Clean up the subscription on unmount
//     return () => {
//       socket.off("message");
//     };
//   }, [dispatch, activeConversation, user]);

//   const handleSendMessage = async () => {
//     if (inputMessage.trim() !== "") {
//       const messageData = {
//         senderId: user.id,
//         receiverId: activeConversation.friendData.id,
//         content: inputMessage,
//         senderData: {
//           avatar: user.avatar,
//           firstName: user.firstName,
//           lastName: user.lastName,
//         },
//       };

//       await dispatch(sendMessage(messageData));
//       setInputMessage("");

//       // Emit sendMessage event to the server
//       socket.emit("sendMessage", messageData);

//       // Fetch messages after sending a message
//       dispatch(fetchMessages({ senderId: user.id, receiverId: activeConversation.friendData.id }));
//     }
//   };




//   return (
//     <div className="bar ChatBox">
//       <header>
//         {activeConversation && activeConversation.friendData ? (
//           <>
//             <Avatar
//               src={activeConversation.friendData.avatar}
//               size="40"
//               round={true}
//               style={{ marginRight: "10px" }}
//             />
//             <h1>
//               {activeConversation.friendData.firstName} {activeConversation.friendData.lastName}
//             </h1>
//           </>
//         ) : (
//           <h1>Please Click On a Friend To Start Chatting </h1>
//         )}
//       </header>

//       <div className="chat-history flex-1 overflow-y-auto">
//         {activeConversation ? (
//           <div className="chat-messages flex-1">
//             {/* Display chat messages here */}
//             {messages.map((message, index) => (
//               message.sender && (
//                 <div
//                   key={index}
//                   className={
//                     message.senderId === user.id ? "sent-message" : "received-message"
//                   }
//                 >
//                   <div className="message-avatar">
//                     <Avatar
//                       src={message.sender.avatar}
//                       size="30"
//                       round={true}
//                       style={{ marginRight: "5px" }}
//                     />
//                   </div>
//                   <div className="message-info">
//                     <p>
//                       {message.sender.firstName} {message.sender.lastName}
//                       <small className="date">{new Date(message.timestamp).toLocaleString()}</small>
//                     </p>
//                     <p className="message-content">{message.content}</p>
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>
//         ) : (
//           <div className="beginning-of-message-history">
//             <h3 className="text-white text-center text-3xl pt-10"> Click On a Friend To Start Chatting</h3>
//           </div>
//         )}
//       </div>
//       <div className="chat-input bg-white p-4">
//           <div className="flex items-center">
//             <input
//               type="text"
//               placeholder="Type your message here"
//               className="chat-input-field border border-gray-300 rounded-lg w-full p-2 mr-4"
//               value={inputMessage}
//               onChange={handleInputChange}
//             />
//             <button
//               onClick={handleSendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//     </div>

//   );
// }

// export default ChatBox;


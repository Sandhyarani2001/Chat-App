import React, { useEffect, useRef, useState } from 'react'
import './chat.css'
import { assets } from '../../assets/assets'
import { FaPhone } from "react-icons/fa6";
import { IoMdVideocam } from "react-icons/io";
import { IoMdInformationCircle } from "react-icons/io";
import { FaRegImage } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../frbsLib/Firebase';
import { useChatStore } from '../../frbsLib/chatStore';
import { useUserStore } from '../../frbsLib/userStore';
import Upload from '../../frbsLib/Upload';


function Chat() {
  const [chats, setChats] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, } = useChatStore();

  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  });

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChats(res.data());
    });
    return () => {
      unSub();
    }
  }, [chatId])

  // console.log(chat);

  const handleEmoji = e => {
    setText((prev) => prev + e.emoji);
    setOpen(false)
  };

  // console.log(text);

  const handleImg = e => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null

    try {

      if (img.file) {
        imgUrl = await Upload(img.file)
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {

        const userChatsRef = doc(db, "userchats", id)
        const userChatsSnapshot = await getDoc(userChatsRef)

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data()

          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          })
        }
      });
    } catch (error) {
      console.log(error);
    }

    setImg({
      file: null,
      url: ""
    })
    setText("");

  }

  console.log("isCurrentUserBlocked:", isCurrentUserBlocked);
  console.log("isReceiverBlocked:", isReceiverBlocked);

  return (
    <div className='chat'>
      {/* top */}
      <div className="top">
        <div className="user">
          <img src={user?.avatar || assets.avatar} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <FaPhone />
          <IoMdVideocam className='vdo' />
          <IoMdInformationCircle className='info' />
        </div>
      </div>

      {/* //center */}
      <div className="center">
        {chats?.messages?.map(message => (
          <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message?.createAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text} </p>
            </div>
          </div>
        ))
        }

        {img.url && (<div className="message own">
          <div className="texts">
            <img src={img.url} alt="" />
          </div>
        </div>
        )}

        <div ref={endRef}></div>
      </div>

      {/* bottom */}
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <FaRegImage />
          </label>
          <input type="file" id='file' style={{ display: "none" }} onChange={handleImg} />
          <FaCamera />
          <FaMicrophone />
        </div>
        <div className="msg">
          <input
            type="text"
            placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You can't send a message" : "type a message..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />
          <button className='sendButton' onClick={handleSend}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          ><IoSend /></button>
        </div>
        <div className="emoji">
          <BsEmojiHeartEyesFill onClick={() => setOpen((prev) => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Chat

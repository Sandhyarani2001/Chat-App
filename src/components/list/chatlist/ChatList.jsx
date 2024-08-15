import React, { useEffect, useState } from 'react'
import './chatlist.css'
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { assets } from '../../../assets/assets';
import AddUser from './addUser/AddUser';
import { useUserStore } from '../../../frbsLib/userStore';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../../../frbsLib/Firebase';
import { useChatStore } from '../../../frbsLib/chatStore';

function ChatList() {
  const [addMode, setAddMode] = useState(false)
  const [chats, setChats] = useState([])
  const [input, setInput] = useState("")

  const { currentUser } = useUserStore()
  const { changeChat } = useChatStore()


  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const data = res.data();
      if (data) {
        const items = data.chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    });

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  //when we click on any chat , on firestore  we are gonna update our user chat we are going to add on userchats EC field and its gona b true
  const handleSelect = async (chat) => {

    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    })

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      })
      changeChat(chat.chatId, chat.user)
    } catch (error) {
      console.log(error);
    }
  };

  const filteredChats = chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className='chatlist'>
      <div className="search">
        <div className="searchBar">
          <FiSearch className='search-icon' />
          <input type="text" placeholder='Search' onChange={(e) => setInput(e.target.value)} />
        </div>
        <div onClick={() => setAddMode((prev) => !prev)}>
          {addMode ? <FaMinus className='add' /> : <FaPlus className='add' />}
        </div>
      </div>

      {/* show items for each chat */}
      {filteredChats.map((chat) => (
        <div className='listItem' key={filteredChats.chatId}>
          <div
            className="item"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe"

            }}
          >
            <img src={chat.user.blocked.includes(currentUser.id) ? assets.avatar : chat.user.avatar || assets.avatar} alt="" />
            <div className="texts">
              <span>{chat.user.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        </div>
      ))}
 

      {addMode && <AddUser />}
    </div>
  )
}

export default ChatList

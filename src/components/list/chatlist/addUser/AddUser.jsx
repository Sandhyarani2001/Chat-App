import React, { useState } from 'react'
import './AddUser.css'
import { assets } from '../../../../assets/assets'
import { db } from "../../../../frbsLib/Firebase"
import { arrayUnion, collection, doc, getDocs, getDoc, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { useUserStore } from "../../../../frbsLib/userStore"

function AddUser() {

  const [user, setUser] = useState(null)
  const { currentUser } = useUserStore()

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q)

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data())
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleAdd = async () => {

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
       // Get current user's chat list
    const currentUserChatsDoc = await getDoc(doc(userChatsRef, currentUser.id));
    const currentUserChats = currentUserChatsDoc.data()?.chats || [];

    // Check if the chat already exists
    const chatExists = currentUserChats.some(
      (chat) => chat.receiverId === user.id
    );

    if (chatExists) {
      console.log("This user is already in the chat list.");
      return;
    }

    // Proceed with adding the user to the chat list if not already added
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      //update our user chat
      await updateDoc(doc(userChatsRef, user.id),{
         chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      console.log("kokoko",user.id);
      await updateDoc(doc(userChatsRef, currentUser.id),{
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }


  



  return (
    <div className='addUser'>
      <form action="" onSubmit={handleSearch}>
        <input type="text" placeholder='Username' name='username' />
        <button>Search</button>
      </form>
      {user && (<div className="user">
        <div className="detail">
          <img src={user.avatar || assets.avatar} alt="" />
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
      </div>)}
    </div>
  )
}

export default AddUser

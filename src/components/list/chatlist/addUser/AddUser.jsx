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

  // const handleAdd = async () => {

  //   const chatRef = collection(db, "chats");
  //   const userChatsRef = collection(db, "userchats");

  //   try {
  //     const newChatRef = doc(chatRef);
  //     await setDoc(newChatRef, {
  //       createdAt: serverTimestamp(),
  //       message: [],
  //     });

  //     //update our user chat
  //     await updateDoc(doc(userChatsRef, user.id),{

  //       chats:arrayUnion({
  //         chatId: newChatRef.id,
  //         lastMessage: "",
  //         receiverId: currentUser.id,
  //         updatedAt: Date.now(),
  //       }),
  //     });
  //     console.log("kokoko",user.id);
  //     await updateDoc(doc(userChatsRef, currentUser.id),{
  //       chats:arrayUnion({
  //         chatId: newChatRef.id,
  //         lastMessage: "",
  //         receiverId: user.id,
  //         updatedAt: Date.now(),
  //       }),
  //     });
  //     // console.log(newChatRef.id);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  const handleAdd = async () => {

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        message: [],
      });

      const userChatDocRef = doc(userChatsRef, user.id);
      const currentUserChatDocRef = doc(userChatsRef, currentUser.id);

      // Check if user chat document exists, if not create it
      const userChatDocSnap = await getDoc(userChatDocRef);
      if (!userChatDocSnap.exists()) {
        await setDoc(userChatDocRef, { chats: [] });
      }

      // Check if current user chat document exists, if not create it
      const currentUserChatDocSnap = await getDoc(currentUserChatDocRef);
      if (!currentUserChatDocSnap.exists()) {
        await setDoc(currentUserChatDocRef, { chats: [] });
      }

      // Update our user chat
      await updateDoc(userChatDocRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(currentUserChatDocRef, {
        chats: arrayUnion({
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

  // const handleAdd = async () => {
  //   if (!user) {
  //     console.log("User not found.");
  //     return;
  //   }

  //   const chatRef = collection(db, "chats");
  //   const userChatsRef = collection(db, "userchats");

  //   try {
  //     const newChatRef = doc(chatRef);
  //     await setDoc(newChatRef, {
  //       createdAt: serverTimestamp(),
  //       message: [],
  //     });
  //     console.log("User chat document path:", doc(userChatsRef, currentUser.id).path);
  //     console.log("User chat document path:", doc(userChatsRef, user.id).path);
  //     const timestamp = new Date(); // Get current timestamp

  //     await updateDoc(doc(userChatsRef, currentUser.id), {
  //       chats: arrayUnion({
  //         chatId: newChatRef.id,
  //         lastMessage: "",
  //         receiverId: user.id,
  //         updatedAt: timestamp, // Use timestamp instead of serverTimestamp()
  //       }),
  //     });

  //     await updateDoc(doc(userChatsRef, user.id), {
  //       chats: arrayUnion({
  //         chatId: newChatRef.id,
  //         lastMessage: "",
  //         receiverId: currentUser.id,
  //         updatedAt: timestamp, // Use timestamp instead of serverTimestamp()
  //       }),
  //     });

  //     console.log("Chat updated successfully.");
  //   } catch (error) {
  //     console.log("Error updating chat:", error);
  //   }
  // };




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

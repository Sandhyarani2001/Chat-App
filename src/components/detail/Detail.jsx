import React from 'react'
import './detail.css'
import { assets } from '../../assets/assets'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";
import { auth, db } from '../../frbsLib/Firebase';
import { useChatStore } from '../../frbsLib/chatStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../../frbsLib/userStore';


function Detail() {

  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id)
    // console.log(currentUser);

    try {
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock();
    } catch (error) {
          console.log(error);
    }
  }


  


  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || assets.avatar} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <IoIosArrowUp className='Icon' />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy and help</span>
            <IoIosArrowUp className='Icon' />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Share photos</span>
            <IoIosArrowDown className='Icon' />
          </div>

          <div className="photos">
            <div className="photoItem">
              <div className="photoDetails">
                <img src="https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                <span>photo_2024.jpg</span>
              </div>
              <IoMdDownload className='DwldIcon' />
            </div>
            <div className="photoItem">
              <div className="photoDetails">
                <img src="https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                <span>photo_2024.jpg</span>
              </div>
              <IoMdDownload className='DwldIcon' />
            </div>

            <div className="photoItem">
              <div className="photoDetails">
                <img src="https://images.pexels.com/photos/21967252/pexels-photo-21967252/free-photo-of-a-group-of-people-are-drinking-coffee-and-eating.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" />
                <span>photo_2024.jpg</span>
              </div>
              <IoMdDownload className='DwldIcon' />
            </div>
            <div className="photoItem">
              <div className="photoDetails">
                <img src="https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                <span>photo_2024.jpg</span>
              </div>
              <IoMdDownload className='DwldIcon' />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <IoIosArrowUp className='Icon' />
          </div>
        </div>
        <button onClick={handleBlock}>{
          isCurrentUserBlocked ? "You are Blocked!" 
          : isReceiverBlocked ? "User Blocked" 
          : "Block User"
          } </button>
        <button className='logout' onClick={() => auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail

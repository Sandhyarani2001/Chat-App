import React, { useEffect } from 'react'
import List from './components/list/List'
import Detail from './components/detail/Detail'
import Chat from './components/chat/Chat'
import Login from './components/Login/Login';
import Notification from './components/Notification/Notification';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './frbsLib/Firebase';
import { useUserStore } from './frbsLib/userStore';
import { useChatStore } from './frbsLib/chatStore';

function App() {

  const { currentUser, isLoading, fetchUserInfo, resetUserState } = useUserStore()
  const { chatId,resetChatState} = useChatStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      // console.log(user.uid);
      // fetchUserInfo(user?.uid)
      
      if (user) {
        // Fetch the new user's information
        fetchUserInfo(user.uid);
      } else {
        // Reset states if no user is logged in (user logged out)
        resetUserState();
        resetChatState();
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo,resetUserState, resetChatState]);

  // console.log(currentUser);

  if (isLoading) return <div className='loading'>Loading...</div>

  return (
    <div className='container'>
      {currentUser ? (<>
        <List />
        {chatId && <Chat />}
        {chatId && <Detail />}
      </>
      )
        : (<Login />)
      }
      <Notification />
    </div>
  )
}

export default App

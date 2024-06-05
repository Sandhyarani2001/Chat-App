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

  const { currentUser, isLoading, fetchUserInfo } = useUserStore()
  const { chatId} = useChatStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      // console.log(user.uid);
      fetchUserInfo(user?.uid)
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo])

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

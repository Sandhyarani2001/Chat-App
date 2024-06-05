import React, { useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets.js'
import { toast } from 'react-toastify'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import { auth, db } from '../../frbsLib/Firebase.js'
import { doc, setDoc } from 'firebase/firestore'
import Upload from '../../frbsLib/Upload.js'

function Login() {

    const [avatar, setAvatar] = useState({
        file:null,
        url: "" 
    })

    const [loading, setLoading] = useState(false)

    const handleAvatar = e => {
      if(e.target.files[0]){
          setAvatar({
            file:e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
      }
    }



    //register

    const handleRegister = async (e) => {
      e.preventDefault()
      setLoading(true)
      const formData = new FormData(e.target);

      const {username, email, password} = Object.fromEntries(formData);
      // console.log(username);

      try {
        const res = await createUserWithEmailAndPassword(auth,email,password)
        // console.log(res);

        const imgUrl = await Upload(avatar.file)    //File usestate main hai upar

        await setDoc(doc(db, "users", res.user.uid),{
          username,
          email,
          avatar:imgUrl,
          id: res.user.uid,
          blocked: [], 
        });

        await setDoc(doc(db, "userchats", res.user.uid),{
         chats: [], 
        });

        toast.success("Account created! You can login now!")
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
      finally{
        setLoading(false)
      }
    }

  

    //login

    const handleLogin = async (e) => {
      e.preventDefault()
      setLoading(true);

      const formData = new FormData(e.target);
      const {email, password} = Object.fromEntries(formData);

      try{
        await signInWithEmailAndPassword(auth,email,password)

      }catch(error){
         console.log(error);
         toast.error(error.message)
      }
      finally{
        setLoading(false)
      }
      toast.success("Logedin successfull")
    }
  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin} >
            <input type="email" name='email' placeholder='Email' />
            <input type="password" name='password' placeholder='Password' />
            <button disabled={loading}>{loading? "Loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
            <label htmlFor='file'>
            <img src={avatar.url || assets.avatar} alt=""  />
            Upload an Image</label>
            <input type="file" id='file' style={{display:"none"}} onChange={handleAvatar} />
            <input type="text" name='username' placeholder='username' />
            <input type="email" name='email' placeholder='Email' />
            <input type="password" name='password' placeholder='Password' />
            <button disabled={loading}>{loading? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login

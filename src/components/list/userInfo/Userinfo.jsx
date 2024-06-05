import './userinfo.css'
import { assets } from '../../../assets/assets'
import { MdOutlineMoreHoriz } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import {useUserStore} from "../../../frbsLib/userStore"


function Userinfo() {

  const {currentUser} = useUserStore();
  console.log("Avatar URL:", currentUser.avatar);

  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser.avatar || assets.avatar} alt="" />
        <h3>{currentUser.username}</h3>
      </div>
      <div className="icons">
      <MdOutlineMoreHoriz className='more'/>
      < IoMdVideocam className='vdo'/>
      <FaRegEdit className='edit' />
      </div>
      
    </div>
    
  )
}



export default Userinfo

import { create } from 'zustand'
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,  //for current user block
    isReceiverBlocked: false,     //for receiver block

    //when i click chat item we are going to send the chat id and the user information for that,
    changeChat: (chatId, user) => {

        const currentUser = useUserStore.getState().currentUser

        //CHECK IF CURRENT USER ID BLOCKED

        if (user.blocked.includes(currentUser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,

            })
        }


        //CHECK IF RECEIVER IS BLOCKED
        else if (currentUser.blocked.includes(user.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,

            })
        } else {
            return set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: false,

            })
        }

    },
    changeBlock: () => {
        set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }))
    }

}));






//chat gpt

// export const useChatStore = create((set) => ({
//     chatId: null,
//     user: null,
//     blockedUsers: [], // Add a state to store blocked users
//     changeChat: (chatId, user) => {
//         const currentUser = useUserStore.getState().currentUser;
//         const blockedUsers = currentUser.blocked || []; // Get blocked users from currentUser
        
//         const isCurrentUserBlocked = blockedUsers.includes(user.id);
//         const isReceiverBlocked = (user.blocked || []).includes(currentUser.id);

//         set({
//             chatId,
//             user,
//             blockedUsers, // Set blockedUsers state
//             isCurrentUserBlocked,
//             isReceiverBlocked,
//         });
//     },
//     toggleBlock: async () => {
//         const currentUser = useUserStore.getState().currentUser;
//         const userDocRef = doc(db, "users", currentUser.id);
//         const isBlocked = !currentUser.blocked || !currentUser.blocked.includes(user.id);

//         try {
//             await updateDoc(userDocRef, {
//                 blocked: isBlocked ? arrayUnion(user.id) : arrayRemove(user.id)
//             });
            
//             // Update blockedUsers state
//             set(state => ({
//                 ...state,
//                 blockedUsers: isBlocked ? [...state.blockedUsers, user.id] : state.blockedUsers.filter(id => id !== user.id)
//             }));
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }));





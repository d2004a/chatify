import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import BorderAnimatedContainer from "../components/AnimatedBorder";
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import { useChatStore } from '../store/useChatStore';
import ChatsList from '../components/ChatsList';
import ContactList from '../components/ContactList';
import ChatConatiner from '../components/ChatConatiner';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';

function ChatPage() {
  const {logout} = useAuthStore();
  const {activeTab, selectedUser} = useChatStore();
  return (
    <div className= "relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
      <div className='w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col'>
        <ProfileHeader/>
        <ActiveTabSwitch/>

        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
          {activeTab ==="chats" ? <ChatsList/> : <ContactList/>}
        </div>
      
      </div>

      <div className='flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm'>
        {selectedUser ? <ChatConatiner/> : <NoConversationPlaceholder/>}
      </div>

      </BorderAnimatedContainer>
      
      
    </div>
  )
}

export default ChatPage

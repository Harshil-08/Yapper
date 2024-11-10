import React,{useState} from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import MembersList from './MembersList'

const AppLayout = ()=> WrappedComponent => {
	return(props)=>{
		const [selectedChatId, setSelectedChatId] = useState(null);

		const handleChatSelect = (chatId) => {
			setSelectedChatId(chatId);
		};
		return(
			<>
				<Header/>
				<div className='flex h-screen'>
					<Sidebar onChatSelect={handleChatSelect}/>
					<WrappedComponent {...props} chatId={selectedChatId}/>
					{selectedChatId && <MembersList chatId={selectedChatId}/>}
				</div>
			</>
		)
	}
}

export default AppLayout

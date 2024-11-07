import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import MembersList from './MembersList'

const AppLayout = ()=> WrappedComponent => {
	return(props)=>{
		return(
			<>
				<Header/>
				<div className='flex h-screen'>
					<Sidebar/>
					<WrappedComponent {...props}/>
					<MembersList/>
				</div>
			</>
		)
	}
}

export default AppLayout

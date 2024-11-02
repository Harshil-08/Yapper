import React from 'react'

const AppLayout = ()=> WrappedComponent => {
	return(props)=>{
		return(
			<>
				<div className=''>Header</div>
				<div className='fexl'>
					<div className=''>sidebar</div>
					<WrappedComponent {...props}/>
					<div className=''>members</div>
				</div>
			</>
		)
	}
}

export default AppLayout

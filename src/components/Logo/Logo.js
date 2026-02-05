import React from 'react'
import {Tilt} from 'react-tilt'
import brain from './brain.png'
import './Logo.css'


const Logo=()=>{
	return(
		<div className='ma4' ref={React.createRef()}>
			<Tilt className="Tilt br2 shadow-5" options={{ max : 25 }} style={{ height: 250, width: 250 }}>
			 <div className="Tilt-inner pa3">
			 <img className='middle' alt='logo' src={brain}>	
			 </img>
			 </div>
			</Tilt>
		</div>
		)
}

export default Logo
import React from 'react'
import './ImageLinkForm.css'


const ImageLinkForm=({onInputChange, onButtonSubmit, user, input})=>{
	return(
		<div>
			<p className='f3 tc'>
				{'Dieses intelligente Gehirn erkennt Gesichter in Ihrem Bild. Probieren Sie es aus!'}
			</p>
			{Object.keys(user).length ?<p className='f3 tc'>
				{Object.keys(user).length &&`${user.username}, your current entry count is : ${user.entries}`}
			</p>:null}
			{Object.keys(user).length ?<p className='f3 tc'>
				{`Remaining count is : ${20-user.entries}`}
			</p>:null}
			<div className='center'>
				<div className='form center pa4 br3 shadow-5'>
					<input className='f4 pa2 w-70 center' type='text' onChange={onInputChange} value={input}/>
					<button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit}>
					erkennen
					</button>
				</div>
			</div>
		</div>
	
		)
}

export default ImageLinkForm
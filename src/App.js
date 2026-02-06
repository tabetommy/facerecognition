import React, { useState, useEffect } from 'react';
// import Particles from 'npm i react-particles-js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import FaceReg from './components/FaceReg/FaceReg.js';
import AuthDialog from './components/Dialog/Dialog.js';
import './App.css';

// const app = new Clarifai.App({
//   apiKey: "a9613b4d271146afae975180c8a77eb1",
// });

const App = () => {
  // Use state hooks instead of this.state
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});

  const [open, setOpen] = React.useState(false);
  const  [user, setUser]=useState({})
  // const [notLoggedIn,setNotLoggedIn]=useState(false)

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  };

  const displayFaceBox = (boxData) => {
    setBox(boxData);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  // const onButtonSubmit = () => {
  //   setImageUrl(input);
    
  //   app.models
  //     .predict(Clarifai.FACE_DETECT_MODEL, input)
  //     .then(response => displayFaceBox(calculateFaceLocation(response)))
  //     .catch(err => console.log(err));
  // };
 useEffect(()=>{
  const token = localStorage.getItem('token');
   if (!token) {
    // Scenario 1: No token found, user must log in
    setOpen(true);
  } else {
    // Scenario 2: Token exists, verify it with the backend
    fetch('https://facerecognitionapp-api-zzin.onrender.com/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Token invalid or expired');
      return res.json();
    })
    .then(userData => {
      // Auto-login successful!
      // loadUser is a function that updates your main App state
      setUser(userData); 
      setOpen(false); 
    })
    .catch(err => {
      console.log(err);
      // If the token is fake or expired, clean up and open modal
      localStorage.removeItem('token');
      setOpen(true);
    });
  }
 
}, []);

   
  const onButtonSubmit = () => {
    const token=localStorage.getItem('token');
  setImageUrl(input);
    fetch('https://facerecognitionapp-api-zzin.onrender.com/imageurl', {
    method: 'post',
    headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`},
    body: JSON.stringify({ input: input })
  })
  .then(response => response.json())
  .then(result => {
    if(result){
      displayFaceBox(calculateFaceLocation(result));
    return fetch('https://facerecognitionapp-api-zzin.onrender.com/image', {
          method: 'put',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ username: user.username })
        })
    }
  })
  .then(response=>response.json())
  .then(count=>{
    setUser({...user,entries:count});
    setInput('');
  })
  .catch(err => console.log('Error processing image:',err));
};

const dataReset=()=>{
  setUser({});
  setInput('');
  setImageUrl('');
  setBox({});
  localStorage.removeItem('token');
}

  return (
    <div>
      <AuthDialog open={open} setOpen={setOpen} setUser={setUser} dataReset={dataReset} user={user}/>
      {/* <Particles className='particles' />  */}
      <Logo />
      <ImageLinkForm 
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
        input={input}
        user={user}
      /> 
      <FaceReg box={box} imageUrl={imageUrl}/>  
    </div>
  );
};

export default App;

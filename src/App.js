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
    setOpen(true)
  },[])
   
  const onButtonSubmit = () => {
  setImageUrl(input);
    fetch('https://facerecognitionapp-api-zzin.onrender.com/imageurl', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ input: input })
  })
  .then(response => response.json())
  .then(result => {
    displayFaceBox(calculateFaceLocation(result))
  })
  .catch(err => console.log(err));
};

  return (
    <div>
      <AuthDialog open={open} setOpen={setOpen} />
      {/* <Particles className='particles' />  */}
      <Logo />
      <ImageLinkForm 
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      /> 
      <FaceReg box={box} imageUrl={imageUrl} />  
    </div>
  );
};

export default App;

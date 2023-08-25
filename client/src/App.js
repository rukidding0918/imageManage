import React from 'react';
import UploadForm from './components/UploadForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <>
      <ToastContainer />
      <h2>사진첩</h2>
      <UploadForm />
    </>
  );
}

export default App;

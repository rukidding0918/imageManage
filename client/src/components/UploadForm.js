import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './UploadForm.css'
import ProgressBar from './ProgressBar.js'

const UploadForm = () => {
    const defaultFileName = '이미지파일을 업로드 해주세요.'
    const [file, setFile] = useState(null);
    const [imgSrc, setImageSrc] = useState(null);
    const [fileName, setFileName] = useState(defaultFileName);
    const [percent, setPercent] = useState(0);

    const imageSelectHandler = (e) => {
        const imageFile = e.target.files[0];
        setFile(imageFile);
        setFileName(imageFile.name);
        const fileReader = new FileReader();
        fileReader.readAsDataURL(imageFile);
        fileReader.onload = e => setImageSrc(e.target.result);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const serverURL = 'https://rukidding0918-friendly-memory-5jrrvpr45p4hv66w-5000.preview.app.github.dev/'
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await axios.post(serverURL + 'images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    setPercent(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                }
            });
            toast.success('업로드 성공');
            setTimeout(() => {
                setPercent(0);
                setFileName(defaultFileName);
                setFile(null);
                setImageSrc(null);
            }, 3000);
        } catch (err) {
            toast.error(err.message || '업로드 실패');
            setPercent(0);
            setFileName(defaultFileName);
            setFile(null);
            setImageSrc(null);
        }
    };


    return (
        <form onSubmit={onSubmit}>
            <img className="image-preview" src={imgSrc}/>
            <ProgressBar percent={percent} />
            <div className="file-dropper">
                {fileName}
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={imageSelectHandler}
                />
            </div>
            <button className="upload-btn" type="submit">업로드</button>
        </form>
    )
}

export default UploadForm
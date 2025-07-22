import React, { useRef } from 'react';
import { uploadFont } from '../api/api';

export default function FontUploader({ onUpload }) {
  const fileInputRef = useRef();

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.ttf')) {
      const formData = new FormData();
      formData.append('font', file);
      await uploadFont(formData);
      onUpload();
    } else {
      alert('Only TTF files allowed!');
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.ttf')) {
      const formData = new FormData();
      formData.append('font', file);
      await uploadFont(formData);
      onUpload();
    } else {
      alert('Only TTF files allowed!');
    }
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-400 py-4 rounded-lg text-center cursor-pointer my-4"
    >
      <div className="text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mx-auto mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" />
        </svg>
        <p><strong>Click to upload</strong> or drag and drop</p>
        <p className="text-xs">Only TTF File Allowed</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".ttf"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

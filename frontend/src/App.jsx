// src/App.js
import React, { useState } from 'react';
import FontUploader from './components/FontUploader';
import FontList from './components/FontList';
import FontGroupCreator from './components/FontGroupCreator';
import FontGroupList from './components/FontGroupList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFontData } from './hooks/useFontData';

export default function App() {
  const [editingGroup, setEditingGroup] = useState(null);
  const {
    fonts,
    groups,
    loading,
    error,
    refreshAllData,
    handleDeleteFont,
    handleDeleteGroup,
    handleUploadFont,
  } = useFontData();

  if (loading) return <div className="p-4 text-center">Loading data...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4 max-w-[1200px] mx-auto">
      <ToastContainer />
      <h1 className="text-xl font-bold mb-4 text-center">Font Group System</h1>
      <FontUploader onUploadFont={handleUploadFont} />
      <FontList fonts={fonts} onDeleteFont={handleDeleteFont} />
      <FontGroupCreator
        fonts={fonts}
        groups={groups}
        editingGroup={editingGroup}
        setEditingGroup={setEditingGroup}
        onCreateOrUpdate={refreshAllData}
      />

      <FontGroupList
        groups={groups}
        onDeleteGroup={handleDeleteGroup}
        onEdit={(group) => setEditingGroup(group)}
      />
    </div>
  );
}
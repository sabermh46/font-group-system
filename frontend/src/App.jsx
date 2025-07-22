import React, { useEffect, useState } from 'react';
import FontUploader from './components/FontUploader';
import FontList from './components/FontList';
import FontGroupCreator from './components/FontGroupCreator';
import FontGroupList from './components/FontGroupList';
import { getFonts, getGroups } from './api/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [fonts, setFonts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);


  const refreshData = () => {
    getFonts().then(setFonts);
    getGroups().then(setGroups);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold mb-4 text-center">Font Group System</h1>
      <FontUploader onUpload={refreshData} />
      <FontList fonts={fonts} onDelete={refreshData} />
      <FontGroupCreator
        fonts={fonts}
        groups={groups}
        editingGroup={editingGroup}
        setEditingGroup={setEditingGroup}
        onCreate={refreshData}
      />

      <FontGroupList
        groups={groups}
        onDelete={refreshData}
        onEdit={(group) => setEditingGroup(group)}
      />
    </div>
  );
}

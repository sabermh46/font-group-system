// src/hooks/useFontGroupForm.js
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { groupService } from '../api/fontService';

export const useFontGroupForm = (fonts, groups, editingGroup, setEditingGroup, onCreateOrUpdate) => {
  const [groupTitle, setGroupTitle] = useState('');
  const [rows, setRows] = useState([
    { fontId: '', customName: '', size: '1.00', price: '0' },
  ]);

  const titleInputRef = useRef();

  useEffect(() => {
    if (editingGroup) {
      setGroupTitle(editingGroup.title);
      setRows(
        editingGroup.fonts.map((f) => ({
          fontId: f.id,
          customName: f.custom_name || '',
          size: '1.00',
          price: '0',
        }))
      );
    } else {
      setGroupTitle('');
      setRows([{ fontId: '', customName: '', size: '1.00', price: '0' }]);
    }
  }, [editingGroup]);

  const addRow = () => {
    setRows([...rows, { fontId: '', customName: '', size: '1.00', price: '0' }]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const validateForm = () => {
    if (!groupTitle.trim()) {
      toast.error('Group title is required.');
      titleInputRef.current.focus();
      return false;
    }

    const validRows = rows.filter((r) => r.fontId);
    if (validRows.length < 2) {
      toast.error('You must select at least two fonts.');
      return false;
    }


    const isDuplicate = groups.some(
      (g) =>
        g.title.toLowerCase() === groupTitle.trim().toLowerCase() &&
        (!editingGroup || g.id !== editingGroup.id) // Exclude current group when editing
    );
    if (isDuplicate) {
      toast.error('Group title already exists.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      groupTitle: groupTitle.trim(),
      fonts: rows
        .filter((r) => r.fontId) // Only include rows with a selected font
        .map((r) => ({
          fontId: parseInt(r.fontId),
          customName: r.customName || '',
        })),
    };

    try {
      let res;
      if (editingGroup) {
        res = await groupService.updateGroup(editingGroup.id, payload);
      } else {
        res = await groupService.createGroup(payload);
      }
      

      console.log(res.success);//true
      
      if (res.success) {
        console.log('encounterte');//shows
        
        setTimeout(() => {
          toast.success(editingGroup ? 'Group updated successfully!' : 'Font group created successfully!');
        }, 100);
        onCreateOrUpdate(); // Callback to refresh data in parent
        setGroupTitle('');
        setRows([{ fontId: '', customName: '', size: '1.00', price: '0' }]);
        if (setEditingGroup) setEditingGroup(null); // Clear edit mode
      } else {
        toast.error(res.error || 'Operation failed.');
      }
    } catch (err) {
      toast.error(`Server error: ${err.message}`);
    }
  };

  const selectedFontIds = rows.map((r) => parseInt(r.fontId)).filter(Boolean);
  const remainingFonts = fonts.filter(
    (font) => !selectedFontIds.includes(font.id)
  );
  const canAddMore = remainingFonts.length > 0;

  const cancelEdit = () => {
    if (setEditingGroup) setEditingGroup(null);
    setGroupTitle('');
    setRows([{ fontId: '', customName: '', size: '1.00', price: '0' }]);
    toast.info('Edit cancelled.');
  };

  return {
    groupTitle,
    setGroupTitle,
    rows,
    addRow,
    removeRow,
    handleRowChange,
    handleSubmit,
    titleInputRef,
    selectedFontIds,
    remainingFonts,
    canAddMore,
    cancelEdit,
  };
};
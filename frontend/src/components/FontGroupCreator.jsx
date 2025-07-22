import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { createGroup } from '../api/api';

export default function FontGroupCreator({
  fonts,
  groups,
  onCreate,
  editingGroup,  // NEW: group to edit, if any
  setEditingGroup, // NEW: to clear edit mode after save
}) {
  const [groupTitle, setGroupTitle] = useState('');
  const [rows, setRows] = useState([
    { fontId: '', customName: '', size: '1.00', price: '0' },
  ]);

  const titleInputRef = useRef();

  // NEW: if editingGroup changes, load its data into form
  React.useEffect(() => {
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

  const handleSubmit = async () => {
    const validRows = rows.filter((r) => r.fontId);

    if (!groupTitle.trim()) {
      toast.error('Group title is required.');
      titleInputRef.current.focus(); // ✅ set focus
      return;
    }

    // Block duplicate title only when creating new
    const duplicate =
      !editingGroup &&
      groups.some(
        (g) =>
          g.title.toLowerCase() === groupTitle.trim().toLowerCase()
      );
    if (duplicate) {
      toast.error('Group title already exists.');
      return;
    }

    if (validRows.length < 2) {
      toast.error('You must select at least two fonts.');
      return;
    }

    const payload = {
      groupTitle: groupTitle.trim(),
      fonts: validRows.map((r) => ({
        fontId: parseInt(r.fontId),
        customName: r.customName || '',
      })),
    };

    // If editing, call update — else create
    try {
      let res;
      if (editingGroup) {
        res = await fetch(`http://localhost:4000/api/groups/${editingGroup.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then((r) => r.json());
      } else {
        res = await createGroup(payload);
      }

      if (res.success) {
        toast.success(
          editingGroup
            ? 'Group updated successfully!'
            : 'Font group created successfully!'
        );
        onCreate();
        setGroupTitle('');
        setRows([{ fontId: '', customName: '', size: '1.00', price: '0' }]);
        if (setEditingGroup) setEditingGroup(null);
      } else {
        toast.error(res.error || 'Operation failed.');
      }
    } catch (err) {
      toast.error('Server error.');
    }
  };

  // Avoid duplicate selection:
  const selectedFontIds = rows.map((r) => parseInt(r.fontId)).filter(Boolean);
  const remainingFonts = fonts.filter(
    (font) => !selectedFontIds.includes(font.id)
  );
  const canAddMore = remainingFonts.length > 0;

  return (
    <div className="p-4 rounded-lg shadow-[0px_0px_10px_10px_rgba(0,0,0,0.1)] bg-white my-4">
      <h2 className="font-bold mb-2">
        {editingGroup ? 'Edit Font Group' : 'Create Font Group'}
      </h2>
      <input
        ref={titleInputRef}
        type="text"
        placeholder="Group Title"
        value={groupTitle}
        onChange={(e) => setGroupTitle(e.target.value)}
        className="block shadow-[0px_0px_10px_10px_rgba(0,0,0,0.1)] rounded-md py-2 px-4 font-bold mb-6 mt-4 w-full"
      />

      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex flex-wrap md:flex-nowrap items-center gap-2 p-1 rounded-md mb-2 pr-2 ${i%2===1 ? 'bg-blue-100' : 'bg-purple-100'}`}
        >
          <input
            type="text"
            placeholder="Font Name"
            value={row.customName}
            onChange={(e) =>
              handleRowChange(i, 'customName', e.target.value)
            }
            className=" bg-white rounded-md p-1 px-2 flex-1 min-w-[150px]"
          />
          <select
            value={row.fontId}
            onChange={(e) => handleRowChange(i, 'fontId', e.target.value)}
            className=" bg-white rounded-md p-1 flex-1 min-w-[150px]"
          >
            <option value="">Select Font</option>
            {fonts
              .filter(
                (font) =>
                  !selectedFontIds.includes(font.id) ||
                  font.id === parseInt(row.fontId)
              )
              .map((font) => (
                <option key={font.id} value={font.id}>
                  {font.name}
                </option>
              ))}
          </select>
          <input
            type="number"
            step="0.1"
            value={row.size}
            disabled
            className=" rounded-md p-1 w-24 text-center bg-white"
          />
          <input
            type="number"
            step="0.1"
            value={row.price}
            disabled
            className=" rounded-md p-1 w-24 text-center bg-white"
          />
          <button
            onClick={() => removeRow(i)}
            className="text-red-400 font-bold pl-2 cursor-pointer hover:text-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <line
                x1="1.41421"
                y1="1"
                x2="22.8461"
                y2="22.4319"
                stroke="currentcolor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="1.1543"
                y1="22.4319"
                x2="22.5862"
                y2="0.999972"
                stroke="currentcolor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}

      <div className="flex justify-between pt-4 flex-wrap gap-2">
        <button
          onClick={addRow}
          disabled={!canAddMore}
          className={`px-2 py-1 rounded-md ${
            canAddMore ? 'bg-blue-500' : 'bg-gray-400 cursor-not-allowed'
          } text-white mr-2 min-w-28`}
        >
          + Add Row
        </button>

        <button
          onClick={handleSubmit}
          className="px-2 py-1 rounded-md bg-green-600 text-white min-w-28"
        >
          {editingGroup ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
}

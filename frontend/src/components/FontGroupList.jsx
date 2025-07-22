import React from 'react';
import { deleteGroup } from '../api/api';

export default function FontGroupList({ groups, onDelete, onEdit }) {
  return (
    <div className="p-4 rounded-lg shadow-[0px_0px_10px_10px_rgba(0,0,0,0.1)] bg-white my-4">
      <h2 className="font-bold text-lg mb-2">Our Font Groups</h2>
      <p className='text-gray-400 font-bold text-sm border-b pb-2 border-gray-300'>List of all available font groups.</p>

      <table className="border-collapse w-full mt-4 rounded-lg overflow-hidden">
              <thead>
                <tr className="text-left text-slate-500 font-bold bg-gray-100">
                  <th className="py-2 px-2 text-sm lg:text-base">NAME</th>
                  <th className="py-2 px-2 text-sm lg:text-base">FONTS</th>
                  <th className="py-2 px-2 text-sm lg:text-base">Count</th>
                  <th className="py-2 px-2 text-sm lg:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id} className="p-2 mb-2">
                    <td>
                      {group.title || 'Untitled'}
                    </td>

                      <td>
                        {group.fonts.map(f => (
                            f.custom_name || f.name.replace('.ttf', '')
                          )).join(', ')}
                      </td>

                      <td>
                        {group.fonts.length}
                      </td>

                    <td>
                      <button
                        onClick={() => onEdit(group)}
                        className="my-2 px-2 py-1 text-blue-500 mr-2 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteGroup(group.id).then(onDelete)}
                        className="my-2 px-2 py-1 text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

      
    </div>
  );
}

import { toast } from 'react-toastify';
import { deleteFont } from '../api/api';


export default function FontList({ fonts, onDelete }) {
  return (
    <div className="p-4 rounded-lg shadow-[0px_0px_10px_10px_rgba(0,0,0,0.1)] bg-white my-4">
      <h2 className="font-bold text-lg">Our Fonts</h2>
      <p className="text-gray-400 font-bold text-sm border-b pb-2 border-gray-300 ">
        Browse a list of Zepto fonts to build your font group.
      </p>

      <div className='overflow-x-auto'>
        <table className="border-collapse w-full mt-4 rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left text-slate-500 font-bold bg-gray-100">
            <th className="py-2 px-2 text-sm lg:text-base">Font Name</th>
            <th className="py-2 px-2 text-sm lg:text-base">Preview</th>
            <th className="py-2 px-2 text-sm lg:text-base">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fonts.map((font, i) => {
            const fontUrl = `http://localhost:4000/uploads/${font.file_path}`;
            const fontFaceName = `font-${font.id}`;

            const styleTag = `
              @font-face {
                font-family: '${fontFaceName}';
                src: url('${fontUrl}');
              }
            `;

            return (
              <tr key={font.id} className={`mb-4 ${i % 2 === 1 ? 'bg-gray-100' : ''}`}>
                <td className="py-2 px-2 text-sm lg:text-base">{font.name}</td>
                <td className="my-2 px-2 text-sm lg:text-base line-clamp-3" style={{ fontFamily: fontFaceName }}>
                  <style>{styleTag}</style>
                  The quick brown fox jumps over the lazy dog
                </td>
                <td className="py-2 px-2 text-sm lg:text-base">
                  <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this font?')) {
                      try {
                        const res = await deleteFont(font.id);

                        if (res.success) {
                          toast.success('Font deleted successfully!');
                          onDelete(); // ✅ Refresh the list only on success
                        } else if (res.error) {
                          toast.error(res.error);
                        } else {
                          toast.error('Something went wrong.');
                        }

                      } catch (err) {
                        toast.error('Failed to delete font.');
                      }
                    }
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

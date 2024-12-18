const MenuBar = ({ editor }) => {

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full z-50 p-2 rounded-none bg-base-300">
      {/* Add your custom menu bar items here */}
      <button
        onClick={(e) => {e.preventDefault(); return editor.chain().focus().setParagraph().run()}}
        className={`${editor.isActive('bold') ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded`}
      >
        <i className="ri-paragraph"></i>
      </button>
      <button
        onClick={(e) => {e.preventDefault(); return editor.chain().focus().toggleBold().run()}}
        className={`${editor.isActive('bold') ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded`}
      >
        <i className="ri-bold"></i>
      </button>
      <button
        onClick={(e) => {e.preventDefault(); return editor.chain().focus().toggleItalic().run()}}
        className={`${editor.isActive('italic') ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded `}
      >
       <i className="ri-italic"></i>
      </button>
      <button
        onClick={(e) => {e.preventDefault(); return editor.chain().focus().toggleOrderedList().run()}}
        className={`${editor.isActive('orderedList') ? 'bg-blue-500 text-white' : ''} px-2 py-1 rounded `}
      >
        <i className="ri-list-ordered"></i>
      </button>
      <button
        onClick={(e) => {e.preventDefault(); return editor.chain().focus().toggleBulletList().run()}}
        className={editor.isActive('bulletList') ? 'bg-blue-500 text-white' : '' + ' px-2 py-1 rounded'}
      >
        <i className='ri-list-check'></i>
      </button>
      <button 
        onClick={(e) => {e.preventDefault(); return editor.chain().focus().undo().run() } } disabled={!editor.can().undo()}
        className={`px-2 py-1 rounded`} 
      >
        <i className='ri-arrow-go-back-fill'></i>
      </button>
      <button
        onClick={(e) => {e.preventDefault(); return editor.chain().focus().undo().run() } } disabled={!editor.can().undo()}
        className='px-2 py-1 rounded'
      >
      <i className='ri-arrow-go-forward-fill'></i>
      </button>
      
      {/* Add more menu items as needed */}
    </div>
  );
};

export default MenuBar;
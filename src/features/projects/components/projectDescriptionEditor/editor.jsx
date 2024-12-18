import MenuBar from './menubar';
import { useEffect, useRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import TextStyle from '@tiptap/extension-text-style';
import BulletList from '@tiptap/extension-bullet-list';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import OrderedList from '@tiptap/extension-ordered-list';

const Editor = ({ content, setContent }) => {
  const editorRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Ensure paragraph is the default node
        paragraph: {
          HTMLAttributes: {
            class: 'text-sm' // Optional base styling
          }
        }
      }),
      Paragraph,
      TextStyle,
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc pl-2',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal pl-6',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'pl-2',
        },
      }),
      Placeholder.configure({
        placeholder: "Enter project description",
        emptyEditorClass: 'before:content-[attr(data-placeholder)] text-gray-400'
      }),
    ],
    content,
    editorProps: {
      // Prevent default double-click save behavior
      handleDoubleClick: (view, pos, event) => {
        // Prevent default node double-click behavior
        event.stopPropagation();
        return true;
      },
    },  
    onUpdate: ({ editor }) => {
      // Use getHTML() method to get string content
      const htmlContent = editor.getHTML();

      setContent(htmlContent)
    },
  });
  

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = editor;
      // editorRef.current?.commands.focus('end');
    }

    return () => {
      editorRef.current?.destroy()
    }
  }, [editor]);

  return (
    <div className="relative">
      <div className="">
        <MenuBar editor={editor}/>
      </div>
      <EditorContent editor={editor} id='description' name='description' className='w-full h-full rounded p-2 text-sm bg-base-200 min-h-[100px]'/>
    </div>
  );
};


export default Editor;
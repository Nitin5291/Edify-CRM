import React from 'react';
import dynamic from 'next/dynamic';

// Load QuillEditor dynamically to ensure it's only rendered on the client-side
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ text, handleChange }: { text: any, handleChange: (e: any) => void }) => {

  return (
    <div>
      {typeof window !== 'undefined' && (
        <ReactQuill
          theme="snow"
          value={text}
          onChange={handleChange}
          className='h-48'
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }, { font: [] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
              ['link', 'image'],
              ['clean']
            ],
          }}
        />
      )}
    </div>
  );
};

export default QuillEditor;

// // // // 'use client';

// // // // import { useEditor, EditorContent } from '@tiptap/react';
// // // // import StarterKit from '@tiptap/starter-kit';
// // // // import Image from '@tiptap/extension-image';

// // // // interface BlogEditorProps {
// // // //   content: string;
// // // //   onChange: (html: string) => void;
// // // // }

// // // // export default function BlogEditor({ content, onChange }: BlogEditorProps) {
// // // //   const editor = useEditor({
// // // //     extensions: [
// // // //       StarterKit,
// // // //       Image.configure({
// // // //         HTMLAttributes: {
// // // //           class: 'rounded-lg max-w-full h-auto my-4',
// // // //         },
// // // //       }),
// // // //     ],
// // // //     content: content,
// // // //     immediatelyRender: false, // Prevents Next.js SSR hydration errors
// // // //     onUpdate: ({ editor }) => {
// // // //       // Passes the formatted HTML string back up to your form state
// // // //       onChange(editor.getHTML());
// // // //     },
// // // //     editorProps: {
// // // //       attributes: {
// // // //         class:
// // // //           'prose dark:prose-invert focus:outline-none min-h-[300px] p-4 border border-gray-300 rounded-md',
// // // //       },
// // // //     },
// // // //   });

// // // //   if (!editor) return null;

// // // //   // Function to handle image upload inside the editor
// // // //   const addImage = async () => {
// // // //     const input = document.createElement('input');
// // // //     input.type = 'file';
// // // //     input.accept = 'image/*';

// // // //     input.onchange = async () => {
// // // //       if (input.files && input.files[0]) {
// // // //         const file = input.files[0];
// // // //         const formData = new FormData();
// // // //         formData.append('file', file);

// // // //         try {
// // // //           // 1. Send file to your backend's image upload endpoint
// // // //           const res = await fetch('/api/upload', {
// // // //             method: 'POST',
// // // //             body: formData,
// // // //           });

// // // //           const data = await res.json();

// // // //           // 2. Insert the image URL into the editor stream wherever the cursor is
// // // //           if (data.url) {
// // // //             editor.chain().focus().setImage({ src: data.url }).run();
// // // //           }
// // // //         } catch (error) {
// // // //           console.error('Image upload failed:', error);
// // // //         }
// // // //       }
// // // //     };

// // // //     input.click();
// // // //   };

// // // //   return (
// // // //     <div className="space-y-2">
// // // //       {/* Basic Editor Toolbar */}
// // // //       <div className="flex gap-2 border p-2 rounded-t-md bg-gray-50 flex-wrap">
// // // //         <button
// // // //           type="button"
// // // //           onClick={() => editor.chain().focus().toggleBold().run()}
// // // //           className={`px-2 py-1 border rounded text-sm ${
// // // //             editor.isActive('bold') ? 'bg-gray-200 font-bold' : ''
// // // //           }`}
// // // //         >
// // // //           Bold
// // // //         </button>
// // // //         <button
// // // //           type="button"
// // // //           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
// // // //           className={`px-2 py-1 border rounded text-sm ${
// // // //             editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 font-bold' : ''
// // // //           }`}
// // // //         >
// // // //           H2
// // // //         </button>
// // // //         <button
// // // //           type="button"
// // // //           onClick={() => editor.chain().focus().toggleBulletList().run()}
// // // //           className={`px-2 py-1 border rounded text-sm ${
// // // //             editor.isActive('bulletList') ? 'bg-gray-200 font-bold' : ''
// // // //           }`}
// // // //         >
// // // //           List
// // // //         </button>
// // // //         <button
// // // //           type="button"
// // // //           onClick={addImage}
// // // //           className="px-2 py-1 border rounded text-sm bg-blue-50 text-blue-600 font-medium hover:bg-blue-100"
// // // //         >
// // // //           + Add Image
// // // //         </button>
// // // //       </div>

// // // //       {/* The Actual Rich Text Input Box */}
// // // //       <EditorContent editor={editor} />
// // // //     </div>
// // // //   );
// // // // }



// // // 'use client';

// // // import { useEditor, EditorContent } from '@tiptap/react';
// // // import StarterKit from '@tiptap/starter-kit';
// // // import Image from '@tiptap/extension-image';
// // // import Link from '@tiptap/extension-link';
// // // import endpointRoute from '@/lib/endpointRoute';
// // // import toast from 'react-hot-toast';

// // // interface BlogEditorProps {
// // //   content: string;
// // //   onChange: (html: string) => void;
// // // }

// // // export default function BlogEditor({ content, onChange }: BlogEditorProps) {
// // //   const editor = useEditor({
// // //     extensions: [
// // //       StarterKit,
// // //       Image.configure({
// // //         HTMLAttributes: {
// // //           class: 'rounded-lg max-w-full h-auto my-4',
// // //         },
// // //       }),
// // //       Link.configure({
// // //         openOnClick: false,
// // //         HTMLAttributes: {
// // //           class: 'text-blue-600 underline hover:text-blue-800',
// // //         },
// // //       }),
// // //     ],
// // //     content: content,
// // //     immediatelyRender: false,
// // //     onUpdate: ({ editor }) => {
// // //       onChange(editor.getHTML());
// // //     },
// // //     editorProps: {
// // //       attributes: {
// // //         class:
// // //           'prose dark:prose-invert max-w-none focus:outline-none min-h-[350px] p-4 border border-gray-300 dark:border-gray-700 rounded-b-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950',
// // //       },
// // //     },
// // //   });

// // //   if (!editor) return null;

// // //   // Handle inline image upload to backend
// // //   const addImage = async () => {
// // //     const input = document.createElement('input');
// // //     input.type = 'file';
// // //     input.accept = 'image/*';

// // //     input.onchange = async () => {
// // //       if (input.files && input.files[0]) {
// // //         const file = input.files[0];
// // //         const formData = new FormData();
// // //         // Backend requirement: field name MUST be 'image'
// // //         formData.append('image', file);

// // //         const toastId = toast.loading('Uploading image...');

// // //         try {
// // //           // Endpoint: POST /api/blogs/upload-image
// // //           const res = await endpointRoute.post('/blogs/upload-image', formData, {
// // //             headers: {
// // //               'Content-Type': 'multipart/form-data',
// // //             },
// // //           });

// // //           // Backend returns: { success: true, url: "https://..." }
// // //           if (res.data?.url) {
// // //             editor.chain().focus().setImage({ src: res.data.url }).run();
// // //             toast.success('Image added successfully!', { id: toastId });
// // //           } else {
// // //             toast.error('Failed to get image URL', { id: toastId });
// // //           }
// // //         } catch (error) {
// // //           toast.error('Image upload failed', { id: toastId });
// // //           console.error('Image upload error:', error);
// // //         }
// // //       }
// // //     };

// // //     input.click();
// // //   };

// // //   // Handle adding external or internal links
// // //   const setLink = () => {
// // //     const previousUrl = editor.getAttributes('link').href;
// // //     const url = window.prompt('Enter URL:', previousUrl);

// // //     if (url === null) return;

// // //     if (url === '') {
// // //       editor.chain().focus().extendMarkRange('link').unsetLink().run();
// // //       return;
// // //     }

// // //     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
// // //   };

// // //   return (
// // //     <div className="space-y-0 rounded-md shadow-sm">
// // //       {/* Editor Toolbar with high-visibility styling */}
// // //       <div className="flex gap-1.5 border border-b-0 border-gray-300 dark:border-gray-700 p-2 rounded-t-md bg-gray-100 dark:bg-gray-900 flex-wrap items-center">
// // //         <button
// // //           type="button"
// // //           onClick={() => editor.chain().focus().toggleBold().run()}
// // //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// // //             editor.isActive('bold')
// // //               ? 'bg-black text-white dark:bg-white dark:text-black border-black'
// // //               : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
// // //           }`}
// // //         >
// // //           Bold
// // //         </button>

// // //         <button
// // //           type="button"
// // //           onClick={() => editor.chain().focus().toggleItalic().run()}
// // //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// // //             editor.isActive('italic')
// // //               ? 'bg-black text-white dark:bg-white dark:text-black border-black'
// // //               : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
// // //           }`}
// // //         >
// // //           Italic
// // //         </button>

// // //         <button
// // //           type="button"
// // //           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
// // //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// // //             editor.isActive('heading', { level: 2 })
// // //               ? 'bg-black text-white dark:bg-white dark:text-black border-black'
// // //               : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
// // //           }`}
// // //         >
// // //           H2
// // //         </button>

// // //         <button
// // //           type="button"
// // //           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
// // //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// // //             editor.isActive('heading', { level: 3 })
// // //               ? 'bg-black text-white dark:bg-white dark:text-black border-black'
// // //               : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
// // //           }`}
// // //         >
// // //           H3
// // //         </button>

// // //         <button
// // //           type="button"
// // //           onClick={() => editor.chain().focus().toggleBulletList().run()}
// // //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// // //             editor.isActive('bulletList')
// // //               ? 'bg-black text-white dark:bg-white dark:text-black border-black'
// // //               : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
// // //           }`}
// // //         >
// // //           Bullet List
// // //         </button>

// // //         <button
// // //           type="button"
// // //           onClick={setLink}
// // //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// // //             editor.isActive('link')
// // //               ? 'bg-black text-white dark:bg-white dark:text-black border-black'
// // //               : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
// // //           }`}
// // //         >
// // //           Link
// // //         </button>

// // //         <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1" />

// // //         <button
// // //           type="button"
// // //           onClick={addImage}
// // //           className="px-3 py-1.5 border rounded text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 border-blue-600 transition"
// // //         >
// // //           📷 Add Image
// // //         </button>
// // //       </div>

// // //       {/* Tiptap Editable Content Field */}
// // //       <EditorContent editor={editor} />
// // //     </div>
// // //   );
// // // }



// // 'use client';

// // import { useEditor, EditorContent } from '@tiptap/react';
// // import StarterKit from '@tiptap/starter-kit';
// // import Image from '@tiptap/extension-image';
// // import Link from '@tiptap/extension-link';
// // import endpointRoute from '@/lib/endpointRoute';
// // import toast from 'react-hot-toast';

// // interface BlogEditorProps {
// //   content: string;
// //   onChange: (html: string) => void;
// // }

// // export default function BlogEditor({ content, onChange }: BlogEditorProps) {
// //   const editor = useEditor({
// //     extensions: [
// //       StarterKit,
// //       Image.configure({
// //         HTMLAttributes: {
// //           class: 'rounded-lg max-w-full h-auto my-4 border border-[#7A7A7A]/20',
// //         },
// //       }),
// //       Link.configure({
// //         openOnClick: false,
// //         HTMLAttributes: {
// //           class: 'text-[#C59A46] underline hover:opacity-80 transition-opacity',
// //         },
// //       }),
// //     ],
// //     content: content,
// //     immediatelyRender: false,
// //     onUpdate: ({ editor }) => {
// //       onChange(editor.getHTML());
// //     },
// //     editorProps: {
// //       attributes: {
// //         class:
// //           'prose max-w-none focus:outline-none min-h-[350px] p-4 rounded-b-md text-[#1F1F1F] bg-white border border-[#7A7A7A]/30 focus:border-[#C59A46]',
// //       },
// //     },
// //   });

// //   if (!editor) return null;

// //   // Handle inline image upload inside editor
// //   const addImage = async () => {
// //     const input = document.createElement('input');
// //     input.type = 'file';
// //     input.accept = 'image/*';

// //     input.onchange = async () => {
// //       if (input.files && input.files[0]) {
// //         const file = input.files[0];
// //         const formData = new FormData();
// //         formData.append('image', file);

// //         const toastId = toast.loading('Uploading inline image...');

// //         try {
// //           const res = await endpointRoute.post('/blogs/upload-image', formData, {
// //             headers: {
// //               'Content-Type': 'multipart/form-data',
// //             },
// //           });

// //           if (res.data?.url) {
// //             editor.chain().focus().setImage({ src: res.data.url }).run();
// //             toast.success('Image inserted!', { id: toastId });
// //           } else {
// //             toast.error('Failed to upload image', { id: toastId });
// //           }
// //         } catch (error) {
// //           toast.error('Image upload failed', { id: toastId });
// //           console.error('Editor image upload error:', error);
// //         }
// //       }
// //     };

// //     input.click();
// //   };

// //   const setLink = () => {
// //     const previousUrl = editor.getAttributes('link').href;
// //     const url = window.prompt('Enter URL:', previousUrl);

// //     if (url === null) return;

// //     if (url === '') {
// //       editor.chain().focus().extendMarkRange('link').unsetLink().run();
// //       return;
// //     }

// //     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
// //   };

// //   return (
// //     <div className="space-y-0 rounded-md shadow-sm">
// //       {/* Editor Toolbar */}
// //       <div className="flex gap-2 border border-b-0 border-[#7A7A7A]/30 p-2.5 rounded-t-md bg-[#F8F5F0] flex-wrap items-center">
// //         <button
// //           type="button"
// //           onClick={() => editor.chain().focus().toggleBold().run()}
// //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// //             editor.isActive('bold')
// //               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
// //               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
// //           }`}
// //         >
// //           Bold
// //         </button>

// //         <button
// //           type="button"
// //           onClick={() => editor.chain().focus().toggleItalic().run()}
// //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// //             editor.isActive('italic')
// //               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
// //               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
// //           }`}
// //         >
// //           Italic
// //         </button>

// //         <button
// //           type="button"
// //           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
// //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// //             editor.isActive('heading', { level: 2 })
// //               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
// //               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
// //           }`}
// //         >
// //           H2
// //         </button>

// //         <button
// //           type="button"
// //           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
// //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// //             editor.isActive('heading', { level: 3 })
// //               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
// //               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
// //           }`}
// //         >
// //           H3
// //         </button>

// //         <button
// //           type="button"
// //           onClick={() => editor.chain().focus().toggleBulletList().run()}
// //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// //             editor.isActive('bulletList')
// //               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
// //               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
// //           }`}
// //         >
// //           Bullet List
// //         </button>

// //         <button
// //           type="button"
// //           onClick={setLink}
// //           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
// //             editor.isActive('link')
// //               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
// //               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
// //           }`}
// //         >
// //           Link
// //         </button>

// //         <div className="h-4 w-[1px] bg-[#7A7A7A]/30 mx-1" />

// //         <button
// //           type="button"
// //           onClick={addImage}
// //           className="px-3 py-1.5 border rounded text-xs font-bold bg-[#C59A46] text-white hover:bg-[#b0873b] border-[#C59A46] transition"
// //         >
// //           + Add Image
// //         </button>
// //       </div>

// //       {/* Editor Main Content Area */}
// //       <EditorContent editor={editor} />
// //     </div>
// //   );
// // }


// 'use client';

// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Image from '@tiptap/extension-image';
// import Link from '@tiptap/extension-link';
// import endpointRoute from '@/lib/endpointRoute';
// import toast from 'react-hot-toast';

// interface BlogEditorProps {
//   content: string;
//   onChange: (html: string) => void;
// }

// export default function BlogEditor({ content, onChange }: BlogEditorProps) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Image.configure({
//         HTMLAttributes: {
//           class: 'rounded-lg max-w-full h-auto my-4 border border-[#7A7A7A]/20',
//         },
//       }),
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: {
//           class: 'text-[#C59A46] font-semibold underline hover:opacity-80 transition-opacity',
//         },
//       }),
//     ],
//     content: content,
//     immediatelyRender: false,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//     editorProps: {
//       attributes: {
//         // Enforced explicit black text (#1F1F1F) and clean white background with proper heading colors
//         class:
//           'prose max-w-none focus:outline-none min-h-[350px] p-4 rounded-b-md text-[#1F1F1F] bg-white border border-[#7A7A7A]/30 focus:border-[#C59A46] [&_*]:text-[#1F1F1F] [&_h1]:text-[#1F1F1F] [&_h2]:text-[#1F1F1F] [&_h3]:text-[#1F1F1F] [&_p]:text-[#1F1F1F] [&_li]:text-[#1F1F1F]',
//       },
//     },
//   });

//   if (!editor) return null;

//   // Handle inline image upload inside editor
//   const addImage = async () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';

//     input.onchange = async () => {
//       if (input.files && input.files[0]) {
//         const file = input.files[0];
//         const formData = new FormData();
//         formData.append('image', file);

//         const toastId = toast.loading('Uploading inline image...');

//         try {
//           const res = await endpointRoute.post('/blogs/upload-image', formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });

//           if (res.data?.url) {
//             editor.chain().focus().setImage({ src: res.data.url }).run();
//             toast.success('Image inserted!', { id: toastId });
//           } else {
//             toast.error('Failed to upload image', { id: toastId });
//           }
//         } catch (error) {
//           toast.error('Image upload failed', { id: toastId });
//           console.error('Editor image upload error:', error);
//         }
//       }
//     };

//     input.click();
//   };

//   const setLink = () => {
//     const previousUrl = editor.getAttributes('link').href;
//     const url = window.prompt('Enter URL:', previousUrl);

//     if (url === null) return;

//     if (url === '') {
//       editor.chain().focus().extendMarkRange('link').unsetLink().run();
//       return;
//     }

//     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };

//   return (
//     <div className="space-y-0 rounded-md shadow-sm">
//       {/* Editor Toolbar with Crisp Black Text */}
//       <div className="flex gap-2 border border-b-0 border-[#7A7A7A]/30 p-2.5 rounded-t-md bg-[#F8F5F0] flex-wrap items-center">
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
//             editor.isActive('bold')
//               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
//               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
//           }`}
//         >
//           Bold
//         </button>

//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
//             editor.isActive('italic')
//               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
//               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
//           }`}
//         >
//           Italic
//         </button>

//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
//             editor.isActive('heading', { level: 2 })
//               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
//               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
//           }`}
//         >
//           H2
//         </button>

//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
//             editor.isActive('heading', { level: 3 })
//               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
//               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
//           }`}
//         >
//           H3
//         </button>

//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
//             editor.isActive('bulletList')
//               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
//               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
//           }`}
//         >
//           Bullet List
//         </button>

//         <button
//           type="button"
//           onClick={setLink}
//           className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
//             editor.isActive('link')
//               ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
//               : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
//           }`}
//         >
//           Link
//         </button>

//         <div className="h-4 w-[1px] bg-[#7A7A7A]/30 mx-1" />

//         <button
//           type="button"
//           onClick={addImage}
//           className="px-3 py-1.5 border rounded text-xs font-bold bg-[#C59A46] text-white hover:bg-[#b0873b] border-[#C59A46] transition"
//         >
//           + Add Image
//         </button>
//       </div>

//       {/* Editor Main Content Area */}
//       <EditorContent editor={editor} />
//     </div>
//   );
// }


'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import endpointRoute from '@/lib/endpointRoute';
import toast from 'react-hot-toast';

interface BlogEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 border border-[#7A7A7A]/20',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#C59A46] font-bold underline cursor-pointer hover:opacity-80',
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose max-w-none focus:outline-none min-h-[350px] p-4 rounded-b-md text-[#1F1F1F] bg-white border border-[#7A7A7A]/30 focus:border-[#C59A46] [&_*]:text-[#1F1F1F] [&_h1]:text-[#1F1F1F] [&_h2]:text-[#1F1F1F] [&_h3]:text-[#1F1F1F] [&_p]:text-[#1F1F1F] [&_li]:text-[#1F1F1F] [&_a]:text-[#C59A46]',
      },
    },
  });

  if (!editor) return null;

  // Handle inline image upload inside editor
  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('image', file);

        const toastId = toast.loading('Uploading inline image...');

        try {
          const res = await endpointRoute.post('blogs/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (res.data?.url) {
            editor.chain().focus().setImage({ src: res.data.url }).run();
            toast.success('Image inserted!', { id: toastId });
          } else {
            toast.error('Failed to upload image', { id: toastId });
          }
        } catch (error) {
          toast.error('Image upload failed', { id: toastId });
          console.error('Editor image upload error:', error);
        }
      }
    };

    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL (e.g. https://example.com):', previousUrl || 'https://');

    if (url === null) return;

    if (url.trim() === '' || url === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="space-y-0 rounded-md shadow-sm">
      {/* Editor Toolbar */}
      <div className="flex gap-2 border border-b-0 border-[#7A7A7A]/30 p-2.5 rounded-t-md bg-[#F8F5F0] flex-wrap items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
            editor.isActive('paragraph')
              ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
          }`}
        >
          Paragraph
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
            editor.isActive('bold')
              ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
          }`}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
            editor.isActive('italic')
              ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
          }`}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
          }`}
        >
          H3
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
            editor.isActive('bulletList')
              ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
          }`}
        >
          Bullet List
        </button>

        <button
          type="button"
          onClick={setLink}
          className={`px-3 py-1.5 border rounded text-xs font-semibold transition ${
            editor.isActive('link')
              ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#7A7A7A]/30 hover:border-[#C59A46]'
          }`}
        >
          Link
        </button>

        <div className="h-4 w-[1px] bg-[#7A7A7A]/30 mx-1" />

        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1.5 border rounded text-xs font-bold bg-[#C59A46] text-white hover:bg-[#b0873b] border-[#C59A46] transition"
        >
          + Add Image
        </button>
      </div>

      {/* Editor Main Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
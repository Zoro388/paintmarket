

// 'use client';

// import { useState } from 'react';
// import BlogEditor from './components/blogComponent';
// import endpointRoute from '@/lib/endpointRoute';
// import DeleteEdit from './components/editDelete'
// import toast from 'react-hot-toast';

// const Page = () => {
//   const [title, setTitle] = useState('');
//   const [shortDescription, setShortDescription] = useState('');
//   // Store the raw File object for featuredImage
//   const [featuredImage, setFeaturedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [content, setContent] = useState('');

//   // SEO fields
//   const [metaTitle, setMetaTitle] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [canonicalUrl, setCanonicalUrl] = useState('');

//   const [loading, setLoading] = useState(false);

//   // Featured Image Change Handler
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFeaturedImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleRemoveImage = () => {
//     setFeaturedImage(null);
//     setImagePreview('');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!featuredImage) {
//       toast.error('Featured image is required');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Build multipart/form-data payload as expected by backend
//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('shortDescription', shortDescription || metaDescription);
//       formData.append('content', content);
//       formData.append('featuredImage', featuredImage); // Sends the raw File object
//       formData.append('metaTitle', metaTitle || title);
//       formData.append('metaDescription', metaDescription);
//       formData.append('canonicalUrl', canonicalUrl);
//       formData.append('status', 'published');
//       formData.append('isFeatured', 'true');

//       await endpointRoute.post('/blogs', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast.success('Blog post saved successfully!');

//       // Reset Form
//       setTitle('');
//       setShortDescription('');
//       setFeaturedImage(null);
//       setImagePreview('');
//       setContent('');
//       setMetaTitle('');
//       setMetaDescription('');
//       setCanonicalUrl('');
//     } catch (error) {
//       toast.error('Something went wrong');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F5F0] py-10 px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-[#7A7A7A]/20 space-y-6 text-[#1F1F1F]"
//       >
//         <div className="border-b border-[#7A7A7A]/20 pb-4">
//           <h1 className="text-2xl font-bold text-[#1F1F1F]">Create Blog Post</h1>
//           <p className="text-sm text-[#7A7A7A] mt-1">
//             Write your story, upload images, and manage SEO options.
//           </p>
//         </div>

//         {/* Main Section */}
//         <div className="space-y-5">
//           <div>
//             <label className="block text-sm font-semibold mb-1 text-[#1F1F1F]">
//               Blog Title *
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full border border-[#7A7A7A]/30 p-3 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] transition"
//               placeholder="Enter post title..."
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold mb-1 text-[#1F1F1F]">
//               Short Description *
//             </label>
//             <input
//               type="text"
//               value={shortDescription}
//               onChange={(e) => setShortDescription(e.target.value)}
//               className="w-full border border-[#7A7A7A]/30 p-3 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] transition"
//               placeholder="Short description..."
//               required
//             />
//           </div>

//           {/* Featured Image Upload Field */}
//           <div>
//             <label className="block text-sm font-semibold mb-1 text-[#1F1F1F]">
//               Featured Image *
//             </label>

//             {!imagePreview ? (
//               <label className="cursor-pointer inline-block bg-[#C59A46] text-white text-sm font-semibold px-4 py-2.5 rounded-md hover:bg-[#b0873b] transition">
//                 📁 Choose Featured Image
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleImageChange}
//                   required
//                 />
//               </label>
//             ) : (
//               <div className="relative w-full h-56 border border-[#7A7A7A]/20 rounded-lg overflow-hidden bg-[#F8F5F0] group">
//                 <img
//                   src={imagePreview}
//                   alt="Featured Preview"
//                   className="w-full h-full object-cover"
//                 />

//                 <button
//                   type="button"
//                   onClick={handleRemoveImage}
//                   className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition flex items-center justify-center group-hover:scale-105"
//                   title="Remove featured image"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="w-4 h-4"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>

//                 <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
//                   Featured Image Selected
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* TipTap Rich Text Editor */}
//           <div>
//             <label className="block text-sm font-semibold mb-1 text-[#1F1F1F]">
//               Blog Content *
//             </label>
//             <BlogEditor content={content} onChange={setContent} />
//           </div>
//         </div>

//         {/* SEO Configuration Section */}
//         <div className="border-t border-[#7A7A7A]/20 pt-6 space-y-4">
//           <div>
//             <h2 className="text-lg font-bold text-[#1F1F1F]">SEO Settings</h2>
//             <p className="text-xs text-[#7A7A7A]">
//               Optional fields to optimize for search engines.
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1 text-[#1F1F1F]">
//               Meta Title
//             </label>
//             <input
//               type="text"
//               value={metaTitle}
//               onChange={(e) => setMetaTitle(e.target.value)}
//               className="w-full border border-[#7A7A7A]/30 p-2.5 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] text-sm"
//               placeholder="Custom title tag for search engines"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1 text-[#1F1F1F]">
//               Meta Description
//             </label>
//             <textarea
//               rows={3}
//               value={metaDescription}
//               onChange={(e) => setMetaDescription(e.target.value)}
//               className="w-full border border-[#7A7A7A]/30 p-2.5 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] text-sm"
//               placeholder="Short summary for Google search results..."
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1 text-[#1F1F1F]">
//               Canonical URL
//             </label>
//             <input
//               type="text"
//               value={canonicalUrl}
//               onChange={(e) => setCanonicalUrl(e.target.value)}
//               className="w-full border border-[#7A7A7A]/30 p-2.5 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] text-sm"
//               placeholder="https://yourdomain.com/blog/original-post"
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-3 bg-[#1F1F1F] text-white font-bold rounded-md hover:bg-[#C59A46] transition duration-200 disabled:opacity-50"
//         >
//           {loading ? 'Publishing...' : 'Publish Blog Post'}
//         </button>
//       </form>


//       <DeleteEdit />
//     </div>
//   );
// };

// export default Page;

'use client';

import { useState } from 'react';
import BlogEditor from './components/blogComponent';
import BlogList, { BlogItem } from './components/editDelete';
import endpointRoute from '@/lib/endpointRoute';
import toast from 'react-hot-toast';

const Page = () => {
  // Editing state tracking
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [content, setContent] = useState('');

  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Featured Image Change Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage(null);
    setImagePreview('');
  };

  // Populate form for Editing
  const handleEditSelect = (blog: BlogItem) => {
    setEditingId(blog._id);
    setTitle(blog.title || '');
    setShortDescription(blog.shortDescription || '');
    setContent(blog.content || '');
    setImagePreview(blog.featuredImage || '');
    setFeaturedImage(null); // Leave null unless admin uploads a new file
    setMetaTitle(blog.metaTitle || '');
    setMetaDescription(blog.metaDescription || '');
    setCanonicalUrl(blog.canonicalUrl || '');

    // Smooth scroll back to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success(`Editing: "${blog.title}"`);
  };

  // Reset form back to Creation mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setShortDescription('');
    setFeaturedImage(null);
    setImagePreview('');
    setContent('');
    setMetaTitle('');
    setMetaDescription('');
    setCanonicalUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId && !featuredImage) {
      toast.error('Featured image is required for new posts');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('shortDescription', shortDescription || metaDescription);
      formData.append('content', content);

      // Send raw file if chosen, or keep imagePreview URL string when editing
      if (featuredImage) {
        formData.append('featuredImage', featuredImage);
      } else if (imagePreview) {
        formData.append('featuredImage', imagePreview);
      }

      formData.append('metaTitle', metaTitle || title);
      formData.append('metaDescription', metaDescription);
      formData.append('canonicalUrl', canonicalUrl);
      formData.append('status', 'published');
      formData.append('isFeatured', 'true');

      if (editingId) {
        // EDIT MODE: PUT to /blogs/:id
        await endpointRoute.put(`/blogs/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Blog post updated successfully!');
      } else {
        // CREATE MODE: POST to /blogs
        await endpointRoute.post('/blogs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Blog post published successfully!');
      }

      // Reset form and refresh list
      handleCancelEdit();
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error(editingId ? 'Failed to update blog' : 'Failed to publish blog');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-10 px-4 space-y-10">
      {/* Blog Upload / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-[#7A7A7A]/20 space-y-6 text-[#1F1F1F]"
      >
        <div className="border-b border-[#7A7A7A]/20 pb-4 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-[#1F1F1F]">
              {editingId ? 'Edit Blog Post' : 'Create Blog Post'}
            </h1>
            <p className="text-sm text-[#7A7A7A] mt-1">
              {editingId
                ? 'Update your blog details below.'
                : 'Write your story, upload images, and manage SEO options.'}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs font-bold px-3 py-1.5 bg-[#7A7A7A]/20 text-[#1F1F1F] rounded hover:bg-[#7A7A7A]/30 transition"
            >
              ✕ Cancel Edit
            </button>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1F1F1F]">
              Blog Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#7A7A7A]/30 p-3 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] transition"
              placeholder="Enter post title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1F1F1F]">
              Short Description *
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full border border-[#7A7A7A]/30 p-3 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] transition"
              placeholder="Short description..."
              required
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1F1F1F]">
              Featured Image *
            </label>

            {!imagePreview ? (
              <label className="cursor-pointer inline-block bg-[#C59A46] text-white text-sm font-semibold px-4 py-2.5 rounded-md hover:bg-[#b0873b] transition">
                📁 Choose Featured Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  required={!editingId}
                />
              </label>
            ) : (
              <div className="relative w-full h-56 border border-[#7A7A7A]/20 rounded-lg overflow-hidden bg-[#F8F5F0] group">
                <img
                  src={imagePreview}
                  alt="Featured Preview"
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition flex items-center justify-center group-hover:scale-105"
                  title="Remove featured image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                  Featured Image Set
                </div>
              </div>
            )}
          </div>

          {/* TipTap Rich Text Editor */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#1F1F1F]">
              Blog Content *
            </label>
            <BlogEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="border-t border-[#7A7A7A]/20 pt-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#1F1F1F]">SEO Settings</h2>
            <p className="text-xs text-[#7A7A7A]">
              Optional fields to optimize for search engines.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#1F1F1F]">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full border border-[#7A7A7A]/30 p-2.5 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] text-sm"
              placeholder="Custom title tag for search engines"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#1F1F1F]">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full border border-[#7A7A7A]/30 p-2.5 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] text-sm"
              placeholder="Short summary for Google search results..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#1F1F1F]">
              Canonical URL
            </label>
            <input
              type="text"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="w-full border border-[#7A7A7A]/30 p-2.5 rounded-md text-[#1F1F1F] bg-white focus:outline-none focus:border-[#C59A46] text-sm"
              placeholder="https://yourdomain.com/blog/original-post"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#1F1F1F] text-white font-bold rounded-md hover:bg-[#C59A46] transition duration-200 disabled:opacity-50"
        >
          {loading
            ? editingId
              ? 'Updating...'
              : 'Publishing...'
            : editingId
            ? 'Update Blog Post'
            : 'Publish Blog Post'}
        </button>
      </form>

      {/* Embedded Blog List Rendered Directly Below Form */}
      <BlogList onEdit={handleEditSelect} refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default Page;
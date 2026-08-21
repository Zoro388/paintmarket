

// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import endpointRoute from '@/lib/endpointRoute';
// import toast from 'react-hot-toast';
// import Navbar from '@/components/landing/Navbar';
// import Footer from '@/components/landing/Footer';

// interface BlogPost {
//   _id?: string;
//   id?: string;
//   title: string;
//   slug: string;
//   shortDescription?: string;
//   featuredImage?: string;
//   createdAt?: string;
// }

// export default function BlogsPage() {
//   const [blogs, setBlogs] = useState<BlogPost[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const res = await endpointRoute.get('/blogs');
//         // Handles array response directly or inside data key
//         const data = Array.isArray(res.data) ? res.data : res.data?.blogs || res.data?.data || [];
//         setBlogs(data);
//         console.log('data', res)
//       } catch (error) {
//         toast.error('Failed to load blogs');
//         console.error('Fetch blogs error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#F8F5F0] py-12 px-4">
//       <Navbar />
//       <div className="max-w-6xl py-10 mx-auto space-y-8">
//         {/* Header */}
//         <div className="border-b border-[#7A7A7A]/20 pb-6 flex justify-between items-center flex-wrap gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-[#1F1F1F]">Latest Blog Posts</h1>
//             <p className="text-sm text-[#7A7A7A] mt-1">
//               Explore our latest articles, insights, and updates.
//             </p>
//           </div>
         
//         </div>

//         {/* Loading Skeleton */}
//         {loading && (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map((n) => (
//               <div
//                 key={n}
//                 className="bg-white rounded-xl h-80 border border-[#7A7A7A]/20 animate-pulse p-4 space-y-4"
//               >
//                 <div className="bg-[#7A7A7A]/10 h-40 rounded-lg w-full" />
//                 <div className="bg-[#7A7A7A]/10 h-6 rounded w-3/4" />
//                 <div className="bg-[#7A7A7A]/10 h-4 rounded w-1/2" />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && blogs.length === 0 && (
//           <div className="text-center py-16 bg-white rounded-xl border border-[#7A7A7A]/20 p-8 space-y-3">
//             <h2 className="text-xl font-bold text-[#1F1F1F]">No blog posts found</h2>
//             <p className="text-sm text-[#7A7A7A]">
//               Get started by creating your very first article!
//             </p>
//           </div>
//         )}

//         {/* Blogs Grid */}
//         {!loading && blogs.length > 0 && (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {blogs.map((blog) => (
//               <article
//                 key={blog._id || blog.id || blog.slug}
//                 className="bg-white rounded-xl border border-[#7A7A7A]/20 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
//               >
//                 {/* Featured Image */}
//                 <div className="h-48 w-full bg-[#F8F5F0] overflow-hidden relative">
//                   {blog.featuredImage ? (
//                     <img
//                       src={blog.featuredImage}
//                       alt={blog.title}
//                       className="w-full h-full object-cover hover:scale-105 transition duration-300"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-[#7A7A7A] text-sm">
//                       No Featured Image
//                     </div>
//                   )}
//                 </div>

//                 {/* Content Details */}
//                 <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
//                   <div className="space-y-2">
//                     <h2 className="text-xl font-bold text-[#1F1F1F] line-clamp-2 hover:text-[#C59A46] transition">
//                       <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
//                     </h2>
//                     {blog.shortDescription && (
//                       <p className="text-sm text-[#7A7A7A] line-clamp-3">
//                         {blog.shortDescription}
//                       </p>
//                     )}
//                   </div>

//                   <div className="pt-2 border-t border-[#7A7A7A]/10 flex items-center justify-between">
//                     <Link
//                       href={`/blog/${blog.slug}`}
//                       className="text-xs font-bold text-[#C59A46] hover:underline uppercase tracking-wider"
//                     >
//                       Read Full Article →
//                     </Link>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import endpointRoute from '@/lib/endpointRoute';
import toast from 'react-hot-toast';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

interface BlogPost {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  shortDescription?: string;
  featuredImage?: string;
  createdAt?: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await endpointRoute.get('/blogs');
        // Handles array response directly or inside data key
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.blogs || res.data?.data || [];
        setBlogs(data);
        console.log('data', res);
      } catch (error) {
        toast.error('Failed to load blogs');
        console.error('Fetch blogs error:', error);
      } 
        setLoading(false);
      
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-12 px-4">
      <Navbar />
      <div className="max-w-6xl py-10 mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#7A7A7A]/20 pb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F1F1F]">Latest Blog Posts</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">
              Explore our latest articles, insights, and updates.
            </p>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl h-80 border border-[#7A7A7A]/20 animate-pulse p-4 space-y-4"
              >
                <div className="bg-[#7A7A7A]/10 h-40 rounded-lg w-full" />
                <div className="bg-[#7A7A7A]/10 h-6 rounded w-3/4" />
                <div className="bg-[#7A7A7A]/10 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#7A7A7A]/20 p-8 space-y-3">
            <h2 className="text-xl font-bold text-[#1F1F1F]">No blog posts found</h2>
            <p className="text-sm text-[#7A7A7A]">
              Get started by creating your very first article!
            </p>
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && blogs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article
                key={blog._id || blog.id || blog.slug}
                className="bg-white rounded-xl border border-[#7A7A7A]/20 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                {/* Featured Image */}
                <div className="h-48 w-full bg-[#F8F5F0] overflow-hidden relative">
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#7A7A7A] text-sm">
                      No Featured Image
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-[#1F1F1F] line-clamp-2 hover:text-[#C59A46] transition">
                      <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h2>
                    {blog.shortDescription && (
                      <p className="text-sm text-[#7A7A7A] line-clamp-3">
                        {blog.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#7A7A7A]/10 flex items-center justify-between">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="text-xs font-bold text-[#C59A46] hover:underline uppercase tracking-wider"
                    >
                      Read Full Article →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
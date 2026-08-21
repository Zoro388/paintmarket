// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import endpointRoute from '@/lib/endpointRoute';
// import toast from 'react-hot-toast';
// import Navbar from '@/components/landing/Navbar';
// import Footer from '@/components/landing/Footer';

// interface SingleBlog {
//   title: string;
//   slug: string;
//   shortDescription?: string;
//   featuredImage?: string;
//   content: string;
//   createdAt?: string;
// }

// export default function SingleBlogPage() {
//   const params = useParams();
//   const router = useRouter();
//   const slug = params?.slug as string;

//   const [blog, setBlog] = useState<SingleBlog | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!slug) return;

//     const fetchSingleBlog = async () => {
//       try {
//         const res = await endpointRoute.get(`/blogs/${slug}`);
//         // Handles blog payload directly or wrapped in data/blog property
//         const data = res.data?.blog || res.data?.data || res.data;
//         setBlog(data);
//       } catch (error) {
//         toast.error('Could not load blog post');
//         console.error('Fetch single blog error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSingleBlog();
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#F8F5F0] py-12 px-4 flex justify-center">
//         <div className="max-w-3xl w-full bg-white p-8 rounded-xl border border-[#7A7A7A]/20 animate-pulse space-y-6">
//           <div className="bg-[#7A7A7A]/10 h-8 rounded w-3/4" />
//           <div className="bg-[#7A7A7A]/10 h-64 rounded-lg w-full" />
//           <div className="space-y-3">
//             <div className="bg-[#7A7A7A]/10 h-4 rounded w-full" />
//             <div className="bg-[#7A7A7A]/10 h-4 rounded w-5/6" />
//             <div className="bg-[#7A7A7A]/10 h-4 rounded w-4/6" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!blog) {
//     return (
//       <div className="min-h-screen bg-[#F8F5F0] py-16 px-4 text-center">
//         <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-[#7A7A7A]/20 space-y-4">
//           <h2 className="text-2xl font-bold text-[#1F1F1F]">Blog Post Not Found</h2>
//           <p className="text-sm text-[#7A7A7A]">
//             The requested article could not be found or has been removed.
//           </p>
//           <button
//             onClick={() => router.push('/blog')}
//             className="px-5 py-2.5 bg-[#1F1F1F] text-white text-sm font-semibold rounded-md hover:bg-[#C59A46] transition"
//           >
//             ← Back to All Blogs
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F5F0] ">
//         <Navbar />
//       <article className="max-w-3xl mx-auto bg-white py-10 px-8 my-20 rounded-xl shadow-sm border border-[#7A7A7A]/20">
//         {/* Navigation */}
//         <Link
//           href="/blogs"
//           className="inline-flex items-center text-xs font-bold text-[#C59A46] hover:underline uppercase tracking-wider mb-2"
//         >
//           ← Back to All Blogs
//         </Link>

//         {/* Blog Header */}
//         <div className="border-b border-[#7A7A7A]/20 pb-6 space-y-3">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F1F1F]">
//             {blog.title}
//           </h1>

//           {blog.shortDescription && (
//             <p className="text-lg text-[#7A7A7A] italic leading-relaxed">
//               {blog.shortDescription}
//             </p>
//           )}
//         </div>

//         {/* Featured Cover Image Display */}
//         {blog.featuredImage && (
//           <div className="w-full max-h-[420px] rounded-lg overflow-hidden border border-[#7A7A7A]/20">
//             <img
//               src={blog.featuredImage}
//               alt={blog.title}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         )}

//         {/* TipTap Rendered HTML Content */}
//         <div
//           className="prose max-w-none text-[#1F1F1F] leading-relaxed pt-4
//             [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1F1F1F] [&_h2]:mt-6 [&_h2]:mb-3
//             [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#1F1F1F] [&_h3]:mt-5 [&_h3]:mb-2
//             [&_p]:text-[#1F1F1F] [&_p]:mb-4 [&_p]:leading-7
//             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:text-[#1F1F1F]
//             [&_a]:text-[#C59A46] [&_a]:font-bold [&_a]:underline
//             [&_img]:rounded-lg [&_img]:my-6 [&_img]:max-w-full [&_img]:border [&_img]:border-[#7A7A7A]/20"
//           dangerouslySetInnerHTML={{ __html: blog.content }}
//         />
//       </article>
//       <Footer />
//     </div>
//   );
// }




'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import endpointRoute from '@/lib/endpointRoute';
import toast from 'react-hot-toast';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

interface SingleBlog {
  title: string;
  slug: string;
  shortDescription?: string;
  featuredImage?: string;
  content: string;
  createdAt?: string;
}

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<SingleBlog | null>(null);
  const [loading, setLoading] = useState(true);

  // Text-To-Speech State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  // Cleanup speech synthesis if user navigates away mid-reading
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchSingleBlog = async () => {
      try {
        const res = await endpointRoute.get(`/blogs/${slug}`);
        // Handles blog payload directly or wrapped in data/blog property
        const data = res.data?.blog || res.data?.data || res.data;
        setBlog(data);
      } catch (error) {
        toast.error('Could not load blog post');
        console.error('Fetch single blog error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleBlog();
  }, [slug]);

  // Strip HTML tags from rich text/TipTap so the synth reads clean prose
  const extractCleanText = (htmlContent: string) => {
    if (typeof window === 'undefined') return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const handlePlayTTS = () => {
    if (!isSupported || !blog) return;

    // Resume if paused
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Clear any active voice instance
    window.speechSynthesis.cancel();

    const textToRead = `${blog.title}. ${blog.shortDescription || ''}. ${extractCleanText(blog.content)}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      toast.error('Error playing audio narration');
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePauseTTS = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStopTTS = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] py-12 px-4 flex justify-center">
        <div className="max-w-3xl w-full bg-white p-8 rounded-xl border border-[#7A7A7A]/20 animate-pulse space-y-6">
          <div className="bg-[#7A7A7A]/10 h-8 rounded w-3/4" />
          <div className="bg-[#7A7A7A]/10 h-64 rounded-lg w-full" />
          <div className="space-y-3">
            <div className="bg-[#7A7A7A]/10 h-4 rounded w-full" />
            <div className="bg-[#7A7A7A]/10 h-4 rounded w-5/6" />
            <div className="bg-[#7A7A7A]/10 h-4 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-[#7A7A7A]/20 space-y-4">
          <h2 className="text-2xl font-bold text-[#1F1F1F]">Blog Post Not Found</h2>
          <p className="text-sm text-[#7A7A7A]">
            The requested article could not be found or has been removed.
          </p>
          <button
            onClick={() => router.push('/blogs')}
            className="px-5 py-2.5 bg-[#1F1F1F] text-white text-sm font-semibold rounded-md hover:bg-[#C59A46] transition"
          >
            ← Back to All Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] pt-10">
      <Navbar />
      <article className="max-w-4xl mx-auto bg-white py-10 px-8 my-20 rounded-xl shadow-sm border border-[#7A7A7A]/20">
        {/* Navigation */}
        <Link
          href="/blogs"
          className="inline-flex items-center text-xs font-bold text-[#C59A46] hover:underline uppercase tracking-wider mb-2"
        >
          ← Back to All Blogs
        </Link>

        {/* Blog Header */}
        <div className="border-b border-[#7A7A7A]/20 pb-6 space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F1F1F]">
            {blog.title}
          </h1>

          {blog.shortDescription && (
            <p className="text-lg text-[#7A7A7A] italic leading-relaxed">
              {blog.shortDescription}
            </p>
          )}

          {/* Text-To-Speech Audio Control Bar */}
          {isSupported && (
            <div className="pt-2">
              <div className="inline-flex items-center gap-3 bg-[#F8F5F0] px-4 py-2.5 rounded-lg border border-[#7A7A7A]/20">
                <span className="text-xs font-semibold text-[#1F1F1F] uppercase tracking-wider">
                  Audio Narration:
                </span>

                {!isPlaying ? (
                  <button
                    onClick={handlePlayTTS}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1F1F1F] hover:bg-[#C59A46] rounded transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {isPaused ? 'Resume' : 'Listen to Article'}
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTTS}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#C59A46] hover:bg-[#1F1F1F] rounded transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                    Pause
                  </button>
                )}

                {(isPlaying || isPaused) && (
                  <button
                    onClick={handleStopTTS}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1F1F1F] bg-white border border-[#7A7A7A]/30 hover:bg-gray-100 rounded transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M6 6h12v12H6z" />
                    </svg>
                    Stop
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Featured Cover Image Display */}
        {blog.featuredImage && (
          <div className="w-full max-h-[420px] my-6 rounded-lg overflow-hidden border border-[#7A7A7A]/20">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* TipTap Rendered HTML Content */}
        <div
          className="prose max-w-none text-[#1F1F1F] leading-relaxed pt-4
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1F1F1F] [&_h2]:mt-6 [&_h2]:mb-3
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#1F1F1F] [&_h3]:mt-5 [&_h3]:mb-2
            [&_p]:text-[#1F1F1F] [&_p]:mb-4 [&_p]:leading-7
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:text-[#1F1F1F]
            [&_a]:text-[#C59A46] [&_a]:font-bold [&_a]:underline
            [&_img]:rounded-lg [&_img]:my-6 [&_img]:max-w-full [&_img]:border [&_img]:border-[#7A7A7A]/20"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
      <Footer />
    </div>
  );
}
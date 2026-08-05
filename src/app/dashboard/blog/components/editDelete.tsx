'use client';

import { useEffect, useState } from 'react';
import endpointRoute from '@/lib/endpointRoute';
import toast from 'react-hot-toast';

export interface BlogItem {
  _id: string;
  title: string;
  shortDescription?: string;
  content: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  createdAt?: string;
}

interface BlogListProps {
  onEdit: (blog: BlogItem) => void;
  refreshTrigger: number;
}

export default function BlogList({ onEdit, refreshTrigger }: BlogListProps) {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const res = await endpointRoute.get('/blogs');
      const data = Array.isArray(res.data) ? res.data : res.data?.blogs || res.data?.data || [];
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    setDeletingId(id);
    const toastId = toast.loading('Deleting blog...');

    try {
      await endpointRoute.delete(`/blogs/${id}`);
      toast.success('Blog deleted successfully!', { id: toastId });
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog', { id: toastId });
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl border border-[#7A7A7A]/20 space-y-4">
        <div className="h-6 bg-[#7A7A7A]/10 rounded w-1/3 animate-pulse" />
        <div className="h-20 bg-[#7A7A7A]/10 rounded w-full animate-pulse" />
        <div className="h-20 bg-[#7A7A7A]/10 rounded w-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-sm border border-[#7A7A7A]/20 space-y-6 text-[#1F1F1F]">
      <div className="border-b border-[#7A7A7A]/20 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#1F1F1F]">Uploaded Blog Posts</h2>
          <p className="text-xs text-[#7A7A7A] mt-0.5">
            Manage, edit, or delete existing blog posts.
          </p>
        </div>
        <span className="bg-[#F8F5F0] border border-[#7A7A7A]/20 text-[#1F1F1F] text-xs font-semibold px-3 py-1 rounded-full">
          Total: {blogs.length}
        </span>
      </div>

      {blogs.length === 0 ? (
        <p className="text-sm text-[#7A7A7A] text-center py-6">
          No blogs uploaded yet. Create one using the form above!
        </p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex items-center justify-between p-4 border border-[#7A7A7A]/20 rounded-lg hover:border-[#C59A46] transition bg-[#F8F5F0]/50 gap-4"
            >
              {/* Thumbnail & Title */}
              <div className="flex items-center gap-4 min-w-0">
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded-md border border-[#7A7A7A]/20 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#7A7A7A]/10 rounded-md flex items-center justify-center text-xs text-[#7A7A7A] shrink-0">
                    No Img
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-bold text-[#1F1F1F] truncate text-base">
                    {blog.title}
                  </h3>
                  {blog.shortDescription && (
                    <p className="text-xs text-[#7A7A7A] truncate mt-0.5">
                      {blog.shortDescription}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(blog)}
                  className="px-3 py-1.5 bg-[#C59A46] text-white text-xs font-bold rounded hover:bg-[#b0873b] transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(blog._id)}
                  disabled={deletingId === blog._id}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deletingId === blog._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
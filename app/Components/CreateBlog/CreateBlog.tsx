"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlogThunk } from "@/app/libs/redux/features/blogSlice";
import toast from "react-hot-toast";
import Loader from "@/app/Loader/Loader";
import { logout, logoutThunk } from "@/app/libs/redux/features/authSlice";
import { AppDispatch } from "@/app/libs/redux/store";
import { ThemeProps } from "@/app/hooks/themes";

const CreateBlog = ({
  theme,
  isLogged,
}: {
  theme: Partial<ThemeProps>;
  isLogged: boolean;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });
  const handleLogout = async () => {
    const res = await dispatch(logoutThunk(undefined));
    try {
      if (res.type === "auth/logout/rejected") {
        toast.error(res.payload.errMessage);
        dispatch(logout());
        return;
      }
      toast.success("Logged out successfully");
    } catch {
      toast.error(res.payload.errMessage);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image || !formData.title)
      return toast.error("Please fill all fields");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      setLoading(true);
      const res = await dispatch(createBlogThunk(data));      
      if (createBlogThunk.fulfilled.match(res)) {
        toast.success(res.payload?.message || "Post Published!");
        setFormData({ title: "", description: "", image: null });
      } else {
        if ((res.payload as any).errMessage === "jwt expired") return null;
        const errorMsg = "Failed to create blog";
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      className="py-12 w-full md:w-[60%] lg:w-[50%] mx-auto backdrop-blur-xl p-8 rounded-3xl border relative"
      style={{
        borderColor: `${theme.color}44`,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <h2
        className="text-4xl font-bold font-orbitron mb-8 text-center"
        style={{ color: theme.color }}
      >
        Share a Memory
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Title Input */}
          <div className="flex-1">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post Title"
              className="w-full bg-transparent border-b-2 border-gray-600 p-3 outline-none focus:border-white transition-colors text-white font-orbitron"
            />
          </div>
        </div>

        {/* Description Textarea */}
        <div className="w-full">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full bg-transparent border-2 border-gray-700 rounded-xl p-4 outline-none focus:border-white transition-all text-white resize-none"
          />
        </div>

        {/* Custom File Upload */}
        <div className="relative group cursor-pointer">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-2xl hover:border-white transition-all group-hover:bg-white/5">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="text-sm text-gray-400">
                {formData.image ? (
                  <span className="text-green-400 font-bold">
                    {formData.image.name}
                  </span>
                ) : (
                  "Click to upload a cool image"
                )}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*, .webp, .avif, .jpg, .jpeg, .png, .gif"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full py-4 rounded-xl font-orbitron font-bold text-xl uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          style={{ background: theme.gradient, color: "#fff" }}
        >
          {loading ? "Uploading..." : "Publish Post"}
        </button>
      </form>

      {isLogged && (
        <button
          onClick={handleLogout}
          style={{
            background: theme.gradient,
          }}
          className="top-0 right-0 bg-rose-600 absolute px-3 py-2 rounded-2xl -translate-x-2 translate-y-2 hidden lg:block text-white"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default CreateBlog;

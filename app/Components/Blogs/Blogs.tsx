"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteBlogThunk,
  getBlogThunk,
  IBlog,
  updateBlogThunk,
} from "@/app/libs/redux/features/blogSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faListDots,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { AppDispatch } from "@/app/libs/redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RoleEnum } from "@/app/types/auth.types";

const Blogs = ({ theme, isLogged, blogs, user }: any) => {
  const dispatch: AppDispatch = useDispatch();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const pathname = usePathname();

  const extractNumber = (val: any) => {
    if (typeof val === "number") return val;
    return parseFloat(val?.toString().replace(/[^\d.-]/g, "")) || 0;
  };

  const formik = useFormik({
    initialValues: { title: "", description: "" },
    validationSchema: Yup.object({
      title: Yup.string().required("Required").min(3),
      description: Yup.string().required("Required").min(10),
    }),
    onSubmit: async (values, helpers) => {
      if (!selectedBlogId) return;
      const res = await dispatch(
        updateBlogThunk({ blogId: selectedBlogId, values }),
      );
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Updated successfully");
        setIsEditModalOpen(false);
        helpers.resetForm();
      }
    },
  });

  const handleEditButton = (blog: any) => {
    setSelectedBlogId(blog._id);
    formik.setValues({ title: blog.title, description: blog.description });
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    const res = await dispatch(deleteBlogThunk(id));

    if (res.meta.requestStatus === "fulfilled")
      toast.success(res.payload.data.message);
    setOpenMenuId(null);
  };

  useEffect(() => {
    setIsClient(true);
    dispatch(getBlogThunk(undefined));
  }, [dispatch]);

  const isDashboard = pathname.includes("dashboard");

  if (!isClient)
    return (
      <div className="min-h-[400px] animate-pulse bg-white/5 rounded-3xl" />
    );

  return (
    <div
      className={`w-full ${!isLogged ? "opacity-30 pointer-events-none" : ""}`}
    >
      {/* Grid Layout */}
      {!blogs || blogs.length === 0 ? (
        <div className="w-full py-20 text-center border border-white/5 bg-white/5 rounded-[2.2rem]">
          <p className="text-gray-400 font-medium">
            There are no posts available at the moment.
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 ${isDashboard ? "lg:grid-cols-2" : "md:grid-cols-2"} gap-10`}
        >
          {blogs?.map((blog: any) => {
            const ownerId = blog.userId?._id || blog.userId?.id || blog.userId;
            const hasPermission =
              isLogged &&
              user &&
              (user.id === ownerId ||
                user.role === RoleEnum.admin ||
                user.role === RoleEnum.super);

            return (
              <div
                key={blog._id}
                className="group relative rounded-[2.2rem] p-4 border border-white/10 bg-black/30 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:-translate-y-2 shadow-xl"
              >
                {/* Dropdown Menu */}
                {hasPermission && (
                  <div className="absolute top-6 right-6 z-[100]">
                    <button
                      className="w-10 h-10 flex items-center justify-center bg-black/40 text-white rounded-full hover:bg-white/20 transition-all shadow-lg"
                      onClick={() =>
                        setOpenMenuId(openMenuId === blog._id ? null : blog._id)
                      }
                    >
                      <FontAwesomeIcon icon={faListDots} />
                    </button>

                    {openMenuId === blog._id && (
                      <div className="absolute right-0 mt-3 w-40 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="w-full p-4 text-left text-red-500 hover:bg-red-500/10 flex items-center gap-3 border-b border-white/5 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                        <button
                          onClick={() => handleEditButton(blog)}
                          className="w-full p-4 text-left text-amber-500 hover:bg-amber-500/10 flex items-center gap-3 transition-colors"
                        >
                          <FontAwesomeIcon icon={faPen} /> Edit
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Image Aspect Ratio Fixed */}
                <figure className="relative aspect-[16/10] rounded-[1.8rem] overflow-hidden bg-zinc-900 shadow-inner">
                  <Image
                    src={blog.image?.secure_url}
                    fill
                    alt="Gallery Item"
                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </figure>

                {/* Text Content */}
                <div className="p-4 mt-2">
                  <h3
                    className="text-xl font-bold truncate mb-3"
                    style={{ color: theme.color }}
                  >
                    {blog.title}
                  </h3>
                  <div className="flex justify-between items-end">
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed max-w-[65%]">
                      {blog.description}
                    </p>
                    <span
                      className="text-[10px] font-black px-4 py-2 text-white uppercase tracking-widest"
                      style={{
                        borderRadius: "1rem",
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), ${theme.gradient}`,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {blog.userId?.username.split(" ")[0] || "ADMIN"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-[3rem] w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-8">
                Refine Content
              </h2>

              <div className="space-y-2">
                <label className="text-gray-500 text-sm ml-2">Title</label>
                <input
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-amber-500 transition-all"
                  {...formik.getFieldProps("title")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-500 text-sm ml-2">
                  Description
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-amber-500 transition-all min-h-[150px] resize-none"
                  {...formik.getFieldProps("description")}
                />
              </div>

              <div className="flex gap-4 justify-end pt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 font-medium px-6 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-black font-bold px-10 py-4 rounded-2xl hover:bg-amber-500 hover:text-white transition-all active:scale-95 disabled:opacity-30"
                >
                  {formik.isSubmitting ? "Saving..." : "Apply Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;

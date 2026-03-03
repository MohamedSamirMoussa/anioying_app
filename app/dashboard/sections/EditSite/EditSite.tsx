import Image from "next/image";
import home from "@/public/home.png";
import gallery from "@/public/gallery.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/libs/redux/store";
import { setEditing } from "@/app/libs/redux/features/editSlice";
import Link from "next/link";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { themes } from "@/app/hooks/themes";

const pages = [
  { title: "Edit Home Page", btnText: "Edit Home live", img: home, href: "/" },
  {
    title: "Edit Gallery Page",
    btnText: "Edit Gallery live",
    img: gallery,
    href: "/gallery",
  },
];

const EditSite = () => {
  const dispatch = useDispatch();
  const { isEditing, editingSection } = useSelector((s: RootState) => s.edit);
  const { activeServer } = useSelector((s: RootState) => s.theme);
  const theme = themes[activeServer];

  return (
    <div className="edit-site h-[80vh] w-[90%] mx-auto">
      <div className="flex items-center mb-8 text-white ">
        <span
          className="w-12 h-12 text-2xl rounded-xl flex items-center justify-center"
          style={{ background: theme.gradient, boxShadow: theme.shadowColor }}
        >
          <FontAwesomeIcon icon={faPen} />
        </span>
        <h2 className="text-3xl font-bold tracking-widest ml-4">Edit Site</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 p-12 h-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
        {pages.map((page, index) => {
          const isThisPageEditing = isEditing  === page.title;
          return (
            <div key={index} className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-white ml-4">
                {page.title}
              </h2>
              <div className="relative w-full h-full aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group bg-[#16161e]">
                <Image
                  fill
                  src={page.img}
                  alt={"edit page preview"}
                  className="w-full h-full object-cover object-top blur-[6px] brightness-[0.4] transition-all duration-500 group-hover:scale-105 group-hover:blur-[3px]"
                />

                <div className="absolute inset-0 flex items-center justify-center z-20">
                  {!isThisPageEditing ? (
                    <button
                      // نرسل اسم الصفحة للـ Redux
                      onClick={() => dispatch(setEditing(page.title))}
                      className="bg-[#40bfff] text-white px-8 py-3 md:px-10 md:py-4 rounded-full font-black text-lg md:text-xl italic shadow-[0_0_30px_rgba(64,191,255,0.6)] border border-white/20 transition-all hover:scale-110 active:scale-95 uppercase"
                    >
                      Go Edit {page.title}
                    </button>
                  ) : (
                    <div className="flex flex-col justify-center items-center gap-5 animate-in fade-in zoom-in duration-300">
                      <Link href={page.href} className="bg-[#40bfff] text-white px-8 py-3 md:px-10 md:py-4 rounded-full font-black text-lg md:text-xl italic shadow-[0_0_30px_rgba(64,191,255,0.6)] border border-white/20 transition-all hover:scale-110 active:scale-95 uppercase text-center">
                        Confirm: {page.title}
                      </Link>
                      <button
                        onClick={() => dispatch(setEditing(null))}
                        className="bg-red-500/80 hover:bg-red-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-base border border-white/10 transition-all hover:scale-105 active:scale-95 uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditSite;

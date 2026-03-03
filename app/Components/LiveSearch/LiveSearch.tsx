"use client";
import { useEffect } from "react";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import { ThemeProps } from "@/app/hooks/themes";

const LiveSearch = ({
  currentTheme,
  onSearch,
}: {
  currentTheme: Partial<ThemeProps>;
  onSearch: (val: string) => void;
}) => {
  const formik = useFormik({
    initialValues: { search: "" },
    onSubmit: () => {},
  });

  useEffect(() => {
    onSearch(formik.values.search);
  }, [formik.values.search, onSearch]);

  return (
    <div className="relative w-full">
      <div className="relative z-10 flex items-center">
        <input
          name="search"
          type="text"
          autoComplete="off"
          placeholder="Search players in this page..."
          className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-2.5 text-white  transition-all w-full pr-20"
          style={{
            borderColor: formik.values.search
              ? currentTheme.color
              : "#ffffff20",
          }}
          onChange={formik.handleChange}
          value={formik.values.search}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
          {formik.values.search && (
            <button
              type="button"
              onClick={() => formik.setFieldValue("search", "")}
              className="text-white/40 hover:text-white transition-colors"
              style={{
                color:currentTheme.color
              }}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          )}

          <div className="text-white/40" style={{ color: currentTheme.color }}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSearch;

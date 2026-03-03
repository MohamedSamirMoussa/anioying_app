import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../libs/redux/store";
import { useFormik } from "formik";
import { updatePageContentThunk } from "../libs/redux/features/pageContentSlice";
import { setSectionName, toggleEditing } from "../libs/redux/features/editSlice";
import toast from "react-hot-toast";

interface UseSectionEditorProps<T> {
  sectionName: string;
  initialValues: T;
}

const useSectionEditor = <T extends object>({
  sectionName,
  initialValues,
}: UseSectionEditorProps<T>) => {
  const dispatch: AppDispatch = useDispatch();
  const { isEditing, editingSection } = useSelector((state: RootState) => state.edit);
  
  const isSectionActive = isEditing && editingSection === sectionName;

  const formik = useFormik<T>({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values, { setSubmitting }) => {

      try {
        const res = await dispatch(
          updatePageContentThunk({
            sectionName, 
            values,
          }),
        );
        console.log(res);
        
        if (updatePageContentThunk.fulfilled.match(res)) {
          toast.success(`${sectionName} updated successfully!`);
         dispatch(setSectionName(""))
        } else {
          toast.error("Failed to update content");
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return { formik, isSectionActive , isEditing, dispatch }; 
};
export default useSectionEditor;

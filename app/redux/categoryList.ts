import { createSlice } from "@reduxjs/toolkit";
import { category, categoryList, sectionData } from "../utilities/Types";
const defaultCatListSection: sectionData[] = [];
const initialState = {
  SectionList: defaultCatListSection,
};

const categoryListSlice = createSlice({
  name: "categoryList",
  initialState: initialState,
  reducers: {
    addCat: (state, action) => {
      const cat: category = action.payload;
      const categoryList = state.SectionList;
      categoryList.forEach((section) => {
        if (!section.valid) {
          if (section.categoryList?.categories) {
            section.categoryList?.categories.push(cat);
          } else {
            section.categoryList?.categories!!.push(cat);
          }
        }
      });
      state.SectionList = categoryList;
    },
    saveCategoryList: (state, action) => {
      const cat: { id: string; name: string; postion: number } = action.payload;
      const dummySections = state.SectionList.map((section) => {
        if (!section.valid) {
          if (section.categoryList?.id === cat.id) {
            return {
              ...section,
              name: cat.name,
              postion: cat.postion,
              valid: true,
            };
          }
        }
        return section;
      });
      const allCategories = dummySections.filter((section) => {
        if (section.type === "categories") {
          if (section.valid) {
            return section;
          }
        }
      });
      const updatedSections = allCategories;
      state.SectionList = updatedSections;
    },
    addCategoryList: (state, action) => {
      const section: sectionData = action.payload;
      state.SectionList.push(section);
    },
    delCat: (state, action) => {
      const cat: { id: string; name: string; position: number } =
        action.payload;

      state.SectionList = state.SectionList.map((section) => {
        if (!section.valid) {
          if (section.categoryList?.id === cat.id) {
            const updatedCategories = section.categoryList.categories?.filter(
              (c) => c.name !== cat.name
            );
            return {
              ...section,
              categoryList: {
                ...section.categoryList,
                categories: updatedCategories,
              },
            };
          }
        }
        return section;
      });
    },
  },
});
export const { addCat, saveCategoryList, delCat, addCategoryList } =
  categoryListSlice.actions;

export default categoryListSlice.reducer;

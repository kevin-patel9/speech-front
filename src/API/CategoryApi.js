import { getData } from "../common/Apicall"

export const getAllCategoryApi = () => {
    return getData("/api/v1/category/getAllCategory");
};

export const getActiveSubCategoryApi = () => {
    return getData("/api/v1/category/getActiveSubCategory");
};
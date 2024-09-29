import { getData, postData } from "../common/Apicall"

export const getTotalExpenseApi = () => {
    return getData("/api/v1/transaction/getTotalExpense");
}

export const createTransactionApi = (data) => {
    return postData("/api/v1/transaction/createTransaction", data);
}

export const getWeekExpenseApi = () => {
    return getData("/api/v1/transaction/getWeekExpense");
}

export const getDataListForSubCategoryApi = (subcategoryName) => {
    return postData("/api/v1/transaction/getDataListForSubCategory", { subcategoryName });
}
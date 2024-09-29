import React, { useState, useEffect } from "react";
import { getAllCategoryApi } from "../../API/CategoryApi";
import { createTransactionApi } from "../../API/TransactionApi";

const AddExpenseModal = ({ isOpen, onClose, onAddExpense }) => {
    const [amount, setAmount] = useState("");
    const [spentOn, setSpentOn] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategoryApi();
                setCategories(response?.allCategory);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = () => {
        onAddExpense({ spentOn, amount,  category: selectedCategory, subcategories: selectedSubCategory });
        onClose();
    };

    // on basis of category filter subcategory
    const handleSelectCategory = (e) => {
        setSelectedCategory(e.target.value);

        const subCategoriesList = categories.filter(data => data._id == e.target.value);
        setSubCategories(subCategoriesList[0]);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl mb-4">Add Expense</h2>
                <input
                    type="text"
                    placeholder="Spent on"
                    value={spentOn}
                    onChange={(e) => setSpentOn(e.target.value)}
                    className="border rounded p-2 mb-4 w-full"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border rounded p-2 mb-4 w-full"
                />
                {/* Select Category */}
                <select
                    value={selectedCategory}
                    onChange={handleSelectCategory}
                    className="border rounded p-2 mb-4 w-full"
                >
                <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.category}
                        </option>
                    ))}
                </select>

                {/* Select Sub-Category */}
                <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="border rounded p-2 mb-4 w-full"
                >
                <option value="">Select Sub-Category</option>
                    {subCategories?.subcategories?.map((category) => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white rounded p-2 w-full"
                >
                    Add Expense
                </button>
                <button
                    onClick={onClose}
                    className="text-blue-500 mt-4 w-full"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

const FloatingPlusButton = ({ setRefresh, refresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddExpense = async (expense) => {
        await createTransactionApi(expense);

        setRefresh(!refresh);
    };

    return (
        <div className="relative">
        <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full p-4 shadow-lg transition duration-300 hover:bg-blue-600"
        >
            +
        </button>
        <AddExpenseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddExpense={handleAddExpense}
        />
        </div>
    );
};

export default FloatingPlusButton;

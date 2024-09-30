import React, { useContext, useEffect, useState } from 'react';
import { UserAuthContext } from '../../App';
import { getActiveSubCategoryApi } from '../../API/CategoryApi';
import { getDataListForSubCategoryApi } from '../../API/TransactionApi';

const TransactionList = ({ refresh }) => {
    const [activeSubcategory, setActiveSubcategory] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { isLoggedIn } = useContext(UserAuthContext);

    useEffect(() => {
        const fetchData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await getActiveSubCategoryApi();
                    setActiveSubcategory(response?.userSubcategoryList || []);
                } catch (error) {
                    console.log("Error fetching subcategories:", error);
                }
            }
        };
        fetchData();
    }, [isLoggedIn, refresh]);

    const getSelectedSubcategory = async (subcategoryName) => {
        const response = await getDataListForSubCategoryApi(subcategoryName);
        setSelectedSubCategory(response?.expenses || []);
        setSelectedCategory(subcategoryName);
    };

    useEffect(() => {
        getSelectedSubcategory("All");
    }, [refresh]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    // Group transactions by date
    const groupedTransactions = selectedSubCategory?.reduce((acc, data) => {
        const dateKey = formatDate(data.createdAt);
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(data);
        return acc;
    }, {});

    return (
        <div className="bg-white flex flex-col p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Transactions</h2>
            <div className="flex gap-2 overflow-y-auto max-w-100">
                {activeSubcategory?.length > 0 ? (
                    activeSubcategory?.map((list, index) => (
                        <div key={index} 
                            onClick={() => getSelectedSubcategory(list.name)} 
                            className={`border p-1 rounded cursor-pointer ${selectedCategory === list.name ? 'bg-blue-500 text-white' : ''}`}
                        >
                            {list.name.length > 12 ? <>{list.name.slice(0, 12)}...</> : list.name}
                        </div>
                    ))
                ) : (
                    <div className='text-gray-500'>No subcategories found.</div>
                )}
            </div>
            <div className="mt-4 h-[300px] overflow-y-scroll border border-gray-300 rounded p-2">
                {Object.keys(groupedTransactions).map(date => (
                    <div key={date} className="mt-4">
                        <h3 className="font-semibold">{date}</h3>
                        {groupedTransactions[date].map(data => (
                            <div key={data._id} className='flex justify-between'>
                                <div>{data.spentOn}</div>
                                <div>- ₹{data.amount}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;

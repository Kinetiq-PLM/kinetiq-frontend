import React from "react";
import { useNavigate } from "react-router-dom";

const User = () => {

    return (
        <div className="admin p-6">
            <h2 className="text-2xl font-bold text-gray-800">User</h2>

            <div className="flex justify-between items-center mb-4 mt-2">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300">Role</button>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300">Hide</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300">Customize</button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-xl">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border border-gray-200 text-left rounded-tl-xl"> </th>
                            <th className="p-3 border border-gray-200 text-left">User Id</th>
                            <th className="p-3 border border-gray-200 text-left">First Name</th>
                            <th className="p-3 border border-gray-200 text-left">Last Name</th>
                            <th className="p-3 border border-gray-200 text-left">Email</th>
                            <th className="p-3 border border-gray-200 text-left">Password</th>
                            <th className="p-3 border border-gray-200 text-left">Role ID</th>
                            <th className="p-3 border border-gray-200 text-left">Status</th>
                            <th className="p-3 border border-gray-200 text-left">Created At</th>
                            <th className="p-3 border border-gray-200 text-left">Updated At</th>
                            <th className="p-3 border border-gray-200 text-left rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array(6).fill(0).map((_, index) => (
                            <tr key={index} className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100">
                                <td className="p-3 border border-gray-200"><input type="checkbox" /></td>
                                <td className="p-3 border border-gray-200 text-teal-600 font-semibold">User_02</td>
                                <td className="p-3 border border-gray-200">Maria</td>
                                <td className="p-3 border border-gray-200">Clara</td>
                                <td className="p-3 border border-gray-200">User02@Gmail.Com</td>
                                <td className="p-3 border border-gray-200">Mari123</td>
                                <td className="p-3 border border-gray-200">Masikip</td>
                                <td className="p-3 border border-gray-200">Sad</td>
                                <td className="p-3 border border-gray-200">Qwdw</td>
                                <td className="p-3 border border-gray-200">Qwdw</td>
                                <td className="p-3 border border-gray-200 rounded-br-xl">
                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Deactivate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;
import React, { useState, useRef, useEffect } from "react";

const dummyUsers = [
    {
        id: "User_01",
        firstName: "Juan",
        lastName: "Dela Cruz",
        email: "juan@gmail.com",
        password: "pass123",
        roleId: "Admin",
        status: "Active",
        createdAt: "2025-01-01",
        updatedAt: "2025-02-01"
    },
    {
        id: "User_02",
        firstName: "Maria",
        lastName: "Clara",
        email: "maria@gmail.com",
        password: "maria456",
        roleId: "Editor",
        status: "Inactive",
        createdAt: "2025-01-10",
        updatedAt: "2025-02-05"
    },
    {
        id: "User_03",
        firstName: "Pedro",
        lastName: "Penduko",
        email: "pedro@gmail.com",
        password: "penduko789",
        roleId: "Viewer",
        status: "Pending",
        createdAt: "2025-01-15",
        updatedAt: "2025-02-10"
    }
];

const dummyRoles = [
    { roleId: "Maria", roleName: "Clara", description: "Sad", permissions: "Qwdw" },
    { roleId: "Maria", roleName: "Clara", description: "Sad", permissions: "Qwdw" },
    { roleId: "Maria", roleName: "Clara", description: "Sad", permissions: "Qwdw" },
];

const User = () => {
    const [activeTab, setActiveTab] = useState("Roles");
    const [selectedUser, setSelectedUser] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const addDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dropdown-action")) {
                setActiveDropdown(null);
            }
            if (addDropdownRef.current && !addDropdownRef.current.contains(e.target)) {
                setShowAddDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderAddForm = () => {
        if (activeTab === "Roles") {
            return (
                <div ref={addDropdownRef} className="absolute top-full right-0 mt-2 bg-white shadow-xl border rounded-lg p-6 z-50 w-[450px]">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Roles permission</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-teal-600">Role ID</label>
                            <input type="text" placeholder="Please enter document name" className="w-full border px-3 py-2 rounded-md text-sm" />
                        </div>
                        <div>
                            <label className="text-sm text-teal-600">Role Name</label>
                            <input type="text" placeholder="Please select category" className="w-full border px-3 py-2 rounded-md text-sm" />
                        </div>
                        <div>
                            <label className="text-sm text-teal-600">Description</label>
                            <input type="text" placeholder="Please select category" className="w-full border px-3 py-2 rounded-md text-sm" />
                        </div>
                        <div>
                            <label className="text-sm text-teal-600">Permissions</label>
                            <input type="text" placeholder="Please select category" className="w-full border px-3 py-2 rounded-md text-sm" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">Add</button>
                        <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md text-sm">Edit</button>
                        <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm">Delete</button>
                    </div>
                </div>
            );
        }

        if (activeTab === "User") {
            return (
                <div ref={addDropdownRef} className="absolute top-full right-0 mt-2 bg-white shadow-xl border rounded-lg p-6 z-50 w-[700px] max-h-[75vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold text-teal-600 mb-4 border-b pb-2">User – Setup</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            "User Id", "Created At", "First Name", "Updated At",
                            "Last Name", "Role ID", "Email", "Role Name",
                            "Password", "Description", "Status", "Permissions"
                        ].map((field, i) => (
                            <div key={i}>
                                <label className="block text-sm font-semibold text-teal-600 mb-1">{field}</label>
                                <input
                                    type="text"
                                    placeholder={`Enter ${field}`}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6 gap-3">
                        <button className="bg-teal-500 text-white px-6 py-2 rounded-md">Add</button>
                        <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md">Edit</button>
                        <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md">Delete</button>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="admin p-6 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User</h2>

            {/* Tabs */}
            <div className="flex items-center border-b mb-4 gap-4">
                {["Roles", "User"].map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-4 border-b-2 ${activeTab === tab ? "border-teal-500 text-teal-600 font-semibold" : "border-transparent text-gray-600"}`}
                    >
                        {tab}
                    </button>
                ))}
                <div className="ml-auto relative">
                    <button onClick={() => setShowAddDropdown(prev => !prev)} className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm">Add</button>
                    {showAddDropdown && renderAddForm()}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-xl">
                    <thead>
                        <tr className="bg-gray-100">
                            {activeTab === "Roles" ? (
                                <>
                                    <th className="p-3 border border-gray-200 text-left">Role ID</th>
                                    <th className="p-3 border border-gray-200 text-left">Role Name</th>
                                    <th className="p-3 border border-gray-200 text-left">Description</th>
                                    <th className="p-3 border border-gray-200 text-left">Permission</th>
                                </>
                            ) : (
                                <>
                                    <th className="p-3 border border-gray-200 text-left">User ID</th>
                                    <th className="p-3 border border-gray-200 text-left">First Name</th>
                                    <th className="p-3 border border-gray-200 text-left">Last Name</th>
                                    <th className="p-3 border border-gray-200 text-left">Email</th>
                                    <th className="p-3 border border-gray-200 text-left">Password</th>
                                    <th className="p-3 border border-gray-200 text-left">Role ID</th>
                                    <th className="p-3 border border-gray-200 text-left">Status</th>
                                    <th className="p-3 border border-gray-200 text-left">Created At</th>
                                    <th className="p-3 border border-gray-200 text-left">Updated At</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {activeTab === "Roles" ? (
                            dummyRoles.map((role, idx) => (
                                <tr key={idx} className="odd:bg-gray-50 hover:bg-gray-100">
                                    <td className="p-3 border border-gray-200">{role.roleId}</td>
                                    <td className="p-3 border border-gray-200">{role.roleName}</td>
                                    <td className="p-3 border border-gray-200">{role.description}</td>
                                    <td className="p-3 border border-gray-200">{role.permissions}</td>
                                </tr>
                            ))
                        ) : (
                            dummyUsers.map((user, idx) => (
                                <tr key={idx} className="odd:bg-gray-50 hover:bg-gray-100">
                                    <td className="p-3 border border-gray-200">{user.id}</td>
                                    <td className="p-3 border border-gray-200">{user.firstName}</td>
                                    <td className="p-3 border border-gray-200">{user.lastName}</td>
                                    <td className="p-3 border border-gray-200">{user.email}</td>
                                    <td className="p-3 border border-gray-200">{user.password}</td>
                                    <td className="p-3 border border-gray-200">{user.roleId}</td>
                                    <td className="p-3 border border-gray-200">{user.status}</td>
                                    <td className="p-3 border border-gray-200">{user.createdAt}</td>
                                    <td className="p-3 border border-gray-200">{user.updatedAt}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;

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

const User = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [deactivatedUsers, setDeactivatedUsers] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [showCustomizeDropdown, setShowCustomizeDropdown] = useState(false);

    const roleRef = useRef(null);
    const customizeRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dropdown-action")) {
                setActiveDropdown(null);
            }
            if (roleRef.current && !roleRef.current.contains(e.target)) {
                setShowRoleDropdown(false);
            }
            if (customizeRef.current && !customizeRef.current.contains(e.target)) {
                setShowCustomizeDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCheckboxChange = (user) => {
        setSelectedUser((prev) => (prev?.email === user.email ? null : user));
    };

    const handleDeactivate = (email) => {
        if (!deactivatedUsers.includes(email)) {
            setDeactivatedUsers((prev) => [...prev, email]);
        }
    };

    const handleActivate = (email) => {
        setDeactivatedUsers((prev) => prev.filter((e) => e !== email));
    };

    return (
        <div className="admin p-6 relative">
            <h2 className="text-2xl font-bold text-gray-800">User</h2>

            <div className="flex justify-between items-center mb-4 mt-2 relative">
                {/* Role Button */}
                <div className="relative" ref={roleRef}>
                    <button
                        className={`px-4 py-2 ${selectedUser
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                : "bg-gray-100 text-gray-400"
                            } rounded-lg shadow`}
                        onClick={() => selectedUser && setShowRoleDropdown(!showRoleDropdown)}
                    >
                        Role
                    </button>
                    {showRoleDropdown && selectedUser && (
                        <div className="absolute left-0 mt-2 bg-white rounded-2xl p-6 w-[450px] shadow-lg z-50">
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Roles permission</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-700">Role Id</label>
                                    <input className="w-full border p-2 rounded mt-1" defaultValue={selectedUser.roleId} />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-700">Role Name</label>
                                    <input className="w-full border p-2 rounded mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-700">Description</label>
                                    <input className="w-full border p-2 rounded mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-700">Access Level</label>
                                    <select className="w-full border p-2 rounded mt-1">
                                        <option>Choices...</option>
                                        <option>Full Access</option>
                                        <option>Read-Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-700">Permissions</label>
                                    <input className="w-full border p-2 rounded mt-1" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button className="px-4 py-1 bg-teal-500 text-white rounded hover:bg-teal-600">Add</button>
                                <button className="px-4 py-1 bg-white text-teal-500 border border-teal-500 rounded hover:bg-teal-50">Remove</button>
                                <button className="px-4 py-1 bg-white text-teal-500 border border-teal-500 rounded hover:bg-teal-50">Modify</button>
                                <button
                                    className="px-4 py-1 bg-white text-gray-600 border border-gray-400 rounded hover:bg-gray-100"
                                    onClick={() => setShowRoleDropdown(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search + Customize */}
                <div className="flex space-x-2 relative" ref={customizeRef}>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300">Hide</button>

                    <div className="relative">
                        <button
                            onClick={() => selectedUser && setShowCustomizeDropdown(!showCustomizeDropdown)}
                            className={`px-4 py-2 ${selectedUser ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-100 text-gray-400"
                                } rounded-lg shadow`}
                        >
                            Customize
                        </button>

                        {showCustomizeDropdown && selectedUser && (
                            <div
                                className="absolute right-0 mt-2 bg-white rounded-2xl p-6 w-[600px] shadow-lg z-50"
                            >
                                <h3 className="text-xl font-semibold mb-4 border-b pb-2">User – Setup</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label>User Id</label><input className="w-full border p-2 rounded" defaultValue={selectedUser.id} /></div>
                                    <div><label>Create At</label><input className="w-full border p-2 rounded" defaultValue={selectedUser.createdAt} /></div>
                                    <div><label>First Name</label><input className="w-full border p-2 rounded" defaultValue={selectedUser.firstName} /></div>
                                    <div><label>Updated At</label><input className="w-full border p-2 rounded" defaultValue={selectedUser.updatedAt} /></div>
                                    <div><label>Last Name</label><input className="w-full border p-2 rounded" defaultValue={selectedUser.lastName} /></div>
                                    <div><label>Role ID</label><input className="w-full border p-2 rounded" defaultValue={selectedUser.roleId} /></div>
                                    <div><label>Email</label><input className="w-full border p-2 rounded" defaultValue={selectedUser.email} /></div>
                                    <div><label>Role Name</label><input className="w-full border p-2 rounded" /></div>
                                    <div><label>Password</label><input className="w-full border p-2 rounded" defaultValue={selectedUser.password} /></div>
                                    <div><label>Description</label><input className="w-full border p-2 rounded" /></div>
                                    <div><label>Status</label><input className="w-full border p-2 rounded" defaultValue={selectedUser.status} /></div>
                                    <div><label>Permissions</label><input className="w-full border p-2 rounded" /></div>
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button className="px-4 py-1 bg-teal-500 text-white rounded hover:bg-teal-600">Add</button>
                                    <button className="px-4 py-1 bg-white text-blue-500 border border-blue-400 rounded hover:bg-blue-50">Alter</button>
                                    <button className="px-4 py-1 bg-white text-red-500 border border-red-400 rounded hover:bg-red-50">Delete</button>
                                    <button
                                        className="px-4 py-1 bg-white text-gray-600 border border-gray-400 rounded hover:bg-gray-100"
                                        onClick={() => setShowCustomizeDropdown(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
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
                        {dummyUsers.map((user, idx) => (
                            <tr key={idx} className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100">
                                <td className="p-3 border border-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={selectedUser?.email === user.email}
                                        onChange={() => handleCheckboxChange(user)}
                                    />
                                </td>
                                <td className={`p-3 border border-gray-200 font-semibold ${deactivatedUsers.includes(user.email) ? "text-gray-400" : "text-teal-600"
                                    }`}>
                                    {user.id}
                                </td>
                                <td className="p-3 border border-gray-200">{user.firstName}</td>
                                <td className="p-3 border border-gray-200">{user.lastName}</td>
                                <td className="p-3 border border-gray-200">{user.email}</td>
                                <td className="p-3 border border-gray-200">{user.password}</td>
                                <td className="p-3 border border-gray-200">{user.roleId}</td>
                                <td className="p-3 border border-gray-200">{user.status}</td>
                                <td className="p-3 border border-gray-200">{user.createdAt}</td>
                                <td className="p-3 border border-gray-200">{user.updatedAt}</td>
                                <td className="p-3 border border-gray-200 rounded-br-xl relative dropdown-action">
                                    <button
                                        className="text-xl px-2"
                                        onClick={() =>
                                            setActiveDropdown(activeDropdown === idx ? null : idx)
                                        }
                                    >
                                        ⋮
                                    </button>
                                    {activeDropdown === idx && (
                                        <div className="absolute right-0 mt-2 bg-white border shadow rounded p-2 z-50 w-32">
                                            {deactivatedUsers.includes(user.email) ? (
                                                <button
                                                    className="text-green-600 hover:underline block w-full text-left"
                                                    onClick={() => {
                                                        handleActivate(user.email);
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    Activate
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-red-600 hover:underline block w-full text-left"
                                                    onClick={() => {
                                                        handleDeactivate(user.email);
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    Deactivate
                                                </button>
                                            )}
                                        </div>
                                    )}
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

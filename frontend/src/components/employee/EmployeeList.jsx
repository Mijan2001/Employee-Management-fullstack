import React, { useState, useEffect } from 'react';
import AddEmployee from './AddEmployee';
import ViewEmployee from './ViewEmployee';
import EditEmployee from './EditEmployee';
const { VITE_API_URL } = import.meta.env || 'http://localhost:5000';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const employeesPerPage = 10;
    const [viewEmployee, setViewEmployee] = useState(null);
    const [editEmployee, setEditEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, [currentPage]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${VITE_API_URL}/api/employee?page=${currentPage}&limit=${employeesPerPage}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (!response.ok) throw new Error('Failed to fetch employees');
            const data = await response.json();
            setEmployees(data.employees);
            setTotalPages(data.totalPages);
            setTotalEmployees(data.totalEmployees);
        } catch (err) {
            setError('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        const res = await fetch(`${VITE_API_URL}/api/department`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();

        console.log('fetchDepartment : == ', data);
        setDepartments(data.departments || data);
    };

    const handleAdd = async formData => {
        try {
            setLoading(true);
            const response = await fetch(`${VITE_API_URL}/api/employee/add`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            if (!response.ok) throw new Error('Failed to add employee');
            fetchEmployees();
            setShowDialog(false);
        } catch (err) {
            setError('Failed to add employee');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async id => {
        try {
            setLoading(true);
            const response = await fetch(`${VITE_API_URL}/api/employee/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete employee');
            fetchEmployees();
        } catch (err) {
            setError('Failed to delete employee');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = newPage => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleView = async id => {
        try {
            const response = await fetch(`${VITE_API_URL}/api/employee/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch employee');
            const data = await response.json();
            setViewEmployee(data);
        } catch (err) {
            console.log('handle view is not performed : ', err);
            setError('Failed to view employee');
        }
    };

    const handleEdit = async id => {
        try {
            const response = await fetch(`${VITE_API_URL}/api/employee/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch employee');
            const data = await response.json();
            setEditEmployee(data);
        } catch (err) {
            console.log('handleEdit error is occurred : ', err);
            setError('failed to edit employee');
        }
    };

    const handleSaveEdit = async updatedData => {
        try {
            setLoading(true);
            let body, headers;
            if (updatedData instanceof FormData) {
                body = updatedData;
                headers = {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                };
            } else {
                body = JSON.stringify(updatedData);
                headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                };
            }
            const response = await fetch(
                `${VITE_API_URL}/api/employee/${editEmployee._id}`,
                {
                    method: 'PUT',
                    headers,
                    body
                }
            );
            if (!response.ok) throw new Error('Failed to update employee');
            setEditEmployee(null);
            fetchEmployees();
        } catch (err) {
            setError('failed to save and edit employee');
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.empId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <input
                        type="text"
                        placeholder="Search By Employee ID"
                        className="border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button
                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded transition-colors w-full sm:w-auto"
                        onClick={() => setShowDialog(true)}
                        disabled={loading}
                    >
                        Add New Employee
                    </button>
                </div>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold">
                                    S No
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Image
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Name
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    DOB
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Department
                                </th>
                                <th className="py-3 px-4 font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp, idx) => (
                                <tr
                                    key={emp._id}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <td className="py-3 px-4">
                                        {(currentPage - 1) * employeesPerPage +
                                            idx +
                                            1}
                                    </td>
                                    <td className="py-3 px-4">
                                        <img
                                            src={emp.imageUrl}
                                            alt={emp.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="py-3 px-4">{emp.name}</td>
                                    <td className="py-3 px-4">
                                        {emp.dob
                                            ? new Date(
                                                  emp.dob
                                              ).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {emp.department || '-'}
                                    </td>
                                    <td className="py-3 justify-center px-4 flex flex-wrap gap-2">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded transition"
                                            onClick={() => handleView(emp._id)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded transition"
                                            onClick={() => handleEdit(emp._id)}
                                        >
                                            Edit
                                        </button>
                                        <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded transition">
                                            Salary
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded transition"
                                            onClick={() =>
                                                handleDelete(emp._id)
                                            }
                                            disabled={loading}
                                        >
                                            Leave
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center py-6 text-gray-400"
                                    >
                                        {loading
                                            ? 'Loading...'
                                            : 'No employees found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center gap-3 justify-center mt-4 text-xs text-gray-600">
                    <div>
                        Rows per page:{' '}
                        <span className="font-semibold">
                            {employeesPerPage}
                        </span>
                    </div>
                    <div>
                        {(currentPage - 1) * employeesPerPage + 1}-
                        {Math.min(
                            currentPage * employeesPerPage,
                            totalEmployees
                        )}{' '}
                        of {totalEmployees}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={loading || currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="text-sm text-gray-600">
                            Page <strong>{currentPage}</strong> of{' '}
                            <strong>{totalPages}</strong>
                        </span>
                        <button
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={loading || currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <AddEmployee
                open={showDialog}
                onAdd={handleAdd}
                onClose={() => setShowDialog(false)}
                departments={departments}
            />
            <ViewEmployee
                open={!!viewEmployee}
                employee={viewEmployee}
                onClose={() => setViewEmployee(null)}
            />
            <EditEmployee
                open={!!editEmployee}
                employee={editEmployee}
                onSave={handleSaveEdit}
                onClose={() => setEditEmployee(null)}
                departments={departments}
            />
        </div>
    );
};

export default EmployeeList;

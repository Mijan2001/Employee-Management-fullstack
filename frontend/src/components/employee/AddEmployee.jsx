import React, { useState, useEffect } from 'react';

const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];
const ROLES = ['Admin', 'Manager', 'Employee'];

const AddEmployee = ({ open, onAdd, onClose, departments = [] }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        empId: '',
        dob: '',
        gender: '',
        maritalStatus: '',
        department: '',
        designation: '',
        salary: '',
        role: '',
        password: '',
        image: null
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) {
            setForm({
                name: '',
                email: '',
                empId: '',
                dob: '',
                gender: '',
                maritalStatus: '',
                department: '',
                designation: '',
                salary: '',
                role: '',
                password: '',
                image: null
            });
            setError('');
        }
    }, [open]);

    if (!open) return null;

    const handleChange = e => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setForm({ ...form, image: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        for (const key of [
            'name',
            'email',
            'empId',
            'dob',
            'gender',
            'maritalStatus',
            'department',
            'designation',
            'salary',
            'role',
            'password'
        ]) {
            if (!form[key]) {
                setError('All fields are required');
                return;
            }
        }
        let imageUrl = '';
        if (form.image) {
            const data = new FormData();
            data.append('file', form.image);
            data.append(
                'upload_preset',
                import.meta.env.CLOUDINARY_UPLOAD_PRESET
            );
            data.append('cloud_name', import.meta.env.CLOUDINARY_CLOUD_NAME);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${
                    import.meta.env.CLOUDINARY_CLOUD_NAME
                }/image/upload`,
                {
                    method: 'POST',
                    body: data
                }
            );
            const cloudinaryData = await res.json();
            imageUrl = cloudinaryData.secure_url;
        }
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key !== 'image' && value) formData.append(key, value);
        });
        if (imageUrl) formData.append('imageUrl', imageUrl);
        onAdd(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Add Employee
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Insert Name"
                            className="w-full px-4 py-2 border rounded"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Insert Email"
                            className="w-full px-4 py-2 border rounded"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Employee ID
                        </label>
                        <input
                            name="empId"
                            type="text"
                            placeholder="Employee ID"
                            className="w-full px-4 py-2 border rounded"
                            value={form.empId}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            name="dob"
                            type="date"
                            className="w-full px-4 py-2 border rounded"
                            value={form.dob}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            name="gender"
                            className="w-full px-4 py-2 border rounded"
                            value={form.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            {GENDERS.map(g => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Marital Status
                        </label>
                        <select
                            name="maritalStatus"
                            className="w-full px-4 py-2 border rounded"
                            value={form.maritalStatus}
                            onChange={handleChange}
                        >
                            <option value="">Select Status</option>
                            {MARITAL_STATUSES.map(s => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Department
                        </label>
                        <select
                            name="department"
                            className="w-full px-4 py-2 border rounded"
                            value={form.department}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            {departments.map(dep => (
                                <option key={dep._id} value={dep.name}>
                                    {dep.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Designation
                        </label>
                        <input
                            name="designation"
                            type="text"
                            placeholder="Designation"
                            className="w-full px-4 py-2 border rounded"
                            value={form.designation}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Salary
                        </label>
                        <input
                            name="salary"
                            type="number"
                            placeholder="Salary"
                            className="w-full px-4 py-2 border rounded"
                            value={form.salary}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="******"
                            className="w-full px-4 py-2 border rounded"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            name="role"
                            className="w-full px-4 py-2 border rounded"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="">Select Role</option>
                            {ROLES.map(r => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Image
                        </label>
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            className="w-full"
                            onChange={handleChange}
                        />
                    </div>
                    {error && (
                        <div className="md:col-span-2 text-red-500 text-xs mb-2">
                            {error}
                        </div>
                    )}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                        >
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;

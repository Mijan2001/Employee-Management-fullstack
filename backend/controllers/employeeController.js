import Employee from '../models/Employee.js';
import bcrypt from 'bcryptjs';

// Get all employees with pagination
export const getAllEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Employee.countDocuments();
        const employees = await Employee.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            employees,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalEmployees: total,
            employeesPerPage: limit
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employees',
            error: error.message
        });
    }
};

// Add new employee
export const addEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            empId,
            dob,
            gender,
            maritalStatus,
            department,
            designation,
            salary,
            role,
            password
        } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }
        if (
            !name ||
            !email ||
            !empId ||
            !dob ||
            !gender ||
            !maritalStatus ||
            !department ||
            !designation ||
            !salary ||
            !role ||
            !password
        ) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existing = await Employee.findOne({ empId: empId.trim() });
        if (existing) {
            return res
                .status(400)
                .json({ message: 'Employee ID already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new Employee({
            name,
            email,
            empId,
            dob,
            gender,
            maritalStatus,
            department,
            designation,
            salary,
            role,
            password: hashedPassword,
            imageUrl
        });
        const saved = await newEmployee.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({
            message: 'Error adding employee',
            error: error.message
        });
    }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        await Employee.findByIdAndDelete(id);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting employee',
            error: error.message
        });
    }
};

// Get single employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employee',
            error: error.message
        });
    }
};

// Update employee by ID
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            empId,
            dob,
            gender,
            maritalStatus,
            department,
            designation,
            salary,
            role,
            password
        } = req.body;
        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.empId = empId || employee.empId;
        employee.dob = dob || employee.dob;
        employee.gender = gender || employee.gender;
        employee.maritalStatus = maritalStatus || employee.maritalStatus;
        employee.department = department || employee.department;
        employee.designation = designation || employee.designation;
        employee.salary = salary || employee.salary;
        employee.role = role || employee.role;
        if (password) {
            employee.password = await bcrypt.hash(password, 10);
        }
        if (imageUrl) {
            employee.imageUrl = imageUrl;
        }
        const updated = await employee.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating employee',
            error: error.message
        });
    }
};

import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        empId: { type: String, required: true, unique: true, trim: true },
        dob: { type: Date, required: true },
        gender: { type: String, required: true },
        maritalStatus: { type: String, required: true },
        department: { type: String, required: true },
        designation: { type: String, required: true },
        salary: { type: Number, required: true },
        role: { type: String, required: true },
        password: { type: String, required: true },
        imageUrl: { type: String, trim: true, default: '' }
    },
    { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;

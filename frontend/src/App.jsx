import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeList from './components/employee/EmployeeList';

import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import AdminSummary from './components/dashboard/AdminSummary';
import DepartmentList from './components/department/DepartmentList';
import AddDepartment from './components/department/AddDepartment';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/admin-dashboard" />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/admin-dashboard"
                        element={
                            <PrivateRoutes>
                                <RoleBaseRoutes requiredRole={['admin']}>
                                    <AdminDashboard />
                                </RoleBaseRoutes>
                            </PrivateRoutes>
                        }
                    >
                        <Route index element={<AdminSummary />} />
                        <Route
                            path="/admin-dashboard/departments"
                            element={<DepartmentList />}
                        />
                        <Route
                            path="/admin-dashboard/add-department"
                            element={<AddDepartment />}
                        />
                        <Route
                            path="/admin-dashboard/employees"
                            element={<EmployeeList />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </>
    );
}

export default App;

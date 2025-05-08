import React from 'react';
import {
    UsersIcon,
    BuildingOffice2Icon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import SummaryCard from './SummaryCard';

const overview = [
    {
        label: 'Total Employees',
        value: 5,
        icon: UsersIcon,
        color: 'bg-teal-600',
        card: 'bg-white'
    },
    {
        label: 'Total Departments',
        value: 3,
        icon: BuildingOffice2Icon,
        color: 'bg-yellow-500',
        card: 'bg-yellow-100'
    },
    {
        label: 'Monthly Pay',
        value: '$2500',
        icon: CurrencyDollarIcon,
        color: 'bg-red-600',
        card: 'bg-white'
    }
];

const leaves = [
    {
        label: 'Leave Applied',
        value: 2,
        icon: DocumentTextIcon,
        color: 'bg-teal-600',
        card: 'bg-white'
    },
    {
        label: 'Leave Approved',
        value: 2,
        icon: CheckCircleIcon,
        color: 'bg-green-500',
        card: 'bg-green-100'
    },
    {
        label: 'Leave Pending',
        value: 1,
        icon: ClockIcon,
        color: 'bg-yellow-500',
        card: 'bg-yellow-100'
    },
    {
        label: 'Leave Rejected',
        value: 2,
        icon: XCircleIcon,
        color: 'bg-red-600',
        card: 'bg-red-100'
    }
];

const AdminSummary = () => {
    return (
        <div className="px-2 py-6 sm:px-4 md:px-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {overview.map(item => (
                    <SummaryCard
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                        color={item.color}
                        card={item.card}
                    />
                ))}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
                Leave Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6  mx-auto">
                {leaves.map(item => (
                    <SummaryCard
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                        color={item.color}
                        card={item.card}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminSummary;

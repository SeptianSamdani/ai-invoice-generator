import React from 'react'
import { ChevronDown } from 'lucide-react' // 1. Impor ikon dari lucide-react

const SelectField = ({ label, name, options, ...props }) => {
    return (
        <div>
            <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1.5'>{label}</label>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    {...props}
                    className='block w-full h-10 px-3 pr-8 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none'
                >
                    {options.map(option => (
                        <option key={option.value || option} value={option.value || option}>
                            {option.label || option}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>
    )
}

export default SelectField;
import React from 'react'

const InputField = ({ icon: Icon, label, name, className = '', value, ...props }) => {
  return (
    <div className={className}>
      <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1.5'>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={name}
          name={name}
          value={value || ''}
          {...props}
          className={`w-full h-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${Icon ? 'pl-10' : 'pl-3'}`}
        />
      </div>
    </div>
  )
}

export default InputField
import React from 'react'

const TextareaField = ({ label, name, rows = 4, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1.5'>
        {label}
      </label>
      <div className="relative">
        <textarea
          id={name}
          name={name}
          rows={rows}
          {...props}
          className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
        />
      </div>
    </div>
  )
}

export default TextareaField;
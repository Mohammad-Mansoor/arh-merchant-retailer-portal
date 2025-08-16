import { Listbox } from '@headlessui/react'

function LimitSelect({ value, onChange, options }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-[6px] pl-3 pr-8 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CD0202] sm:text-sm">
          <span className="block truncate text-gray-700 dark:text-gray-300">
            {value} 
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 bottom-full mb-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((option) => (
            <Listbox.Option
              key={option}
              value={option}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-5 ${
                  active ? 'bg-red-50 dark:bg-gray-700 text-[#CD0202]  dark:text-[#CD0202]' : 'text-gray-900 dark:text-gray-200'
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    {option} 
                  </span>
                 
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}

export default LimitSelect;
'use client'
import { Popover, PopoverButton, PopoverPanel, CloseButton } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

interface Props {
  id?: string
  options: string[]
  value: string
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
  callBack: (option: string) => void
}

export default function Dropdown({id, options, value, placeholder, searchable, clearable, callBack}: Props) {

  const [search, setSearch] = useState<string>('')
  const filtered = options.filter(option => option.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <Popover className="relative">
      <PopoverButton id={id} className="inline-flex items-center relative font-semibold text-gray-700 bg-white p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400 w-full" onClick={() => setSearch('')}>
        {value
          ? <span className="truncate pr-6" title={value}>{value}</span>
          : <span className="truncate pr-6 font-normal text-gray-400">{placeholder}</span>}
        <ChevronDownIcon aria-hidden="true" className="size-5 absolute right-2" />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-0 z-10 flex min-w-full w-max max-w-[90vw] mt-1 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="w-full shrink rounded-xl bg-white p-4 text-sm/6 font-semibold text-gray-900 shadow-lg ring-1 ring-gray-900/5">
          {searchable && (
            <input
              autoFocus
              placeholder="Search..."
              className="w-full mb-2 p-2 border rounded-md font-normal focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          <div className="max-h-80 overflow-y-auto">
            {filtered.length === 0 && <p className='py-2 px-2 text-left font-normal text-gray-400'>No options available</p>}
            {filtered.map((option) => (
              <CloseButton key={option} className="block hover:text-blue-600 w-full" onClick={() => callBack(option)}>
                {option === value ? <p className='bg-gray-100 py-2 px-2 rounded-md text-left break-all'>{option}</p> : <p className='py-2 px-2 text-left break-all'>{option}</p>}
              </CloseButton>
            ))}
          </div>
          {clearable && value && (
            <CloseButton className="mt-2 w-full text-xs font-normal text-gray-500 hover:text-blue-600" onClick={() => callBack('')}>
              Clear
            </CloseButton>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  )
}

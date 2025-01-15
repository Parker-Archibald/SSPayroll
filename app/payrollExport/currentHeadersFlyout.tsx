'use client'
import { Popover, PopoverButton, PopoverPanel, CloseButton } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

// const solutions = [
//   { name: 'Corporate', href: '#' },
//   { name: 'Franchise', href: '#' },
//   { name: 'Company', href: '#' },
// ]

type Props = {
    callBack: Function;
    allHeaders: [];
    getHeaderId: Function;
}

export default function CurrentHeaders({callBack, allHeaders, getHeaderId}: Props) {

    const [level, setLevel] = useState<string>('Select Header')

  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center relative text-gray-700 border bg-white p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-orange-400 w-full">
        <span>{level}</span>
        <ChevronDownIcon aria-hidden="true" className="size-5 absolute right-2" />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-1/2 z-10 flex w-screen max-w-[28rem] mt-1 -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="w-full shrink rounded-xl bg-white p-4 text-sm/6 font-semibold text-gray-900 shadow-lg ring-1 ring-orange-500">
          {allHeaders.map((header: any) => (
            <CloseButton key={header.name} className="block hover:text-orange-500 w-full" onClick={() => {callBack(header.name); setLevel(header.name); getHeaderId(header.id)}}>
              {header.name === level ? <p className='bg-gray-100 py-2 px-2 rounded-md text-left'>{header.name} {`(${header.elType})`}</p> : <p className='py-2 px-2 text-left'>{header.name} {`(${header.elType})`}</p>}
            </CloseButton>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  )
}
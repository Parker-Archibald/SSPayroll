'use client'
import { Popover, PopoverButton, PopoverPanel, CloseButton } from '@headlessui/react'
import { CalendarDaysIcon } from '@heroicons/react/20/solid'

const days = Array.from({length: 31}, (_, i) => String(i + 1))

interface Props {
  id?: string
  value: string
  callBack: (day: string) => void
}

// Calendar style grid of days 1-31
export default function DayOfMonthPicker({id, value, callBack}: Props) {

  return (
    <Popover className="relative">
      <PopoverButton id={id} className="inline-flex items-center relative font-semibold text-gray-700 bg-white p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400 w-full">
        {value
          ? <span>{value}</span>
          : <span className="font-normal text-gray-400">Select a day</span>}
        <CalendarDaysIcon aria-hidden="true" className="size-5 absolute right-2" />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-0 z-10 mt-1 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="rounded-xl bg-white p-4 text-sm font-semibold text-gray-900 shadow-lg ring-1 ring-gray-900/5">
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => (
              <CloseButton
                key={day}
                className={`size-9 rounded-md hover:bg-gray-100 hover:text-blue-600 ${day === value ? 'bg-orange-500 text-white hover:bg-orange-500 hover:text-white' : ''}`}
                onClick={() => callBack(day)}
              >
                {day}
              </CloseButton>
            ))}
          </div>
          {value && (
            <CloseButton className="mt-2 w-full text-xs font-normal text-gray-500 hover:text-blue-600" onClick={() => callBack('')}>
              Clear
            </CloseButton>
          )}
        </div>
      </PopoverPanel>
    </Popover>
  )
}

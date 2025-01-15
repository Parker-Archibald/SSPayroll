'use client'

import { useEffect, useState } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'



const checks: {
  id: number;
  name: string;
  paramList: string[];
  example: string;
}[] = [
    {id: 1, name: 'Hours_worked', paramList: ['columns=1', 'type=Regular', 'decimalPlaces=5'], example: '2.00'},
    {id: 2, name: 'Hours_worked_excluding_company_holidays', paramList: ['NA'], example: '2.00'},
    {id: 3, name: 'Sick_hours', paramList: ['NA'], example: '2.00'},
    {id: 4, name: 'OT', paramList: ['type=Overtime', 'code=02OT', 'desc=8 hours per day', 'daysWorkedType=DAYS WORKED OT', 'format=dd-MMM-yy', 'multiplier=1'], example: '2.00'},
    {id: 5, name: 'DT', paramList: ['code=dt', 'type=Doubletime', 'desc=12 hours per day', 'daysWorkedType=DAYS_WORKED_DT', 'format=dd=MMM-yy', 'multiplier=2'], example: '2.00'},
    {id: 6, name: 'Regular_hours_duration', paramList: ['code=', 'type=Regular', 'desc=Hourly Pay', 'daysWorkedType=DYAS_WORKED_REGULAR', 'format=dd-MMM-yy','managementShifts=false', 'deductHolidaysWorked=true','excludeBreakDuration=true'], example: '2.00'},
    {id: 7, name: 'Spp_requested_holidays', paramList: ['code=HOLIDAYS'], example: '2.00'},
    {id: 8, name: 'Requested_holidays', paramList: ['NA'], example: '2.00'},
    {id: 9, name: 'PERIOD_START_DATE', paramList: ['NA'], example: '02/02/2025'},
    {id: 10, name: 'PERIOD_END_DATE', paramList: ['format=MM/dd/yyyy'], example: '02/02/2025'},
    {id: 11, name: 'BANK_HOLIDAY', paramList: ['NA'], example: '2.00'},
    {id: 12, name: 'BANK_HOLIDAY_NON_WORKED', paramList: ['NA'], example: '2.00'},
    {id: 13, name: 'BANK_HOLIDAY_WORKED', paramList: ['NA'], example: '2.00'},
    {id: 14, name: 'BANK_HOLIDAY_COMBINED', paramList: ['NA'], example: '2.00'},
    {id: 15, name: 'SHIFT_COUNT', paramList: ['NA'], example: '2.00'},
    {id: 16, name: 'FIRST_NAME', paramList: ['NA'], example: 'Bob'},
    {id: 17, name: 'NAME', paramList: ['format=LAST_NAME,FIRST_NAME', 'format=FIRST_NAME'], example: 'Bob Marley'},
    {id: 18, name: 'STAFF_NUMBER', paramList: ['NA'], example: '123456789'},
    {id: 19, name: 'SSN', paramList: ['NA'], example: '111-11-1111'},
    {id: 20, name: 'COMPANY_CODE', paramList: ['NA'], example: '123456789'},
    {id: 21, name: 'COMPANY_SHORT_CODE', paramList: ['NA'], example: '2345'},
    {id: 22, name: 'COMPANY_NAME', paramList: ['NA'], example: '2345-test'},
    {id: 23, name: 'BONUS_HOURS', paramList: ['NA'], example: '2.00'},
    {id: 24, name: 'BONUS_AMOUNT', paramList: ['code=BONUs', 'code=OTHER'], example: '2.00'},
    {id: 25, name: 'SHIFT_BONUS', paramList: ['NA'], example: '2.00'},
    {id: 26, name: 'PAY_RATE', paramList: ['NA'], example: '12.00'},
    {id: 27, name: 'TIP_SHARE', paramList: ['deductTipSharePaid=false', 'dollarAmount=true'], example: '2.00'},
    {id: 28, name: 'TIP_SHARE_PAID', paramList: ['NA'], example: '2.00'},
    {id: 29, name: 'DECLARED_TIPS', paramList: ['source=seti', 'code=CashTips'], example: '12.00'},
    {id: 30, name: 'JOB_CODE', paramList: ['NA'], example: 'Cook'},
    {id: 31, name: 'SECTION', paramList: ['NA'], example: 'Cook'},
    {id: 32, name: 'DEPARTMENT', paramList: ['NA'], example: 'FOH'},
    {id: 33, name: 'PAYMENT_SALES', paramList: ['NA'], example: '200.00'},
    {id: 34, name: 'PAYMENT_TIPS', paramList: ['NA'], example: '2.00'},
    {id: 35, name: 'PAYMENT_SERVICE_CHARGE', paramList: ['NA'], example: 'NA'},
    {id: 36, name: 'TIP_INFO_SALES', paramList: ['NA'], example: '2.00'},
    {id: 37, name: 'CHARGED_TIPS', paramList: ['deductTipSharePaid=false'], example: '2.00'},
    {id: 38, name: 'CASH_TIPS', paramList: ['includeTipShareEarned=false'], example: '2.00'},
    {id: 39, name: 'SHIFT_TIPS', paramList: ['includeServiceCharge=true', 'nonCashOnly=true','code=CashTips','isAmount=true','includeDeclared=true'], example: '2.00'},
    {id: 40, name: 'BASIC', paramList: ['NA'], example: 'NA'},
    {id: 41, name: 'SUNDAY', paramList: ['NA'], example: 'NA'},
    {id: 42, name: 'NOTES', paramList: ['NA'], example: 'This is a note'},
    {id: 43, name: 'FIXED_TEXT', paramList: ['text=doubletime', 'was=SHIFT_BONUS', 'category=MILEAGE', 'text=0.00'], example: 'doubletime'},
    {id: 44, name: 'WEEK_NUMBER', paramList: ['NA'], example: '1'},
    {id: 45, name: 'YEAR', paramList: ['NA'], example: '2025'},
    {id: 46, name: 'SHIFT_DATE', paramList: ['fomrat=MM/dd/yyyy'], example: '01/14/2025'},
    {id: 47, name: 'CURRENT_DATE', paramList: ['NA'], example: '01/14/2025'},
    {id: 48, name: 'PAID_BREAKS', paramList: ['code=','type=Paid Breaks','desc=Earnings for time spend on break', 'daysWorkedType=DAYS_WORKED_REGULAR', 'format=dd-MMM-yy'], example: '02/02/2025'},
    {id: 49, name: 'DAYS_WORKED_REGULAR', paramList: ['NA'], example: '2.00'},
    {id: 50, name: 'DAYS_WORKED_OT', paramList: ['NA'], example: '2.00'},
    {id: 51, name: 'DAYS_WORKED_DT', paramList: ['NA'], example: '2.00'},
    {id: 52, name: 'COST_TOTAL', paramList: ['decimalPlaces=3'], example: '2.00'},
    {id: 53, name: 'COST_REGULAR', paramList: ['decimalPlaces=4'], example: '2.00'},
    {id: 54, name: 'COST_OT', paramList: ['decimalPlaces=2'], example: '2.00'},
    {id: 55, name: 'COST_DT', paramList: ['decimalPlaces=0'], example: '2.00'},
    {id: 56, name: 'COST_SUNDAY', paramList: ['decimalPlaces=5'], example: '2.00'},
    {id: 57, name: 'COST_SUNDAY_OT', paramList: ['decimalPlaces=1'], example: '2.00'},
    {id: 58, name: 'COST_SUNDAY_DT', paramList: ['decimalPlaces=1'], example: '2.00'},
    {id: 59, name: 'Last_Name', paramList: ['NA'], example: 'Marley'}
]

interface Props {
  callBack: (p: string) => void;
  getParams: (p: string[]) => void;
  getExample: (d: string) => void;
}

export default function ElementSelect({callBack, getParams, getExample}: Props) {

  const [selected, setSelected] = useState(checks[0])
  const [filteredChecks, setFilteredChecks] = useState(checks)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    if(filter === '') {
        setFilteredChecks(checks.sort())
    }
    else {
        const newArr: { id: number; name: string; paramList: string[]; example: string; }[] = []

        checks.filter((check) => {
            if(check.name.toLowerCase().includes(filter.toLowerCase())) {
                    newArr.push(check)
                }
        })

        setFilteredChecks(newArr.sort())
    }
  }, [filter])

  return (
    <Listbox value={selected} onChange={(value) => {setSelected(value); callBack(value.name); setFilter(''); getParams(value.paramList); getExample(value.example);}}>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-pointer grid-cols-1 rounded-md bg-white py-2 pl-3 pr-2 text-left text-gray-700 outline outline-1 -outline-offset-1 outline-gray-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-orange-400 sm:text-sm/6">
          <span className="col-start-1 row-start-1 truncate pr-6">{selected.name}</span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
            {/* Search */}
            <div className='flex px-1'>
                <div className=''><MagnifyingGlassIcon className='size-4 m-2'/></div>
                <input className='w-full py-2 focus:outline-none' placeholder='Search' onChange={(e) => setFilter(e.target.value)}/>
            </div>

          {filteredChecks.map((check) => (
            <ListboxOption
            key={check.id}
            value={check}
            className="group relative cursor-default select-none py-3 pl-3 pr-9 text-gray-700 data-[focus]:bg-orange-400 data-[focus]:text-white data-[focus]:outline-none hover:cursor-pointer"
            >
            <span className="block truncate font-normal group-data-[selected]:font-semibold">{check.name}</span>

            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-orange-400 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
            </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
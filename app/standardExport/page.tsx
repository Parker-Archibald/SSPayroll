'use client'
import { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon, ClipboardDocumentListIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import Dropdown from "./dropdown";
import DayOfMonthPicker from "./dayOfMonthPicker";
import { timezones } from "./timezones";

const exportTypes = ['STANDARD_STATIC', 'STANDARD_TRANSACTIONAL']

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const scriptLocations: Record<string, string> = {
    STANDARD_STATIC: '/usr/pentaho-exports/data-exports/Standard_Exports/static_data/export_static.sh',
    STANDARD_TRANSACTIONAL: '/usr/pentaho-exports/data-exports/Standard_Exports/transaction_data/export_trans.sh',
}

const hours = Array.from({length: 24}, (_, i) => String(i).padStart(2, '0'))
const minutes = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'))

type TimePartProps = {
    id: string;
    label: string;
    placeholder: string;
    options: string[];
    min: number;
    max: number;
    value: string;
    callBack: (value: string) => void;
}

// Text box the user can type into or pick from the suggestion list
const TimePartInput = ({id, label, placeholder, options, min, max, value, callBack}: TimePartProps) => (
    <>
        <input
            id={id}
            aria-label={label}
            list={`${id}Options`}
            inputMode="numeric"
            autoComplete="off"
            placeholder={placeholder}
            className="p-2 w-16 text-center focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400"
            value={value}
            onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 2)
                // Ignore input that would go past the max, e.g. hour 13
                if(digits === '' || parseInt(digits) <= max) callBack(digits)
            }}
            onBlur={() => {
                // Pad to two digits when leaving the field, clear anything below the min
                if(value === '') return
                callBack(parseInt(value) < min ? '' : value.padStart(2, '0'))
            }}
        />
        <datalist id={`${id}Options`}>
            {options.map(o => <option key={o} value={o}/>)}
        </datalist>
    </>
)


type Query = {
    table: string;
    columns: [string, string][]; // Column name and its SQL value
}

// Quote a string for SQL, escaping single quotes
const sqlString = (value: string) => `'${value.replace(/'/g, "''")}'`

const columnList = (query: Query) => `(${query.columns.map(([col]) => col).join(', ')})`
const valueList = (query: Query) => `(${query.columns.map(([, val]) => val).join(', ')})`

// Today's date as yyyymmdd001
const todaysId = () => {
    const d = new Date()
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}001`
}

const InfoTooltip = ({text}: {text: string}) => (
    <div className="relative group">
        <InformationCircleIcon className="size-4 text-gray-500 hover:text-orange-500 hover:cursor-pointer"/>
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-56 rounded-md bg-gray-800 text-gray-100 text-xs px-3 py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out">
            {text}
        </div>
    </div>
)

const StandardExport = () => {

    const [corporateId, setCorporateId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [type, setType] = useState<string>(exportTypes[0])
    const [sftpUrl, setSftpUrl] = useState<string>('')
    const [sftpUsername, setSftpUsername] = useState<string>('')
    const [sftpPassword, setSftpPassword] = useState<string>('')
    const [sftpTargetDirectory, setSftpTargetDirectory] = useState<string>('')
    const [franchiseId, setFranchiseId] = useState<string>('')
    const [taskHour, setTaskHour] = useState<string>('')
    const [taskMinute, setTaskMinute] = useState<string>('')
    const [timezone, setTimezone] = useState<string>('')
    const [validDay, setValidDay] = useState<string>('')
    const [dayOfMonth, setDayOfMonth] = useState<string>('')
    const [queryIsOpen, setQueryIsOpen] = useState<boolean>(true)
    const [copied, setCopied] = useState<boolean>(false)
    const [id, setId] = useState<string>('')

    // Set on the client only so the server and browser render the same HTML
    useEffect(() => {
        setId(todaysId())
    }, [])

    const fullCorporateId = corporateId.padEnd(15, '0')
    // "TSC - Serve - Standard - Static" -> "TSC_Serve_Standard_Static"
    const codeName = name.replace(/-/g, ' ').trim().split(/\s+/).join('_')
    const scriptParameters = `-f true -c ${fullCorporateId} -fe ${sftpUrl} -fu ${sftpUsername} -fp ${sftpPassword} -fd ${sftpTargetDirectory}` + (franchiseId ? ` -fId ${franchiseId}` : '')

    const code = `${type}_${codeName}`
    // 24 hour time, e.g. "14:30", empty until both hour and minute are entered
    const taskTime = taskHour && taskMinute ? `${taskHour.padStart(2, '0')}:${taskMinute.padStart(2, '0')}` : ''

    const queries: Query[] = [
        {
            table: 'data_export',
            columns: [
                ['ID', id || 'NULL'],
                ['Corporate_ID', corporateId ? fullCorporateId : 'NULL'],
                ['Name', sqlString(name)],
                ['Type', sqlString(type)],
                ['Code', sqlString(code)],
                ['Export_Script_Location', sqlString(scriptLocations[type])],
                ['Parameters', sqlString('')],
                ['Script_Parameters', sqlString(scriptParameters)],
            ],
        },
        {
            table: 'synergy_scheduled_task',
            columns: [
                ['ID', id || 'NULL'],
                ['Description', sqlString(name)],
                ['Server_id', '-100'],
                ['secondary_server_id', 'NULL'],
                ['corporate_list', corporateId ? sqlString(fullCorporateId) : 'NULL'],
                ['company_list', 'NULL'],
                ['exclude_company_list', 'NULL'],
                ['franchise_list', 'NULL'],
                ['Parameters', sqlString(`CODE=${code}`)],
                ['scheduled_task_type', sqlString('DATA_EXPORT')],
                ['recurring', '1'],
                ['run_now', '0'],
                // e.g. Tuesday -> 'tu'
                ['valid_days', validDay ? sqlString(validDay.slice(0, 2).toLowerCase()) : 'NULL'],
                ['day_of_month', dayOfMonth || 'NULL'],
                ['task_time', taskTime ? sqlString(taskTime) : 'NULL'],
                ['timezone', timezone ? sqlString(timezone) : 'NULL'],
                ['is_absolute_time', '1'],
                ['run_synchronously', '1'],
                ['last_process_time', 'NULL'],
                ['secondary_server_process_delay', 'NULL'],
                ['last_update_server_id', 'NULL'],
                ['status', 'NULL'],
                ['last_run_message', 'NULL'],
                ['last_run_duration', 'NULL'],
                ['last_run_start_time', 'NULL'],
                ['run_every', 'NULL'],
                ['last_scheduled_run_date', 'NULL'],
                ['last_queued_time', 'NULL'],
                ['SQS_Name', sqlString('production-PENTAHO-scheduledTasks.fifo')],
            ],
        },
    ]

    const copyToClipboard = () => {
        navigator.clipboard.writeText(queries.map(q => `INSERT INTO ${q.table} ${columnList(q)} VALUES ${valueList(q)};`).join('\n'))
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className="py-4 px-8">
            {/* Title */}
            <div>
                <h2 className="font-semibold text-2xl">Create a new Standard Export</h2>
            </div>

            {/* Options */}
            <div className="py-4 bg-gray-200 rounded-md my-4 px-8 shadow-lg flex flex-wrap gap-x-10 gap-y-4">
                {/* Corporate ID */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-56 text-gray-800">
                    <div className="flex items-center gap-x-1">
                        <label htmlFor='corporateIdInput' className="text-sm">Corporate ID</label>
                        <InfoTooltip text="Enter the first 3 digits of the Corporate ID."/>
                    </div>
                    <input
                        id='corporateIdInput'
                        inputMode="numeric"
                        maxLength={3}
                        placeholder="123"
                        className="p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400"
                        value={corporateId}
                        onChange={(e) => setCorporateId(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    />
                </div>
                {/* Name */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <div className="flex items-center gap-x-1">
                        <label htmlFor='nameInput' className="text-sm">Name</label>
                        <InfoTooltip text="A unique name for the export. Include the corporate or franchise name, followed by Standard - export type."/>
                    </div>
                    <input
                        id='nameInput'
                        placeholder="TSC - Serve - Standard - Static"
                        className="p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                {/* Type */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='typeInput' className="text-sm">Type</label>
                    <Dropdown id='typeInput' options={exportTypes} value={type} callBack={(opt: string) => setType(opt)}/>
                </div>
                {/* SFTP Server URL */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='sftpUrlInput' className="text-sm">SFTP Server URL</label>
                    <input
                        id='sftpUrlInput'
                        autoComplete="off"
                        className="p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400"
                        value={sftpUrl}
                        onChange={(e) => setSftpUrl(e.target.value)}
                    />
                </div>
                {/* SFTP Username */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='sftpUsernameInput' className="text-sm">SFTP Username</label>
                    <input
                        id='sftpUsernameInput'
                        autoComplete="off"
                        className="p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400"
                        value={sftpUsername}
                        onChange={(e) => setSftpUsername(e.target.value)}
                    />
                </div>
                {/* SFTP Password */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='sftpPasswordInput' className="text-sm">SFTP Password</label>
                    <input
                        id='sftpPasswordInput'
                        type="password"
                        autoComplete="new-password"
                        className="p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400"
                        value={sftpPassword}
                        onChange={(e) => setSftpPassword(e.target.value)}
                    />
                </div>
                {/* SFTP Target Directory */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='sftpTargetDirectoryInput' className="text-sm">SFTP Target Directory</label>
                    <input
                        id='sftpTargetDirectoryInput'
                        autoComplete="off"
                        className="p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400"
                        value={sftpTargetDirectory}
                        onChange={(e) => setSftpTargetDirectory(e.target.value)}
                    />
                </div>
                {/* Franchise ID */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <div className="flex items-center gap-x-1">
                        <label htmlFor='franchiseIdInput' className="text-sm">Franchise ID</label>
                        <InfoTooltip text="If this export is for the whole corporate, leave the Franchise ID blank."/>
                    </div>
                    <input
                        id='franchiseIdInput'
                        autoComplete="off"
                        className="p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400"
                        value={franchiseId}
                        onChange={(e) => setFranchiseId(e.target.value)}
                    />
                </div>
                {/* Task Time */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='taskTimeInput' className="text-sm">Task Time</label>
                    <div className="flex items-center gap-x-1">
                        <TimePartInput id='taskTimeInput' label="Hour" placeholder="hh" options={hours} min={0} max={23} value={taskHour} callBack={setTaskHour}/>
                        <span>:</span>
                        <TimePartInput id='taskMinuteInput' label="Minute" placeholder="mm" options={minutes} min={0} max={59} value={taskMinute} callBack={setTaskMinute}/>
                    </div>
                </div>
                {/* Timezone */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='timezoneInput' className="text-sm">Timezone</label>
                    <Dropdown id='timezoneInput' options={timezones} value={timezone} placeholder="Select a timezone" searchable callBack={(opt: string) => setTimezone(opt)}/>
                </div>
                {/* Valid Days */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='validDaysInput' className="text-sm">Valid Days</label>
                    <Dropdown id='validDaysInput' options={weekDays} value={validDay} placeholder="Select a day" clearable callBack={(opt: string) => setValidDay(opt)}/>
                </div>
                {/* Day of Month */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='dayOfMonthInput' className="text-sm">Day of Month</label>
                    <DayOfMonthPicker id='dayOfMonthInput' value={dayOfMonth} callBack={(day: string) => setDayOfMonth(day)}/>
                </div>
            </div>

            {/* Query */}
            <section className="w-full my-10 border-b">
                {/* Title */}
                <div className="relative hover:cursor-pointer" onClick={() => setQueryIsOpen(!queryIsOpen)}>
                    <h3 className='text-xl font-semibold'>Query</h3>
                    <ChevronDownIcon className={`size-6 absolute top-2 right-4 transition-all duration-300 ease-in-out ${queryIsOpen ? 'rotate-180' : ''}`}/>
                </div>

                <div className={`bg-gray-200 rounded-md mt-4 transition-all duration-300 ease-in-out relative ${queryIsOpen ? 'h-fit p-4 pr-16 mb-4' : 'h-0 px-4 overflow-y-hidden'}`}>
                    <div className="absolute right-4 top-2 flex items-center gap-x-1">
                        {copied && <span className="text-xs text-gray-600">Copied!</span>}
                        <ClipboardDocumentListIcon className="size-10 hover:cursor-pointer hover:bg-gray-300 px-2 py-2 duration-200 ease-in-out rounded-md" onClick={copyToClipboard}/>
                    </div>
                    <div className="flex flex-col gap-y-4">
                        {queries.map(q => (
                            <p key={q.table} className="break-words">
                                <span className="text-blue-600">INSERT INTO</span> {q.table} {columnList(q)}
                                <span className="text-blue-600"> VALUES</span> (
                                {q.columns.map(([col, val], i) => (
                                    <Fragment key={col}>
                                        {i > 0 && ', '}
                                        {/* Hover a value to see which column it belongs to */}
                                        <span className="relative group rounded-sm hover:bg-orange-200 cursor-default">
                                            {val}
                                            <span className="absolute left-0 bottom-full mb-1 z-10 whitespace-nowrap rounded-md bg-gray-800 text-gray-100 text-xs px-2 py-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out pointer-events-none">
                                                {col}
                                            </span>
                                        </span>
                                    </Fragment>
                                ))});
                            </p>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default StandardExport;

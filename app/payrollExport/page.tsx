'use client'
import { useEffect, useState } from "react";
import Flyout from "./flyout";
import MultilineFlyout from "./multilineFlyout";
import { ChevronDownIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import PayrollPreview from "./payrollPreview";

type Header = {
    id: string;
    payroll_mapping_id: number;
    elNum: number;
    elType: string;
    name: string;
    params: string;
    valHourly: number;
    valSalary: number;
    reqZero: number;
    example: string;
}

type Element = {
    elType: string;
    headerName: string;
    selectedElementType: string;
    parameters: string;
    headerId: string;
    elRow: number;
    example: string;
    valHourly: number;
    valSalary: number;
    reqZero: number;
    headername: string;
    elNum: string;
    headerid: string;
    pMapId: number | null;
    id: string
}

type El = {
    headerName: string,
    parameters: string,
    headerId: string,
    elRow: string,
    valHourly: number,
    valSalary: number,
    reqZero: number,
    id: string;
    pMapId: number | null;
    elNum: number | string;
    elType: string;
}

const PayrollExport = () => {

    const [level, setLevel] = useState<string>('Corporate')
    const [id, setId] = useState<number | null>(null)
    const [isMultiLine, setIsMultiLine] = useState<boolean>(true)
    const [queryIsOpen, setQueryIsOpen] = useState<boolean>(false)
    const [numberOfRows, setNumberOfRows] = useState<number>(0)
    const [rowData, setRowData] = useState([])
    const [allElements, setAllElements] = useState<El[] | []>([])
    const [allHeaders, setAllHeaders] = useState<Header[] | []>([])
    const [hasNewData, setHasNewData] = useState<boolean>(false)

    const [columnOpen, setColumnOpen] = useState(false)

    useEffect(() => {
        if(numberOfRows > 0) {
            let ar: any = Array.from(Array(numberOfRows).keys())
        
            ar.forEach((num: number) => {
                ar[num] = `(${id}0${num + 1}, ${id}, ${num + 1}, 1, 1)`
            })

            setRowData(ar)
        }

    }, [numberOfRows])

    useEffect(() => {
        setHasNewData(false)
    }, [hasNewData])

    const handleQueryOpen = () => {
        if(queryIsOpen) {
            setQueryIsOpen(false)
            document.getElementById('querySection')!.style.height = '0px'
            document.getElementById('querySection')!.style.padding = '0rem'
            document.getElementById('queryChev')!.style.transform = 'rotate(0deg)'
        }
        else {
            setQueryIsOpen(true)
            document.getElementById('querySection')!.style.height = 'fit-content'
            document.getElementById('querySection')!.style.padding = '1rem'
            document.getElementById('queryChev')!.style.transform = 'rotate(180deg)'
        }
    }

    const updateHeaders = (data: {}[]) => {
        setAllHeaders(data)
        setHasNewData(true)
    }

    const updateElements = ((data: El[]) => {
        setAllElements(data)
        setHasNewData(true)
    })  

    const copyToClipboard = () => {
        const payrollElementRow: string[] = []
        const headers: string[] = [];
        const elements: string[] = [];

        rowData.forEach(row => {
            payrollElementRow.push(`INSERT INTO payroll_element_row (ID, Payroll_Mapping_ID, Row_Order, Valid_Hourly, Valid_Salaried) VALUES ${row};
`)
        })

        allHeaders.map((header: Header) => {
            headers.push(`INSERT INTO payroll_element (ID, payroll_mapping_id, Element_Number, Payroll_Element, Column_Title, Parameters, Valid_Hourly, Valid_Salaried, Requires_Non_Zero) Values (${header.id}, ${header.payroll_mapping_id}, ${header.elNum}, '${header.elType}', '${header.name}', ${header.params ? `'${header.params}'` : null}, ${header.valHourly}, ${header.valSalary}, ${header.reqZero});
`)
        })

        allElements.map((element: El) => {
            elements.push(`INSERT INTO payroll_element (ID, Payroll_mapping_id, Payroll_element_row_id, Parent_element_id, element_number, Payroll_element, Column_title, Parameters, Valid_hourly, Valid_salaried, Requires_non_zero) VALUES (${element.id}, ${element.pMapId}, ${element.elRow}, ${element.headerId}, ${element.elNum}, '${element.elType}', '${element.headerName}', ${element.parameters !== '' && element.parameters !== undefined ? `'${element.parameters}'` : null}, ${element.valHourly}, ${element.valSalary}, ${element.reqZero});
`)
        })

        const copyText = `INSERT INTO sage_micropay_mapping (ID, Corporate_ID) VALUES ('${id}', '${id}'); 
${payrollElementRow.join('')} ${headers.join('')} ${elements.join('')}`

        console.log(copyText)
        navigator.clipboard.writeText(copyText)
    }

    return (
        <div className="py-4 px-8">
            {/* Title */}
            <div>
                <h2 className="font-semibold text-2xl">Create a new Payroll Export</h2>
            </div>

            {/* Gray bar with Level, ID, Mulit-line and # of rows */}
            <div className="py-4 bg-gray-200 rounded-md my-4 px-8 shadow-lg flex gap-x-10">
                {/* Level */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-56 text-gray-800">
                    <label htmlFor='exportLevelInput' className="text-sm ">Level</label>
                    <Flyout callBack={(lev: string) => setLevel(lev)}/>
                </div>
                {/* ID */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-72 text-gray-800">
                    <label htmlFor='exportIdInput' className="text-sm ">ID {'(Corporate, Franchise or Company)'}</label>
                    <input id='exportIdInput' className="p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400" onChange={(e) => setId(parseInt(e.target.value))}/>
                </div>
                {/* Multi-line */}
                <div className="flex flex-col gap-y-2 w-1/4 max-w-56 text-gray-800">
                    <label htmlFor='exportLevelInput' className="text-sm ">Uses Multi-line?</label>
                    <MultilineFlyout callBack={(opt: boolean) => setIsMultiLine(opt)}/>
                </div>
                {/* Lines in payroll_element_row */}
                <div className="flex flex-col gap-y-2 w-fit text-gray-800">
                    <label htmlFor='exportIdInput' className="text-sm ">How many lines are needed in payroll_element_row?</label>
                    <input type='number' className="p-2 focus:outline-none rounded-md focus:ring-1 focus:ring-blue-400" placeholder={'1'} onChange={(e) => {
                        e.target.value === '' ? setNumberOfRows(1) : setNumberOfRows(parseInt(e.target.value))
                    }}/>
                </div>
            </div>

            {/* Query */}
            <section className="w-full my-10 border-b">
                {/* Title */}
                <div className="relative hover:cursor-pointer" onClick={handleQueryOpen}>
                    <h3 className='text-xl font-semibold'>Query</h3>
                    <ChevronDownIcon id='queryChev' className="size-6 absolute top-2 right-4 transition-all duration-300 ease-in-out"/>
                </div>

                
                <div id='querySection' className="bg-gray-200 rounded-md mt-4 h-0 px-4 overflow-y-hidden transition-all duration-300 ease-in-out relative">
                    <div className="absolute right-4 top-2  transition-all"><ClipboardDocumentListIcon className="size-10 hover:cursor-pointer hover:bg-gray-300 px-2 py-2 duration-200 ease-in-out rounded-md" onClick={copyToClipboard}/></div>
                    {/* Sage_micropay_mapping insert */}
                    <div>
                        <p><span className="text-blue-600">INSERT INTO</span> sage_micropay_mapping 
                        (ID, {
                            level === 'Corporate' ? 'Corporate_ID' : level === 'Franchise' ? 'Franchise_ID' : 'Company_ID'
                        }) 
                        <span className="text-blue-600"> VALUES</span> {`('${id}', '${id}')`};</p>
                    </div>

                    {/* Payroll_element_row insert */}
                    <div>
                        {rowData.map(row => (
                            <div key={row}>
                                <span className="text-blue-600">INSERT INTO</span> payroll_element_row {'(ID, Payroll_Mapping_ID, Row_Order, Valid_Hourly, Valid_Salaried)'} <span className="text-blue-600">VALUES</span> {row};
                            </div>
                        ))}
                    </div>

                    {/* Headers */}
                    <div>
                        {allHeaders.map((header: Header) => (
                            <div key={header.name}>
                                <span className="text-blue-600">INSERT INTO</span> payroll_element {`(ID, payroll_mapping_id, Element_Number, Payroll_Element, Column_Title, Parameters, Valid_Hourly, Valid_Salaried, Requires_Non_Zero)`}
                                <span className="text-blue-600"> Values</span> {`(${header.id}, ${header.payroll_mapping_id}, ${header.elNum}, '${header.elType}', '${header.name}', ${header.params ? `'${header.params}'` : null}, ${header.valHourly}, ${header.valSalary}, ${header.reqZero});`}
                            </div>
                        ))}
                    </div>

                    {/* All Elements */}
                    <div>
                        {allElements.map((element: El) => (
                            <div key={element.elType}>
                            <span className="text-blue-600">INSERT INTO</span> payroll_element {'(ID, Payroll_mapping_id, Payroll_element_row_id, Parent_element_id, element_number, Payroll_element, Column_title, Parameters, Valid_hourly, Valid_salaried, Requires_non_zero)'}
                            <span className="text-blue-600"> VALUES</span> {`(${element.id}, ${element.pMapId}, ${element.elRow}, ${element.headerId}, ${element.elNum}, '${element.elType}', '${element.headerName}', ${element.parameters !== '' && element.parameters !== undefined ? `'${element.parameters}'` : null}, ${element.valHourly}, ${element.valSalary}, ${element.reqZero});`}
                        </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Preview */}
            <section className="w-full my-10">
                <h3 className='text-xl font-semibold'>Preview</h3>
                <div className="bg-gray-200 rounded-md mt-4 p-4">
                    <PayrollPreview id={id} headerCallback={(data: Header[]) => updateHeaders(data)} elementCallback={(data: El[]) => updateElements(data)}/>
                </div>
            </section>

        </div>
    )
}

export default PayrollExport;
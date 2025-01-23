'use client'
import { useState } from "react"
import NewHeader from "./newHeader"
import NewElement from "./newElement"

  interface Props {
    id: number | null;
    headerCallback: (data: ReturnHeader[]) => void;
    elementCallback: (data: Element[]) => void;
  }

  type Element = {
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

  type El = {
    headerName: string,
    selectedElementType: string,
    parameters: string,
    headerId: string,
    elRow: string,
    example: string,
    valHourly: number,
    valSalary: number,
    reqZero: number
  }

  type Header = {
    selectedElementType: string; 
    headerName: string; 
    parameters: string; 
    example: string;
  }

  type ReturnHeader = {
    id: number | null;
    payroll_mapping_id: number | null;
    elNum: number;
    elType: string;
    name: string;
    params: string;
    valHourly: number;
    valSalary: number;
    reqZero: number;
    example: string;
  }
  
  export default function PayrollPreview({id, headerCallback, elementCallback}: Props) {

    const [newHeaderOpen, setNewHeaderOpen] = useState<boolean>(false)
    const [headers, setHeaders] = useState<ReturnHeader[]>([])
    const [newElementOpen, setNewElementOpen] = useState<boolean>(false)
    const [allElements, setAllElements] = useState<Element[]>([])
    const [row2, setRow2] = useState<Element[] | []>([])
    const [row3, setRow3] = useState<Element[] | []>([])


    const addNewHeader = async (data: {
      selectedElementType: string;
      headerName: string;
      parameters: string;
      example: string;
    }) => {
      const newHeaders: ReturnHeader[] = headers;
      let finalId;
      const headerLen = headers.length
      const elLen = allElements.length
      // const finalLen = headerLen + elLen

      finalId = parseInt(`${id}${headerLen + elLen}`)

      const tempData: ReturnHeader = {
        id: finalId,
        payroll_mapping_id: id,
        elNum: headers.length + 1,
        elType: data.selectedElementType,
        name: data.headerName,
        params: data.parameters,
        valHourly: 1,
        valSalary: 1,
        reqZero: 0,
        example: data.example
      }

      newHeaders.push(tempData)

      setHeaders(newHeaders)

      await headerCallback(newHeaders)
    }

    const addNewElement = async (data: El) => {
      const newList: Element[] = allElements;

      const headerLen = headers.length;
      const elLen = allElements.length;
      const finalLen = headerLen + elLen + 1;
      let finalId;

      if(finalLen > 10) {
        finalId = `${id}${finalLen}`
      }
      else {
        finalId = `${id}0${finalLen}`
      }

      const finalData: Element = {
        id: finalId,
        pMapId: id,
        elRow: data.elRow,
        headerId: data.headerId,
        elNum: 0,
        elType: data.selectedElementType,
        headerName: data.headerName,
        parameters: data.parameters,
        valHourly: data.valHourly,
        valSalary: data.valSalary,
        reqZero: data.reqZero
      }

      newList.push(finalData)
      setAllElements(newList)

      await elementCallback(newList)

      const two: Element[] = [];
      const three: Element[] = []
      newList.forEach((el: Element) => {
        const str: string = el.elRow;
        const newStr = str[el.elRow.length - 1]

        if(newStr === '2') {
          two.push(el)
        }
        else {
          three.push(el)
        }
      })

      setRow2(two)
      setRow3(three)
    }

    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="flex">
              <div>
                <div className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3" onClick={() => setNewHeaderOpen(true)}><span className="bg-orange-400 ml-5 text-white hover:bg-gray-300 px-3 py-2 rounded-md transition-all duration-200 ease-in-out hover:cursor-pointer">New Header</span></div>
                {newHeaderOpen && <NewHeader isOpen={() => setNewHeaderOpen(false)} callBack={(data: Header) => addNewHeader(data)}/>}
              </div>
              <div>
                <div className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3" onClick={() => setNewElementOpen(true)}><span className="bg-orange-400 ml-5 text-white hover:bg-gray-300 px-3 py-2 rounded-md transition-all duration-200 ease-in-out hover:cursor-pointer">New Element</span></div>
                {newElementOpen && <NewElement isOpen={() => setNewElementOpen(false)} callBack={(data: El) => addNewElement(data)} allHeaders={headers} id={id}/>}
              </div>
            </div>
            
            <div className=" min-w-full py-2 align-middle sm:px-6 lg:px-8 flex">
              <table className="min-w-full divide-y divide-gray-300 bg-white">
                <thead>
                  <tr>
                    {headers.map((header: {
                      name: string;
                    }) => (
                        <th key={header.name} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                            {header.name}
                        </th>
                    ))}
                    
                  </tr>
                  
                </thead>
                <tbody className="bg-white">
                <tr className="even:bg-gray-50">
                  {headers.map((header: ReturnHeader, index: number) => (
                      <td key={header.example + index}  className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {header.example}
                      </td>
                  ))}
                  </tr>
                  <tr className="even:bg-gray-50" >
                    {row2.map((element: Element, index: number) => (
                    
                      <td key={element.id + index} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {element.elType}
                      </td>
                      
                    ))}
                  </tr>
                  <tr className="even:bg-gray-50" >
                    {row3.map((element: Element, index: number) => (
                    
                      <td key={element.id + index} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {element.elType}
                      </td>
                      
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
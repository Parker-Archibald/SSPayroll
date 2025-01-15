'use client'
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/16/solid"
import Inputs from "./inputs"
import ElementSelect from "./elementSelect"
import { useState, useEffect } from "react"
import CurrentHeaders from "./currentHeadersFlyout"

type Props = {
  isOpen: Function;
  callBack: Function;
  allHeaders: [];
  id: number | null;
}

export default function NewElement({isOpen, callBack, allHeaders, id}: Props) {

    const [headerName, setHeaderName] = useState<string>('')
    const [selectedElementType, setSelectedElementType] = useState<string>('')
    const [parameters, setParameters] = useState<string>('')
    const [paramList, setParamList] = useState<any>([])
    const [selectedHeader, setSelectedHeader] = useState<string>('')
    const [elRow, setElRow] = useState(`${id}02`)
    const [example, setExample] = useState('')
    const [headerId, setHeaderId] = useState('')
    const [valHourly, setValHourly] = useState(1)
    const [valSalary, setValSalary] = useState(1)
    const [reqZero, setReqZero] = useState(0)

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-10 flex items-center justify-center">
        <div className="fixed top-0 left-0 bg-gray-400/50 backdrop-blur-sm w-full h-full hover:cursor-pointer" onClick={isOpen}/>
        <div className="bg-white w-1/4 h-fit z-20 rounded-md p-8 relative">
            <div className="absolute right-1 top-1 p-1 hover:bg-gray-100 rounded-md transition-all duration-200 ease-in-out hover:cursor-pointer" onClick={isOpen}><XMarkIcon className="size-6"/></div>
            <h3 className="text-xl font-semibold">New Element</h3>
            <form className="py-4 flex flex-col gap-y-4" onSubmit={(e: any) => {callBack({
              headerName: selectedHeader,
              selectedElementType: selectedElementType,
              parameters: parameters,
              headerId: `${headerId}`,
              elRow: elRow,
              example: example,
              valHourly: valHourly,
              valSalary: valSalary,
              reqZero: reqZero
            }); e.preventDefault(); isOpen()}}>
                {/* <Inputs label={'Header Name'} callBack={(name: string) => setHeaderName(name)}/> */}
                <div className="space-y-2">
                    <p>Header</p>
                    {/* <ElementSelect callBack={(el: string) => setSelectedElementType(el)} getParams={(p: any) => setParamList(p)}/> */}
                    <CurrentHeaders callBack={(el: string) => setSelectedHeader(el)} getParams={(p: any) => setParamList(p)} allHeaders={allHeaders} getHeaderId={(headerId: any) => setHeaderId(headerId)}/>
                </div>
                <div>
                    <p>Element Type</p>
                    <ElementSelect callBack={(el: string) => setSelectedElementType(el)} getParams={(p: any) => setParamList(p)} getExample={(d: any) => setExample(d)}/>
                </div>
                <div>
                    <Inputs label="Payroll_element_row_id" value={elRow} callBack={(data: any) => setElRow(data)}/>
                </div>
                {headerId !== '' && (
                  <div>
                      <Inputs label="Parent_element_id" value={`${headerId}`} callBack={(data: any) => setHeaderId(data)}/>
                  </div>
                )}
                {/* Valids and non zero */}
                <div className="flex gap-x-8">
                  <div className="flex flex-col gap-y-2">
                      <label htmlFor="valHourlyInput">Valid Hourly</label>
                      <input id='valHourlyInput' type='number' defaultValue={1} className="border rounded-md py-1 px-2 w-full focus:outline-none focus:ring-1 focus:ring-orange-400" onChange={(e: any) => setValHourly(e.target.value)}/>
                  </div>  
                  <div className="flex flex-col gap-y-2">
                      <label htmlFor="valHourlyInput">Valid Salary</label>
                      <input id='valHourlyInput' type='number' defaultValue={1} className="border rounded-md py-1 px-2 w-full focus:outline-none focus:ring-1 focus:ring-orange-400" onChange={(e: any) => setValSalary(e.target.value)}/>
                  </div> 
                  <div className="flex flex-col gap-y-2">
                      <label htmlFor="valHourlyInput">Non-zero</label>
                      <input id='valHourlyInput' type='number' defaultValue={0} className="border rounded-md py-1 px-2 w-full focus:outline-none focus:ring-1 focus:ring-orange-400" onChange={(e: any) => setReqZero(e.target.value)}/>
                  </div> 
                </div>
                <div className="flex flex-col gap-y-2 w-full">
                    <div className="flex gap-x-2 items-center">
                        <label htmlFor="parameterInput" className="">Parameters</label>
                        <a target="_blank" href='https://synergysuite.atlassian.net/wiki/spaces/~62cdbb871e326fd9301290f6/pages/2746712075/Payroll+Element+Parameters' title='Confluence Documentation'>
                            <ArrowTopRightOnSquareIcon className="size-4 hover:cursor-pointer"/>
                        </a>
                    </div>
                    <input id='parameterInput' className="rounded-md px-2 py-1 border focus:outline-none focus:ring-1 focus:ring-orange-500" title={paramList} onChange={(e) => setParameters(e.target.value)}/>
                </div>
                <div className="w-full flex justify-center">
                  <button type='submit' className="bg-orange-400 w-fit px-8 py-1 rounded-md hover:bg-orange-600 transition-all duration-200 ease-in-out text-gray-100">Save</button>
                </div>
            </form>
        </div>
    </div>
  )
}
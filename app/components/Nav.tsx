'use client'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

const Nav = () => {

    const router = useRouter();
    const pathName = usePathname()
    const [route, setRoute] = useState<string | undefined>(undefined);

    useEffect(() => {
            const path = pathName.split('/')[1]
            if(path === 'payrollExport') {
                setRoute('Payroll Export') 
            }
            else {
                setRoute(undefined)
            }
    }, [pathName])

    return (
        <div className=" top-0 left-0 pt-10">
            <div className="bg-orange-500 py-2 text-gray-100 px-8">
                <div className="hover:bg-gray-100 hover:text-orange-500 w-fit px-2 py-1 rounded-sm hover:cursor-pointer text-sm transition-all duration-100 ease-in-out" onClick={() => router.push('/payrollExport')}>
                    <p>Payroll Export</p>
                </div>
            </div>

            <div className='px-8 py-2 bg-gray-100'>
                <p>{route ? <span className='text-blue-800 hover:cursor-pointer' onClick={() => router.push('/')}>Home</span> : 'Home'} {route && `${'>'} ${route}`}</p>
            </div>
        </div>
    )
}

export default Nav
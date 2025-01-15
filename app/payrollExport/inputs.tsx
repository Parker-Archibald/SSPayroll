
type Props = {
    label: string;
    callBack: Function;
    value?: string | number;
}

const Inputs = ({label, callBack, value}: Props) => {

    return (
        <div className="flex flex-col gap-y-2 ">
            <label htmlFor={label}>{label}</label>
            <input id={label} className="border rounded-md py-1 px-2 w-full focus:outline-none focus:ring-1 focus:ring-orange-400" defaultValue={value} onChange={(e: any) => callBack(e.target.value)}/>
        </div>
    )
}

export default Inputs
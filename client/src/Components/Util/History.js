import React, { useState, useEffect } from 'react'
import Popup from './Popup'
import axios from "../Api"
import Status from './Status'

const History = (props) => {
    const [popup, setPopup] = useState(-1);
    const s1 =
        "bg-white-900 mx-3 mt-5 text-center h-max rounded-md text-base font-medium";
    const [data, setData] = useState([]);
    const [status, setStatus] = useState("All");
    const choices = ["All", 'Pending', 'Approved', 'Denied', props.handle == "donations" ? 'Donated' : "Completed"];
    const [id, setId] = useState(-1);
    const [newStat, setnewStat] = useState("");
    
    useEffect(() => {
        axios.get(`/${props.user}/${props.handle}`, { withCredentials: true }).then((r) => {
            setData(r.data);
        }).catch((e) => {
            alert("Something went wrong")
        })
    }, [])

    useEffect(() => {
        if (id != -1) {
            data[id].status = newStat;
        }
    }, [id]);

    return (
        <div className={s1}>
            <div className='text-right'>
                <span className='text-lg'>Status:</span> <select name="status" id="status" onChange={(e) => setStatus(e.target.value)}
                    className={'border-2 px-2 mb-2 rounded-xl hover:shadow-md cursor-pointer'}
                >
                    {
                        choices.map((e, index) =>
                            <option key={index} value={e} selected={status === e}>{e}</option>
                        )
                    }
                </select>
            </div>
            <table className='rounded-md'>
                <thead>
                    {props.user == "bank" ? <tr>
                        <th className='border p-4 px-4'>{props.handle == "donations" ? "Donor" : "Patient"} Name</th>
                        <th className='border p-2 px-4'>Age</th>
                        <th className='border p-4 px-4'>Blood Group</th>
                        <th className='border p-4 px-4'>Gender</th>
                        <th className='border p-4 px-4'>Units(mL)</th>
                        <th className='border p-4 px-4'>{props.handle == "donations" ? "Disease" : "Reason"}</th>
                        <th className='border p-4 px-4'>Date</th>
                        <th className='border p-4 px-4'>Status</th>
                    </tr> : <tr>
                        <th className='border p-4 px-7'>Units(mL)</th>
                        <th className='border p-2'>{props.handle == "donations" ? "Disease" : "Reason"}</th>
                        <th className='border p-2'>Date</th>
                        <th className='border p-2'>Blood Bank</th>
                        <th className='border p-2'>Status</th>
                    </tr>}
                </thead>
                <tbody>
                    {
                        data.map((e, i) =>
                            props.user == "bank" ? <tr key={i} className={status == "All" ? "" : status != e.status ? "hidden" : ""}>
                                <td className='border underline decoration-dotted underline-offset-4 cursor-pointer p-3' onClick={() => setPopup(i)}>
                                    {props.handle == "donations" ? (e.User?.name || e.user?.name || "Unknown") : (e.name || "Unknown")}
                                </td>
                                <td className='border p-3'>
                                    {props.handle == "donations" ? (e.User?.age || e.user?.age || "N/A") : (e.age || "N/A")}
                                </td>
                                <td className='border p-3'>
                                    {props.handle == "donations" ? (e.User?.bloodGroup || e.user?.bloodGroup || "N/A") : (e.bloodGroup || "N/A")}
                                </td>
                                <td className='border p-3'>
                                    {props.handle == "donations" ?
                                        (e.User?.gender || e.user?.gender || "Unknown").charAt(0).toUpperCase() + (e.User?.gender || e.user?.gender || "Unknown").slice(1) :
                                        (e.gender ? e.gender.charAt(0).toUpperCase() + e.gender.slice(1) : "Unknown")
                                    }
                                </td>
                                <td className='border p-3'>{e.units}</td>
                                <td className='border p-3'>{props.handle == "donations" ? (e.disease ? e.disease : "---") : (e.reason ? e.reason : "---")}</td>
                                <td className='border p-3'>
                                    {(() => {
                                        try {
                                            const d = new Date(e.date);
                                            return (
                                                <>
                                                    {d.toLocaleDateString()}<br />
                                                    <code><small>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></code>
                                                </>
                                            );
                                        } catch (err) {
                                            return e.date || "---";
                                        }
                                    })()}
                                </td>
                                <td className='border p-3'>
                                    <Status status={status == "All" ? e.status : status} id={e.id} i={i} setId={setId} units={e.units} bloodGroup={props.handle == "donations" ? (e.User?.bloodGroup || e.user?.bloodGroup) : e.bloodGroup} setStatus={setnewStat} handle={props.handle} />
                                </td>
                            </tr> : <tr key={i} className={status == "All" ? "" : status != e.status ? "hidden" : ""}>
                                <td className='border p-3'>{e.units}</td>
                                <td className='border p-3'>{props.handle == "donations" ? (e.disease ? e.disease : "---") : (e.reason ? e.reason : "---")}</td>
                                <td className='border p-3'>
                                    {(() => {
                                        try {
                                            const d = new Date(e.date);
                                            return (
                                                <>
                                                    {d.toLocaleDateString()}<br />
                                                    <code><small>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></code>
                                                </>
                                            );
                                        } catch (err) {
                                            return e.date || "---";
                                        }
                                    })()}
                                </td>
                                <td className='border p-3 cursor-pointer underline decoration-dotted underline-offset-4' onClick={() => setPopup(i)}>
                                    {e.BloodBank?.name || e.bloodBank?.name || "Unknown Bank"}
                                </td>
                                <td className='border p-3'><span className={(e.status == "Pending" ? "border-metal text-metal" : (e.status == "Approved" ? "border-yellowX text-yellowX " : (e.status == "Denied" ? "border-red text-red" : "border-green text-green"))) + ' border-2 px-4 py-2 rounded-xl hover:shadow-md'}>{e.status}</span></td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <Popup popup={popup} setPopup={setPopup} data={popup == -1 ? [] : props.user == "bank" ? (data[popup].User || data[popup].user) : (data[popup].BloodBank || data[popup].bloodBank)} handle={props.user == "bank" ? "User" : "Blood Bank"} />
        </div>
    )
}

export default History
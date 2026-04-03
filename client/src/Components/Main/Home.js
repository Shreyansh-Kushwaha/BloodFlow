import React from 'react'
import bg from "../../assets/bg.webp";
import bg2 from "../../assets/bg2.jpg";
import donationFact from "../../assets/donationFact.webp"
import g1 from "../../assets/donation/g1.jpg"
import g2 from "../../assets/donation/g2.jpg"
import g3 from "../../assets/donation/g3.jpg"
import g4 from "../../assets/donation/g4.jpg"

const Home = () => {
    const temp = [
        { blood: "A+", donate: "A+ AB+", recieve: "A+ A- O+ O-" },
        { blood: "O+", donate: "O+ A+ B+ AB+", recieve: "O+ O-" },
        { blood: "B+", donate: "B+ AB+", recieve: "B+ B- O+ O-" },
        { blood: "AB+", donate: "AB+", recieve: "Everyone" },
        { blood: "A-", donate: "A+ A- AB+ AB-", recieve: "A- O-" },
        { blood: "O-", donate: "Everyone", recieve: "O-" },
        { blood: "B-", donate: "B+ B- AB+ AB-", recieve: "B- O-" },
        { blood: "AB-", donate: "AB+ AB-", recieve: "AB- A- B- O-" }
    ];

    const temp2 = [
        { 
            title: "Registration", 
            img: g1,
            desc: "You will sign in, show your ID, and read the required information. Then, you will complete a private and confidential questionnaire about your health history and recent travel to ensure donor safety."
        },
        { 
            title: "Health Screening", 
            img: g2,
            desc: "A trained staff member will give you a quick mini-physical. They will check your temperature, blood pressure, pulse, and hemoglobin levels to ensure it is completely safe for you to donate blood today."
        },
        { 
            title: "The Donation", 
            img: g3,
            desc: "The actual donation takes only about 8-10 minutes. Your arm will be cleansed, and a brand new, sterile needle will be used to safely collect about one pint of whole blood."
        },
        { 
            title: "Refresh & Save Lives", 
            img: g4,
            desc: "After donating, you will relax for 10-15 minutes and enjoy some snacks and drinks to replenish your fluids. Your single donation will be processed and can safely save up to three lives!"
        },
    ];

    return (
        <div className="dark:text-white-900">
            <img src={bg} alt="" />
            <div className='grid grid-cols-2 place-items-center mt-6 px-52'>
                <div>
                    <img draggable={false} src={bg2} width="100%" alt="" />
                </div>
                <div>
                    <p className='text-center font-bold text-4xl text-gray-dark dark:text-white-900'>
                        Be the reason <br />for <br />someone's heartbeat
                    </p>
                </div>
            </div>
            <h1 className='font-bold text-center text-blood my-4 text-lg underline'>Learn About Donation</h1>
            <div className='flex px-20'>
                <div>
                    <img src={donationFact} width="90%" alt="" />
                    <p className='text-center mt-2'>
                        <code>After donating blood, the body works to replenish the blood loss. This stimulates the production of new blood cells and in turn, helps in maintaining good health.</code>
                    </p>
                </div>
                <div>
                    <table className='w-max' cellPadding={5}>
                        <thead>
                            <tr>
                                <td colSpan={3} className="border bg-blood text-white-900 text-center font-bold">Compatible Blood Type Donors</td>
                            </tr>
                            <tr>
                                <th className='border w-max text-lg'>Blood Type</th>
                                <th className='border w-max text-lg'>Donate Blood To</th>
                                <th className='border w-max text-lg'>Receive Blood From</th>
                            </tr>
                        </thead>
                        <tbody>
                            {temp.map((e, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='border w-max text-lg font-semibold'>{e.blood}</td>
                                        <td className='border w-max text-lg'>{e.donate}</td>
                                        <td className='border w-max text-lg'>{e.recieve}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className='text-xl underline font-bold text-blood text-center mt-8 mb-5'>
                Blood Donation Process
            </p>
            <div className='grid grid-cols-2 place-items-center gap-4 px-10'>
                {temp2.map((e, i) =>
                    <div key={i} className='border border-metal shadow-md rounded-lg overflow-hidden max-w-[90%] select-none grid grid-cols-2 bg-white-900 dark:bg-gray-bg'>
                        <div><img src={e.img} draggable={false} width="100%" height="100%" style={{objectFit: "cover"}} alt={e.title} /></div>
                        <div className='m-4 flex flex-col justify-center'>
                            <h1 className='font-bold text-lg text-midnight dark:text-white-900 mb-2'>{i + 1} - {e.title}</h1>
                            <p className='text-justify text-sm leading-relaxed'>{e.desc}</p>
                        </div>
                    </div>
                )}
            </div>
            <br />
            <div className='w-full bg-blood text-white-900 h-max py-2 text-sm text-center font-bold'>
                <code>ॐ BloodFlow @ {new Date().getFullYear()} ॐ || Made with ❤️ by Shreyansh</code>
            </div>
        </div>
    )
}

export default Home
import React from 'react'
import g1 from "../../assets/donation/g1.jpg"
import g2 from "../../assets/donation/g2.jpg"
import g3 from "../../assets/donation/g3.jpg"
import g4 from "../../assets/donation/g4.jpg"

const AboutDonation = () => {
    const data = [
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
    ]
    
    return (
        <section className="grid place-items-center dark:text-white-900 pb-12">
            <div className="container">
                <div className="text-center"><br />
                    <h2 className='text-3xl font-bold'>Donation Process</h2>
                    <code>The donation process from the time you arrive at the center until the time you leave</code><br /><br />
                </div>
                <div className='grid grid-cols-4 place-items-stretch gap-5 px-6'>
                    {data.map((e, i) =>
                        <div key={i} className='border border-metal shadow-md rounded-lg overflow-hidden w-full select-none flex flex-col bg-white-900 dark:bg-gray-bg'>
                            <img src={e.img} draggable={false} className="w-full h-48 object-cover" alt={e.title} />
                            <div className='m-4 flex-grow'>
                                <h1 className='font-bold text-lg text-midnight dark:text-white-900 mb-2'>{i + 1} - {e.title}</h1>
                                <p className='text-justify text-sm leading-relaxed'>{e.desc}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AboutDonation
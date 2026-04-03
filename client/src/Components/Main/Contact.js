import React from 'react'
import cc from "../../assets/cc.png"

const Contact = () => {
    const data = [
        {
            title: "Technical Support (For when things go batty) 🦇", 
            body: [
                "Address: 127.0.0.1 (There is no place like localhost)",
                "Phone: +91-800-B-POSITIVE",
                "Email: bugs@bloodflow.network (I respond faster if you send virtual pizza 🍕)"
            ]
        },
        {
            title: "Partnerships & Collaborations 🤝", 
            body: [
                "HQ: A dimly lit room powered entirely by caffeine and React Hooks",
                "Owl Post: Send your letters via Hedwig to the highest server rack",
                "Email: Dracula's day-shift manager handles these."
            ]
        },
        { 
            title: "General Inquiries & Friendly Chats 💬", 
            body: [
                "Carrier Pigeon: Fly them towards the AWS Cloud ☁️",
                "Telepathy: Just close your eyes and think really hard about BloodFlow",
                "Or just ping us on GitHub, let's be honest, we live there anyway."
            ] 
        }
    ];

    return (
        <div className='px-64'><br />
            <h1 className='text-center text-3xl font-bold'>Contact Details</h1><br />
            <div className='flex justify-around'>
                <div className='mt-8'>
                    {
                        data.map((e, index) => {
                            return (
                                <div key={index} className="mb-6">
                                    <p className='text-xl font-bold underline'>{e.title}</p><br />
                                    <code>
                                        {e.body.map((k, i) => {
                                            return <p key={i} className='text-md leading-7'>{k}</p>
                                        })}
                                    </code><br />
                                </div>
                            )
                        })
                    }
                </div>
                <div>
                    <img src={cc} draggable={false} width="90%" alt="Contact Us Illustration" />
                </div>
            </div>
        </div>
    )
}

export default Contact
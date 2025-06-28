import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import './Voltar.css'


export default function Voltar() {
    return (
        <div className='voltar-container'>
           <span> <IoIosArrowRoundBack size={50}/> Voltar </span>
        </div>
    )
}

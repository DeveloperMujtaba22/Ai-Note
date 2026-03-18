import React from 'react'
import logo from "../assets/logo.png"


const Footer = () => {
  return (
    <motion.div>
        <div>
            <motion.div>
                <div>
                    <img src={logo} alt="" />
                    <span>ExamNotes <span>AI</span></span>
                </div>
                <p>ExamNote AI helps students generate </p>
            </motion.div>
        </div>
    </motion.div>
  )
}

export default Footer
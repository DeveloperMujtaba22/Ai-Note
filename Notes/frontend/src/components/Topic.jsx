import React, { useState } from 'react'
import { motion } from "motion/react"



const Topic = ({setResult, setLoading, loading , setError }) => {
    const [topic, setTopic] = useState("");
    const [classLevel, setClassLevel] = useState("");
    const [examType, setExamType] = useState("");
    const [revisionMode, setRevisionMode] = useState(false);
    const [includeDiagram, setIncludeDiagram] = useState(false);
    const [includeChart, setIncludeChart] = useState(false);

  return (
    <motion.div>
        <input type="text" className='' placeholder='Enter topic (e.g. Web Development) ' onChange={(e) =>setTopic(e.target.value)} value={topic} />

        <input type="text" className='' placeholder='Class / Level (e.g Class 10) ' onChange={(e) =>setClassLevel(e.target.value)} value={classLevel} />

        <input type="text" className='' placeholder='Enter Type (e.g. CBSE , JEE , NEET) ' onChange={(e) =>setExamType(e.target.value)} value={examType} />

        <div>
            <Toggle label="revisionMode" checked={revisionMode} onChange={()=>setRevisionMode(!revisionMode)}/>
                <Toggle label="Include Diagram" checked={includeDiagram} onChange={() => setIncludeDiagram(!includeDiagram)}/>
                    <Toggle label="Include Chart" checked={includeChart} onChange={()=>setIncludeChart(!setIncludeChart)}/>
        </div>
        <motion.button>
            {loading ? "Generating Notes..." : "Generate Notes"}
        </motion.button>

    </motion.div>

  )
}

function Toggle({label,checked , onChange}){
    return(
        <div className='flex items-center gap-4 cursor-pointer select-none' onClick={onChange}>
            <motion.div>
                <motion.div>
                    <span>{label}</span>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Topic
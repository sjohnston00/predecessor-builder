import React, { useState } from "react"
import NumberCheckbox from "~/components/NumberCheckbox"

export default function Index() {
  const LEVELS = 18
  const ogSkillToggle = {
    toggled: false,
    locked: false,
  }
  const originalSkills = {
    q: Array(LEVELS).fill(ogSkillToggle),
    e: Array(LEVELS).fill(ogSkillToggle),
    rightClick: Array(LEVELS).fill(ogSkillToggle),
    r: Array(LEVELS).fill(ogSkillToggle),
  }
  const [skills, setSkills] = useState<any>(originalSkills)
  const [render, setRender] = useState(false)

  return (
    <>
      <div className="flex w-fit m-auto flex-col justify-center items-center">
        <h1 className="text-5xl mb-8 font-bold tracking-wide self-start">
          Skill Order
        </h1>
        <div className="flex">
          <div className="w-40"></div>
          <div className="flex mb-2 gap-3 w-[780px]">
            {Array(18)
              .fill(undefined)
              .map((a, index) => (
                <span key={`skill-column-${index}`} className="w-8 text-center">
                  {index + 1}
                </span>
              ))}
          </div>
        </div>
        {Object.entries(skills).map(([key]) => (
          <div className="flex mb-3" key={`skill-${key}`}>
            <span className="w-40">{key}</span>
            <div className="flex gap-3">
              {skills[key].map((skill, i) => (
                <NumberCheckbox
                  key={`skill-${key}-${i}`}
                  skillsKey={key}
                  skills={skills}
                  setSkills={setSkills}
                  index={i}
                  render={render}
                  setRender={setRender}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <button className="p-2 rounded bg-indigo-500 text-white mt-2 disabled:opacity-30 transition">
            Submit
          </button>
          <button
            className="p-2 rounded bg-pink-500 text-white mt-2 disabled:opacity-30 transition"
            onClick={() => setSkills(originalSkills)}>
            Reset
          </button>
        </div>
      </div>
      <pre className="w-1/2">{JSON.stringify(skills, null, 2)}</pre>
    </>
  )
}

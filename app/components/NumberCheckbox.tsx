import React from "react"

type NumberCheckboxProps = {
  index: number
  displayNumber?: boolean
  skills: any
  setSkills: React.Dispatch<any>
  skillsKey: string
  render: boolean
  setRender: React.Dispatch<boolean>
}

export default function NumberCheckbox({
  index,
  displayNumber = true,
  setSkills,
  skills,
  skillsKey,
  render,
  setRender,
}: NumberCheckboxProps) {
  const skill = skills[skillsKey][index]
  const checked = skill.toggled
  const locked = skill.locked
  return (
    <button
      onClick={() => {
        const keys = Object.keys(skills).filter((key) => key !== skillsKey)
        const clone = skills
        const skillIndexVal = clone[skillsKey][index].toggled

        keys.forEach((key) => {
          clone[key][index] = {
            toggled: false,
            locked: !skillIndexVal,
          }
        })

        clone[skillsKey][index] = { toggled: !skillIndexVal, locked: false }
        setSkills(clone)
        setRender(!render)
      }}
      className={`flex justify-center items-center w-6 h-6 text-center shadow-sm rounded p-4 transition  ${
        checked
          ? "bg-indigo-500 text-white"
          : locked
          ? "bg-slate-200 text-slate-200"
          : "bg-slate-400 text-slate-400"
      }`}>
      {displayNumber ? index + 1 : null}
    </button>
  )
}

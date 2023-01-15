import React from "react";
import {
  checkAbilityMaxed,
  getAllOtherKeys,
  lockOtherSkillsForIndex
} from "~/utils";

type NumberCheckboxProps = {
  index: number;
  displayNumber?: boolean;
  skills: any;
  setSkills: React.Dispatch<any>;
  skillsKey: string;
  render: boolean;
  setRender: React.Dispatch<boolean>;
};

export default function NumberCheckbox({
  index,
  displayNumber = true,
  setSkills,
  skills,
  skillsKey,
  render,
  setRender
}: NumberCheckboxProps) {
  const skill = skills[skillsKey][index];
  const checked = skill.toggled;
  const locked = skill.locked;
  return (
    <button
      type='button'
      onClick={() => {
        const keys = getAllOtherKeys(skillsKey, skills);
        const clone = skills;
        const skillIndexVal = clone[skillsKey][index].toggled;

        lockOtherSkillsForIndex(keys, clone, index);

        const abilityCount = clone[skillsKey].filter(
          (level) => level.toggled === true
        ).length;
        if (checkAbilityMaxed(skillsKey, abilityCount)) {
          alert(`ability: "${skillsKey}" has already been maxed out`);
          return;
        }

        clone[skillsKey][index] = { toggled: !skillIndexVal, locked: false };
        setSkills(clone);
        setRender(!render);
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
  );
}

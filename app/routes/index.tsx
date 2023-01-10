import React, { useState } from "react";
import NumberCheckbox from "~/components/NumberCheckbox";
import useKeypress from "react-use-keypress";
import {
  checkAbilityMaxed,
  getAllOtherKeys,
  lockOtherSkillsForIndex
} from "~/utils";

export default function Index() {
  useKeypress(["q", "e", "r", "t", "Backspace"], ({ key }) => {
    console.log(
      "TODO: Move this functionality to function to use in NumberCheckbox component"
    );
    console.log("TODO: Lock all other ability for this index");
    console.log("TODO: Fix bug of index 0");
    let ability = key;
    if (key === "t") {
      ability = "rightClick";
    }

    if (key === "Backspace") {
      console.log("Set the last instance of true to ogSkillToggle");
      return;
    }

    const nextQIndex = lastUntoggledIndex() + 1;

    if (nextQIndex >= LEVELS) return;

    const clone = skills;

    const keys = getAllOtherKeys(ability, clone);
    lockOtherSkillsForIndex(keys, clone, nextQIndex);

    const abilityCount = levels.filter((level) => level === ability).length;
    checkAbilityMaxed(ability, abilityCount);

    clone[ability][nextQIndex] = {
      toggled: true,
      locked: false
    };
    setSkills(clone);
    setRender(!render);
  });
  const LEVELS = 18;
  const ogSkillToggle = {
    toggled: false,
    locked: false
  };
  const originalSkills = {
    q: Array(LEVELS).fill(ogSkillToggle),
    e: Array(LEVELS).fill(ogSkillToggle),
    rightClick: Array(LEVELS).fill(ogSkillToggle),
    r: Array(LEVELS).fill(ogSkillToggle)
  };
  const [skills, setSkills] = useState<any>(originalSkills);
  const [render, setRender] = useState(false);

  const levels = Array(LEVELS).fill(undefined);
  Object.entries(skills).forEach(([key]) => {
    skills[key].forEach((skillLevel, index) =>
      skillLevel.toggled ? (levels[index] = key) : null
    );
  });
  const levelsIncomplete = levels.includes(undefined);

  const lastUntoggledIndex = () => {
    let index = 0;
    Object.entries(skills).forEach(([key]) => {
      const abilities = skills[key].map((skill) => skill.toggled);
      const lastIndex = abilities.lastIndexOf(true);
      if (lastIndex > index) {
        index = lastIndex;
      }
    });
    return index;
  };

  const calcLevels = () => {
    if (levelsIncomplete) {
      alert("You must add every level before submitting");
      return;
    }
    console.log(levels);
  };

  return (
    <>
      <div className='flex w-fit m-auto flex-col justify-center items-center'>
        <h1 className='text-5xl mb-4 font-bold tracking-wide self-start'>
          Skill Order
          <span className='block text-sm font-normal opacity-50 mt-4'>
            (Pressing the skill key will add to the skill order and backspace
            will remove the last one (try pressing 'q', then 'backspace'))
          </span>
        </h1>
        <div className='flex'>
          <div className='w-40'></div>
          <div className='flex mb-2 gap-3'>
            {Array(LEVELS)
              .fill(undefined)
              .map((a, index) => (
                <span
                  key={`skill-column-${index}`}
                  className='h-8 w-8 text-center rounded'>
                  {index + 1}
                </span>
              ))}
          </div>
        </div>
        {Object.entries(skills).map(([key]) => (
          <div className='flex mb-3' key={`skill-${key}`}>
            <span className='w-40'>{key}</span>
            <div className='flex gap-3'>
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
        <div className='flex gap-2'>
          <button
            className='p-2 rounded bg-indigo-500 text-white mt-2 disabled:opacity-30 transition'
            onClick={calcLevels}
            disabled={levelsIncomplete}>
            Submit
          </button>
          <button
            className='p-2 rounded bg-pink-500 text-white mt-2 disabled:opacity-30 transition'
            onClick={() => setSkills(originalSkills)}>
            Reset
          </button>
        </div>
      </div>
      <pre className='w-1/2'>{JSON.stringify(skills, null, 2)}</pre>
    </>
  );
}

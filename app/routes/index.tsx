import React, { useState } from "react";
import NumberCheckbox from "~/components/NumberCheckbox";
import useKeypress from "react-use-keypress";
import {
  checkAbilityMaxed,
  getAllOtherKeys,
  lockOtherSkillsForIndex
} from "~/utils";
import { Form, useLoaderData } from "@remix-run/react";
import { ActionArgs, redirect } from "@remix-run/node";

export const loader = async () => {
  return {
    heroes: [
      "Dekker",
      "Lt. Bellica",
      "Gideon",
      "The Fey",
      "Feng Mao",
      "Drongo",
      "Sparrow",
      "Murdock",
      "Muriel",
      "Narbash",
      "Countess",
      "Khaimera",
      "Kalari",
      "Rampage",
      "Grux",
      "Steel",
      "Gadget",
      "Howitser",
      "Riktor"
    ]
  };
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const levels = JSON.parse(data.skillOrder.toString());
  const hero = data.hero.toString().toLowerCase().replace(" ", "-");

  //TODO: save the build to db
  //TODO: be able to load build from db
  //TODO: create route for /builds/gideon-[name]-[number]
  //TODO: once saved redirect user to /builds/gideon-[name]-[number]
  // return { hero, levels };
  return redirect(`/builds/${hero}`);
};

export default function Index() {
  const { heroes } = useLoaderData<typeof loader>();
  useKeypress(["q", "e", "r", "t", "Backspace"], ({ key }) => {
    let ability = key;
    if (key === "t") {
      ability = "rightClick";
    }

    if (key === "Backspace") {
      console.log("Set the last instance of true to ogSkillToggle");
      return;
    }

    const lastIndex = lastToggledIndex();
    const nextQIndex = lastIndex === -1 ? 0 : lastIndex + 1; //if none is toggle this will return -1 so we start with index 0, else we want to go to the next line
    if (nextQIndex >= LEVELS) return;

    const clone = skills;

    const keys = getAllOtherKeys(ability, clone);
    lockOtherSkillsForIndex(keys, clone, nextQIndex);

    const abilityCount = levels.filter((level) => level === ability).length;

    if (checkAbilityMaxed(ability, abilityCount)) {
      alert(`ability: "${ability}" has already been maxed out`);
      return;
    }

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

  const lastToggledIndex = () => {
    let index = -1;
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
  };

  const smallSkillSize = `w-16 h-16`;
  const skillPointSize = `w-3 h-3`;
  const ultSkillSize = `w-32 h-32`;

  return (
    <>
      <div className='flex w-fit m-auto flex-col justify-center items-center'>
        <h1 className='text-5xl mb-4 font-bold tracking-wide self-start'>
          New Build
        </h1>
        <Form method='post'>
          <div className='self-start mb-4'>
            <label htmlFor='hero' className='block'>
              Hero
            </label>
            <select name='hero' id='hero' className='p-2 border'>
              {heroes.map((hero) => (
                <option key={hero} value={hero}>
                  {hero}
                </option>
              ))}
            </select>
          </div>
          <h2 className='text-3xl mb-4 font-bold tracking-wide self-start'>
            Skill Order
            <span className='block text-sm font-normal opacity-50 mt-4'>
              (Pressing the skill key will add to the skill order and backspace
              will remove the last one (try pressing 'q', then 'backspace'))
            </span>
          </h2>
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
              <span className='w-40'>
                {key === "rightClick" ? `${key} (t)` : key}
              </span>
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
            <input
              type='hidden'
              name='skillOrder'
              id='skillOrder'
              value={JSON.stringify(levels)}
            />
            <button
              type='submit'
              className='p-2 rounded bg-indigo-500 text-white mt-2 disabled:opacity-30 transition'
              // onClick={calcLevels}
              disabled={levelsIncomplete}>
              Submit
            </button>
            <button
              className='p-2 rounded bg-pink-500 text-white mt-2 disabled:opacity-30 transition'
              onClick={() => setSkills(originalSkills)}>
              Reset
            </button>
          </div>
        </Form>
      </div>
      <div className='flex justify-center my-24 gap-8 items-end'>
        <div className='flex flex-col gap-8 justify-center items-center'>
          <div
            className={`${smallSkillSize} bg-slate-900 bg-opacity-70 rotate-45 flex justify-center items-center`}>
            <span className='-rotate-45 text-lg text-white'>Q</span>
          </div>
          <div className='flex gap-2.5'>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
          </div>
        </div>
        <div className='flex flex-col gap-8 justify-center items-center'>
          <div
            className={`${smallSkillSize} bg-slate-900 bg-opacity-70 rotate-45 flex justify-center items-center`}>
            <span className='-rotate-45 text-lg text-white'>E</span>
          </div>
          <div className='flex gap-2.5'>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
          </div>
        </div>
        <div className='flex flex-col gap-10 justify-center items-center'>
          <div
            className={`${ultSkillSize} bg-slate-900 bg-opacity-70 rotate-45 flex justify-center items-center`}>
            <span className='-rotate-45 text-lg text-white'>R</span>
          </div>
          <div className='flex gap-2.5'>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
          </div>
        </div>
        <div className='flex flex-col gap-8 justify-center items-center'>
          <div
            className={`${smallSkillSize} bg-slate-900 bg-opacity-70 rotate-45 flex justify-center items-center`}>
            <span className='-rotate-45 text-lg text-white'>L Clck</span>
          </div>
          <div className='flex gap-2.5'>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
          </div>
        </div>
        <div className='flex flex-col gap-8 justify-center items-center'>
          <div
            className={`${smallSkillSize} bg-slate-900 bg-opacity-70 rotate-45 flex justify-center items-center`}>
            <span className='-rotate-45 text-lg text-white'>R Clck</span>
          </div>
          <div className='flex gap-2.5'>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
            <div
              className={`${skillPointSize} bg-slate-900 bg-opacity-10 rotate-45 flex justify-center items-center`}></div>
          </div>
        </div>
      </div>
      <pre className='w-1/2'>{JSON.stringify(skills, null, 2)}</pre>
    </>
  );
}

import React, { useState, useRef } from "react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import useKeypress from "react-use-keypress";
import {
  checkAbilityMaxed,
  getAllOtherKeys,
  lockOtherSkillsForIndex
} from "~/utils";
import NumberCheckbox from "~/components/NumberCheckbox";
import { getUserId } from "~/utils/session.server";
import Input from "~/components/Input";
import Select from "~/components/Select";
import Heading from "~/components/Heading";

export const loader = async () => {
  const heroes = await prisma.hero.findMany();
  return {
    heroes
  };
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const levels = JSON.parse(data.skillOrder.toString()) as string[];
  const heroName = data.hero.toString();
  const buildName = data.name.toString();
  const loggedInUserId = await getUserId(request);
  const hero = await prisma.hero.findFirst({
    where: {
      name: {
        equals: heroName,
        mode: "insensitive"
      }
    }
  });

  if (!hero) {
    return {
      message: `Couldn't find a hero with name "${heroName}"`
    };
  }

  const newBuild = await prisma.build.create({
    data: {
      name: buildName || "No Name",
      abilityOrder: levels,
      heroId: hero.heroId,
      userId: loggedInUserId
    }
  });

  throw redirect(`/builds/${heroName}/${newBuild.name}`);
};

export default function NewBuild() {
  const buildNameRef = useRef<HTMLInputElement>(null);
  const { heroes } = useLoaderData<typeof loader>();
  useKeypress(["q", "e", "r", "t", "Backspace"], ({ key }) => {
    if (document.activeElement === buildNameRef.current) return;

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

  return (
    <>
      <div className='flex w-fit m-auto flex-col justify-center items-center'>
        <Heading type='h1' className='mb-4 self-start'>
          New Build
        </Heading>
        <Form method='post'>
          <div className='self-start mb-4'>
            <label htmlFor='name' className='block'>
              Build Name
            </label>
            <Input
              type='text'
              name='name'
              id='name'
              ref={buildNameRef}
              required
            />
          </div>
          <div className='self-start mb-4'>
            <label htmlFor='hero' className='block'>
              Hero
            </label>
            <Select name='hero' id='hero' required>
              {heroes.map((hero) => (
                <option key={hero.name} value={hero.name}>
                  {hero.name}
                </option>
              ))}
            </Select>
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
              onClick={() => setSkills(originalSkills)}
              type='button'>
              Reset
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}

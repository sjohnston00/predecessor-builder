import { useState } from "react";

export default function Index() {
  const LEVELS = 18;
  const [skills, setSkills] = useState<any>({
    q: Array(LEVELS).fill(undefined),
    e: Array(LEVELS).fill(undefined),
    rightClick: Array(LEVELS).fill(undefined),
    r: Array(LEVELS).fill(undefined)
  });
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <div className='flex'>
        <div className='w-40'></div>
        <div className='flex mb-2 gap-2'>
          {Array(18)
            .fill(undefined)
            .map((a, index) => (
              <span key={`skill-column-${index}`} className='w-4 text-center'>
                {index + 1}
              </span>
            ))}
        </div>
      </div>
      {Object.entries(skills).map(([key]) => (
        <div className='flex mb-2 gap-2' key={key}>
          <span className='w-40'>{key}</span>
          <div className='flex gap-2'>
            {skills[key].map((skill, i) => (
              <>
                <input
                  type='checkbox'
                  className='w-4'
                  key={`${key}-${i}`}
                  name={key}
                  id={key}
                />
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import React from "react";

export default function Index() {
  const smallSkillSize = `w-16 h-16`;
  const skillPointSize = `w-3 h-3`;
  const ultSkillSize = `w-32 h-32`;

  return (
    <>
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
    </>
  );
}

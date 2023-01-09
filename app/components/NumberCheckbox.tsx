import React, { useState } from "react";

type NumberCheckboxProps = {
  n: number;
};

export default function NumberCheckbox({ n }: NumberCheckboxProps) {
  const [checked, setChecked] = useState(false);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={`flex justify-center items-center w-6 h-6 text-center align-middle rounded p-2 transition ${
        checked ? "bg-indigo-500 text-white" : "bg-slate-400 text-slate-400"
      }`}>
      {n}
    </button>
  );
}

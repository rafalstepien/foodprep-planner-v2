import { useState } from "react";

type WeekSetupProps = {
  currentKcal: number;
  currentMeals: number;
  currentDays: number;
  setCurrentKcal: (prev: number) => void;
  setCurrentMeals: (prev: number) => void;
  setCurrentDays: (prev: number) => void;
};

type AdjustableItemProps = {
  currentValue: number;
  label: string;
  inrementDecrementValue: number;
  setNewValue: (prev: number) => void;
};

function AdjustableItem(props: AdjustableItemProps) {
  const roundedButtonClassName =
    "w-10 h-10 flex items-center justify-center rounded-full text-white text-xl font-bold shadow bg-gray-300 hover:bg-gray-400 transition duration-400 transition-colors";

  return (
    <div className="w-1/3 flex rounded items-center justify-center py-10 gap-6">
      <button
        type="submit"
        className={roundedButtonClassName}
        onClick={() =>
          props.setNewValue((prev) => prev + props.inrementDecrementValue)
        }
      >
        +
      </button>
      <div>
        <div className="text-6xl font-inter font-bold">
          {props.currentValue}
        </div>
        <div className="flex items-center justify-center">{props.label}</div>
      </div>

      <button
        type="submit"
        className={roundedButtonClassName}
        onClick={() =>
          props.setNewValue((prev) => prev - props.inrementDecrementValue)
        }
      >
        -
      </button>
    </div>
  );
}

export default function WeekSetup(props: WeekSetupProps) {
  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md flex flex-col gap-2">
      <div className="w-full items-left flex flex-row gap-4">
        <h2 className="text-lg font-bold text-gray-800 text-left">
          Set your goal
        </h2>
      </div>

      <div className="w-full flex flex-row justify-center items-center gap-8">
        <AdjustableItem
          label={"Calories"}
          currentValue={props.currentKcal}
          inrementDecrementValue={100}
          setNewValue={props.setCurrentKcal}
        />
        <AdjustableItem
          label={"Meals"}
          currentValue={props.currentMeals}
          inrementDecrementValue={1}
          setNewValue={props.setCurrentMeals}
        />
        <AdjustableItem
          label={"Days"}
          currentValue={props.currentDays}
          inrementDecrementValue={1}
          setNewValue={props.setCurrentDays}
        />
      </div>
    </div>
  );
}

import type { SetupData } from "./Types";

type WeekSetupProps = {
  setupData: SetupData;
  setSetupData: React.Dispatch<React.SetStateAction<SetupData>>;
};

export default function WeekSetup(props: WeekSetupProps) {
  const colorDays = "#E45A92";
  const colorMeals = "#5D2F77";
  const colorKcal = "#3E1E68";

  const roundedButtonClassName = `w-10 h-10 flex items-center justify-center rounded-full text-white text-xl font-bold shadow bg-gray-300 hover:bg-gray-400 transition duration-400 transition-colors`;

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md flex flex-col gap-2">
      <div className="w-full items-left flex flex-row gap-4">
        <h2 className="text-lg font-bold text-gray-800 text-left">
          Set your goal
        </h2>
      </div>

      <div className="w-full flex flex-row justify-center items-center gap-8">
        <div className="w-1/3 flex rounded items-center justify-center py-10 gap-6">
          <button
            type="submit"
            className={roundedButtonClassName}
            onClick={() =>
              props.setSetupData((prev: SetupData) => {
                return {
                  numberOfKcal: prev.numberOfKcal + 100,
                  numberOfDays: prev.numberOfDays,
                  numberOfMeals: prev.numberOfMeals,
                };
              })
            }
          >
            +
          </button>
          <div>
            <div
              className={`text-6xl font-inter font-bold text-[${colorKcal}]`}
            >
              {props.setupData.numberOfKcal}
            </div>
            <div
              className={`flex items-center justify-center text-[${colorKcal}]`}
            >
              Calories
            </div>
          </div>

          <button
            type="submit"
            className={roundedButtonClassName}
            onClick={() =>
              props.setSetupData((prev: SetupData) => {
                return {
                  numberOfKcal: prev.numberOfKcal - 100,
                  numberOfDays: prev.numberOfDays,
                  numberOfMeals: prev.numberOfMeals,
                };
              })
            }
          >
            -
          </button>
        </div>
        <div className="w-1/3 flex rounded items-center justify-center py-10 gap-6">
          <button
            type="submit"
            className={roundedButtonClassName}
            onClick={() =>
              props.setSetupData((prev: SetupData) => {
                return {
                  numberOfKcal: prev.numberOfKcal,
                  numberOfDays: prev.numberOfDays,
                  numberOfMeals: prev.numberOfMeals + 1,
                };
              })
            }
          >
            +
          </button>
          <div>
            <div
              className={`text-6xl font-inter font-bold text-[${colorMeals}]`}
            >
              {props.setupData.numberOfMeals}
            </div>
            <div
              className={`flex items-center justify-center text-[${colorMeals}]`}
            >
              Meals
            </div>
          </div>

          <button
            type="submit"
            className={roundedButtonClassName}
            onClick={() =>
              props.setSetupData((prev: SetupData) => {
                return {
                  numberOfKcal: prev.numberOfKcal,
                  numberOfDays: prev.numberOfDays,
                  numberOfMeals: prev.numberOfMeals - 1,
                };
              })
            }
          >
            -
          </button>
        </div>
        <div className="w-1/3 flex rounded items-center justify-center py-10 gap-6">
          <button
            type="submit"
            className={roundedButtonClassName}
            onClick={() =>
              props.setSetupData((prev: SetupData) => {
                return {
                  numberOfKcal: prev.numberOfKcal,
                  numberOfDays: prev.numberOfDays + 1,
                  numberOfMeals: prev.numberOfMeals,
                };
              })
            }
          >
            +
          </button>
          <div>
            <div
              className={`text-6xl font-inter font-bold text-[${colorDays}]`}
            >
              {props.setupData.numberOfDays}
            </div>
            <div
              className={`flex items-center justify-center text-[${colorDays}]`}
            >
              Days
            </div>
          </div>

          <button
            type="submit"
            className={roundedButtonClassName}
            onClick={() =>
              props.setSetupData((prev: SetupData) => {
                return {
                  numberOfKcal: prev.numberOfKcal,
                  numberOfDays: prev.numberOfDays - 1,
                  numberOfMeals: prev.numberOfMeals,
                };
              })
            }
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}

import Select, { SingleValue } from "react-select";

interface Option {
  value: number;
  label: string;
}

type AddMealInputProps = {
  selectOptions: Option[];
  setSelectedOption: (option: SingleValue<Option>) => void;
  addMeal: (e: React.FormEvent) => void;
};

export default function AddMealInput(props: AddMealInputProps) {
  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md flex flex-col gap-2">
      <div className="grid gap-3 mb-1 md:grid-cols-2">
        <Select
          options={props.selectOptions}
          onChange={(option: SingleValue<Option>) =>
            props.setSelectedOption(option)
          }
        />
        <button
          type="submit"
          onClick={props.addMeal}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Meal
        </button>
      </div>
    </div>
  );
}

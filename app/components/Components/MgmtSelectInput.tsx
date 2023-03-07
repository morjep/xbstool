export const MgmtSelectInput = ({
  name,
  nameInput,
  placeholderInput,
  placeholderSelect,
  action,
  options,
  buttonName,
}: {
  name: string;
  nameInput: string;
  placeholderInput: string;
  placeholderSelect: string;
  action: string;
  options: string[];
  buttonName: string;
}) => {
  return (
    <div className="pt-6 pb-16 flex flex-row">
      <div className="pb-4">
        <select className="select select-bordered w-72" name={name}>
          <option disabled selected>
            {placeholderSelect}
          </option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="w-72 px-2">
        <input
          type="text"
          name={nameInput}
          placeholder={placeholderInput}
          className="input input-bordered w-full"
        />
      </div>
      <button
        type="submit"
        className="btn bg-primary text-primary-content w-32"
        name="action"
        value={action}
      >
        {buttonName}
      </button>{" "}
    </div>
  );
};

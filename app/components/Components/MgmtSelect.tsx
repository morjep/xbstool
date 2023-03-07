export const MgmtSelect = ({
  name,
  placeholderSelect,
  action,
  options,
  buttonName,
}: {
  name: string;
  placeholderSelect: string;
  action: string;
  options: string[];
  buttonName: string;
}) => {
  return (
    <div className="pt-6 pb-16 flex flex-row">
      <div className="px-4">
        <select className="select select-bordered w-72" name={name}>
          <option disabled selected>
            {placeholderSelect}
          </option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
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

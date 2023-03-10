export const MgmtContainer = ({ children }: { children: any }) => {
  return <div className="pt-6 pb-16 flex flex-row">{children}</div>;
};

export const MgmtContainerInput = ({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) => {
  return (
    <div className="w-72 px-2">
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="input input-bordered w-full"
      />
    </div>
  );
};

export const MgmtContainerButton = ({
  action,
  buttonName,
}: {
  action: string;
  buttonName: string;
}) => {
  return (
    <div className="px-2">
      <button
        type="submit"
        className="btn bg-primary text-primary-content w-32"
        name="action"
        value={action}
      >
        {buttonName}
      </button>
    </div>
  );
};

// option is an object with id and name
// options is an array of option objects
export interface Option {
  id: string;
  name: string;
}

export const MgmtContainerSelectId = ({
  name,
  placeholder,
  options,
}: {
  name: string;
  placeholder: string;
  options: Option[];
}) => {
  return (
    <div className="px-2">
      <select className="select select-bordered w-72" name={name}>
        <option disabled selected>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

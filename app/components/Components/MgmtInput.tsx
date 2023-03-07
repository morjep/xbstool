export const MgmtInput = ({
  name,
  placeholder,
  action,
  buttonName,
}: {
  name: string;
  placeholder: string;
  action: string;
  buttonName: string;
}) => {
  return (
    <div className="pt-6 pb-16 flex flex-row">
      <div className="w-72 px-2">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
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

const Box = ({ label }) => {
  return (
    <div className="border border-primary-focus rounded w-40 shadow-md shadow-base-300  bg-base-100">
      <div className="text-center">
        <div className="px-2 py-2">{label}</div>
      </div>{" "}
    </div>
  );
};

const Node = ({ data, children }) => {
  return (
    <div className="indicator">
      {data.indicator == "success" && <span className="indicator-item badge badge-success"></span>}
      {data.indicator == "warning" && <span className="indicator-item badge badge-warning"></span>}
      {data.indicator == "danger" && <span className="indicator-item badge badge-error"></span>}
      {data.due && (
        <span className="indicator-item indicator-top indicator-start badge text-xs badge-accent">
          {data.due}
        </span>
      )}
      <Box label={data.label} />
      {children}
    </div>
  );
};

export default Node;

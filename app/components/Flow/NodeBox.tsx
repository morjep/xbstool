const NodeBox = ({ label }) => {
  return (
    <div className="border border-primary-focus rounded w-40 shadow-md shadow-base-300  bg-base-100">
      <div className="text-center">
        <div className="px-2 py-2">{label}</div>
      </div>{" "}
    </div>
  );
};

export default NodeBox;

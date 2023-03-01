const Box = ({
  label,
  progressBar,
  progressValue,
}: {
  label: string;
  progressBar: boolean;
  progressValue: string;
}) => {
  return (
    <div className="border border-primary-focus rounded w-40 shadow-md shadow-base-300  bg-base-100">
      <div className="text-center">
        <div className="px-2 py-1">{label}</div>
      </div>{" "}
      {progressBar && (
        <progress
          className="progress progress-info w-40 px-4"
          value={progressValue}
          max="100"
        ></progress>
      )}
    </div>
  );
};

const Node = ({ data, children }: { data: any; children: any }) => {
  return (
    <div className="indicator">
      {data.indicator == "success" && (
        <span className="indicator-item badge badge-xs badge-success"></span>
      )}
      {data.indicator == "warning" && (
        <span className="indicator-item badge badge-xs badge-warning"></span>
      )}
      {data.indicator == "error" && (
        <span className="indicator-item badge badge-xs badge-error"></span>
      )}
      {data.due && (
        <span className="indicator-item indicator-top indicator-start badge badge-xs text-xs badge-accent">
          {data.due}
        </span>
      )}
      <Box label={data.label} progressBar={data.progressBar} progressValue={data.progressValue} />

      {children}
    </div>
  );
};

export default Node;

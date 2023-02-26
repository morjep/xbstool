const Indicator = ({ indicator, children }) => {
  return (
    <div className="indicator">
      {indicator == "success" && <span className="indicator-item badge badge-success"></span>}
      {indicator == "warning" && <span className="indicator-item badge badge-warning"></span>}
      {indicator == "danger" && <span className="indicator-item badge badge-error"></span>}
      {children}
    </div>
  );
};

export default Indicator;

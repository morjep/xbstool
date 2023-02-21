import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";

const targetHandleStyle: CSSProperties = {};

const ChildNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  return (
    <>
      <div className="indicator">
        {/* <span className="indicator-item indicator-top indicator-end badge badge-xs badge-primary">
          priority
        </span> */}
        <div className="border border-black rounded w-40 flex justify-left shadow-lg shadow-gray-500 bg-gray-100">
          <div className="grid">
            <div className="px-2 py-2">{data.label}</div>
          </div>
        </div>
        <Handle type="target" position={Position.Left} id="a" style={targetHandleStyle} />
      </div>
    </>
  );
};

export default memo(ChildNode);

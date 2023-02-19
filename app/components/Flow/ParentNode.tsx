import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";

const targetHandleStyle: CSSProperties = {};
const sourceHandleStyle: CSSProperties = { left: 10 };

const ParentNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  return (
    <>
      <div className="border border-black rounded w-40 flex justify-left shadow-lg shadow-gray-500  bg-gray-100">
        <div className="px-2 py-2">{data.label}</div>
      </div>
      <Handle type="target" position={Position.Top} id="t" style={targetHandleStyle} />
      <Handle type="source" position={Position.Bottom} id="b" style={sourceHandleStyle} />
    </>
  );
};

export default memo(ParentNode);

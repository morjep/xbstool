import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";

const sourceHandleStyle: CSSProperties = {};

const TopNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  return (
    <>
      <div className="border border-black rounded w-40 flex justify-center shadow-lg  shadow-gray-500  bg-gray-100">
        <div className="px-2 py-2">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" style={sourceHandleStyle} />
    </>
  );
};

export default memo(TopNode);

import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import Node from "./Node";

const targetHandleStyle: CSSProperties = {};
const sourceHandleStyle: CSSProperties = { left: 10 };
const handleStyle: CSSProperties = { top: 12 };

const ParentNode: FC<NodeProps> = ({ data }) => {
  console.log(data);
  return (
    <>
      <Node data={data}>
        <Handle type="target" position={Position.Left} id="next" style={handleStyle} />
        <Handle type="source" position={Position.Right} id="prev" style={handleStyle} />

        <Handle type="target" position={Position.Top} id="target" style={targetHandleStyle} />
        <Handle type="source" position={Position.Bottom} id="source" style={sourceHandleStyle} />
      </Node>
    </>
  );
};

export default memo(ParentNode);

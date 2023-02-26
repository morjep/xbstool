import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import Node from "./Node";

const targetHandleStyle: CSSProperties = {};
const sourceHandleStyle: CSSProperties = { left: 10 };

const ParentNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  console.log(data);
  return (
    <>
      <Node data={data}>
        <Handle type="target" position={Position.Top} id="t" style={targetHandleStyle} />
        <Handle type="source" position={Position.Bottom} id="b" style={sourceHandleStyle} />
      </Node>
    </>
  );
};

export default memo(ParentNode);

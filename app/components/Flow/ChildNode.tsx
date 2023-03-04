import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import Node from "./Node";

const targetHandleStyle: CSSProperties = {};

const ChildNode: FC<NodeProps> = ({ data }) => {
  return (
    <>
      <Node data={data}>
        <Handle type="target" position={Position.Left} id="target" style={targetHandleStyle} />
      </Node>
    </>
  );
};

export default memo(ChildNode);

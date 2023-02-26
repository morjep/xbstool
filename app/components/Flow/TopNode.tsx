import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import Node from "./Node";

const sourceHandleStyle: CSSProperties = {};

const TopNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  return (
    <>
      <Node data={data}>
        <Handle type="source" position={Position.Bottom} id="a" style={sourceHandleStyle} />
      </Node>
    </>
  );
};

export default memo(TopNode);

import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import NodeBox from "./NodeBox";

const sourceHandleStyle: CSSProperties = {};

const TopNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  return (
    <>
      <NodeBox label={data.label} />
      <Handle type="source" position={Position.Bottom} id="a" style={sourceHandleStyle} />
    </>
  );
};

export default memo(TopNode);

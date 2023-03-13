import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import NodeFlow from "./NodeFlow";

const sourceHandleStyle: CSSProperties = {};

const TopNodeFlow: FC<NodeProps> = ({ data }) => {
  return (
    <>
      <NodeFlow data={data}>
        <Handle type="source" position={Position.Bottom} id="source" style={sourceHandleStyle} />
      </NodeFlow>
    </>
  );
};

export default memo(TopNodeFlow);

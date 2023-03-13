import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import NodeFlow from "./NodeFlow";

const targetHandleStyle: CSSProperties = {};

const ChildNodeFlow: FC<NodeProps> = ({ data }) => {
  return (
    <>
      <NodeFlow data={data}>
        <Handle type="target" position={Position.Left} id="target" style={targetHandleStyle} />
      </NodeFlow>
    </>
  );
};

export default memo(ChildNodeFlow);

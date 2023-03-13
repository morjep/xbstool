import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import NodeFlow from "./NodeFlow";

const targetHandleStyle: CSSProperties = {};
const sourceHandleStyle: CSSProperties = { left: 10 };
const handleStyle: CSSProperties = { top: 12 };

const ParentNodeFlow: FC<NodeProps> = ({ data }) => {
  console.log(data);
  return (
    <>
      <NodeFlow data={data}>
        <Handle type="target" position={Position.Left} id="next" style={handleStyle} />
        <Handle type="source" position={Position.Right} id="prev" style={handleStyle} />

        <Handle type="target" position={Position.Top} id="target" style={targetHandleStyle} />
        <Handle type="source" position={Position.Bottom} id="source" style={sourceHandleStyle} />
      </NodeFlow>
    </>
  );
};

export default memo(ParentNodeFlow);

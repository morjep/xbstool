import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import Indicator from "./Indicator";
import NodeBox from "./NodeBox";

const targetHandleStyle: CSSProperties = {};

const ChildNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  return (
    <>
      <Indicator indicator={data.indicator}>
        <NodeBox label={data.label} />
        <Handle type="target" position={Position.Left} id="a" style={targetHandleStyle} />
      </Indicator>
    </>
  );
};

export default memo(ChildNode);

import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import Indicator from "./Indicator";
import NodeBox from "./NodeBox";

const targetHandleStyle: CSSProperties = {};
const sourceHandleStyle: CSSProperties = { left: 10 };

const ParentNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  console.log(data);
  return (
    <>
      <Indicator indicator={data.indicator}>
        {data.due && (
          <span className="indicator-item indicator-top indicator-start badge text-xs badge-accent">
            {data.due}
          </span>
        )}
        <NodeBox label={data.label} />
        <Handle type="target" position={Position.Top} id="t" style={targetHandleStyle} />
        <Handle type="source" position={Position.Bottom} id="b" style={sourceHandleStyle} />
      </Indicator>
    </>
  );
};

export default memo(ParentNode);

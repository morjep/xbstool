import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import Indicator from "./Indicator";

const targetHandleStyle: CSSProperties = {};
const sourceHandleStyle: CSSProperties = { left: 10 };

const ParentNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  console.log(data);
  return (
    <>
      <Indicator indicator={data.indicator}>
        {data.due && (
          <span className="indicator-item indicator-top indicator-start badge text-xs badge-neutral">
            {data.due}
          </span>
        )}
        <div className="border border-black rounded w-40 flex justify-left shadow-lg shadow-gray-500  bg-gray-100">
          <div className="grid">
            <div className="px-2 py-2">{data.label}</div>
          </div>{" "}
        </div>
        <Handle type="target" position={Position.Top} id="t" style={targetHandleStyle} />
        <Handle type="source" position={Position.Bottom} id="b" style={sourceHandleStyle} />
      </Indicator>
    </>
  );
};

export default memo(ParentNode);

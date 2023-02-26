import type { FC, CSSProperties } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import Indicator from "./Indicator";

const targetHandleStyle: CSSProperties = {};

const ChildNode: FC<NodeProps> = ({ data, xPos, yPos }) => {
  return (
    <>
      <Indicator indicator={data.indicator}>
        <div className="border border-black rounded w-40 flex justify-left shadow-lg shadow-gray-500 bg-gray-100">
          <div className="grid">
            <div className="px-2 py-2">
              {data.label}
              {data.tag1 || data.tag2 || data.tag3 ? <br /> : null}
              {data.tag1 && <span className="badge badge-primary">{data.tag1}</span>}
              {data.tag1 && <span className="px-1" />}
              {data.tag2 && (
                <span className="badge badge-xs text-xs badge-secondary">{data.tag2}</span>
              )}
              {data.tag2 && <span className="px-1" />}{" "}
              {data.tag3 && (
                <span className="badge badge-xs text-xs badge-accent">{data.tag3}</span>
              )}
            </div>
          </div>
        </div>
        <Handle type="target" position={Position.Left} id="a" style={targetHandleStyle} />
      </Indicator>
    </>
  );
};

export default memo(ChildNode);

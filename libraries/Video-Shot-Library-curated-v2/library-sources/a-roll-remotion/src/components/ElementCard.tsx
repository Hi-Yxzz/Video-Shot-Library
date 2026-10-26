import {useState, type CSSProperties} from "react";
import {Img, staticFile} from "remotion";
import type {ElementItem} from "../config";

type ElementCardProps = {
  item: ElementItem;
  width: number;
  height: number;
  borderRadius: number;
  shadow: number;
};

export const ElementCard = ({
  item,
  width,
  height,
  borderRadius,
  shadow,
}: ElementCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage =
    (item.type === "image" || item.type === "mixed") &&
    item.imageSrc &&
    !imageFailed;
  const showLabel = item.type !== "image" || !showImage;

  const style: CSSProperties = {
    width,
    height,
    flex: "0 0 auto",
    borderRadius,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "10px 14px",
    overflow: "hidden",
    background:
      "linear-gradient(145deg, rgba(255,255,255,.96), rgba(236,239,244,.88))",
    border: `1px solid ${item.accentColor}55`,
    boxShadow: `0 12px 30px rgba(0,0,0,${shadow})`,
    color: "#151922",
    fontFamily: "Arial, sans-serif",
    fontSize: 19,
    fontWeight: 700,
  };

  return (
    <div style={style}>
      {showImage ? (
        <Img
          src={staticFile(item.imageSrc!)}
          onError={() => setImageFailed(true)}
          style={{
            maxWidth: 44,
            maxHeight: 44,
            objectFit: "contain",
          }}
        />
      ) : null}
      {showLabel ? <span>{item.label || item.id}</span> : null}
    </div>
  );
};

const colors = ["#f25022", "#7fba00", "#00a4ef", "#ffb900"];

export const MicrosoftMark = ({size = 14}: {size?: number}) => {
  return (
    <div
      aria-label="Microsoft"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(2, ${size}px)`,
        gridTemplateRows: `repeat(2, ${size}px)`,
        gap: Math.max(2, Math.round(size * 0.18)),
      }}
    >
      {colors.map((color) => (
        <div key={color} style={{width: size, height: size, background: color}} />
      ))}
    </div>
  );
};

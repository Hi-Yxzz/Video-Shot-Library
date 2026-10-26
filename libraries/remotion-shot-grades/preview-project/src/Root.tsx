import React from 'react';
import {
  AbsoluteFill,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const CinematicTitleIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleY = spring({
    frame,
    fps,
    from: 50,
    to: 0,
    durationInFrames: 40,
    config: {damping: 14, mass: 0.8},
  });
  const titleOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 30,
  });
  const underlineWidth = interpolate(frame, [20, 50], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #111827 0%, #1a1a2e 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          color: 'white',
          fontSize: 64,
          fontWeight: 700,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          margin: 0,
          letterSpacing: '0.05em',
        }}
      >
        Your Story Begins
      </h1>
      <div
        style={{
          width: `${underlineWidth}%`,
          maxWidth: 320,
          height: 4,
          background: 'linear-gradient(90deg, #4361ee, #7209b7)',
          borderRadius: 2,
          marginTop: 16,
        }}
      />
      <p
        style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: 24,
          fontWeight: 300,
          opacity: subtitleOpacity,
          marginTop: 24,
          letterSpacing: '0.1em',
        }}
      >
        A Cinematic Experience
      </p>
    </AbsoluteFill>
  );
};

const LineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const data = [
    {x: 0, y: 25, label: 'Jan'},
    {x: 1, y: 40, label: 'Feb'},
    {x: 2, y: 35, label: 'Mar'},
    {x: 3, y: 55, label: 'Apr'},
    {x: 4, y: 50, label: 'May'},
    {x: 5, y: 70, label: 'Jun'},
    {x: 6, y: 65, label: 'Jul'},
    {x: 7, y: 80, label: 'Aug'},
    {x: 8, y: 75, label: 'Sep'},
    {x: 9, y: 90, label: 'Oct'},
  ];
  const chartWidth = 900;
  const chartHeight = 500;
  const padding = 70;
  const xScale = (x: number) =>
    (x / (data.length - 1)) * (chartWidth - padding * 2) + padding;
  const yScale = (y: number) =>
    chartHeight - padding - (y / 100) * (chartHeight - padding * 2);
  const points = data.map((d) => `${xScale(d.x)},${yScale(d.y)}`).join(' ');
  let totalLength = 0;
  for (let i = 1; i < data.length; i++) {
    const dx = xScale(data[i].x) - xScale(data[i - 1].x);
    const dy = yScale(data[i].y) - yScale(data[i - 1].y);
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }
  const dashOffset = interpolate(frame, [0, 60], [totalLength, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'linear-gradient(to bottom right, #111827, #1f2937)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: chartWidth,
          height: chartHeight,
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          padding: 20,
        }}
      >
        <svg width={chartWidth} height={chartHeight}>
          {[0, 25, 50, 75, 100].map((val) => (
            <React.Fragment key={val}>
              <line
                x1={padding}
                y1={yScale(val)}
                x2={chartWidth - padding}
                y2={yScale(val)}
                stroke="rgba(255,255,255,0.1)"
              />
              <text
                x={padding - 15}
                y={yScale(val) + 5}
                textAnchor="end"
                fill="rgba(255,255,255,0.6)"
                fontSize="12"
              >
                {val}
              </text>
            </React.Fragment>
          ))}
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          {data.map((point, i) => (
            <text
              key={point.label}
              x={xScale(point.x)}
              y={chartHeight - padding + 25}
              textAnchor="middle"
              fill="rgba(255,255,255,0.8)"
              fontSize="13"
              fontWeight="500"
            >
              {point.label}
            </text>
          ))}
          <polyline
            points={points}
            fill="none"
            stroke="#4361ee"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
          />
          {data.map((point, i) => {
            const pointProgress = interpolate(
              frame,
              [5 + i * 6, 10 + i * 6],
              [0, 1],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
            );
            return (
              <circle
                key={`${point.label}-point`}
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r={5 * pointProgress}
                fill="#f72585"
                stroke="white"
                strokeWidth="2"
                opacity={pointProgress}
              />
            );
          })}
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 25,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 28,
            fontWeight: 700,
            color: 'white',
          }}
        >
          Revenue Growth
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BokehCircles: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const t = frame / fps;
  const circles = Array.from({length: 15}, (_, i) => {
    const baseX = ((i * 173 + 53) % 100) / 100;
    const baseY = ((i * 241 + 97) % 100) / 100;
    const x = baseX * width + Math.sin(t * 0.2 + i * 1.3) * 30;
    const y = baseY * height + Math.cos(t * 0.15 + i * 0.9) * 25;
    const baseSize = 40 + ((i * 37 + 11) % 80);
    const size = baseSize * (Math.sin(t * 0.4 + i * 0.7) * 0.2 + 1);
    const opacity = 0.1 + ((i * 19 + 7) % 20) / 100;
    const colors = [
      [59, 130, 246],
      [139, 92, 246],
      [20, 184, 166],
    ];
    return {x, y, size, opacity, rgb: colors[i % 3], key: i};
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#111827', overflow: 'hidden'}}>
      {circles.map((circle) => (
        <div
          key={circle.key}
          style={{
            position: 'absolute',
            left: circle.x,
            top: circle.y,
            width: circle.size,
            height: circle.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${circle.rgb[0]},${circle.rgb[1]},${circle.rgb[2]},${circle.opacity + 0.1}) 0%, rgba(${circle.rgb[0]},${circle.rgb[1]},${circle.rgb[2]},0) 100%)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const AnimatedText: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const text = 'Hello Remotion'.split('');

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{width: '100%', textAlign: 'center'}}>
        {text.map((char, i) => {
          const delay = i * 5;
          const opacity = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: {mass: 0.5, damping: 10},
          });
          const y = spring({
            frame: frame - delay,
            fps,
            from: -50,
            to: 0,
            config: {mass: 0.5, damping: 10},
          });
          const rotate = spring({
            frame: frame - delay,
            fps,
            from: -180,
            to: 0,
            config: {mass: 0.5, damping: 12},
          });
          return (
            <span
              key={`${char}-${i}`}
              style={{
                display: 'inline-block',
                opacity,
                color: 'white',
                fontSize: 80,
                fontWeight: 700,
                transform: `translateY(${y}px) rotate(${rotate}deg)`,
              }}
            >
              {char === ' ' ? '\u00a0' : char}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GradeS"
        component={CinematicTitleIntro}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="GradeA"
        component={LineChart}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="GradeB"
        component={BokehCircles}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="GradeC"
        component={AnimatedText}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};

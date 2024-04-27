export default function LoadingGif() {
  return (
    <div>
      <svg
        style={{
          margin: "auto",
          background: "none",
          display: "block",
          shapeRendering: "auto",
        }}
        width="210px"
        height="210px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M16 50A34 34 0 0 0 84 50A34 36.1 0 0 1 16 50"
          fill="#000000"
          stroke="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.3623188405797102s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 51.05;360 50 51.05"
          ></animateTransform>
        </path>
      </svg>
    </div>
  );
}

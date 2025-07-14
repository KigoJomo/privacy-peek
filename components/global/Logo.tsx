import * as React from "react";

const SvgIcon = ({ size=32 }: { size?: number }) => (
  <svg
    height={size}
    width={size/1.329}
    fill="none"
    viewBox={`0 0 514 683`}
    // viewBox={`0 0 ${size / 1.329} ${size}`}
  >
    <path
      className="fill-foreground"
      d="M0 580c0-17.673 14.327-32 32-32h12c17.673 0 32 14.327 32 32v71c0 17.673-14.327 32-32 32H32c-17.673 0-32-14.327-32-32zM0 32C0 14.327 14.327 0 32 0h226s128 3 190.5 87.5C528.76 196.012 512 264 512 264l-75-8s0-67.5-51-125-128-55-128-55H108c-17.673 0-32 14.327-32 32v296c0 17.673 14.327 32 32 32h150s67.5 6 131-60.5c48-50.268 48-119.5 48-119.5l75 8s.588 79-63.5 160S258 512 258 512H32c-17.673 0-32-14.327-32-32z"
    ></path>
  </svg>
);

export default SvgIcon;

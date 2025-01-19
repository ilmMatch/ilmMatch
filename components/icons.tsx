import * as React from 'react';

import { IconSvgProps } from '@/types';

export const Logox: React.FC<IconSvgProps> = ({
  size = 36,
  color = 'currentColor',
  width,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    viewBox="-2.069 66.202 502.069 343.804"
    width={size || width}
    {...props}
  >
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF0000" /> {/* Start color (red) */}
        <stop offset="100%" stopColor="#0000FF" /> {/* End color (blue) */}
      </linearGradient>
    </defs>
    <path
      d="M 270.623 75.39 C 280.658 76.387 287.159 81.174 295.122 86.89 C 296.396 87.75 297.668 88.612 298.98 89.5 C 304.752 93.6 308.233 96.202 310.465 103.046 C 310.542 105.196 310.542 105.196 310.622 107.389 C 308.641 108.71 306.662 110.03 304.622 111.389 C 303.741 117.291 303.741 117.291 303.94 124.327 C 303.94 125.654 303.938 126.981 303.938 128.349 C 303.943 132.742 303.988 137.134 304.035 141.528 C 304.046 144.573 304.056 147.615 304.061 150.657 C 304.085 158.673 304.145 166.69 304.21 174.704 C 304.27 182.882 304.298 191.061 304.328 199.238 C 304.392 215.285 304.495 231.334 304.622 247.385 C 312.262 249.498 319.179 249.582 327.122 249.509 C 329.647 249.49 332.173 249.472 334.776 249.454 C 337.669 249.42 337.669 249.42 340.62 249.385 C 340.62 244.197 338.851 242.601 335.745 238.508 C 328.243 228.614 327.223 219.526 328.621 207.385 C 333.673 191.208 341.954 180.067 356.62 171.387 C 374.741 163.361 390.621 165.004 409.125 170.438 C 419.176 173.345 429.027 175.405 439.117 171.761 C 442.757 169.292 445.66 166.638 448.617 163.387 C 457.125 166.377 460.658 172.507 465.117 179.887 C 465.842 181.009 466.571 182.128 467.319 183.285 C 472.001 190.908 473.832 196.48 472.616 205.385 C 465.32 212.89 457.337 216.885 446.937 217.987 C 434.828 218.033 423.926 217.049 412.118 214.259 C 401.302 211.743 391.353 209.564 380.62 213.385 C 374.041 218.839 372.823 221.945 371.619 230.384 C 372.773 238.459 374.912 241.677 380.62 247.385 C 385.545 249.849 388.893 249.686 394.405 249.763 C 397.456 249.812 397.456 249.812 400.57 249.864 C 402.777 249.892 404.98 249.918 407.25 249.946 C 409.504 249.982 411.758 250.021 414.08 250.058 C 423.756 250.216 433.431 250.35 443.108 250.488 C 450.155 250.593 457.2 250.706 464.249 250.822 C 466.456 250.848 468.664 250.877 470.941 250.904 C 472.971 250.937 474.998 250.969 477.088 251.004 C 478.883 251.03 480.68 251.054 482.53 251.08 C 486.615 251.384 486.615 251.384 488.615 253.384 C 487.901 265.193 483.978 273.897 478.49 284.256 C 477.36 286.453 477.36 286.453 476.206 288.69 C 474.36 292.264 472.49 295.825 470.616 299.382 C 461.117 297.882 461.117 297.882 456.616 293.382 C 450.619 292.759 450.619 292.759 443.478 292.84 C 442.127 292.828 440.775 292.819 439.385 292.809 C 436.446 292.787 433.508 292.776 430.57 292.772 C 425.9 292.764 421.232 292.73 416.562 292.69 C 403.284 292.581 390.007 292.518 376.728 292.471 C 368.605 292.439 360.484 292.376 352.361 292.301 C 349.28 292.277 346.203 292.264 343.123 292.264 C 325.505 292.263 309.446 291.288 292.623 285.383 C 291.962 287.363 291.303 289.343 290.623 291.382 C 285.453 294.255 282.253 295.714 276.373 294.514 C 270.115 293.283 264.215 293.081 257.856 292.905 C 225.309 291.889 225.309 291.889 212.453 279.297 C 208.994 275.435 205.748 271.519 202.625 267.383 C 196.398 273.372 190.856 279.755 185.36 286.406 C 181.898 290.174 179.718 291.303 174.608 291.673 C 172.96 291.691 171.313 291.71 169.613 291.729 C 167.743 291.757 165.872 291.782 163.948 291.811 C 161.918 291.833 159.889 291.852 157.799 291.874 C 153.509 291.941 149.221 292.006 144.932 292.075 C 138.164 292.169 131.398 292.256 124.631 292.337 C 118.105 292.416 111.577 292.518 105.052 292.625 C 103.045 292.641 101.041 292.659 98.975 292.674 C 78.354 292.827 78.354 292.827 61.004 302.633 C 52.651 314.26 48.579 327.103 50.631 341.38 C 53.839 353.908 59.039 363.521 69.881 371.004 C 81.258 375.007 91.934 374.386 103.629 371.879 C 109.371 369.007 110.425 367.256 112.628 361.38 C 113.948 360.06 115.268 358.74 116.628 357.38 C 118.609 357.38 120.588 357.38 122.628 357.38 C 124.183 369.497 119.397 377.742 112.628 387.38 C 103.921 397.065 93.495 402.641 80.66 404.018 C 60.914 404.714 46.519 400.743 31.132 388.253 C 17.923 375.772 9.307 360.016 8.155 341.865 C 7.382 311.775 15.236 292.053 36.148 269.609 C 47.777 258.872 61.107 253.634 76.63 251.384 C 76.584 248.948 76.536 246.511 76.488 244 C 76.453 240.754 76.414 237.506 76.38 234.258 C 76.346 232.658 76.312 231.061 76.278 229.411 C 76.178 217.261 77.244 207.03 83.629 196.386 C 95.591 184.423 109.912 176.377 124.878 168.761 C 126.846 167.749 126.846 167.749 128.856 166.717 C 145.968 158.269 163.563 154.878 182.626 157.387 C 206.281 165.612 221.547 179.194 232.625 201.385 C 236.535 210.514 237.062 217.699 234.625 227.385 C 229.826 234.585 224.251 240.776 218.625 247.385 C 231.825 248.705 245.025 250.025 258.623 251.384 C 258.698 246.081 258.698 246.081 258.776 240.668 C 258.945 228.799 259.121 216.929 259.302 205.058 C 259.412 197.884 259.517 190.708 259.617 183.533 C 259.848 167.262 260.118 150.99 260.468 134.719 C 260.567 130.023 260.66 125.325 260.739 120.626 C 260.851 114.741 261.012 108.86 261.194 102.976 C 261.217 101.304 261.242 99.634 261.266 97.911 C 261.651 87.894 263.491 82.504 270.623 75.39 Z M 112.628 209.385 C 109.907 218.271 110.661 226.818 111.379 236.009 C 111.559 238.477 111.739 240.945 111.925 243.487 C 111.985 249.152 111.985 249.152 114.628 251.384 C 120.059 251.587 125.439 251.664 130.87 251.651 C 133.315 251.652 133.315 251.652 135.81 251.656 C 139.264 251.656 142.719 251.652 146.173 251.644 C 151.471 251.634 156.769 251.644 162.068 251.658 C 165.419 251.656 168.769 251.653 172.118 251.651 C 174.507 251.656 174.507 251.656 176.943 251.662 C 185.046 251.819 185.046 251.819 192.626 249.385 C 191.016 233.79 181.722 223.637 170.22 213.501 C 159.309 205.118 151.829 203.049 137.878 202.886 C 135.264 202.834 132.65 202.782 129.956 202.73 C 122.193 203.423 118.434 204.21 112.628 209.385 Z"
      fill={color}
    />
  </svg>
);


export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  color = 'currentColor',
  width,
  height,
  ...props
}) => (
  <svg
    fill="none"
    // width="501" height="498"
    height={size || height}
    viewBox="295.815 88.756 317.258 192.04"
    width={size || width}
    {...props}
  >
    <g transform="matrix(0.697218, 0, 0, 0.697218, 278.668064, 38.827794)">
      <path d="M 250 80 C 261.211 80.244 271.96 88.866 280 96 C 281.863 98.681 282.902 100.41 283.438 103.625 C 283.293 104.409 283.149 105.193 283 106 C 282.341 106.45 281.682 106.901 281.003 107.365 C 278.822 108.807 278.822 108.807 278.508 111.087 C 278.511 111.895 278.515 112.704 278.519 113.537 C 278.513 114.466 278.508 115.396 278.502 116.354 C 278.517 117.372 278.531 118.39 278.546 119.438 C 278.545 120.512 278.545 121.585 278.544 122.691 C 278.547 126.246 278.578 129.8 278.609 133.355 C 278.617 135.817 278.623 138.279 278.627 140.741 C 278.642 147.227 278.681 153.712 278.725 160.198 C 278.766 166.813 278.785 173.429 278.805 180.045 C 278.848 193.03 278.915 206.015 279 219 C 280.895 219.241 280.895 219.241 282.828 219.487 C 283.539 219.578 284.25 219.668 284.982 219.761 C 287.372 220.044 289.752 220.206 292.156 220.316 C 293.033 220.358 293.909 220.4 294.813 220.443 C 295.699 220.483 296.586 220.522 297.5 220.563 C 298.418 220.606 299.336 220.649 300.281 220.693 C 302.521 220.798 304.76 220.9 307 221 C 305.871 216.52 304.665 213.045 301.938 209.313 C 296.675 202.068 296.727 192.672 298 184 C 299.729 179.188 302.071 175.176 305 171 C 305.478 170.304 305.956 169.608 306.449 168.891 C 312.311 161.299 320.733 156.186 330 154 C 333.533 153.582 337.007 153.525 340.563 153.563 C 341.526 153.566 342.49 153.569 343.483 153.572 C 349.365 153.686 354.672 154.356 360.313 156 C 366.019 157.644 371.16 158.438 377.063 158.5 C 377.753 158.518 378.444 158.536 379.156 158.555 C 385.315 158.483 389.656 156.344 394 152 C 397.307 152.089 398.807 152.843 401.375 154.938 C 408.8 163.044 414.931 172.102 414.605 183.41 C 413.703 187.268 411.763 188.678 408.531 190.781 C 401.859 193.994 396.317 195.527 388.875 195.438 C 388.021 195.434 387.167 195.431 386.288 195.428 C 378.594 195.266 371.2 194.035 363.687 192.424 C 355.496 190.696 346.89 189.597 339 193 C 335.652 195.778 334.319 197.302 333.52 201.559 C 333.179 208.2 334.55 212.999 339 218 C 342.249 220.166 343.256 220.275 347.027 220.379 C 348.105 220.412 349.183 220.446 350.294 220.48 C 351.496 220.507 352.699 220.535 353.938 220.563 C 355.201 220.599 356.465 220.636 357.767 220.674 C 365.816 220.9 373.867 221.035 381.918 221.157 C 385.464 221.211 389.009 221.268 392.555 221.326 C 397.291 221.403 402.027 221.465 406.763 221.52 C 408.971 221.553 411.179 221.587 413.387 221.621 C 414.414 221.629 415.44 221.638 416.498 221.646 C 417.443 221.663 418.388 221.68 419.362 221.697 C 420.602 221.712 420.602 221.712 421.867 221.728 C 424 222 424 222 427 224 C 425.979 237.534 419.101 249.15 413 261 C 404.747 260.139 404.747 260.139 402 257 C 397.093 255.529 391.921 255.848 386.848 255.842 C 385.828 255.837 384.808 255.832 383.756 255.827 C 381.542 255.816 379.328 255.808 377.114 255.801 C 373.598 255.789 370.081 255.769 366.565 255.748 C 356.568 255.686 346.57 255.632 336.572 255.599 C 330.452 255.578 324.332 255.542 318.212 255.498 C 315.891 255.484 313.57 255.475 311.249 255.472 C 296.017 255.449 282.645 254.253 268 250 C 267.918 250.784 267.835 251.568 267.75 252.375 C 267 255 267 255 265.246 256.163 C 262.712 257.107 261.008 257.165 258.316 257.012 C 257.399 256.965 256.481 256.919 255.535 256.872 C 254.554 256.811 253.573 256.75 252.563 256.688 C 250.49 256.574 248.417 256.461 246.344 256.348 C 244.764 256.257 244.764 256.257 243.152 256.165 C 240.133 256.007 237.116 255.898 234.094 255.809 C 233.162 255.777 232.231 255.746 231.271 255.714 C 229.516 255.656 227.76 255.607 226.004 255.569 C 216.78 255.219 210.912 252.76 204.625 246 C 204.106 245.466 203.586 244.933 203.051 244.383 C 200.78 242.024 198.82 239.73 197 237 C 193.353 237.557 191.942 238.808 189.625 241.625 C 189.023 242.342 188.421 243.058 187.801 243.797 C 186.652 245.203 185.503 246.609 184.355 248.016 C 183.846 248.629 183.337 249.243 182.813 249.875 C 182.365 250.429 181.918 250.984 181.457 251.555 C 177.669 255.312 173.919 255.25 168.744 255.255 C 167.658 255.261 167.658 255.261 166.549 255.266 C 164.979 255.273 163.409 255.276 161.838 255.274 C 159.344 255.273 156.85 255.286 154.355 255.303 C 147.264 255.35 140.172 255.374 133.081 255.381 C 128.738 255.386 124.396 255.41 120.054 255.446 C 118.408 255.456 116.762 255.458 115.116 255.453 C 105.75 255.424 97.622 255.898 89 260 C 87.847 260.521 87.847 260.521 86.67 261.053 C 80.034 264.223 77.607 270.442 75 277 C 72.222 285.35 73.084 295.938 76.801 303.789 C 77.394 304.883 77.394 304.883 78 306 C 78.385 306.73 78.771 307.459 79.168 308.211 C 81.979 313.105 85.401 317.93 91.063 319.613 C 95.376 320.181 99.653 320.225 104 320.25 C 104.889 320.271 105.779 320.291 106.695 320.313 C 111.603 320.342 115.097 320.313 119 317 C 120.872 314.703 122.497 312.317 124.156 309.863 C 126 308 126 308 128.719 307.73 C 129.472 307.819 130.224 307.908 131 308 C 132.346 317.269 128.904 324.413 124 332 C 118.145 338.886 110.798 343.076 102 345 C 98.94 345.216 95.879 345.185 92.813 345.188 C 92 345.2 91.187 345.212 90.35 345.225 C 76.025 345.259 64.318 339.947 54 330 C 41.452 315.158 38.245 301.001 39 282 C 39.031 281.086 39.062 280.172 39.094 279.23 C 40.064 265.771 47.543 253.104 56 243 C 56.534 242.309 57.067 241.618 57.617 240.906 C 64.473 232.377 75.497 225.078 86.535 223.679 C 89.022 223.427 91.508 223.2 94 223 C 93.984 221.806 93.984 221.806 93.968 220.588 C 93.926 216.934 93.901 213.28 93.875 209.625 C 93.858 208.373 93.841 207.122 93.824 205.832 C 93.773 196.048 93.861 185.17 100 177 C 107.053 170.057 115.441 164.873 124 160 C 124.663 159.618 125.327 159.236 126.01 158.842 C 142.847 149.225 162.863 141.934 182.457 146.871 C 185.448 148.067 188.194 149.42 191 151 C 191.92 151.496 192.841 151.993 193.789 152.504 C 207.54 160.542 217.871 172.855 223 188 C 224.17 194.074 224.186 199.467 220.871 204.82 C 218.428 208.365 215.745 211.685 213 215 C 212.01 216.32 211.02 217.64 210 219 C 220.56 219.99 231.12 220.98 242 222 C 241.988 217.464 241.977 212.928 241.965 208.254 C 241.929 191.246 241.944 174.239 241.985 157.232 C 241.996 152.596 242.001 147.961 242.001 143.326 C 242.002 136.016 242.032 128.707 242.099 121.397 C 242.116 118.985 242.123 116.573 242.12 114.161 C 242.1 90.267 242.1 90.267 249 81 C 249.33 80.67 249.66 80.34 250 80 Z"
        fill={color} />
      <path d="M 163.957 264.93 C 168.151 266.405 168.751 268.164 170.687 272.125 C 171.013 272.776 171.338 273.427 171.674 274.098 C 172.808 276.387 173.905 278.692 175 281 C 175.903 282.874 176.807 284.748 177.711 286.621 C 179.61 290.569 181.493 294.525 183.367 298.485 C 186.093 304.228 188.945 309.9 191.855 315.551 C 193 318 191.957 315.601 193.313 319.478 C 195.5 321.876 194.766 322.086 195.604 322.086 C 196.429 322.086 196.217 322.086 198 320 C 198.954 317.671 198.449 318.469 198.68 317.68 C 200.483 312.655 202.799 307.927 205.125 303.125 C 205.616 302.107 206.106 301.088 206.612 300.039 C 222.162 267.838 222.162 267.838 225 265 C 227.437 264.813 227.437 264.813 230 265 C 232.825 267.825 232.26 269.664 232.275 273.621 C 232.28 274.301 232.285 274.981 232.29 275.681 C 232.304 277.934 232.303 280.186 232.301 282.438 C 232.305 284 232.309 285.561 232.314 287.123 C 232.321 290.398 232.321 293.673 232.316 296.949 C 232.31 301.152 232.327 305.355 232.35 309.559 C 232.365 312.785 232.366 316.01 232.362 319.236 C 232.363 320.786 232.368 322.336 232.378 323.886 C 232.391 326.051 232.384 328.215 232.372 330.379 C 232.373 331.612 232.374 332.845 232.374 334.116 C 232.251 335.068 232.127 336.02 232 337 C 229 339 229 339 226.375 338.688 C 224 338 224 338 223 337 C 222.84 334.118 222.74 331.257 222.684 328.371 C 222.663 327.507 222.642 326.643 222.621 325.753 C 222.555 322.981 222.496 320.209 222.437 317.438 C 222.394 315.563 222.351 313.689 222.307 311.815 C 222.199 307.21 222.098 302.605 222 298 C 223.493 288.879 219.557 292.135 218 297 C 217.47 298.075 216.941 299.15 216.395 300.257 C 214.428 304.247 212.452 308.232 210.474 312.216 C 209.62 313.941 208.767 315.666 207.917 317.393 C 206.694 319.876 205.463 322.354 204.23 324.832 C 203.852 325.604 203.474 326.376 203.084 327.172 C 202.724 327.892 202.364 328.613 201.993 329.355 C 201.523 330.304 201.523 330.304 201.044 331.273 C 199.887 333.186 198.709 334.559 197 336 C 194.609 336.215 194.609 336.215 192 335 C 190.031 332.384 188.671 329.504 187.25 326.563 C 186.826 325.721 186.402 324.88 185.965 324.013 C 185.078 322.246 184.199 320.476 183.327 318.701 C 182.018 316.037 180.689 313.385 179.352 310.735 C 177.217 306.498 175.103 302.252 173 298 C 171.68 298 168.274 288.407 169 298 C 168.985 299.136 168.971 300.271 168.956 301.441 C 168.898 305.651 168.821 309.861 168.738 314.071 C 168.704 315.893 168.676 317.716 168.654 319.539 C 168.62 322.158 168.568 324.776 168.512 327.395 C 168.502 328.618 168.502 328.618 168.492 329.867 C 168.344 335.559 168.344 335.559 166.633 337.751 C 165 339 165 339 162.437 338.813 C 160 338 160 338 158 336 C 157.739 333.198 157.739 333.198 157.725 329.579 C 157.72 328.92 157.715 328.261 157.71 327.583 C 157.696 325.4 157.697 323.218 157.699 321.035 C 157.695 319.521 157.691 318.006 157.686 316.492 C 157.679 313.315 157.679 310.138 157.684 306.961 C 157.69 302.888 157.673 298.815 157.65 294.741 C 157.635 291.613 157.634 288.484 157.637 285.355 C 157.637 283.854 157.632 282.352 157.622 280.85 C 157.609 278.75 157.616 276.651 157.628 274.551 C 157.627 273.356 157.626 272.161 157.626 270.929 C 158 268 158 268 159.338 266.095 C 161 265 161 265 163.957 264.93 Z"
        fill={color} />
      <path d="M 284 288.25 C 284.99 288.828 285.98 289.405 287 290 C 288.011 290.516 289.021 291.031 290.063 291.563 C 294.887 295.566 298.023 301.069 300 307 C 300.204 311.309 300.186 315.62 300.185 319.934 C 300.187 322.058 300.206 324.182 300.225 326.307 C 300.228 327.654 300.23 329.001 300.23 330.348 C 300.235 331.575 300.239 332.802 300.243 334.067 C 300 337 300 337 298 339 C 295.584 339.237 293.287 339.352 290.867 339.371 C 289.801 339.385 289.801 339.385 288.714 339.398 C 287.206 339.413 285.698 339.422 284.189 339.426 C 281.904 339.437 279.621 339.486 277.336 339.537 C 268.14 339.64 262.063 338.819 255.236 332.322 C 249.423 326.423 247.865 319.65 247.438 311.563 C 247.62 304.759 249.587 300.149 254 295 C 256.506 292.691 259.079 290.75 262 289 C 262.599 288.625 263.199 288.25 263.816 287.863 C 269.584 285.583 278.256 285.888 284 288.25 Z"
        fill={color} />
      <path d="M 164 187 C 173.27 193.133 183.449 202.129 187 213 C 187.538 215.698 187.803 218.247 188 221 C 184.243 222.728 181.279 223.259 177.156 223.291 C 176.005 223.303 174.853 223.316 173.667 223.329 C 172.434 223.331 171.201 223.334 169.93 223.336 C 168.02 223.346 168.02 223.346 166.072 223.356 C 163.383 223.366 160.696 223.372 158.007 223.371 C 154.563 223.37 151.119 223.398 147.674 223.432 C 144.384 223.46 141.095 223.459 137.805 223.461 C 136.567 223.475 135.33 223.49 134.055 223.504 C 132.91 223.498 131.765 223.492 130.585 223.486 C 129.577 223.489 128.568 223.492 127.529 223.494 C 125 223 125 223 123.177 221.159 C 120.776 216.754 121.482 211.486 121.499 206.583 C 121.5 204.571 121.458 202.564 121.414 200.553 C 121.41 198.641 121.41 198.641 121.406 196.691 C 121.399 195.528 121.392 194.365 121.385 193.166 C 122.181 189.068 123.819 187.613 127 185 C 137.247 180.121 154.358 181.386 164 187 Z"
        fill={'currentColor'}
        style={{ filter: 'invert(1)' }} />
      <path d="M 414.5 264.75 C 417 265 417 265 419 267 C 419.319 269.522 419.319 269.522 419.414 272.664 C 419.453 273.786 419.491 274.907 419.531 276.063 C 419.562 277.238 419.593 278.414 419.625 279.625 C 419.664 280.808 419.702 281.992 419.742 283.211 C 419.837 286.14 419.922 289.07 420 292 C 420.736 291.469 420.736 291.469 421.486 290.928 C 428.539 286.137 434.574 285.849 443 287 C 449.424 289.36 453.166 293.891 456.581 299.679 C 458.196 303.459 458.434 306.664 458.398 310.699 C 458.401 311.416 458.404 312.133 458.407 312.872 C 458.409 314.377 458.404 315.882 458.391 317.387 C 458.375 319.692 458.391 321.994 458.41 324.299 C 458.408 325.766 458.404 327.232 458.398 328.699 C 458.408 329.731 458.408 329.731 458.417 330.783 C 458.374 333.656 458.296 335.572 456.639 337.972 C 455 339 455 339 452.375 338.75 C 450 338 450 338 449 337 C 448.878 334.768 448.82 332.532 448.789 330.297 C 448.761 328.91 448.732 327.523 448.703 326.137 C 448.662 323.947 448.625 321.757 448.599 319.567 C 448.571 317.456 448.525 315.345 448.477 313.234 C 448.447 311.335 448.447 311.335 448.417 309.397 C 447.976 305.803 447.002 303.959 445 301 C 445 300.34 445 299.68 445 299 C 439.587 296.2 435.06 295.266 429 296 C 425.705 297.198 422.89 298.732 420.828 301.669 C 419.667 304.939 419.702 308.112 419.691 311.539 C 419.666 313.021 419.641 314.503 419.615 315.984 C 419.586 318.313 419.562 320.641 419.544 322.97 C 419.522 325.222 419.483 327.474 419.441 329.727 C 419.441 330.426 419.441 331.124 419.441 331.845 C 419.401 333.807 419.401 333.807 419 337 C 416 339 416 339 413.375 338.688 C 411 338 411 338 410 337 C 409.895 334.833 409.861 332.662 409.855 330.492 C 409.851 329.813 409.848 329.133 409.845 328.433 C 409.835 326.175 409.833 323.918 409.832 321.66 C 409.829 320.097 409.825 318.534 409.822 316.971 C 409.816 313.689 409.814 310.408 409.815 307.127 C 409.815 302.916 409.801 298.704 409.784 294.493 C 409.773 291.263 409.771 288.033 409.771 284.804 C 409.77 283.251 409.766 281.698 409.758 280.145 C 409.748 277.975 409.751 275.806 409.757 273.637 C 409.756 272.401 409.754 271.165 409.753 269.891 C 410.07 266.183 410.735 265.126 414.5 264.75 Z"
        fill={color} />
      <path d="M 279 295 C 284.688 297.844 288.501 302.173 291 308 C 292.024 314.34 291.16 319.083 287.434 324.309 C 284.184 328.142 281.035 330.647 275.949 331.238 C 270.401 331.42 267.352 330.758 263 327 C 257.706 321.506 256.634 317.206 256.723 309.723 C 257.262 304.425 260.285 301.51 264.125 298.188 C 269.021 294.462 272.954 294.33 279 295 Z"
        fill={'currentColor'}
        style={{ filter: 'invert(1)' }} />
      <path d="M 385.613 287.984 C 387.591 289.191 389.274 290.46 391 292 C 392.268 292.99 392.268 292.99 393.563 294 C 395 296 395 296 394.75 298.75 C 394.503 299.493 394.255 300.235 394 301 C 391.875 301.813 391.875 301.813 389 302 C 385.875 299.625 385.875 299.625 383 297 C 377.432 295.144 371.969 295.088 366.625 297.563 C 361.688 302.147 359.777 305.783 359.5 312.438 C 359.753 318.388 361.032 323.221 365.473 327.379 C 370.216 330.597 375.439 330.94 381 330 C 383.024 329.107 383.024 329.107 384.813 327.938 C 388 326 388 326 390.938 326.25 C 391.618 326.498 392.299 326.745 393 327 C 393.495 329.475 393.495 329.475 394 332 C 392.733 332.984 391.461 333.962 390.188 334.938 C 389.48 335.483 388.772 336.028 388.043 336.59 C 382.329 340.534 374.622 339.688 368 339 C 359.901 336.142 354.556 330.272 350.871 322.672 C 348.552 315.559 348.934 307.282 352.063 300.5 C 358.915 288.711 372.427 283.017 385.613 287.984 Z"
        fill={color} />
      <path d="M 320.938 270.813 C 324 271 324 271 326 273 C 326.145 275.745 326.187 278.385 326.125 281.125 C 326.116 281.879 326.107 282.633 326.098 283.41 C 326.074 285.274 326.038 287.137 326 289 C 326.687 288.965 327.374 288.93 328.082 288.895 C 328.983 288.867 329.884 288.84 330.813 288.813 C 332.152 288.76 332.152 288.76 333.52 288.707 C 336.416 289.049 337.226 289.754 339 292 C 337.125 295.875 337.125 295.875 336 297 C 334.314 297.072 332.625 297.084 330.938 297.063 C 330.018 297.053 329.099 297.044 328.152 297.035 C 327.442 297.024 326.732 297.012 326 297 C 326.023 301.397 326.1 305.791 326.188 310.188 C 326.193 311.433 326.199 312.679 326.205 313.963 C 326.076 321.196 326.076 321.196 329.316 327.316 C 332.571 329.358 335.2 329.708 339 330 C 340 331 340 331 340.188 333.938 C 340 337 340 337 338 339 C 333.931 339.615 330.14 339.451 326.313 337.938 C 322.653 334.871 319.151 331.301 317 327 C 316.904 325.249 316.872 323.494 316.871 321.74 C 316.867 320.642 316.864 319.544 316.861 318.413 C 316.863 317.224 316.865 316.034 316.867 314.809 C 316.866 313.593 316.865 312.377 316.864 311.125 C 316.864 308.552 316.865 305.979 316.87 303.406 C 316.875 299.451 316.87 295.496 316.863 291.541 C 316.864 289.047 316.865 286.553 316.867 284.059 C 316.865 282.867 316.863 281.675 316.861 280.448 C 316.864 279.353 316.867 278.258 316.871 277.131 C 316.871 276.162 316.872 275.193 316.873 274.195 C 317.069 270.809 317.489 271.033 320.938 270.813 Z"
        fill={color} />
    </g>
  </svg>
);

export const DiscordIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const TwitterIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"
        fill="currentColor"
      />
    </svg>
  );
};

export const GithubIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const MoonFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

export const HeartFilledIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const NextUILogo: React.FC<IconSvgProps> = (props) => {
  const { width, height = 40 } = props;

  return (
    <svg
      fill="none"
      height={height}
      viewBox="0 0 161 32"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-black dark:fill-white"
        d="M55.6827 5V26.6275H53.7794L41.1235 8.51665H40.9563V26.6275H39V5H40.89L53.5911 23.1323H53.7555V5H55.6827ZM67.4831 26.9663C66.1109 27.0019 64.7581 26.6329 63.5903 25.9044C62.4852 25.185 61.6054 24.1633 61.0537 22.9582C60.4354 21.5961 60.1298 20.1106 60.1598 18.6126C60.132 17.1113 60.4375 15.6228 61.0537 14.2563C61.5954 13.0511 62.4525 12.0179 63.5326 11.268C64.6166 10.5379 65.8958 10.16 67.1986 10.1852C68.0611 10.1837 68.9162 10.3468 69.7187 10.666C70.5398 10.9946 71.2829 11.4948 71.8992 12.1337C72.5764 12.8435 73.0985 13.6889 73.4318 14.6152C73.8311 15.7483 74.0226 16.9455 73.9968 18.1479V19.0773H63.2262V17.4194H72.0935C72.1083 16.4456 71.8952 15.4821 71.4714 14.6072C71.083 13.803 70.4874 13.1191 69.7472 12.6272C68.9887 12.1348 68.1022 11.8812 67.2006 11.8987C66.2411 11.8807 65.3005 12.1689 64.5128 12.7223C63.7332 13.2783 63.1083 14.0275 62.6984 14.8978C62.2582 15.8199 62.0314 16.831 62.0352 17.8546V18.8476C62.009 20.0078 62.2354 21.1595 62.6984 22.2217C63.1005 23.1349 63.7564 23.9108 64.5864 24.4554C65.4554 24.9973 66.4621 25.2717 67.4831 25.2448C68.1676 25.2588 68.848 25.1368 69.4859 24.8859C70.0301 24.6666 70.5242 24.3376 70.9382 23.919C71.3183 23.5345 71.6217 23.0799 71.8322 22.5799L73.5995 23.1604C73.3388 23.8697 72.9304 24.5143 72.4019 25.0506C71.8132 25.6529 71.1086 26.1269 70.3314 26.4434C69.4258 26.8068 68.4575 26.9846 67.4831 26.9663V26.9663ZM78.8233 10.4075L82.9655 17.325L87.1076 10.4075H89.2683L84.1008 18.5175L89.2683 26.6275H87.103L82.9608 19.9317L78.8193 26.6275H76.6647L81.7711 18.5169L76.6647 10.4062L78.8233 10.4075ZM99.5142 10.4075V12.0447H91.8413V10.4075H99.5142ZM94.2427 6.52397H96.1148V22.3931C96.086 22.9446 96.2051 23.4938 96.4597 23.9827C96.6652 24.344 96.9805 24.629 97.3589 24.7955C97.7328 24.9548 98.1349 25.0357 98.5407 25.0332C98.7508 25.0359 98.9607 25.02 99.168 24.9857C99.3422 24.954 99.4956 24.9205 99.6283 24.8853L100.026 26.5853C99.8062 26.6672 99.5805 26.7327 99.3511 26.7815C99.0274 26.847 98.6977 26.8771 98.3676 26.8712C97.6854 26.871 97.0119 26.7156 96.3973 26.4166C95.7683 26.1156 95.2317 25.6485 94.8442 25.0647C94.4214 24.4018 94.2097 23.6242 94.2374 22.8363L94.2427 6.52397ZM118.398 5H120.354V19.3204C120.376 20.7052 120.022 22.0697 119.328 23.2649C118.644 24.4235 117.658 25.3698 116.477 26.0001C115.168 26.6879 113.708 27.0311 112.232 26.9978C110.759 27.029 109.302 26.6835 107.996 25.9934C106.815 25.362 105.827 24.4161 105.141 23.2582C104.447 22.0651 104.092 20.7022 104.115 19.319V5H106.08V19.1831C106.061 20.2559 106.324 21.3147 106.843 22.2511C107.349 23.1459 108.094 23.8795 108.992 24.3683C109.993 24.9011 111.111 25.1664 112.242 25.139C113.373 25.1656 114.493 24.9003 115.495 24.3683C116.395 23.8815 117.14 23.1475 117.644 22.2511C118.16 21.3136 118.421 20.2553 118.402 19.1831L118.398 5ZM128 5V26.6275H126.041V5H128Z"
      />
      <path
        className="fill-black dark:fill-white"
        d="M23.5294 0H8.47059C3.79241 0 0 3.79241 0 8.47059V23.5294C0 28.2076 3.79241 32 8.47059 32H23.5294C28.2076 32 32 28.2076 32 23.5294V8.47059C32 3.79241 28.2076 0 23.5294 0Z"
      />
      <path
        className="fill-white dark:fill-black"
        d="M17.5667 9.21729H18.8111V18.2403C18.8255 19.1128 18.6 19.9726 18.159 20.7256C17.7241 21.4555 17.0968 22.0518 16.3458 22.4491C15.5717 22.8683 14.6722 23.0779 13.6473 23.0779C12.627 23.0779 11.7286 22.8672 10.9521 22.4457C10.2007 22.0478 9.5727 21.4518 9.13602 20.7223C8.6948 19.9705 8.4692 19.1118 8.48396 18.2403V9.21729H9.72854V18.1538C9.71656 18.8298 9.88417 19.4968 10.2143 20.0868C10.5362 20.6506 11.0099 21.1129 11.5814 21.421C12.1689 21.7448 12.8576 21.9067 13.6475 21.9067C14.4374 21.9067 15.1272 21.7448 15.7169 21.421C16.2895 21.1142 16.7635 20.6516 17.0844 20.0868C17.4124 19.4961 17.5788 18.8293 17.5667 18.1538V9.21729ZM23.6753 9.21729V22.845H22.4309V9.21729H23.6753Z"
      />
    </svg>
  );
};

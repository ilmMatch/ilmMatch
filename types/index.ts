import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type CountryCode = {
  country: string;
  flag: string;
  code: number;
};


export type Action = "add" | "remove";
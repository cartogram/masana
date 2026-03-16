export type Theme = {
  bg: string;
  gradient?: {
    from: string;
    via?: string;
    to: string;
  };
  shape: {
    square: string;
    circle: string;
    triangle: string;
    diamond: string;
  };
};

export const defaultTheme: Theme = {
  bg: '#0b5675',
  gradient: {
    from: '#0d0d0d',
    via: '#1a1a2e',
    to: 'navy',
  },
  shape: {
    square: 'dodgerblue',
    circle: 'navy',
    triangle: 'darkblue',
    diamond: 'blue',
  },
};

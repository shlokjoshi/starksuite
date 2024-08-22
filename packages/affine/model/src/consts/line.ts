import { createZodUnion } from '../utils/zod.js';

export enum LineColor {
  Black = '--affine-palette-line-black',
  Blue = '--affine-palette-line-blue',
  Green = '--affine-palette-line-green',
  Grey = '--affine-palette-line-grey',
  Magenta = '--affine-palette-line-magenta',
  Orange = '--affine-palette-line-orange',
  Purple = '--affine-palette-line-purple',
  Red = '--affine-palette-line-red',
  Teal = '--affine-palette-line-teal',
  White = '--affine-palette-line-white',
  Yellow = '--affine-palette-line-yellow',
}

export const LINE_COLORS = [
  LineColor.Yellow,
  LineColor.Orange,
  LineColor.Red,
  LineColor.Magenta,
  LineColor.Purple,
  LineColor.Blue,
  LineColor.Teal,
  LineColor.Green,
  LineColor.Black,
  LineColor.Grey,
  LineColor.White,
] as const;

export const LineColorsSchema = createZodUnion(LINE_COLORS);

export const DEFAULT_TEXT_COLOR = LineColor.Blue;

export const DEFAULT_BRUSH_COLOR = LineColor.Blue;

export const DEFAULT_CONNECTOR_COLOR = LineColor.Grey;

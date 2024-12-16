import {
  GreenScreenFilter,
  RetroGraphicsFilter,
  ColorBalanceFilter
} from 'webgl-effects'

export const filters = [
  {
    label: 'Green Screen',
    filterClass: GreenScreenFilter
  },
  {
    label: 'Retro Graphics',
    filterClass: RetroGraphicsFilter
  },
  {
    label: 'Color Balance',
    filterClass: ColorBalanceFilter
  }
] as const

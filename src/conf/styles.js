export const CIRCLE_STYLE = {
  'circle-color': [
    'match',
    [ 'get', 'region_URI', [ 'get', 'althurayyaData' ]],
    'Aqur_RE', '#ff7f0e',
    '#fff'
  ],
  'circle-stroke-width': 2,
  'circle-stroke-color': '#ff7f0e',
  'circle-opacity': 1,
  'circle-stroke-opacity': 1,
  'circle-radius': [
    'match',
    ['get', 'top_type', [ 'get', 'althurayyaData' ]],
    'metropoles', 10,
    'towns', 4,
    2
  ]
}

export const LINE_STYLE = {
  'line-color': '#ff7f0e',
  'line-width': 2
}

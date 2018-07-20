export const CIRCLE_STYLE = {
  'circle-color': [
    'match',
    [ 'get', 'region_URI', [ 'get', 'althurayyaData' ]],
    'Andalus_RE', '#8F547C',
    'Aqur_RE', '#ff7f0e',
    'BadiyatArab_RE', '#d3d3d3',
    'Barqa_RE', '#58E0C1',
    'Daylam_RE', '#D5812E',
    'Misr_RE', '#6CD941',
    'Fars_RE', '#E23A80',
    'Hind_RE', '#000000',
    'Iraq_RE', '#ABB1DB',
    'JaziratArab_RE', '#537195',
    'Jibal_RE', '#384E21',
    'Khazar_RE', '#00008B',
    'Khurasan_RE', '#B27E86',
    'Khuzistan_RE', '#8F351D',
    'Kirman_RE', '#D5AB7A',
    'Mafaza_RE', '#d3d3d3',
    'Maghrib_RE', '#539675',
    'Mawarannahr_RE', '#522046',
    'Rihab_RE', '#DB4621',
    'Rum_RE', '#000000',
    'Sham_RE', '#539236',
    'Siqiliyya_RE', '#4B281F',
    'Sijistan_RE', '#68DA85',
    'Sind_RE', '#6C7BD8',
    'Yaman_RE', '#8F3247',
    '#d3d3d3'
  ],
  'circle-opacity': 1,
  'circle-radius': [
    'match',
    ['get', 'top_type', [ 'get', 'althurayyaData' ]],
    'metropoles', 8,
    'capitals', 7,
    'towns', 6,
    'villages', 5,
    'waystations', 4,
    'sites', 4,
    'xroads', 4,
    'waters', 3,
    'mont', 3,
    3
  ]
}

export const LINE_STYLE = {
  'line-color': '#939393',
  'line-width': 2
}

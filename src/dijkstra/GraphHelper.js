export default class  GraphHelper {

  static buildGraph(features) {
    const g = require('./Graph.js');

    const map = {};

    const addIfNotExists = (map, from, to, weight) => {
      if (!map[from]) map[from] = {}; // Create empty
      const neighboursMap = map[from];
      neighboursMap[to] = weight;
    }

    features.forEach(f => {
      const p = f.properties; // Shorthand
      addIfNotExists(map, p.sToponym, p.eToponym, p.Meter);
    });

    return new Graph(map);
  }

}

let queue: { value: number; cost: number }[] = [];
const addToQueue = (value: number, cost: number) => {
  queue.push({ value, cost });
  queue.sort((a, b) => b.cost - a.cost);
};

const singleSourceShortestPaths = (graph, start, destination) => {
  // Predecessor map for each node that has been encountered.
  // node ID => predecessor node ID
  const predecessors = {};

  // Costs of shortest paths from s to all nodes encountered.
  // node ID => cost
  const costs = {};
  costs[start] = 0;

  // Costs of shortest paths from s to all nodes encountered; differs from
  // `costs` in that it provides easy access to the node that currently has
  // the known shortest path from s.
  // XXX: Do we actually need both `costs` and `open`?
  queue = [];
  addToQueue(start, 0);

  while (queue.length) {
    // In the nodes remaining in graph that have a known cost from s,
    // find the node, closestValue, that currently has the shortest path from s.
    const closest = queue.pop()!;
    const shortestValue = closest.value;
    const shortestCost = closest.cost;

    // Get nodes adjacent to closestValue...
    const adjacentNodes = graph[shortestValue] || { cost: 0, value: 0 };

    // ...and explore the edges that connect closestValue to those nodes, updating
    // the cost of the shortest paths to any or all of those nodes as
    // necessary. adjacentNode is the node across the current edge from closestValue.
    for (const adjacentNode in adjacentNodes) {
      if (adjacentNodes.hasOwnProperty(adjacentNode)) {
        // Get the cost of the edge running from closestValue to adjacentNode.
        const adjacentNodeCost = adjacentNodes[adjacentNode];

        // Cost of s to closestValue plus the cost of closestValue to adjacentNode across e--this is *a*
        // cost from s to adjacentNode that may or may not be less than the current
        // known cost to adjacentNode.
        const totalCostToAdjecentNode = shortestCost + adjacentNodeCost;

        // If we haven't visited adjacentNode yet OR if the current known cost from s to
        // adjacentNode is greater than the new cost we just found (cost of s to closestValue plus
        // cost of closestValue to adjacentNode across e), update adjacentNode's cost in the cost list and
        // update adjacentNode's predecessor in the predecessor list (it's now closestValue).
        const cost_of_s_to_v = costs[adjacentNode];
        const first_visit = typeof costs[adjacentNode] === "undefined";
        if (first_visit || cost_of_s_to_v > totalCostToAdjecentNode) {
          costs[adjacentNode] = totalCostToAdjecentNode;
          addToQueue(adjacentNode, totalCostToAdjecentNode);
          predecessors[adjacentNode] = shortestValue;
        }
      }
    }
  }

  if (
    typeof destination !== "undefined" &&
    typeof costs[destination] === "undefined"
  ) {
    throw new Error(`Could not find a path from ${start} to ${destination}.`);
  }
  return [predecessors, costs];
};

const extractShortestPathFromPredecessorList = (predecessors, destination) => {
  const nodes = [];
  let closestValue = destination;
  while (closestValue) {
    nodes.push(closestValue);
    closestValue = predecessors[closestValue];
  }
  nodes.reverse();
  return nodes;
};

export const findPath = (graph, start, destination) => {
  return findPathWithCost(graph, start, destination)[0];
};

export const findPathWithCost = (graph, start, destination) => {
  const [predecessors, costs] = singleSourceShortestPaths(
    graph,
    start,
    destination
  );
  return [
    extractShortestPathFromPredecessorList(predecessors, destination),
    costs[destination],
  ];
};

export default { findPath, findPathWithCost, singleSourceShortestPaths };

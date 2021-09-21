/* eslint-disable */
import computeMunkres from 'munkres-js'
import underscore from 'underscore'

const _ = underscore

/*

 ad88888ba   88                                   88
d8"     "8b  ""                                   88
Y8,                                               88
`Y8aaaaa,    88  88,dPYba,,adPYba,   8b,dPPYba,   88   ,adPPYba,
  `"""""8b,  88  88P'   "88"    "8a  88P'    "8a  88  a8P_____88
        `8b  88  88      88      88  88       d8  88  8PP"""""""
Y8a     a8P  88  88      88      88  88b,   ,a8"  88  "8b,   ,aa
 "Y88888P"   88  88      88      88  88`YbbdP"'   88   `"Ybbd8"'
                                     88
                                     88
*/
function computeAssignmentsKBF(self, {
  companies,
  students,
  rankings
}) {
/*
 ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗   ██╗████████╗███████╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║   ██║╚══██╔══╝██╔════╝
██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║   ██║   █████╗
██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║   ██║   ██╔══╝
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝   ██║   ███████╗
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝    ╚═╝   ╚══════╝

*/
  let assignments = computeMunkres(rankings)
    .map(assignment => {
      let [row, col] = assignment;
      return {
        student: students[row],
        company: companies[col],
        ranking: rankings[row][col]
      }
    })

/*
 ██████╗ █████╗ ██╗      ██████╗
██╔════╝██╔══██╗██║     ██╔════╝
██║     ███████║██║     ██║
██║     ██╔══██║██║     ██║
╚██████╗██║  ██║███████╗╚██████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝

███████╗████████╗ █████╗ ████████╗███████╗
██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
███████╗   ██║   ███████║   ██║   ███████╗
╚════██║   ██║   ██╔══██║   ██║   ╚════██║
███████║   ██║   ██║  ██║   ██║   ███████║
╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
*/

  let totalCost = _.reduce(_.pluck(assignments, 'ranking'), (a, b) => a + b, 0);
  let avgSatisfaction = totalCost / students.length;

/*
 ██████╗ ██╗   ██╗████████╗██████╗ ██╗   ██╗████████╗
██╔═══██╗██║   ██║╚══██╔══╝██╔══██╗██║   ██║╚══██╔══╝
██║   ██║██║   ██║   ██║   ██████╔╝██║   ██║   ██║
██║   ██║██║   ██║   ██║   ██╔═══╝ ██║   ██║   ██║
╚██████╔╝╚██████╔╝   ██║   ██║     ╚██████╔╝   ██║
 ╚═════╝  ╚═════╝    ╚═╝   ╚═╝      ╚═════╝    ╚═╝

 █████╗ ███████╗███████╗██╗ ██████╗ ███╗   ██╗███████╗
██╔══██╗██╔════╝██╔════╝██║██╔════╝ ████╗  ██║██╔════╝
███████║███████╗███████╗██║██║  ███╗██╔██╗ ██║███████╗
██╔══██║╚════██║╚════██║██║██║   ██║██║╚██╗██║╚════██║
██║  ██║███████║███████║██║╚██████╔╝██║ ╚████║███████║
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
*/

  self.postMessage({
    mutation: 'STORE_ASSIGNMENTS_KBF',
    payload: {
      assignments,
      avgSatisfaction
    }
  })
}

onmessage = e => {
  const {
    action,
    payload
  } = e.data;
  switch (action) {
    case 'computeAssignmentsJobFair':
      self.postMessage({
        mutation: 'SET_WORKING_JOBFAIR',
        payload: true
      });
      computeAssignmentsJobFair(self, payload);
      self.postMessage({
        mutation: 'SET_WORKING_JOBFAIR',
        payload: false
      });
      break;
    case 'computeAssignmentsKBF':
      self.postMessage({
        mutation: 'SET_WORKING_KBF',
        payload: true
      });
      computeAssignmentsKBF(self, payload);
      self.postMessage({
        mutation: 'SET_WORKING_KBF',
        payload: false
      });
      break;
  }
};

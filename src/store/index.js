import Vue from 'vue'
import Vuex from 'vuex'
import * as Papa from 'papaparse'
import underscore from 'underscore'
import realCompanyData from '../data/fortune500-2019.json'

const _ = underscore

const actions = new Worker('./actions.js', {
  type: 'module'
});

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    kbf: {
      // input
      rawCsvRankings: '',
      companies: [],
      students: [],
      rankings: [],
      // results
      assignments: [],
      avgSatisfaction: null,
      // options
      fake: {
        students: 50,
        companies: 70,
        rankingMax: 10,
        unrankedValue: 99
      },
      // status
      isWorking: false
    }
  },
  mutations: {
    resetStateKBF(state) {
      state.kbf.companies = [];
      state.kbf.students = [];
      state.kbf.rankings = [];
      state.kbf.assignments = [];
      state.kbf.history = [];
      state.kbf.avgSatisfaction = null;
      state.kbf.isWorking = false;
    },
    setCsvRankingsKBF(state, csv) {
      state.kbf.rawCsvRankings = csv;
    },
    setCompaniesKBF(state, companies) {
      state.kbf.companies = companies;
    },
    setStudentsKBF(state, students) {
      state.kbf.students = students;
    },
    setRankingsKBF(state, rankings) {
      state.kbf.rankings = rankings;
    },
    SET_WORKING_KBF(state, value) {
      state.kbf.isWorking = value;
    },
    STORE_ASSIGNMENTS_KBF(state, payload) {
      state.kbf.assignments = payload.assignments;
      state.kbf.avgSatisfaction = payload.avgSatisfaction;
    },
  },
  actions: {
    createFakeRankingsKBF({
      commit,
      state
    }) {
      let { fake } = state.kbf;
      let students = _.map(Array(fake.students), () => {
          return `${Vue.faker().name.firstName()} ${Vue.faker().name.lastName()}`
        });
      let companies = _.shuffle(realCompanyData.map(c => c.company)).slice(0, fake.companies);

      var matrix = [
        ["Student Name", ...companies]
      ];
      for (var i = 0; i < students.length; i++) {
        let rankings = _.shuffle([
          ..._.range(1, fake.rankingMax + 1),
          ...Array(companies.length - fake.rankingMax).fill(fake.unrankedValue),
        ]);
        matrix.push([students[i], ...rankings]);
      }
      commit('setCsvRankingsKBF', Papa.unparse(matrix));
    },
    resetStateKBF({ commit }) {
      commit('resetStateKBF');
    },
    ingestCsvKBF({ commit, state }, csvRankings) {
      commit('setCsvRankingsKBF', csvRankings);
      let data = Papa.parse(csvRankings).data;
      let firstRow = data[0];
      let companies = firstRow.slice(1, firstRow.length);
      let firstColumn = data.map(row => row[0]);
      let students = firstColumn.slice(1, firstColumn.length);
      let rankings = data.slice(1, data.length)
        .map(row => row.slice(1, row.length))
        .map(row => row.map(item => item.trim() ? item : state.kbf.unrankedValue))
        .map(row => row.map(item => parseInt(item)));
      commit('setCompaniesKBF', companies);
      commit('setStudentsKBF', students);
      commit('setRankingsKBF', rankings);
    },
    computeAssignmentsKBF({ state }) {
      actions.postMessage({
        action: 'computeAssignmentsKBF',
        payload: {
          companies: state.kbf.companies,
          students: state.kbf.students,
          rankings: state.kbf.rankings
        }
      })
    }
  },
  modules: {}
})

// Handle incoming messages as commits
// https://logaretm.com/blog/2019-12-21-vuex-off-mainthread/
actions.onmessage = e => {
  store.commit(e.data.mutation, e.data.payload);
};

export default store;

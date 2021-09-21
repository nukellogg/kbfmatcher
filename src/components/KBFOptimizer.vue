<template>
  <div>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="10">
        <h1>KBF Optimizer</h1>
        <v-expansion-panels
          v-model="helpPanel"
          popout
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              expand-icon="mdi-help"
              color="yellow"
              disable-icon-rotate
            >
              <h4>Help</h4>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                This will optimally match students to companies when the students have numerically ranked their individual preferences for the companies.
              </p>
              <p v-if="!isWorking">
                Try pressing <v-btn v-if="!isWorking" class="warning" @click.stop="createFakeRankingsKBF">Fill Fake Data</v-btn> if you want to see what the data format should be. You can then press <v-btn v-if="!isWorking" class="success" @click.stop="compute">Find Assignments</v-btn><v-btn v-else class="grey" disabled>Working...</v-btn> to see what the results would look like. 
              </p>
              <p>
                If you're using Qualtrics to collect the student rankings, you can
                convert your survey output to the required format in the
                <router-link to="Qualtrics">Qualtrics Converter</router-link>
                first.
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="10">
        <v-textarea
          name="csvRankings"
          label="CSV/TSV of Student Rankings of Companies"
          v-model="csvRankings"
        ></v-textarea>
        <v-btn
          v-if="!isWorking"
          class="success"
          @click.stop="compute"
        >
          Find Assignments
        </v-btn>
        <v-btn
          v-else
          class="grey"
          disabled
        >
          Working...
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row v-show="isStarted">
      <v-spacer></v-spacer>
      <v-col cols="12" md="10">
        <h2>Student/Company Assignments</h2>
        <p>
          Download Assignments in CSV: 
          <v-btn
            @click.stop="save(filename({ avgSatisfaction }), simple.assignments)"
            color="deep-purple"
            icon
            dark
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
          {{ filename({ avgSatisfaction }) }}
        </p>
        <ResultsKBF />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import ResultsKBF from '@/components/ResultsKBF'
import * as Papaparse from 'papaparse'
import { roundNumber } from '@/utils/formatters'
import { saveFile } from '@/utils/download'
import kelloggConfetti from '@/utils/kellogg-confetti'

export default Vue.extend({
  name: "Home",
  components: {
    ResultsKBF,
  },
  computed: {
    ...mapState([ 'kbf' ]),
    rawCsvRankings() {
      return this.kbf.rawCsvRankings
    },
    isWorking() {
      return this.kbf.isWorking
    },
    avgSatisfaction() {
      return this.kbf.avgSatisfaction
    }
  },
  data() {
    return {
      helpPanel: [],
      csvRankings: "",
      isStarted: false
    }
  },
  watch: {
    rawCsvRankings(val) {
      this.csvRankings = val
    },
    isWorking(val) {
      if (val) {
        this.isStarted = true
        this.helpPanel = []
      }
      if(!val && this.isStarted) {
        // we're finished
        this.celebrate()
      }
    },
  },
  created() {
    document.title = "KBF Student/Company Matching Optimizer"
  },

  methods: {
    ...mapActions([
      "createFakeRankingsKBF",
      "resetStateKBF",
      "ingestCsvKBF",
      "computeAssignmentsKBF"
    ]),
    compute() {
      this.resetStateKBF()
      this.ingestCsvKBF(this.csvRankings)
      this.computeAssignmentsKBF()
    },
    filename(payload) {
      let r = `${roundNumber(payload.avgSatisfaction, 2)}AvgRanking`
      return `Assignments-${r}.csv`
    },
    save(filename, data) {
      // data here is a list of lists, which represents lines of a CSV. Use
      // Papaparse to turn into a single string with linebreaks.
      let csvString = Papaparse.unparse(data)
      saveFile(filename, csvString, 'text/csv')
    },
    celebrate() {
      kelloggConfetti(5)
    }
  },
});
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

ol > li {
  margin-top: 10px !important;
  margin-bottom: 10px !important; 
}
</style>

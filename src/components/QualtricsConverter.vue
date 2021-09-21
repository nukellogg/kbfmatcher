<template>
  <div>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="10">
        <h1>Qualtrics Survey Results Converter</h1>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="10">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              How do I use this?
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-spacer></v-spacer>
                <v-col cols="12" md="12">
                  <p>
                    This will convert a Qualtrics Survey output CSV file
                    with a single rank order question to a rankings matrix,
                    like the matrix needed for
                    <router-link to="/">this interview matcher</router-link
                    >. As of March 2021, to get the CSV output from
                    Qualtrics: go to the survey, click on the Data &amp;
                    Analysis tab, press the "Export &amp; Import" button,
                    "Export", choose "CSV" / "Download all fields" / "Use
                    choice text", click "Download". Open this CSV file in
                    Microsoft Excel or Apple Numbers, select all cells and
                    copy them, and paste into the Qualtrics Input textarea
                    below.
                  </p>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <h3>
                    Example Input (Qualtrics results in CSV format)
                  </h3>
                  <v-textarea :value="exampleInput" readonly></v-textarea>
                </v-col>
                <v-col cols="12">
                  <h3>
                    Example Output (CSV; use this in the
                    <router-link to="/">optimizer</router-link>)
                  </h3>
                  <v-textarea :value="exampleOutput" readonly></v-textarea>
                </v-col>
              </v-row>
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
          name="csvQualtricsInput"
          label="Qualtrics Input (CSV)"
          v-model="csvQualtricsInput"
        ></v-textarea>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="6" md="4">
        <v-text-field
          label="Column Heading where student identifiers are located"
          v-model="studentIdColLabel"
        ></v-text-field>
      </v-col>
      <v-col cols="3" md="3">
        <v-text-field
          label="Row where question text shows up"
          type="number"
          v-model="questionTextRow"
        ></v-text-field>
      </v-col>
      <v-col cols="3" md="3">
        <v-text-field
          label="Row where data starts"
          type="number"
          v-model="dataStartRow"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="6" md="5">
        <h3>Student Identifiers</h3>
        <h4>
          These should be unique. If you see duplicates, edit the Qualtrics
          output CSV to remove the duplicate students before converting
          here.
        </h4>
        <ol>
          <li v-for="(student, i) in studentNames" v-bind:key="i">
            {{ student }}
          </li>
        </ol>
      </v-col>
      <v-col cols="6" md="5">
        <h3>Companies</h3>
        <ol>
          <li v-for="(company, i) in companyNames" v-bind:key="i">
            {{ company }}
          </li>
        </ol>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="10">
        <v-btn @click="convert" class="success">Convert</v-btn>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="10">
        <v-textarea
          name="csvRankingsMatrix"
          label="Rankings Matrix Output (CSV)"
          v-model="csvRankingsMatrix"
        ></v-textarea>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
import Vue from "vue"
import * as Papa from "papaparse"
import { exampleInput, exampleOutput } from "@/data/converter-example.json"

export default Vue.extend({
  name: "Qualtrics",
  data() {
    return {
      exampleInput: exampleInput,
      exampleOutput: exampleOutput,
      csvQualtricsInput: "",
      studentIdColLabel: "Q2",
      questionTextRow: 1,
      dataStartRow: 3,
      csvRankingsMatrix: "",
      companyRegExpString:
        "(?<=- Ranks - My Top 10 - )(?<company>.*)(?= - Rank)",
      parsedQualtricsCsv: [],
      columnLabels: [],
      questionTexts: [],
      students: [],
      studentNames: [],
      companies: [],
      companyNames: [],
      studentIdColNumber: null,
      studentIdColumn: null,
    }
  },
  watch: {
    csvQualtricsInput: function() {
      this.convert()
    },
  },
  created() {
    document.title = "Kellogg CMC Job Fair Interview Optimizer"
  },
  methods: {
    __parsedQualtricsCsv() {
      return Papa.parse(this.csvQualtricsInput).data
    },

    __columnLabels() {
      return this.parsedQualtricsCsv[0]
    },

    __questionTexts() {
      return this.parsedQualtricsCsv[this.questionTextRow]
    },

    __students() {
      let data = this.parsedQualtricsCsv
      this.studentIdColNumber = this.columnLabels.indexOf(
        this.studentIdColLabel
      )
      this.studentIdColumn = data.map((row) => row[this.studentIdColNumber])
      let students = []
      for (
        let row = this.dataStartRow;
        row < this.studentIdColumn.length;
        row++
      ) {
        let name = this.studentIdColumn[row]
        if (name && name.length > 0) {
          students.push({ name, row })
        }
      }
      return students
    },

    __studentNames() {
      return this.students.map((s) => s.name)
    },

    __companies() {
      let companies = [];
      let companyRegExp = new RegExp(this.companyRegExpString);
      for (let i = 0; i < this.questionTexts.length; i++) {
        let questionText = this.questionTexts[i]
        if (questionText.match(companyRegExp)) {
          companies.push({
            name: questionText.match(companyRegExp).groups.company,
            column: i,
          })
        }
      }
      return companies
    },

    __companyNames() {
      return this.companies.map((c) => c.name)
    },

    __rankingsMatrix() {
      let output = []
      let firstRow = ["Student ID", ...this.companyNames]
      output.push(firstRow)
      for (var i = 0; i < this.students.length; i++) {
        let student = this.students[i].name
        let row = this.students[i].row
        let outputRow = [student]
        for (var j = 0; j < this.companies.length; j++) {
          let column = this.companies[j].column
          let ranking = this.parsedQualtricsCsv[row][column]
          outputRow.push(ranking)
        }
        output.push(outputRow)
      }
      return output;
    },

    convert() {
      this.parsedQualtricsCsv = this.__parsedQualtricsCsv()
      this.columnLabels = this.__columnLabels()
      this.questionTexts = this.__questionTexts()
      this.students = this.__students()
      this.studentNames = this.__studentNames()
      this.companies = this.__companies()
      this.companyNames = this.__companyNames()
      this.csvRankingsMatrix = Papa.unparse(this.__rankingsMatrix())
    },
  },
})
</script>

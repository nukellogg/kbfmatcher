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
                    This will convert a Qualtrics Survey output CSV file with a
                    single rank order question to a rankings matrix, like the
                    matrix needed for
                    <router-link to="/">this interview matcher</router-link>. As
                    of March 2021, to get the CSV output from Qualtrics: go to
                    the survey, click on the Data &amp; Analysis tab, press the
                    "Export &amp; Import" button, "Export", choose "CSV" /
                    "Download all fields" / "Use choice text", click "Download".
                    Open this CSV file in Microsoft Excel or Apple Numbers,
                    select all cells and copy them, and paste into the Qualtrics
                    Input textarea below.
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
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="6" md="5">
        <h3>Student Identifiers</h3>
        <h4>
          These should be unique. If you see duplicates, edit the Qualtrics
          output CSV to remove the duplicate students before converting here.
        </h4>
        <ol>
          <li
            v-for="(student, i) in Object.keys(studentCompaniesMap)"
            v-bind:key="i"
          >
            {{ student }}
          </li>
        </ol>
      </v-col>
      <v-col cols="6" md="5">
        <h3>Companies</h3>
        <ol>
          <li v-for="(company, i) in companies" v-bind:key="i">
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
import Vue from "vue";
import * as Papa from "papaparse";
import { exampleInput, exampleOutput } from "@/data/converter-example.json";

export default Vue.extend({
  name: "Qualtrics",
  data() {
    return {
      exampleInput: exampleInput,
      exampleOutput: exampleOutput,
      csvQualtricsInput: "",
      csvRankingsMatrix: "",
      parsedQualtricsCsv: [],
      studentCompaniesMap: {},
      companies: [],
    };
  },
  watch: {
    csvQualtricsInput: function() {
      this.convert();
    },
  },
  created() {
    document.title = "Kellogg CMC Job Fair Interview Optimizer";
  },
  methods: {
    __parsedQualtricsCsv() {
      return Papa.parse(this.csvQualtricsInput).data;
    },

    __companies() {
      // This code loops through the CSV data and adds each company to a list of companies and returns it.
      // The variable 'companies' holds the list of companies.
      // The variable 'company' holds the name of the company.
      // The variable 'data' holds the CSV data.
      // The variable 'i' loops through the rows of the CSV data.
      // 'i' starts at 2 because the first two rows are the header row.
      // The variable 'j' loops through the columns of the CSV data.
      // 'j' Starts at 19 because the first 18 columns are not company names.
      // The variables 'i' and 'j' will be replaced eventually with user input.

      let data = this.parsedQualtricsCsv;
      let companies = [];
      for (let i = 2; i < data.length; i++) {
        for (let j = 19; j < 24; j++) {
          let company = data[i][j];
          if (company && !companies.includes(company)) {
            companies.push(company);
          }
        }
      }
      return companies;
    },

    __studentCompaniesMap() {
      // This code loops through the CSV data and creates a map of students to companies.
      // Specifically, it is matching students to the companies they ranked where the student
      // name is the key, and the value is a list of companies in the order they ranked them.

      // The variable 'data' holds the CSV data.
      // The variable 'studentCompaniesMap' holds the map of students to companies.

      // The variable 'student_name' holds the name of the student.
      // We reference data[i][17] and data[i][18] because the student name is in the 17th and 18th columns.
      // For future proofing, 'i' and the correspeonding value will be supplied by the user
      // in the future.

      // The variable 'companies' holds the list of companies.

      // The variable 'i' loops through the rows of the CSV data.
      // 'i' starts at 2 because the first two rows are the header row.
      // The variable 'j' loops through the columns of the CSV data.
      // 'j' Starts at 19 because the first 18 columns are not company names.

      // The variables 'i' and 'j' will be replaced eventually with user input.

      let data = this.parsedQualtricsCsv;
      let studentCompaniesMap = {};
      for (let i = 2; i < data.length; i++) {
        let student_name = data[i][17] + " " + data[i][18];
        if (student_name != "undefined undefined") {
          let companies = [];
          for (let j = 19; j < 24; j++) {
            companies.push(data[i][j]);
          }
          studentCompaniesMap[student_name] = companies;
        }
      }
      return studentCompaniesMap;
    },

    __rankingsMatrix() {
      // This code loops through the studentCompaniesMap and creates a matrix of rankings.

      // The variable 'output' holds the rankings matrix.
      // The variable 'header' holds the header row of the rankings matrix.
      // The variable 'row' holds the current row of the rankings matrix.
      // The variable 'student' holds the name of the student.
      // The variable 'company' holds the name of the company.
      // The variable 'ranking' holds the ranking of the company for the student.
      // The variable 'studentCompaniesMap' holds the map of students to companies.
      // The variable 'companies' holds the list of companies.

      // Due to the companies being inserted into the map in the order they were ranked,
      // the ranking is the index of the company in the associated list of companies plus 1.

      let output = [];
      let header = ["Student ID", ...this.companies];
      output.push(header);

      for (let student in this.studentCompaniesMap) {
        let row = [student];
        for (let company of this.companies) {
          let ranking = this.studentCompaniesMap[student].indexOf(company) + 1;
          if (ranking == 0) {
            ranking = "";
          }
          row.push(ranking);
        }
        output.push(row);
      }

      return output;
    },

    convert() {
      this.parsedQualtricsCsv = this.__parsedQualtricsCsv();
      this.studentCompaniesMap = this.__studentCompaniesMap();
      this.companies = this.__companies();
      this.output = this.__rankingsMatrix();
      this.csvRankingsMatrix = Papa.unparse(this.__rankingsMatrix());
    },
  },
});
</script>

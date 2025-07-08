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
                  <p>
                    After pasting the data, the loading spinner will dissapear
                    and the table will become visible. Start by finding the cell
                    that contains the first student identifier. Right click and
                    choose "First Name". Then, find the cell that contains the
                    last student identifier. Right click and choose "Last Name".
                    Repeat this process for the first and last company
                    identifier. Now, click convert at the bottom of the screen.
                    After selecting the identifiers, for ease of use to click
                    the convert button, you may want to click the show / hide
                    table button.
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
      <v-col cols="12" md="10">
        <v-btn @click="toggleTable" class="success">Show / Hide Table</v-btn>
      </v-col>
      <ve-table
        ref="tableRef"
        id="table"
        fixed-header
        border-y
        :columns="columnNames"
        :table-data="tableData"
        :rowStyleOption="rowStyleOption"
        rowKeyFieldName="rowKey"
        :contextmenu-body-option="contextmenuBodyOption"
      />
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
import { veLoading } from "vue-easytable";

Vue.prototype.$veLoading = veLoading;
export default Vue.extend({
  name: "Qualtrics",
  data() {
    return {
      showTable: true,
      loadingInstance: null,
      rowStyleOption: {
        clickHighlight: false,
        hoverHighlight: false,
        stripe: true,
      },
      cellSelectionOption: {
        // disble cell selection
        enable: true,
      },

      // contextmenu body option
      contextmenuBodyOption: {
        // after menu click
        afterMenuClick: ({
          type,
          selectionRangeKeys,
          selectionRangeIndexes,
        }) => {
          const startColIndex = selectionRangeIndexes.startColIndex;
          const startRowIndex = selectionRangeIndexes.startRowIndex + 1;
          const cellValue = this.parsedQualtricsCsv[startRowIndex][
            startColIndex
          ];
          // Call print cell value funtion

          switch (type) {
            case "first-name":
              this.pushToArray(type, [startRowIndex, startColIndex]);
              break;
            case "last-name":
              this.pushToArray(type, [startRowIndex, startColIndex]);
              break;
            case "first-company":
              this.pushToArray(type, [startRowIndex, startColIndex]);
              break;
            case "last-company":
              this.pushToArray(type, [startRowIndex, startColIndex]);
              break;
            default:
              break;
          }
        },

        // contextmenus
        contextmenus: [
          {
            type: "first-name",
            label: "First Name",
          },
          {
            type: "last-name",
            label: "Last Name",
          },
          {
            type: "SEPARATOR",
          },
          {
            type: "first-company",
            label: "First Company",
          },
          {
            type: "last-company",
            label: "Last Company",
          },
        ],
      },
      tableData: [{}],
      exampleInput: exampleInput,
      exampleOutput: exampleOutput,
      csvQualtricsInput: "",
      csvRankingsMatrix: "",
      parsedQualtricsCsv: [],
      studentCompaniesMap: {},
      companies: [],
      columnNames: [{}],
      firstStudentIdentifierIndex: [],
      lastStudentIdentifierIndex: [],
      firstCompanyIdentifierIndex: [],
      lastCompanyIdentifierIndex: [],
    };
  },
  watch: {
    csvQualtricsInput: function() {
      this.displayTable();
      this.loadingInstance.close();
    },
  },
  created() {
    document.title = "Kellogg CMC Job Fair Interview Optimizer";
  },
  mounted() {
    this.loadingInstance = this.$veLoading({
      target: document.querySelector("#table"),
      tip: "Waiting for CSV input...",
      name: "bounce",
    });
    this.show();
  },
  methods: {
    show() {
      this.loadingInstance.show();
    },
    close() {
      this.loadingInstance.close();
    },

    toggleTable() {
      // Hide table using document.getElementById("table").style.display = "none";
      if (this.showTable == true) {
        document.getElementById("table").style.display = "none";
        this.showTable = false;
        return;
      }
      document.getElementById("table").style.display = "block";
      this.displayTable = true;
    },

    pushToArray(type, indexes) {
      switch (type) {
        case "first-name":
          this.firstStudentIdentifierIndex = indexes;
          break;
        case "last-name":
          this.lastStudentIdentifierIndex = indexes;
          break;
        case "first-company":
          this.firstCompanyIdentifierIndex = indexes;
          break;
        case "last-company":
          this.lastCompanyIdentifierIndex = indexes;
          break;
        default:
          break;
      }
    },

    __parsedQualtricsCsv() {
      return Papa.parse(this.csvQualtricsInput).data;
    },

    __printCellValue(cellValue) {
      console.log(cellValue);
    },

    __columnNames() {
      // Get column names from this.csvQualtricsInput. Save as objects
      // with the following structure : { field: "name", key: "a", title: "Name", align: "center" },
      // where "name" is the name of the column, "a" is the key for the column, "Name" is the title
      // of the column, and "center" is the alignment of the column.
      let columnNames = [];
      let data = this.parsedQualtricsCsv;
      for (let i = 0; i < data[0].length; i++) {
        columnNames.push({
          field: data[0][i],
          key: data[0][i],
          title: data[0][i],
          align: "center",
        });
      }
      return columnNames;
    },

    __tableData() {
      // Convert this.parsedQualtricsCsv to a tableData object where the key is the column name and the value
      // is the value of the cell in the column.
      // Also include a rowKey field that is the row number.
      let tableData = [];
      let data = this.parsedQualtricsCsv;
      for (let i = 1; i < data.length; i++) {
        let row = {};
        for (let j = 0; j < data[i].length; j++) {
          row[data[0][j]] = data[i][j];
        }
        row["rowKey"] = i;
        tableData.push(row);
      }
      return tableData;
    },

    __companies() {
      // This code loops through the CSV data and adds each company to a list of companies and returns it.
      // The variable 'companies' holds the list of companies.
      // The variable 'company' holds the name of the company.
      // The variable 'data' holds the CSV data.
      // The variable 'i' loops through the rows of the CSV data.
      // 'i' starts at the first index of the variable firstCompanyIdentifierIndex. This contains the row number of the first company.
      // The variable 'j' loops through the columns of the CSV data.
      // 'j' starts at the second index of the variable firstCompanyIdentifierIndex. This contains the column number of the first company.
      // 'j' Will loop through until it has reached the end of the companies which is denoted by lastCompanyIdentifierIndex[1].

      let data = this.parsedQualtricsCsv;
      let companies = [];
      for (let i = this.firstCompanyIdentifierIndex[0]; i < data.length; i++) {
        for (
          let j = this.firstCompanyIdentifierIndex[1];
          j <= this.lastCompanyIdentifierIndex[1];
          j++
        ) {
          let company = data[i][j];
          // First attempt to convert company to a number (from a string). If it is a number, then it is not a company. Ignore it.
          if (isNaN(company)) {
            // If the company is not a number, then check if it is already in the list of companies.
            // If it is not in the list of companies, then add it to the list of companies.
            if (company && !companies.includes(company)) {
              companies.push(company);
            }
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
      for (let i = this.firstStudentIdentifierIndex[0]; i < data.length; i++) {
        let student_name =
          data[i][this.firstStudentIdentifierIndex[1]] +
          " " +
          data[i][this.lastStudentIdentifierIndex[1]];
        if (student_name != "undefined undefined") {
          let companies = [];
          for (
            let j = this.firstCompanyIdentifierIndex[1];
            j <= this.lastCompanyIdentifierIndex[1];
            j++
          ) {
            if (data[i][j] != "") {
              companies.push(data[i][j]);
            }
          }
          studentCompaniesMap[student_name] = companies;
          console.log(student_name, studentCompaniesMap[student_name]);
        } else {
          console.log("Student name is undefined, skipping");
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
        //

        output.push(row);
      }

      return output;
    },

    displayTable() {
      this.parsedQualtricsCsv = this.__parsedQualtricsCsv();
      this.columnNames = this.__columnNames();
      this.tableData = this.__tableData();
    },

    convert() {
      this.parsedQualtricsCsv = this.__parsedQualtricsCsv();
      this.columnNames = this.__columnNames();
      this.tableData = this.__tableData();
      console.log(this.parsedQualtricsCsv);
      this.studentCompaniesMap = this.__studentCompaniesMap();
      this.companies = this.__companies();
      this.output = this.__rankingsMatrix();
      this.csvRankingsMatrix = Papa.unparse(this.__rankingsMatrix());
    },
  },
});
</script>

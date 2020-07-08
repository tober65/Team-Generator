const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const questions = [
    {
        type: "input",
        message: "What is the employee's name?",
        name: "name",
    },
    {
        type: "input",
        message: "What is the employee's ID?",
        name: "id",
    },
    {
        type: "input",
        message: "What is the employee's email?",
        name: "email",
    }
];

const employeeList = [];
let html;

// Prompt the user for a new worker
function promptForWorker(workerType) {
    const allQuestions = [...questions];

    // Add the last question based on the worker type
    switch (workerType) {
        case "Manager":
            allQuestions.push({
                type: "input",
                message: "What is the employee's office number?",
                name: "office",
            });
            break;
        case "Engineer":
            allQuestions.push({
                type: "input",
                message: "What is the employee's GitHub username?",
                name: "github",
            });
            break;
        case "Intern":
            allQuestions.push({
                type: "input",
                message: "What is the employee's school?",
                name: "school",
            });
            break;
        default:
            break;
    }

    // Add the add new employee question to the end
    allQuestions.push({
        type: "list",
        message: "Do you want to add another employee?",
        name: "employeeType",
        choices: [
          "Engineer",
          "Intern",
          "None"
        ],
      })

      // Prompt the user all the questions and build the employee object
    inquirer.prompt(allQuestions).then(function (answers) {
        switch (workerType) {
            case "Manager":
                employeeList.push(new Manager(answers.name, answers.id, answers.email, answers.office))
                break;
            case "Engineer":
                employeeList.push(new Engineer(answers.name, answers.id, answers.email, answers.github))
                break;
            case "Intern":
                employeeList.push(new Intern(answers.name, answers.id, answers.email, answers.school))
                break;
            default:
                break;
        }
        
        // keep prompting until None is selected
        if (answers.employeeType !== "None") {
            promptForWorker(answers.employeeType);
        }
        else {
            // call render and write the file
            console.log("Calling render");
            html = render(employeeList);

            fs.writeFile("output/team.html", html, function(error) {
                if (error) {
                  return console.log(error);
                }
                console.log("Success!");
              });
        }
    });
}

// Always prompt for a manager to start
promptForWorker("Manager");
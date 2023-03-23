// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require("inquirer");
require("console.table");


// Connect to database
const connection = mysql.createConnection(
    {
        host: '127.0.0.1',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '',
        database: 'tracker_db'
    },
    console.log(`Connected to the employee tracker_db database.`)
);


const menu = () => {
    inquirer
        .prompt({
            name: "start",
            type: "list",
            message: "Which of the following you wish to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add a Department",
                "Add Role",
                "Add an Employee",
                "View Employees by Manager",
                "View Employees by Department",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.start) {
                case "View All Departments":
                    viewAllDepartments();
                    break;

                case "View All Roles":
                    viewAllRoles();
                    break;

                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "Add a Department":
                    addDepartment();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add an Employee":
                    addEmployee();
                    break;

                case "View Employees by Manager":
                    viewEmployeesByManager();
                    break;

                case "View Employees by Department":
                    viewEmployeesByDepartment();
                    break;

                case "Exit":
                    exit();
                    break;
            }
        });
};

function viewAllDepartments() {
    const query =
        'SELECT department.id AS ID, department.name AS NAME FROM department;';
 connection.query(query, (err, data)=> {
    if (err) throw err;
    console.table(data);
    menu();
 });
};

function viewAllRoles() {
    const query =
        'SELECT role.id AS ID, role.title as TITLE, role.salary AS SALARY, department.name as DEPARTMENT FROM role LEFT JOIN department ON role.department_id = department.id;';
     connection.query(query, (err, data)=> {
        if (err) throw err;
        console.table(data);
        menu();
     });
};


function viewAllEmployees() {
    const query =
        'SELECT employee.id AS ID, employee.first_name AS FIRST_NAME, employee.last_name AS LAST_NAME,role.title AS TITLE, department.name AS DEPARTMENT, role.salary AS SALARY, CONCAT(manager.first_name," ", manager.last_name) AS MANAGER FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;';

         connection.query(query, (err, data)=> {
            if (err) throw err;
            console.table(data);
            menu();
         });
};

function addDepartment() {
  inquirer
  .prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the department?",
    },
  ])
  .then((data) => {
    const { name } = data;
    connection.query(
      `INSERT INTO department (name) VALUES (?)`, [name], (err, res) => {
        if (err) throw err;
        console.log(
          `${name} has been added to the list of departments`
        );
        viewAllDepartments();
      }
    );
  });
};

function addRole() {
    inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the role title to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
      },
      {
        type: "list",
        name: "department_name",
        message: "What is the department related to this role?",
        choices: ["Management", "Marketing", "Finance", "Procurement", "ICT"],
      },
    ])
    .then((data) => {
        const { title, salary, department_name } = data;
        connection.query(
          `INSERT INTO role (title, salary, department_id)
          SELECT ?, ?, department.id
          FROM department
          LEFT JOIN role ON department.id = role.department_id
          WHERE department.name = ?`,
          [title, salary, department_name],
          (err, res) => {
            if (err) throw err;
            console.log(
              `${title} has been added to the role table`
            );
            viewAllRoles();
          }
        );
      });
};

function addEmployee() {
  connection.query('SELECT * FROM role', (err, role) => {
      if (err) throw err;
  connection.query('SELECT * FROM employee', (err, employee) => {
          if (err) throw err;
          inquirer.prompt([
              {
                  type: 'input',
                  name: 'firstName',
                  message: 'What is the first name of the new employee?',
              },
              {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the new employee?',
            },
              {
                  type: 'list',
                  name: 'roleId',
                  message: 'What is the role of the new employee?',
                  choices: role.map((role) => {
                      return {
                          name: role.job_title,
                          value: role.id
                      }
                  }),
              },
              {
                  type: 'list',
                  name: 'managerld',
                  message: 'Who is the managerof the new employee?',
                  choices: employee.map((employee) => {
                      return {
                          name: `${employee.first_name} ${employee.last_name}`,
                          value: employee.id
                      }
                  })
              }
          ]).then((answer) => {
              connection.query('INSERT INTO employee SET ?', {
                  first_name: answer.firstName,last_name: answer.lastName, role_id: answer.roleId, 
                  manager_id: answer.managerId}, 
              (err, res) => {
                  if (err) throw err;
                  console.log(`New employee added.`);
                  viewAllEmployees();
              });
          });
      });
  });
}


function viewEmployeesByManager() {
    const query = `SELECT 
     employee.id, 
    employee.first_name, 
     employee.last_name, 
     role.title, 
     department.name AS 
     department, 
     CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
     FROM employee 
     LEFT JOIN role ON employee.role_id = role.id 
     LEFT JOIN department ON role.department_id = department.id 
     LEFT JOIN employee manager ON manager.id = employee.manager_id 
     ORDER BY manager;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      menu();
    });
  };


  function viewEmployeesByDepartment() {
    const query = `SELECT 
     employee.id, 
    employee.first_name, 
     employee.last_name, 
     role.title, 
     department.name AS 
     department, 
     CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
     FROM employee 
     LEFT JOIN role ON employee.role_id = role.id 
     LEFT JOIN department ON role.department_id = department.id 
     LEFT JOIN employee manager ON manager.id = employee.manager_id 
     ORDER BY department;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      menu();
    });
  };

menu();
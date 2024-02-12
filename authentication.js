const fs = require("fs");
const readline = require("readline");

const userPath = "users.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const loadUsers = () => {
  try {
    const data = fs.readFile(userPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveUser = (user) => {
    fs.writeFileSync(userPath, JSON.stringify(user, null, 2), 'utf-8')
}


const generateNumber = () => {
    return Math.floor(1000 + Math.random() * 9000)
}

const addUser = () => {
    rl.question('Enter your name: ', (name) => {
        const pin = generateNumber().toString()
        const accountID = 'ACC' + generateNumber().toString()

        const newUser = {
            accountID,
            name,
            pin,
            balance: 0.0,
            transactions: [],
        }
        const users = loadUsers()
        users.push(newUser)

    })
}

// const fs = require('fs');
// const readline = require('readline');

// const USERS_FILE_PATH = 'users.json';

// const rl = readline.createInterface({
// input: process.stdin,
// output: process.stdout,
// });

// // Load users from the JSON file
// const loadUsers = () => {
// try {
//     const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
//     return JSON.parse(data);
// } catch (error) {
//     return [];
// }
// };

// // Save users to the JSON file
// const saveUsers = (users) => {
// fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
// };

// // Generate a unique four-digit number
// const generateFourDigitNumber = () => {
// return Math.floor(1000 + Math.random() * 9000);
// };

// // Add a new user to the system
// const addUser = () => {
// rl.question('Enter your name: ', (name) => {
//     const pin = generateFourDigitNumber().toString();
//     const accountID = 'ACC' + generateFourDigitNumber().toString();

//     const newUser = {
//     accountID,
//     name,
//     pin,
//     balance: 0.0,
//     transactions: [],
//     };

//     const users = loadUsers();
//     users.push(newUser);
//     saveUsers(users);

//     console.log('User added successfully!');
//     // rl.close();
//     authenticateUser();
// });
// };

// // Authenticate a user based on accountID and pin
// const authenticateUser = () => {
// rl.question('Enter your accountID: ', (accountID) => {
//     rl.question('Enter your pin: ', (pin) => {
//     const users = loadUsers();
//     const user = users.find((u) => u.accountID === accountID && u.pin === pin);

//     if (user) {
//         console.log('Authentication successful!');
//         console.log('Welcome, ' + user.name + '!');
//     } else {
//         console.log('Authentication failed. Invalid accountID or pin.');
//     }

//     rl.close();
//     });
// });
// };

// // Example usage
// addUser(); // Add a new user
// // authenticateUser(); // Authenticate a user

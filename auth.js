const fs = require('fs');
const readline = require('readline');

const USERS_FILE_PATH = 'users.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Load users from the JSON file
const loadUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save users to the JSON file
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
};

// Generate a unique four-digit number
const generateFourDigitNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// Authenticate a user based on accountID and pin
const authenticateUser = (callback) => {
  rl.question('Enter your accountID: ', (accountID) => {
    rl.question('Enter your pin: ', (pin) => {
      const users = loadUsers();
      const user = users.find((u) => u.accountID === accountID && u.pin === pin);

      if (user) {
        console.log('Authentication successful!');
        callback(user); // Pass the authenticated user to the provided callback function
      } else {
        console.log('Authentication failed. Invalid accountID or pin.');
        rl.close();
      }
    });
  });
};

// Add a new user to the system
const addUser = () => {
  rl.question('Enter your name: ', (name) => {
    const pin = generateFourDigitNumber().toString();
    const accountID = 'ACC' + generateFourDigitNumber().toString();

    const newUser = {
      accountID,
      name,
      pin,
      balance: 0.0,
      transactions: [],
    };

    const users = loadUsers();
    users.push(newUser);
    saveUsers(users);

    console.log('User added successfully!');
    authenticateAndPerformActions(newUser); // Pass the newly created user to perform actions
  });
};

// Authenticate a user and perform actions
const authenticateAndPerformActions = (user) => {
  console.log('Welcome, ' + user.name + '!');

  // Actions menu
  console.log('Actions:');
  console.log('1. Check Balance');
  console.log('2. Deposit Money');
  console.log('3. Withdraw Money');
  console.log('4. View Transaction History');
  console.log('5. Exit');

  rl.question('Enter the number of the action you want to perform: ', (action) => {
    switch (action) {
      case '1':
        checkBalance(user);
        break;
      case '2':
        rl.question('Enter the amount to deposit: $', (amount) => {
          depositMoney(user, parseFloat(amount));
        });
        break;
      case '3':
        rl.question('Enter the amount to withdraw: $', (amount) => {
          withdrawMoney(user, parseFloat(amount));
        });
        break;
      case '4':
        viewTransactionHistory(user);
        break;
      case '5':
        console.log('Exiting...');
        rl.close();
        break;
      default:
        console.log('Invalid action. Please enter a valid number.');
        authenticateAndPerformActions(user);
    }
  });
};

// Display user balance
const checkBalance = (user) => {
  console.log(`Current Balance: $${user.balance.toFixed(2)}`);
  authenticateAndPerformActions(user);
};

// Deposit money into user account
const depositMoney = (user, amount) => {
  user.balance += amount;
  user.transactions.push({
    type: 'deposit',
    amount,
    date: new Date().toISOString().split('T')[0],
  });
  saveUsers(loadUsers());
  console.log(`Deposit successful! New Balance: $${user.balance.toFixed(2)}`);
  authenticateAndPerformActions(user);
};

// Withdraw money from user account
const withdrawMoney = (user, amount) => {
  if (amount > user.balance) {
    console.log('Insufficient funds. Withdrawal failed.');
  } else {
    user.balance -= amount;
    user.transactions.push({
      type: 'withdraw',
      amount,
      date: new Date().toISOString().split('T')[0],
    });
    saveUsers(loadUsers());
    console.log(`Withdrawal successful! New Balance: $${user.balance.toFixed(2)}`);
  }
  authenticateAndPerformActions(user);
};

// Display transaction history for a user
const viewTransactionHistory = (user) => {
  console.log('Transaction History:');
  user.transactions.forEach((transaction) => {
    console.log(`${transaction.date}: ${transaction.type} $${transaction.amount.toFixed(2)}`);
  });
  authenticateAndPerformActions(user);
};

// Main function to choose between authentication and user creation
const main = () => {
  console.log('Choose an option:');
  console.log('1. Authenticate User');
  console.log('2. Add User');
  rl.question('Enter the number of the option you want to choose: ', (option) => {
    switch (option) {
      case '1':
        authenticateUser(authenticateAndPerformActions);
        break;
      case '2':
        addUser();
        break;
      default:
        console.log('Invalid option. Exiting...');
        rl.close();
    }
  });
};

// Example usage
main(); // Start the program by choosing between authentication and user creation

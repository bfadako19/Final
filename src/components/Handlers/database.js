// import openDatabase hook
import { openDatabase } from "react-native-sqlite-storage";

// use hook to create database
const myRemindersDB = openDatabase({ name:  'MyRemindersDB' });
const remindersTableName = 'reminders';



module.exports = {
    createRemindersTable: async function () {
        (await myRemindersDB).transaction(txn => {
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS ${remindersTableName}(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    description TEXT,
                    date TEXT
                    priority TEXT,
                );`,
                [],
                () => {
                    console.log('Reminders table created successfully');
                },
                error => {
                    console.log('Error creating reminders table ' + error.message);
                },
            );
        });
    },

    addReminder: async function (title, description, date, priority) {
        (await myRemindersDB).transaction(txn => {
            txn.executeSql(
                `INSERT INTO ${remindersTableName} (title, description, date, priority) VALUES ("${title}", "${description}", "${date}","${priority}")`,
                [],
                () => {
                    console.log(title + " added successfully");
                },
                error => {
                    console.log('Error adding reminder ' + error.message);
                },
            );
        });
    },

};
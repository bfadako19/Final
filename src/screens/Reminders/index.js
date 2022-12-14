import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import Reminder from '../../components/Reminder';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { openDatabase } from "react-native-sqlite-storage";

const myRemindersDB = openDatabase({name: 'MyRemindersDB'});
const remindersTableName = 'reminders';

const RemindersScreen = props => {

  const navigation = useNavigation();

  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      let results = [];
      myRemindersDB.transaction(txn => {
        txn.executeSql(
          `SELECT * FROM ${remindersTableName}`,
          [],

          (_, res) => {
            let len = res.rows.length;
            console.log('Length of reminders ' + len);
            if (len > 0){
              for (let i = 0; i < len; i++){
                let item = res.rows.item(i);
                results.push({
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  date: item.date,
                  priority: item.priority,
                });
              }
              setReminders(results);
            } else {
              setReminders([]);
            }
          },
          error => {
            console.log('Error getting reminders ' + error.message);
          },
        )
      });
    });
    return listener;
  });

  return (
    <View style={styles.container}>
      <View>
        <FlatList 
          data={reminders}
          renderItem={({item}) => <Reminder post={item} />}
          keyExtractor={item => item.id}
        />
      </View>
        <View style={styles.bottom}>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('Add Reminder')}
                >
                <Text style={styles.buttonText}>Add Reminder</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default RemindersScreen;
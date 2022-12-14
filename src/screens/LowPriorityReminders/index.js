import React, {useState, useEffect} from 'react';
import {View,FlatList} from 'react-native';
import Reminder from '../../components/Reminder';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { openDatabase } from "react-native-sqlite-storage";

const myRemindersDB = openDatabase({ name: 'MyReminders.db' });
const remindersTableName = 'reminders';
const LowScreen = props => {

    const post = props.route.params.post;
    const navigation = useNavigation();
    const [reminders,setReminders] = useState([]);
    useEffect(() => {
        listener = navigation.addListener('focus', () => {
         let results = [];
         myRemindersDB.transaction(txn => {
         txn.executeSql(
           `SELECT * item.id, name, price, quantity FROM ${remindersTableName},
            WHERE item.priority = 'Low'`,
           [],
           (_, res) => {
           let len = res.rows.length;
           console.log('Length of reminders ' + len);
           if (len>0){
             for(let i = 0; i < len; i++){
               let item = res.rows.item(i);
               results.push({
               id : item.id,
               title: item.title,
               description: item.description,
               date: item.date,
               priority: item.priority
               });
             }
             setReminders(results);
      
           } else{
             setReminders([]);
           } 
           },
           error => {
           console.log('Error getting reminders' + error.message);  
           },
         )  
         });
       });
       return listener;
      });
      
    return(
        <View style={styles.container}>
      <View>
        <FlatList
          data={reminders}
          renderItem={({item}) => <Reminder post={item}/>}
          keyExtractor={item => item.id}
        />
        
      </View>
    </View>
    );
};

export default LowScreen;
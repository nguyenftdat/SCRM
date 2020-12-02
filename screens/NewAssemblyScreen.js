//React import here
import * as React from 'react';
//External imports here
import { 
  Container, 
  Content, 
  Text, 
  View, 
  Button, 
  Body,
  Toast} from 'native-base';
import { ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import CardGroupThietBi from '../components/CardGroupThietBi';
import { GroupThietBi, ThietBiRow } from '../models/GroupThietBi';
import ModalAddThietBi from '../components/ModalAddThietBi';

const NewAssemblyScreen = ({route, navigation}) => {
  const schedule = route.params.schedule;
  const [state, setState] = React.useState({
    contractNumber: "",
    groups: []
  });
  const modalAddThietBi = React.useRef(null);
  const showModalAddThietBi = (index:number) => () => {
    modalAddThietBi.current.showModal(index);
  }

  const addGroup = () => {
    if(state.contractNumber.length==0){
      Toast.show({
        text: 'Vui lòng nhân viên nhập số hợp đồng.',
        duration: 2000,
        position: "top",
        textStyle: { textAlign: "center" },
      })
    }
    else {
      setState((previousState) => ({
        contractNumber:"",
        groups: [...previousState.groups, 
        {
          MaThueBao: "",
          SO_HOPDONG: state.contractNumber,
          ListThietBi:[]
        }],
      }));
    }
  }
  const removeGroup = (index:number) => () =>{
    let groups:Array<GroupThietBi> = [...state.groups];
    groups.splice(index,1);
    setState({groups});
  }

  const addItem = (index:number, item:ThietBiRow) => {
    let groups:Array<GroupThietBi> = [...state.groups];
    groups[index].ListThietBi.push(item);
    setState({groups});
  }
  const removeItem = (groupIdx:number) => (index:number) => () => {
    let groups:Array<GroupThietBi> = [...state.groups];
    groups[groupIdx].ListThietBi.splice(index,1);
    setState({groups});
  }
  const onSaveData = () => {
    if(state.groups.length === 0){
      Alert.alert(
        'Thông báo',
        'Hiện tại bạn chưa nhập thiết bị bạn có chắc chắn bỏ qua không.',
        [
          {text: 'YES', onPress: () => navigation.navigate('FinishScheduleModal', {schedule: schedule, thietBiSuDung: state.groups})},
          {text: 'NO', onPress: () => console.log('Cancel Pressed')},
        ],
                // { cancelable: true }  
      );
    }
    else {
      navigation.navigate('FinishScheduleModal', {schedule: schedule, thietBiSuDung: state.groups});
    }
  }
  return (
    <ScrollView style={{padding: 10}}>
      <View style={styles.header}>
        <TextInput 
          style={styles.textInput}
          placeholder='>Nhập mã số hợp đồng'
          onChangeText={(contractNumber)=> setState({...state, contractNumber})}
          value={state.contractNumber}
          placeholderTextColor='white'
          underlineColorAndroid='transparent'>
        </TextInput>
        <Button onPress={addGroup}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </Button>
      </View>
      {state.groups.map((item, index)=>(
        <CardGroupThietBi group={item} key={index} 
          showModal={showModalAddThietBi(index)}
          removeGroup={removeGroup(index)}
          removeItem={removeItem(index)}/>
      ))}
      <ModalAddThietBi ref={(el) => modalAddThietBi.current = el} addItem={addItem}/>
      <Button full rounded style={{ margin: 40, marginBottom: 10, marginTop: 10}}
        onPress={onSaveData}>
        <Text>Lưu</Text>
      </Button>
    </ScrollView>    
    
  );
};
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#4f81bd',
        alignItems: 'center',
        justifyContent:'center',
        borderBottomWidth: 10,
        borderBottomColor: '#ddd'
    },
    
    textInput: {
        alignSelf: 'stretch',
        color: '#fff',
        padding: 20,
        backgroundColor: '#252525',
        borderTopWidth:2,
        borderTopColor: '#ededed'
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 10,
        top: 5,
        backgroundColor: '#4f81bd',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },
});
export default NewAssemblyScreen;
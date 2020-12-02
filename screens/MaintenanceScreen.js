//React import here
import * as React from 'react';
//External imports here
import { 
  Container, 
  Content, 
  Text, 
  View, 
  Button, 
  Body} from 'native-base';
import { ScrollView, Alert } from 'react-native';
import CardGroupThietBi from '../components/CardGroupThietBi';
import { GroupThietBi, ThietBiRow } from '../models/GroupThietBi';
import ModalAddThietBi from '../components/ModalAddThietBi';

const MaintenanceScreen = ({route, navigation}) => {
  const schedule = route.params.schedule;
  let groups:Array<GroupThietBi> = [{
    SO_HOPDONG: "",
    MaThueBao: schedule.MaThueBao,
    ListThietBi: []
  }]
  const [state, setState] = React.useState({
    groups
  });
  const modalAddThietBi = React.useRef(null);
  const showModalAddThietBi = (index:number) => () => {
    modalAddThietBi.current.showModal(index);
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
    if(state.groups[0].ListThietBi.length === 0)
      {
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
        else{
            navigation.navigate('FinishScheduleModal', {schedule: schedule, thietBiSuDung: state.groups});
        }
  }
  return (
    <ScrollView style={{padding: 10}}>
      {state.groups.map((item, index)=>(
        <CardGroupThietBi group={item} key={index} 
          showModal={showModalAddThietBi(index)}
          removeGroup={removeGroup(index)}
          removeItem={removeItem(index)}/>
      ))}
      <ModalAddThietBi ref={(el) => modalAddThietBi.current = el} addItem={addItem}/>
      <Button full rounded style={{ margin: 40, marginBottom: 10, marginTop: 10}}
        onPress = {onSaveData}>
        <Text>Lưu</Text>
      </Button>
    </ScrollView>    
    
  );
};

export default MaintenanceScreen;

//@flow
import React from 'react';
import { Text, View, Form } from 'native-base';
import { TouchableOpacity, FlatList} from 'react-native';
import CommonModel from '../models/CommonModel';

type Props = {
    item:CommonModel,
    index:number,
    onPressItem:(Id:string)=>void
}

const ScheduleListItem = (props:Props) => {
    //const backgroundColor = props.item.Reference == 'LD' ? '#fac090' : '#95b3d7';
    let backgroundColor = '';
    if(props.item.Status == 'TIEPNHAN'){
        backgroundColor = '#27cd42';
    }
    else if(props.item.Value >=240)
    {
        backgroundColor = '#c00000';
    }
    else if(props.item.Value >=120)
    {
        backgroundColor = '#ffc000';
    }
    else if(props.item.Reference == 'LD')
    {
        backgroundColor = '#fac090';
    }
    else if(props.item.Reference == 'BT'){
        backgroundColor = '#95b3d7';
    }
    
    return (
        <TouchableOpacity onPress={()=>props.onPressItem(props.item.Id)}>
            <View style={{
                flex: 1, flexDirection: 'row',
                margin: 5,
                borderRadius: 2,
                backgroundColor: backgroundColor,
                padding: 5
            }}>
                <Text style={{ paddingHorizontal: 10, color: '#ecf2f1' }}>{props.item.Text}</Text>
                <Text style={{ paddingHorizontal: 10, color: '#ecf2f1' }}>{props.item.Data}</Text>
            </View>
        </TouchableOpacity>
    );
}

type ScheduleListProps = {
    listSchedule:Array<CommonModel>,
    onPressItem:(Id:string)=>void
}
export const ScheduleList = (props:ScheduleListProps) =>{
    return (
        <FlatList
            data={props.listSchedule}
            renderItem={({ item, index }) => {
                return (
                    <ScheduleListItem item = {item} index={index} onPressItem={props.onPressItem}/>
                );
            }}
            keyExtractor={(item, index) => 'key'+index}
        >
        </FlatList>
    )
    
}
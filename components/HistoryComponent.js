//@flow
import React from 'react';
import { Text, View } from 'native-base';
import { StyleSheet} from 'react-native';
import { ScheduleHistoryModel } from "../models/ScheduleHistoryModel";
import { formatDate } from '../utils/Utils';
const FlatListItem = (props) => {
    const item:ScheduleHistoryModel = props.item;
    return (
        <View style={{
            flex: 1, flexDirection: 'row',
            backgroundColor: props.index % 2 == 0 ? '#d0d8e8' :'#e9edf4'
        }}>
            <View style={{ flex: 1, flexDirection: 'column', borderWidth: 1, borderColor: 'white' }}>
                <Text style={{ paddingLeft: 10}}>{item.ketqua_xuly_ten == null ? item.ma_ketqua_xuly : item.ketqua_xuly_ten}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', borderWidth: 1, borderColor: 'white' }}>
                <Text style={{ paddingLeft: 10 }}>{formatDate(new Date(item.ngay_xuly))}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', borderWidth: 1, borderColor: 'white' }}>
                <Text style={{ paddingLeft: 10 }}>{item.ten_nguoi_xuly}</Text>
            </View>
        </View>
    );
}

export const HistoryComponent = (props) => {
    if(props.history === null || props.history === undefined){
        return(<View/>)
    }
    const history:Array<any> = props.history;
    if(history.length === 0)
        return(<View/>)
    else{
        return(
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{justifyContent: 'center'}}>
                    <View style={{ flexDirection: 'row', backgroundColor:'blue' }}>
                        <View style={styles.lichsuStyle}>
                            <Text style={{color: 'white'}}>Thao tác</Text>
                        </View>
                        <View style={styles.lichsuStyle}>
                            <Text style={{ color: 'white' }}>Ngày thao tác</Text>
                        </View>
                        <View style={styles.lichsuStyle}>
                            <Text style={{ color: 'white' }}>Người thao tác</Text>
                        </View>
                    </View>
                    {history.map((item, index) => {
                        return (
                            <FlatListItem item={item} index={index} key={'His'+index}/>
                        );
                    })}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    lichsuStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white'
    }
});
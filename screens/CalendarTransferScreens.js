//@flow
import React, { Component } from 'react';
import { Thumbnail,Container, Content,Toast, Input, Text, Label, View, Item, Form, Picker, Icon, List, ListItem, Left, Right, Body, Button } from 'native-base';
import { TextInput, Alert,StyleSheet, FlatList,Dimensions } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { CalendarTransferPayload } from '../models/CalendarTransferPayload';
import { callAPI, ApiMethods } from '../utils/ApiUtils';
import { UserContext } from '../context/UserContext';

const CalendarTransferScreens = ({ route, navigation }) => {
  let multiSelect = null;
  const { user, setUser } = React.useContext(UserContext);
  const schedule = route.params.schedule;
  const [state, setState] = React.useState({
    NVNhan: undefined,
            PGD: undefined,
            selectedItems: [],
  });
  const [variable, setVariable] = React.useState({
    listNhanVien: [],
    mangMaYeuCau: []
  });
  let listNhanVien = [];
  let mangMaYeuCau = [];
  React.useEffect(() => {
    resetState();
    mangMaYeuCau.push(schedule.ma_yeucau);
  }, [])
  const resetState = () => {
        setState({...state,
            PGD:global.listLich[0].DanhMucPGD[0].Id
        })
        listNhanVien = global.listLich[0].NhanVienTheoLich.filter((data) => {
            return data.Reference === global.listLich[0].DanhMucPGD.find(element => {
                if (element.Id === global.listLich[0].DanhMucPGD[0].Id)
                    return element;
            }).Id
        });
        setVariable({...variable, listNhanVien: listNhanVien});
    }
    const onValueChange_PGD = (value: string) => {
        setState({...state,
            PGD: value
        });
        listNhanVien = global.listLich[0].NhanVienTheoLich.filter((data) => {
            return data.Reference === global.listLich[0].DanhMucPGD.find(element => {
                if (element.Id === value)
                    return element;
            }).Id
        });
        setVariable({...variable, listNhanVien: listNhanVien});
    }
    const onSubmit = () => {
        if(state.selectedItems.length == 0)
        {
        Alert.alert(
            'Thông báo',
            'Vui lòng chọn nhân viên');
        }
        else{
        const payload:CalendarTransferPayload = {
            listMaYeuCau: mangMaYeuCau,
            nvNhan: state.selectedItems[0].toString()
        }
        callAPI(ApiMethods.SAP_LICH, user.Token, payload, processSubmit, null);
        }
    }
    const processSubmit = (data) => {
        Toast.show({
            text: "Chuyển lịch thành công",
            duration: 2000,
            position: "bottom",
            textStyle: { textAlign: "center" },
        });
        // global.refreshHome();
         navigation.navigate('Home');
    }

    const onSelectedItemsChange = (selectedItems) => {
        setState({...state, selectedItems:selectedItems });
      };

    
        return (
            <Container>
                <Content style={{backgroundColor: '#4f81bd'}}>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.viewText}>
                                <Text style={styles.textStyle}>Phòng giao dịch:</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Form style={styles.formStyle}>
                                    <Item Picker>
                                        <Picker
                                            mode='dropdown'
                                            iosIcon={<Icon name='ios-arrow-down-outline' />}
                                            style={{ width: undefined }}
                                            selectedValue={state.PGD}
                                            onValueChange={onValueChange_PGD}
                                        >
                                            {global.listLich[0].DanhMucPGD.map((item, index) => {
                                                    return (
                                                        <Picker.Item label={item.Text} value={item.Id} key={index} />
                                                    )
                                                })}
                                        </Picker>
                                    </Item>
                                </Form>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.viewText}>
                                <Text style={styles.textStyle}>Nhân viên nhận:</Text>
                            </View>
                            <View style={{ flex: 1,borderWidth: 1,paddingTop: 10,backgroundColor: '#ffffff',borderColor: '#7c7c7c'}}>
                            <MultiSelect
                                hideTags
                                single={true}
                                fontSize={15}
                                items={variable.listNhanVien.length>0 ? variable.listNhanVien : []}
                                uniqueKey="Id"
                                ref={(component) => { multiSelect = component }}
                                onSelectedItemsChange={onSelectedItemsChange}
                                selectedItems={state.selectedItems}
                                selectText="Chọn nhân viên"
                                searchInputPlaceholderText="Tìm kiếm nhân viên..."
                                altFontFamily="ProximaNova-Light"
                                tagRemoveIconColor="#CCC"
                                tagBorderColor="#CCC"
                                tagTextColor="#CCC"
                                textColor="#000"
                                selectedItemTextColor="#CCC"
                                selectedItemIconColor="#CCC"
                                itemTextColor="#000"
                                displayKey="Text"
                                searchInputStyle={{ color: '#000' }}
                            >
                            </MultiSelect>
                            </View>
                        </View>
                        <View style={styles.view_btn}>
                            <Button onPress={onSubmit}
                                // onPress={this.onload}
                                style={styles.btn_chuyenlich}>
                                <Text style={{ color: 'white' }}>Sắp lịch</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
}
export default CalendarTransferScreens;
const styles = StyleSheet.create({
    container:{ 
        flex: 1, 
        backgroundColor: '#4f81bd', 
        flexDirection: 'column' 
    },
    textStyle:{ 
        paddingLeft: 5, 
        color: 'white' 
    },
    viewText:{ 
        flex: 0.5, 
        justifyContent: 'center'
    },
    formStyle:{
        borderWidth: 1,
        borderColor: '#7c7c7c', 
        backgroundColor: 'white'
    },
     view_btn:{ 
        flex: 1, 
        justifyContent: 'center', 
        flexDirection: 'row' 
    },
    btn_chuyenlich:{ 
        borderRadius: 10, 
        backgroundColor: '#4bacc6', 
        marginTop: 30,
        justifyContent: 'center' 
    }
});
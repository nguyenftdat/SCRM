import React, { Component } from 'react';
import {Thumbnail, View, Button, Text, Form, Picker, Item, Icon, Textarea, Input, Container, List, Content, Toast ,ListItem} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import * as Location from 'expo-location';
import { StyleSheet, FlatList,Dimensions,Alert } from 'react-native';
import MapView from 'react-native-maps';
import { callAPI, ApiMethods } from '../utils/ApiUtils';
import { ReasonModel } from "../models/ReasonModel";
import { CommonModel } from "../models/CommonModel";
import { FinishSchedulePayload } from '../models/FinishSchedulePayload';
import { ScheduleModel } from '../models/ScheduleModel';
import {CustomerLocationPayload} from '../models/CustomerLocationPayload';
import locationpng from '../assets/img/location.png';
import orangeMarkerImg from '../assets/img/nhakh.png';
import { UserContext } from '../context/UserContext';

const FinishScheduleModal = ({route, navigation}) => {
  let map: MapView = null;
  var list_LNN = [];
  var list_NN = [];
  const schedule = route.params.schedule;
  const thietBiSuDung = route.params.thietBiSuDung;
  const { user, setUser } = React.useContext(UserContext);
  const [status, setStatus] = React.useState('denied');
  const [variable, setVariable] = React.useState({
    list_LNN: [],
    list_NN: []
  });
  const [state, setState] = React.useState({
    reasons:[],
    material:[],
    device:false,
    ndxuly:'',
    loaiTB1:'',
    loaiTB2:'',
    selectedKey:'',
    selectedKeyPV:'',
    selectedKeyLNN:'',
    selectedKeyMaKQXL:'',
    focusedlocation_KH:{
      latitude: 10.7725504,
      longitude: 106.6958526,
      latitudeDelta: 0.0122,
      longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.0122},
    locationChosen_KH: false,
    focusedlocation: {
      latitude: 13.0162143,
      longitude: 77.5474441,
      latitudeDelta: 0.0122,
      longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.0122
    },
    locationChosen: false,
  });
  // Ma ket qua xu ly
  const onValueChangeMaKQXL = (value: string) => {
    setState({...state, selectedKeyMaKQXL: value})
  };
  // Phạm vi
  const onValueChangePV = (value: string) => {
    list_LNN = global.listFinish[0].LoaiNguyenNhan.filter((data) => {
      return data.Reference === global.listFinish[0].PhamVi.find(element => {
        if (element.Id === value)
          return element;
      }).Id
    });
    list_NN = global.listFinish[0].NguyenNhan.filter((data) => {
      return data.Reference === global.listFinish[0].LoaiNguyenNhan.find(element => {
        if (element.Id === list_LNN[0].Id)
          return element;
      }).Id
    });
    setVariable({...variable, list_LNN: list_LNN, list_NN: list_NN});
    setState({...state,
      selectedKeyPV: value,
      selectedKeyLNN: list_LNN[0].Id,
      selectedKey: list_NN[0].Id,
    });
  }
  // Loại nguyên nhân
  const onValueChangeLNN = (value: string) => {
    list_NN = global.listFinish[0].NguyenNhan.filter((data) => {
      return data.Reference === global.listFinish[0].LoaiNguyenNhan.find(element => {
        if (element.Id === value)
          return element;
      }).Id
    });
    setState({...state,
      selectedKeyLNN: value,
      selectedKey: list_NN[0].Id,
    });
    setVariable({...variable, list_NN: list_NN})
  }
  // Nguyên nhân
  const onValueChange = (value: string) => {
    setState({...state,
      selectedKey: value,
    });
  }
  const pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    map.animateToRegion({
      ...state.focusedlocation,
      latitude: coords.latitude,
      longitude: coords.longitude
    });
    setState(...state, prevState => {
      return {
        focusedlocation: {
        ...prevState.focusedlocation,
        latitude: coords.latitude,
        longitude: coords.longitude
        },
        locationChosen: true
      };
    });
  }
  const getLocationHandler = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const coordsEvent = {
      nativeEvent: {
        coordinate: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      }
    };
    pickLocationHandler(coordsEvent);
  }
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      setStatus(status);
    })();
    loadLocation();
    resetState();
  });
  const resetState = () =>{
    if(state.selectedKeyPV === '' && state.selectedKeyMaKQXL === ''){
      setState({...state,
        selectedKeyPV:global.listFinish[0].PhamVi[0].Id,
        selectedKeyMaKQXL: global.listLich[0].KetQuaXuLy[0].Id
      })
    }
    // this.onValueChangePV();
    list_LNN = global.listFinish[0].LoaiNguyenNhan.filter((data) => {
        return data.Reference === global.listFinish[0].PhamVi.find(element => {
          if (element.Id === global.listFinish[0].PhamVi[0].Id)
            return element;
        }).Id
      });
    if(list_LNN.length > 0 && state.selectedKeyLNN === ''){
      setState({...state,
        selectedKeyLNN: list_LNN[0].Id
      });
      setVariable({...variable, list_LNN: list_LNN});
    }
    // this.onValueChangeLNN();
    list_NN = global.listFinish[0].NguyenNhan.filter((data) => {
      return data.Reference === global.listFinish[0].LoaiNguyenNhan.find(element => {
        if (element.Id === global.listFinish[0].LoaiNguyenNhan[0].Id)
          return element;
      }).Id
    });
    if(list_NN.length > 0 && state.selectedKey === ''){
      setState({...state,
        selectedKey: list_NN[0].Id
      });
      setVariable({...variable, list_NN: list_NN})
    }
    // alert(JSON.stringify(state))
  }
  // Load vị trí khách hàng
  const loadLocation = () => {
    const payload: CustomerLocationPayload = {
      CN_ID: schedule.CN_ID,
      MaThueBao: schedule.MaThueBao
    }
    callAPI(ApiMethods.CUSTOMER_GET_LOCATION, user.Token, payload, processLocation, null);
  }
  const processLocation = (data:Array<Location>) => {
    if (data.length === 0){
      Toast.show({
        text: "Vị trí khách hàng chưa được cập nhập.",
        duration: 2000,
        position: "bottom",
        textStyle: { textAlign: "center" },
      });
    }
    else{
      //Hien thi tren ban do vi tri khach hang
      const coordsEvent = {
        nativeEvent: {
          coordinate: {
            latitude: data[0].Latitude,
            longitude: data[0].Longitude
          }
        }
      };
      pickLocationHandler_KH(coordsEvent);
    }   
  }
  const pickLocationHandler_KH = event => {
    const coords = event.nativeEvent.coordinate;
    map.animateToRegion({
      ...state.focusedlocation_KH,
      latitude: coords.latitude,
      longitude: coords.longitude
    });
    setState(...state, prevState => {
      return {
        focusedlocation_KH: {
          ...prevState.focusedlocation_KH,
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        locationChosen_KH: true
      };
    });
  }
  const onSubmit = () => {
    if(schedule.ten_loai_yeucau === 'Lắp mới' || schedule.co_nguyennhan_hoantat != 1){
      const payload:FinishSchedulePayload = {
        yc_id: schedule.yc_id,
        ma_ketqua_xuly: state.selectedKeyMaKQXL,
        ma_nguyennhan:'KHAC',
        ma_yeucau: schedule.ma_yeucau,
        nhom: schedule.nhom,
        nd_id: user.ND_ID,
        noi_dung: state.ndxuly,
        latitude: state.focusedlocation.latitude,
        longitude: state.focusedlocation.longitude,
        ThietBiSuDung: thietBiSuDung
      }
      callAPI(ApiMethods.FINISH_SCHEDULE, user.Token,payload, processSubmit, errorSubmit);
    }
    else {
      const payload:FinishSchedulePayload = {
        yc_id: schedule.yc_id,
        ma_ketqua_xuly: state.selectedKeyMaKQXL,
        ma_nguyennhan: state.selectedKey,
        ma_yeucau: schedule.ma_yeucau,
        nhom: schedule.nhom,
        nd_id: user.ND_ID,
        noi_dung: state.ndxuly,
        latitude: state.focusedlocation.latitude,
        longitude:state.focusedlocation.longitude,
        ThietBiSuDung: thietBiSuDung
      }
      // alert(JSON.stringify(payload))
      callAPI(ApiMethods.FINISH_SCHEDULE, user.Token, payload, processSubmit, errorSubmit);
    }
  }
  const processSubmit = (data) => {
    Toast.show({
      text: "Cập nhật thành công",
      duration: 2000,
      position: "bottom",
      textStyle: { textAlign: "center" },
    });
    global.refreshHome();
    navigation.navigate('Home');
  }
  const errorSubmit = (error) => {
    Toast.show({
      text: "Cập nhật thất bại"+error.message,
      duration: 2000,
      position: "bottom",
      textStyle: { textAlign: "center" },
    });
  }

  let marker = null;
  let marker_KH = null;
  let location = null;

  if (state.locationChosen_KH && state.locationChosen) {
    marker_KH = <MapView.Marker
    title={'Vị trí khách hàng'}
    coordinate={state.focusedlocation_KH}
    image={orangeMarkerImg} />;
    marker = <MapView.Marker
    title={'Vị trí nhân viên'}
    coordinate={state.focusedlocation}/>;
  }
  else if (state.locationChosen_KH === false && state.locationChosen) {
    marker = <MapView.Marker
    title={'Vị trí nhân viên'}
    coordinate={state.focusedlocation}/>;
  }
  return(
    <Container>
      <Content padder>
        <Grid>
          <Row style={styles.row}>
            <Col style={styles.leftBlock}><Text style={styles.titleTxt}>Kết quả xử lý</Text></Col>
            <Col>
              <Form>
                <Item Picker style={styles.dropdown}>
                  <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='ios-arrow-down-outline' />}
                    selectedValue={state.selectedKeyMaKQXL}
                    onValueChange={onValueChangeMaKQXL}>
                    { global.listLich[0].KetQuaXuLy.map((item, index) => {
                      return (
                        <Picker.Item label={item.Text} value={item.Id} key={index} />
                      )
                    })}
                  </Picker>
                </Item>
              </Form>
            </Col>
          </Row>
          {(schedule.ten_loai_yeucau === 'Bảo trì' || schedule.co_nguyennhan_hoantat === 1)?          <View>
            <Row style={styles.row}>
              <Col style={styles.leftBlock}><Text style={styles.titleTxt}>Phạm vi</Text></Col>
              <Col>
                <Form>
                  <Item Picker style={styles.dropdown}>
                    <Picker
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      selectedValue={state.selectedKeyPV}
                      onValueChange={onValueChangePV}>
                      { global.listFinish[0].PhamVi.map((item, index) => {
                        return (
                          <Picker.Item label={item.Text} value={item.Id} key={index} />
                        )
                      })}
                    </Picker>
                  </Item>
                </Form>
              </Col>
            </Row>
            <Row style={styles.row}>
              <Col style={styles.leftBlock}><Text style={styles.titleTxt}>Loại nguyên nhân</Text></Col>
              <Col>
                <Form>
                  <Item Picker style={styles.dropdown}>
                    <Picker
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      selectedValue={state.selectedKeyLNN}
                      onValueChange={onValueChangeLNN}>
                      {
                        variable.list_LNN.length > 0 ? variable.list_LNN.map((item, index) => {
                          return (
                            <Picker.Item label={item.Text} value={item.Id} key={index} />
                          )
                        }) : <Picker.Item label={""} value={""} key={0} />
                      }
                    </Picker>
                  </Item>
                </Form>
              </Col>
            </Row>
            <Row style={styles.row}>
              <Col style={styles.leftBlock}><Text style={styles.titleTxt}>Nguyên nhân</Text></Col>
              <Col>
                <Form>
                  <Item Picker style={styles.dropdown}>
                    <Picker
                      mode='dropdown'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      selectedValue={state.selectedKey}
                      onValueChange={onValueChange}>
                      {
                        variable.list_NN.length > 0 ? variable.list_NN.map((item, index) => {
                          return (
                            <Picker.Item label={item.Text} value={item.Id} key={index} />
                          )
                        }) : <Picker.Item label={""} value={""} key={0} />
                      }
                    </Picker>
                  </Item>
                </Form>
              </Col>
            </Row>
          </View>
          : <View></View>
          }
          <Row style={styles.row}>
            <Col style={styles.leftBlock}><Text style={styles.titleTxt}>Nội dung xử lý</Text></Col>
            <Col>
              <Textarea 
                style={styles.inputStyle} 
                rowSpan={3} 
                onChangeText={(text) => {setState({...state, ndxuly: text})}}/>
            </Col>
          </Row>
          <Row style={styles.row}><Text style={styles.titleTxt}>Vị trí hiện tại</Text></Row>
          <Row style={styles.row}>
            <Col style={{width: Dimensions.get('window').width*0.1}}></Col>
            <Col style={styles.mapBlock}>
              <MapView
                onMapReady={getLocationHandler}
                style={styles.map}
                initialRegion={state.focusedlocation}
                onPress={pickLocationHandler}
                ref={(el) => map = el}>
              </MapView>
              <Button transparent
                  style={styles.btnMap}
                  onPress={getLocationHandler}>
                  <Thumbnail small source={locationpng} />
              </Button>
            </Col>
            <Col style={{width: Dimensions.get('window').width*0.1}}></Col>
          </Row>
        </Grid>
        <Button full rounded
          onPress={onSubmit}
          style={{margin: 50, marginBottom: 10, marginTop: 20}}>
          <Text>Lưu</Text>
        </Button>
      </Content>            
    </Container>
  );
}
const styles = StyleSheet.create({
    inputStyle: {
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.4)',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        margin: 2,
    },
    leftBlock: {
      width: Dimensions.get('window').width*0.35,
      justifyContent: 'center'
    },
    row: {
      marginTop: 10
    },
    mapBlock: {
      marginTop: 10,
      borderWidth: 0.5, 
      height: Dimensions.get('window').width*0.8
    },
    titleTxt: {
      fontWeight: 'bold'
    },
    btnMap: {
      opacity: 0.6,
      top: -2,
      left: 2
    },
    dropdown: {
      marginLeft: 0, 
      paddingLeft: 0
    }
});
export default FinishScheduleModal;
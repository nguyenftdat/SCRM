//React import here
import * as React from 'react';
import { StatusBar, StyleSheet, Alert, Dimensions, Modal, TouchableOpacity } from 'react-native';
//External imports here
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Textarea,
  Spinner,
  View,
  Button,
  Thumbnail,
  Accordion,
  Text,
  Icon,
  Picker,
  Toast,
  Body
} from 'native-base';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
//Custom imports here
import { UserContext } from '../context/UserContext';
import { ApiMethods, callAPI } from '../utils/ApiUtils';
import { ScheduleList } from '../components/ScheduleList';
import {HistoryComponent} from '../components/HistoryComponent';
import MaintenanceScreen from './MaintenanceScreen';
import { formatDateTime, getRegion } from '../utils/Utils';
import locationpng from '../assets/img/location.png';

const DetailedScheduleScreen = ({ route, navigation }) => {
  //Context
  const { user, setUser } = React.useContext(UserContext);
  //Nav params
  const { scheduleId } = route.params;
  //State
  const [state, setState] = React.useState({
    data: null,
    loading: true,
  });
  const [enableCheckIn, setEnableCheckIn] = React.useState(false);
  const [enableThaoTac, setEnableThaoTac] = React.useState(false);
  const [selectedThaoTac, setSelectedThaoTac] = React.useState('0');
  const [history, setHistory] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);

  //Map
  const [padding, setPadding] = React.useState(1);
  const [region, setRegion] = React.useState({
    latitude: 10.757399253082067,
    longitude: 106.76181085807956,
    latitudeDelta: 0.0027,
    longitudeDelta: 0.0315,
  });
  const [userLocation, setUserLocation] = React.useState({
    latitude: 10.757399253082067,
    longitude: 106.76181085807956,
  });

  //API
  const loadData = () => {
    const payload: ScheduleIdPayload = {
      yc_id: scheduleId,
    };
    callAPI(
      ApiMethods.GET_DETAILED_SCHEDULE,
      user.Token,
      payload,
      processData,
      null
    );
  };

  const processData = (data: Array<ScheduleModel>) => {
    if (data.length > 0) {
      setState({
        ...state,
        data: data[0],
        loading: false,
      });
      if (
        data[0].subStatus === 'CHECKED_IN' &&
        data[0].ma_trangthai === 'XULY'
      ) {
        setEnableCheckIn(false);
        setEnableThaoTac(true);
      } else if (
        data[0].subStatus !== 'CHECKED_IN' &&
        data[0].ma_trangthai === 'XULY'
      ) {
        setEnableCheckIn(true);
        setEnableThaoTac(false);
      } else {
        setEnableCheckIn(false);
        setEnableThaoTac(false);
      }
      getCustomerLocation(data[0].CN_ID, data[0].MaThueBao);
    } else {
      alert('Không có thông tin của lịch này');
    }
  };

  const handleCheckIn = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const payload: CheckInPayload = {
      yc_id: scheduleId,
      nd_id: user.nd_id,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    callAPI(ApiMethods.CHECK_IN, user.Token, payload, processCheckin, null);
  };

  const processCheckin = () => {
    Toast.show({
      text: 'Cập nhật thành công',
      duration: 2000,
      position: 'bottom',
      textStyle: { textAlign: 'center' },
    });
    loadData();
  };

  //Location
  let map: MapView = null;
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [status, setStatus] = React.useState('denied');
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      setStatus(status);
    })();
  }, []);
  const getCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    let _region = {
      ...region,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    map.animateToRegion(_region);
  };

  const getCustomerLocation = (cn_Id, maThueBao) => {
    const payload: CustomerLocationPayload = {
      CN_ID: cn_Id,
      MaThueBao: maThueBao,
    };
    callAPI(
      ApiMethods.CUSTOMER_GET_LOCATION,
      user.Token,
      payload,
      processCustomerLocation,
      null
    );
  };
  const processCustomerLocation = (data: Array<Location>) => {
    if (data == null || data.length === 0) {
      alert('Vị trí khách hàng chưa được cập nhập');
    } else {
      map.animateToRegion({
        latitude: data[0].Latitude,
        longitude: data[0].Longitude,
      });
    }
  };

  //History
  const loadHistory = () => {
    const payload = {
      yc_id: scheduleId,
    };
    callAPI(
      ApiMethods.GET_SCHEDULE_HISTORY,
      user.Token,
      payload,
      processHistory,
      null
    );
  };
  const processHistory = (data) => {
    setHistory(data);
  };

  //onLoad
  React.useEffect(() => {
    loadData();
    loadHistory();
  }, []);

  // return state.loading ? (
  //   <Spinner />
  // ) : (
  //   <Container>
  //     <Content>
  //       <Form>
  //         <Item fixedLabel disabled>
  //           <Label>Mã yêu cầu</Label>
  //           <Input disabled value={state.data.ma_yeucau} />
  //         </Item>
  //         <Item fixedLabel disabled>
  //           <Label>Trạng thái:</Label>
  //           <Input disabled value={state.data.trangthai_ten} />
  //         </Item>
  //         <Item fixedLabel disabled>
  //           <Label>Họ tên:</Label>
  //           <Input disabled value={state.data.ho_ten} />
  //         </Item>
  //         <Item fixedLabel disabled>
  //           <Label>Điện thoại:</Label>
  //           <Input disabled value={state.data.dien_thoai} />
  //         </Item>
  //         <Item stackedLabel disabled>
  //           <Label>Địa chỉ:</Label>
  //           <Textarea disabled value={state.data.dia_chi} rowSpan={2} />
  //         </Item>
  //         <Item fixedLabel disabled>
  //           <Label>Mức độ:</Label>
  //           <Input disabled value={state.data.do_uutien_ten} />
  //         </Item>
  //         <Item fixedLabel disabled>
  //           <Label>Loại yêu cầu:</Label>
  //           <Input disabled value={state.data.ten_loai_yeucau} />
  //         </Item>
  //         <Item fixedLabel disabled>
  //           <Label>Dịch vụ:</Label>
  //           <Input disabled value={state.data.ten_dichvu} />
  //         </Item>
  //         <Item fixedLabel disabled>
  //           <Label>Ngày hẹn:</Label>
  //           <Input
  //             disabled
  //             value={formatDateTime(new Date(state.data.ngay_hen))}
  //           />
  //         </Item>
  //         <Item stackedLabel disabled>
  //           <Label>Ghi chú:</Label>
  //           <Textarea disabled value={state.data.noi_dung} rowSpan={2} />
  //         </Item>
  //       </Form>
  //       <View style={{ padding: padding }}>
  //         <MapView
  //           style={styles.mapStyle}
  //           region={region}
  //           showsUserLocation={true}
  //           showsMyLocationButton={true}
  //           ref={(el) => (map = el)}
  //         />
  //         <Button
  //           transparent
  //           style={{
  //             borderRadius: 10,
  //             position: 'absolute',
  //             bottom: 0,
  //             right: 0,
  //           }}
  //           onPress={getCurrentLocation}>
  //           <Thumbnail small source={locationpng} />
  //         </Button>
  //       </View>
  //     </Content>
  //   </Container>
  // );

  const onValueChange = (value) => {
    setSelectedThaoTac(value);
    if (value != '0') {
      if (value === '1' && state.data.subStatus !== 'CHECKED_IN') {
        Toast.show({
          text: 'Vui lòng CHECK IN để hoàn tất lịch',
          duration: 3000,
          position: 'bottom',
          textStyle: { textAlign: 'center' },
        });
      } else if (
        value === '1' &&
        state.data.subStatus === 'CHECKED_IN' &&
        state.data.nhom === 'BT' &&
        state.data.co_nguyennhan_hoantat === 1
      ) {
        // setModalVisible(true);
        navigation.navigate('MaintenanceScreen', { schedule: state.data });
      } else if (value === '1' && state.data.subStatus === 'CHECKED_IN') {
        navigation.navigate('NewAssemblyScreen', { schedule: state.data });
      } else
       navigation.navigate(value, { schedule: state.data }); // Chọn màn hình muốn chuyển
    }
  };

  const dataArray = [
    { title: 'Thông tin lịch', content: '1' },
    { title: 'Thao tác', content: '2' },
    { title: 'Lịch sử', content: '3' },
  ];
  
  const _renderContent = (item) => {
    if (item.content === '1') {
      return (
        <Form>
          <Item fixedLabel disabled>
            <Label>Mã yêu cầu</Label>
            <Input disabled value={state.data.ma_yeucau} />
          </Item>
          <Item fixedLabel disabled>
            <Label>Trạng thái:</Label>
            <Input disabled value={state.data.trangthai_ten} />
          </Item>
          <Item fixedLabel disabled>
            <Label>Họ tên:</Label>
            <Input disabled value={state.data.ho_ten} />
          </Item>
          <Item fixedLabel disabled>
            <Label>Điện thoại:</Label>
            <Input disabled value={state.data.dien_thoai} />
          </Item>
          <Item stackedLabel disabled>
            <Label>Địa chỉ:</Label>
            <Textarea disabled value={state.data.dia_chi} rowSpan={2} />
          </Item>
          <Item fixedLabel disabled>
            <Label>Mức độ:</Label>
            <Input disabled value={state.data.do_uutien_ten} />
          </Item>
          <Item fixedLabel disabled>
            <Label>Loại yêu cầu:</Label>
            <Input disabled value={state.data.ten_loai_yeucau} />
          </Item>
          <Item fixedLabel disabled>
            <Label>Dịch vụ:</Label>
            <Input disabled value={state.data.ten_dichvu} />
          </Item>
          <Item fixedLabel disabled>
            <Label>Ngày hẹn:</Label>
            <Input
              disabled
              value={formatDateTime(new Date(state.data.ngay_hen))}
            />
          </Item>
          <Item stackedLabel disabled>
            <Label>Ghi chú:</Label>
            <Textarea disabled value={state.data.noi_dung} rowSpan={2} />
          </Item>
        </Form>
      );
    } else if (item.content === '2') {
      return (
        <View>
          <View>
            <MapView
              style={styles.mapStyle}
              region={region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              ref={(el) => (map = el)}
            />
            <Button
              transparent
              style={{
                // borderRadius: 10,
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
              onPress={getCurrentLocation}>
              <Thumbnail square small source={locationpng} style={{opacity: 0.5}}/>
            </Button>
          </View>
          <Button
            full
            rounded
            style={{ margin: 30 }}
            onPress={handleCheckIn}
            disabled={!enableCheckIn}>
            <Text>Check In</Text>
          </Button>
          <Form>
            <Item Picker disabled={!enableThaoTac}>
              <Picker
                mode="dropdown"
                enabled={enableThaoTac}
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                selectedValue={selectedThaoTac}
                onValueChange={onValueChange}>
                <Picker.Item label="Thao tác" value="0" />
                <Picker.Item label="Hoàn tất" value="1" />
                <Picker.Item label="Hẹn lại" value="PostponeScheduleModal" />
                <Picker.Item label="Hủy lịch" value="CancelScheduleModal" />
                <Picker.Item label="Sắp lịch" value="CalendarTransferScreens" />
              </Picker>
            </Item>
          </Form>
        </View>
      );
    } else return (<HistoryComponent history={history}/>    );
  };

  return state.loading ? (
    <Spinner />
  ) : (
    <Container>
      <Content padder style={{ backgroundColor: 'white' }}>
        <Accordion
          dataArray={dataArray}
          animation={true}
          expanded={0}
          renderContent={_renderContent}
        />
      </Content>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerModal}>
              <Text style={styles.modalText}>Bảo trì thiết bị</Text>
            </View>

            <TouchableOpacity
              style={styles.openButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <MaintenanceScreen schedule= {state.data} />
            </TouchableOpacity>
            
            
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  headerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 0.5,
    width: Dimensions.get('window').width*0.8
  },
  modalText: {
    fontWeight: 'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  openButton: {
    width: Dimensions.get('window').width*0.8,
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5
  }
});
export default DetailedScheduleScreen;

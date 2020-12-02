import React, { useState } from 'react';
import { 
  Thumbnail,
  Container, 
  Content,
  Toast, 
  Input, 
  Text, 
  Label, 
  View, 
  Item, 
  Form, 
  Picker, 
  Icon, 
  List, 
  ListItem, 
  Left, 
  Right, 
  Body, 
  Button,
  ActionSheet } from 'native-base';
import {
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  TouchableOpacity} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { callAPI, ApiMethods } from '../utils/ApiUtils';
import { ThietBiRow } from '../models/GroupThietBi';
import closeIcon from '../assets/img/close_icon.png';

var listMaterial = [];
var listStatus = ['C', 'M'];
var listPayment = ['MienPhi', 'CoPhi'];
var list = {
  C: 'Cũ',
  M: 'Mới',
  CoPhi: 'Có phí',
  MienPhi: 'Miễn phí'
};
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;
const ModalAddThietBi = React.forwardRef((props, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [disable, setDisable] = useState(true);
  const [state, setState] = useState({
    selectedEquip: 'Chọn thiết bị',
    id: '',
    selectedStatus: 'Chọn tình trạng',
    unit: '',
    selectedPayment: "Loại thanh toán",
  });
  const resetState = () => {
    setState({
      selectedEquip: 'Chọn thiết bị',
      id: '',
      selectedStatus: 'Chọn tình trạng',
      unit: '',
      selectedPayment: "Loại thanh toán",
      index: ''
    });
  };
  const onThietBiChange = (value: string) => {
    setState({
      ...state,
      selectedEquip: value,
      unit: global.listMaterial.find(element => {
        if (element.Text === value)
          return element;
        }).Value,
      id: global.listMaterial.find(element => {
        if (element.Text === value)
          return element;
        }).Value.Id
    });
  }
  const onSave = () => {
    if(state.amount <= 0)
    {
      Toast.show({
        text: 'Vui lòng nhân viên kiểm tra số lượng thiết bị.',
        duration: 2000,
        position: "top",
        textStyle: { textAlign: "center" },
      })
    }
    else {
      let item:ThietBiRow = {
        DMTB_ID: state.id,
        LOAI_THANH_TOAN: state.selectedPayment,
        SO_LUONG: state.amount,
        TenThietBi : state.selectedEquip,
        TINHTRANG_VATTU : state.selectedStatus,
        Unit : state.unit
      };
      props.addItem(state.index, item);
      resetState();
      setModalVisible(false);
    }
  }
  React.useImperativeHandle(ref, () => ({
    showModal(index) {
      setModalVisible(true);
      setState({...state, index: index});
    }
  }))
  const onChangeDisable = () => {
    if(state.selectedEquip != 'Chọn thiết bị' && state.selectedStatus != 'Chọn tình trạng' && state.selectedPayment != 'Hình thức thanh toán'){
      setDisable(false);
    }
    else setDisable(true);
  }
  React.useEffect(() => {
    onChangeDisable();
  });
  return(
    // <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeBtn}
              onPress= {() => {setModalVisible(!modalVisible)}}>
              <Thumbnail circle source={closeIcon} style={{width: 30, height: 30}}/>
            </TouchableOpacity>
            <Grid style={{borderWidth: 0.5, marginBottom: 10}}>
              <Col>
                <Row style={styles.row}><Text style={styles.titleTxt}>Tên thiết bị</Text></Row>
                <Row style={styles.row}><Text style={styles.titleTxt}>Số lượng</Text></Row>
                <Row style={styles.row}><Text style={styles.titleTxt}>Tình trạng vật tư</Text></Row>
                <Row style={styles.row}><Text style={styles.titleTxt}>Loại thanh toán</Text></Row>
              </Col>
              <Col>
                <Row style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      global.listMaterial.forEach(item => {listMaterial.push(item.Text)});
                      ActionSheet.show({
                        options: listMaterial,
                        cancelButtonIndex: CANCEL_INDEX,
                        destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        title: "Chọn thiết bị"
                      },
                      buttonIndex => {
                        // setState({...state, selectedEquip: listMaterial[buttonIndex]});
                        onThietBiChange(listMaterial[buttonIndex]);
                      },
                      )}}>
                    <Text style={{fontStyle: 'italic'}}>{state.selectedEquip}</Text>
                  </TouchableOpacity>
                </Row>
                <Row style={[styles.row, {flexDirection: 'row'}]}>
                  <Input
                    placeholder='Nhập số lượng'
                    keyboardType = 'numeric'
                    placeholderTextColor='grey'
                    onChangeText={(amount)=> setState({...state, amount: amount})}
                    />
                    <View style={{ flex: 0.3,justifyContent: 'center'}}><Text>{state.unit}</Text></View>
                </Row>
                <Row style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      ActionSheet.show({
                        options: ['Cũ', 'Mới'],
                        cancelButtonIndex: CANCEL_INDEX,
                        destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        title: "Chọn tình trạng"
                      },
                      buttonIndex => {
                        setState({...state, selectedStatus: listStatus[buttonIndex]});
                      },
                      )}}>
                      {
                        state.selectedStatus === 'Chọn tình trạng' ?  <Text>{state.selectedStatus}</Text> : <Text>{list[state.selectedStatus]}</Text>
                      }
                  </TouchableOpacity>
                </Row>
                <Row style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      ActionSheet.show({
                        options: ['Miễn phí', 'Có phí'],
                        cancelButtonIndex: CANCEL_INDEX,
                        destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        title: "Hình thức thanh toán"
                      },
                      buttonIndex => {
                        setState({...state, selectedPayment: listPayment[buttonIndex]});
                      },
                      )}}>
                      {
                        state.selectedPayment === 'Loại thanh toán' ?  <Text>{state.selectedPayment}</Text> : <Text>{list[state.selectedPayment]}</Text>
                      }
                  </TouchableOpacity>
                </Row>
              </Col>
            </Grid>
            <Button full success rounded disabled={disable} onPress={onSave}><Text>Lưu</Text></Button>
          </View>
        </View>
      </Modal>
    // </View>
  );
})
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    height: Dimensions.get('window').height*0.6,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  titleTxt: {
    fontWeight: 'bold',
    color: 'grey',
    marginLeft: 10
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 0.5
  },
  closeBtn: {
    position: "absolute",
    top: -10,
    right: -5,
    zIndex: 5
  }
});
export default ModalAddThietBi;
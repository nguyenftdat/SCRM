import React, { useState, useEffect } from 'react';
import {
  Container,
  Content,
  View,
  Text,
  Button,
  Item,
  Picker,
  Icon,
  Textarea,
  Body,
  DatePicker,
  Toast,
} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { formatDateTime } from '../utils/Utils';
import { callAPI, ApiMethods } from '../utils/ApiUtils';
import { UserContext } from '../context/UserContext';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const PostponeScheduleModal = ({route, navigation}) => {
  const schedule = route.params.schedule;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { user, setUser } = React.useContext(UserContext);
  const [state, setState] = useState({
    selectedDate: new Date(),
    // maLyDo: undefined,
    ghiChu: '',
    reasons: [],
    maLyDo: 'Khách hàng hẹn lại',
  });
  const onValueChange = (value: string) => {
    setState({
      ...state,
      maLyDo: value,
    });
  };
  const showDateTimePicker = () => setDatePickerVisibility(true);
  const hideDateTimePicker = () => setDatePickerVisibility(false);
  const handleDatePicked = (date) => {
    setState({ ...state, selectedDate: date });
    hideDateTimePicker();
  };
  React.useEffect(() => {
    if (global.postponeReasons == null) {
      callAPI(
        ApiMethods.GET_LIST_POSTPONE_REASONS,
        user.Token,
        {},
        processReasons,
        null
      );
    } else
      setState({
        ...state,
        reasons: global.postponeReasons,
        maLyDo: global.postponeReasons[0].Id,
      });
  }, []);
  const processReasons = (data: Array<CommonModel>) => {
    global.postponeReasons = data;
    setState({ ...state, reasons: data, maLyDo: data[0].Id });
  };
  const onSubmit = () => {
    const payload: PostponeSchedulePayload = {
      ma_lydo: state.maLyDo,
      ma_yeucau: schedule.ma_yeucau,
      nd_id: user.nd_id,
      ngay_hen: state.selectedDate,
      noi_dung: state.ghiChu,
    };
    callAPI(
      ApiMethods.POSTPONE_SCHEDULE,
      user.Token,
      payload,
      processSubmit,
      errorSubmit
    );
  };
  const processSubmit = (data) => {
    Toast.show({
      text: 'Cập nhật thành công',
      duration: 2000,
      position: 'center',
      textStyle: { textAlign: 'center' },
    });
    // global.refreshHome();
    navigation.navigate('Home');
  };
  const errorSubmit = (error) => {
    Toast.show({
      text: 'Cập nhật thất bại' + error.message,
      duration: 2000,
      position: 'center',
      textStyle: { textAlign: 'center' },
    });
  };
  return (
    <Container>
      <Content padder>
        <Grid>
          <Row style={styles.row}>
            <Col style={styles.leftRow}>
              <Text style={styles.title}>Ngày hẹn</Text>
            </Col>
            <Col style={{ paddingLeft: 10 }}>
              <DateTimePicker
                mode="datetime"
                date={state.selectedDate}
                isVisible={isDatePickerVisible}
                onConfirm={handleDatePicked}
                onCancel={hideDateTimePicker}
              />
              <TouchableOpacity onPress={showDateTimePicker}>
                <Text>{formatDateTime(state.selectedDate)}</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col style={[styles.leftRow, { paddingTop: 10 }]}>
              <Text style={styles.title}>Lý do hẹn</Text>
            </Col>
            <Col>
              <Item Picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="ios-arrow-down-outline" />}
                  selectedValue={state.maLyDo}
                  onValueChange={onValueChange}>
                  {state.reasons.map((item, index) => {
                    return (
                      <Picker.Item
                        label={item.Text}
                        value={item.Id}
                        key={'Reason ' + index}
                      />
                    );
                  })}
                </Picker>
              </Item>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <Text style={styles.title}>Ghi chú</Text>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <Textarea bordered 
                onChangeText={(text) => {setState({...state, ghiChu: text})}}/>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <Button
                full
                rounded
                style={{ margin: 40, marginTop: 10 }}
                onPress={onSubmit}>
                <Text>Lưu</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Content>
    </Container>
  );
};
export default PostponeScheduleModal;
const styles = StyleSheet.create({
  leftRow: {
    width: deviceWidth * 0.3,
  },
  row: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
  },
});

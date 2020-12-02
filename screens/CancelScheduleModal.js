//@flow
import React, { Component } from 'react';
import {
  Container,
  Content,
  View,
  Button,
  Text,
  Form,
  Picker,
  Item,
  Icon,
  Textarea,
  Input,
  Toast,
} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import { StyleSheet, FlatList, Dimensions } from 'react-native';
import { ApiMethods, callAPI } from '../utils/ApiUtils';
import { FinishSchedulePayload } from '../models/FinishSchedulePayload';
import CommonModel from '../models/CommonModel';
import { UserContext } from '../context/UserContext';

const CancelScheduleModal = ({ route, navigation }) => {
  const schedule = route.params.schedule;
  const { user, setUser } = React.useContext(UserContext);
  const [state, setState] = React.useState({
    maLyDo: undefined,
    ghiChu: '',
    reasons: [],
  });
  React.useEffect(() => {
    if (global.cancelReasons == null) {
      callAPI(
        ApiMethods.GET_LIST_CANCEL_REASONS,
        user.Token,
        {},
        processReasons,
        null
      );
    } else
      setState({
        ...state,
        reasons: global.cancelReasons,
        maLyDo: global.cancelReasons[0].Id,
      });
  }, []);
  const processReasons = (data: Array<CommonModel>) => {
    global.cancelReasons = data;
    setState({ ...state, reasons: data, maLyDo: data[0].Id });
  };

  const onValueChange = (value: string) => {
    setState({...state,
      maLyDo: value,
    });
  };

  const onSubmit = () => {
    const payload: FinishSchedulePayload = {
      ma_nguyennhan: state.maLyDo,
      ma_yeucau: schedule.ma_yeucau,
      nd_id: user.nd_id,
      noi_dung: state.ghiChu,
    };
    callAPI(
      ApiMethods.CANCEL_SCHEDULE,
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
              <Text style={styles.title}>Lý do hủy:</Text>
            </Col>
            <Col>
              <Form>
                <Item Picker style={{marginLeft: 0}}>
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
              </Form>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col style={styles.leftRow}>
              <Text style={styles.title}>Ghi chú:</Text>
            </Col>
            <Col>
              <Textarea
                bordered
                onChangeText={(text) => {
                  setState({ ...state, ghiChu: text });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                onPress={onSubmit}
                full
                rounded
                style={{ margin: 40, marginTop: 10 }}>
                <Text style={{ color: 'white' }}>Lưu</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Content>
    </Container>
  );
};
export default CancelScheduleModal;
const styles = StyleSheet.create({
  leftRow: {
    width: Dimensions.get('window').width * 0.3,
    justifyContent: 'center',
  },
  row: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
  },
});

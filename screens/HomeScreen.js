//React import here
import * as React from 'react';
import { StatusBar, StyleSheet, Alert, TouchableOpacity } from 'react-native';
//External imports here
import {
  Container,
  Header,
  Body,
  Content,
  Button,
  View,
  Text,
  Left,
  Right,
  Icon,
  Title,
  Spinner,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
//Custom imports here
import { UserContext } from '../context/UserContext';
import { ApiMethods, callAPI } from '../utils/ApiUtils';
import { ScheduleList } from '../components/ScheduleList';

const HomeScreen = ({route, navigation}) => {
  //Context
  const { user, setUser } = React.useContext(UserContext);
  //Refs
  const intervalId = React.useRef(0);
  //State
  const [state, setState] = React.useState({
    listSchedule: null,
    loading: true,
    countQH: 0,
    countDH: 0,
    countLD: 0,
    countBT: 0,
  });
  global.refreshHome = getListSchedule;
  //Filter lich
  const onDetailDenHan = () => {
    let list = global.listSchedule.filter((data) => {
        return data.Value >= 120 && data.Value < 240;
      });
    setState({
      ...state,
      listSchedule: list
    });
  };
  const onDetailQuaHan = () => {
    let list = global.listSchedule.filter((data) => {
        return data.Value >= 240;
      });
    setState({
      ...state,
      listSchedule: list
    });
  };
  const onDetailBaoTri = () => {
    let list = global.listSchedule.filter((data) => {
        return data.Reference === 'BT';
      });
    setState({
      ...state,
      listSchedule: list
    });
  };
  const onDetailLapMoi = () => {
    let list = global.listSchedule.filter((data) => {
        return data.Reference === 'LD';
      });
    setState({
      ...state,
      listSchedule: list
    });
  };

  React.useEffect(() => {
    const payload = { CN_ID: user.CN_ID };
    callAPI(
      ApiMethods.GET_LIST_MATERIAL,
      user.Token,
      payload,
      processmaterial,
      null
    );
    callAPI(
      ApiMethods.GET_DANH_MUC_XUAT_KHO,
      user.Token,
      payload,
      processXuatKho,
      null
    );
    callAPI(
      ApiMethods.GET_LIST_REASONS,
      user.Token,
      payload,
      processFinish,
      null
    );
    callAPI(
      ApiMethods.GET_DANH_MUC_ALL,
      user.Token,
      payload,
      processMucLich,
      null
    );
    getListSchedule();
    intervalId.current = setInterval(() => {
      getListSchedule();
    }, 300000);
    // Specify how to clean up after this effect:
    return function cleanup() {
      clearInterval(intervalId.current);
    };
  }, []);

  const processmaterial = (data) => {
    global.listMaterial = data;
  };
  const processXuatKho = (data) => {
    global.listXuatKho = data;
  };
  const processFinish = (data) => {
    global.listFinish = data;
  };
  const processMucLich = (data) => {
    global.listLich = data;
  };

  const getListSchedule = () => {
    setState({ ...state, loading: true });
    callAPI(
      ApiMethods.GET_LIST_MY_SCHEDULES,
      user.Token,
      '',
      processResult,
      processError
    );
  };
  const processResult = (data) => {
    let countBT = 0,
      countLM = 0,
      countQH = 0,
      countDH = 0;
    data.forEach((element) => {
      if (element.Reference == 'LD') countLM++;
      else countBT++;
      if (element.Value >= 240) {
        countQH++;
      } else if (element.Value >= 120 && element.Value < 240) {
        countDH++;
      }
    });
    setState({
      listSchedule: data,
      loading: false,
      countQH: countQH,
      countDH: countDH,
      countLD: countLM,
      countBT: countBT,
    });
    global.listSchedule = data;
  };

  const processError = (error) => {
    setState({
      ...state,
      loading: false,
    });
  };

  const refreshControl = () => {
    setState({
      ...state,
      listSchedule: global.listSchedule,
    });
  };

  const onPressItem = (id) => {
    navigation.navigate('DetailedSchedule',{scheduleId:id});
  };
  return (
    <Container style={{ marginTop: StatusBar.currentHeight }}>
      <Content padder>
        <Grid>
          <Col>
            <TouchableOpacity style={[styles.quaHan, styles.btn]} onPress={onDetailQuaHan}>
              <Text style={styles.textBtn_1}>{state.countQH}</Text>
              <Text style={styles.textBtn_2}>QUÁ HẠN</Text>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={[styles.sapDenHan, styles.btn]} onPress={onDetailDenHan}>
              <Text style={styles.textBtn_1}>{state.countDH}</Text>
              <Text style={styles.textBtn_2}>ĐẾN HẠN</Text>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={[styles.moiGiao, styles.btn]} onPress={onDetailLapMoi}>
              <Text style={styles.textBtn_1}>{state.countLD}</Text>
              <Text style={styles.textBtn_2}>LẮP ĐẶT</Text>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity style={[styles.henLai, styles.btn]} onPress={onDetailBaoTri}>
              <Text style={styles.textBtn_1}>{state.countBT}</Text>
              <Text style={styles.textBtn_2}>BẢO TRÌ</Text>
            </TouchableOpacity>
          </Col>
        </Grid>
        {state.loading ? (
          <Spinner />
        ) : (
          <ScheduleList
            listSchedule={state.listSchedule}
            onPressItem={onPressItem}
          />
        )}
      </Content>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // height: 100,
  },
  btn: {
    padding: 10,
    borderRadius: 2,
    margin: 5
  },
  textBtn_1: {
    fontSize: 20,
    color: 'white',
  },
  textBtn_2: {
    color: 'white',
    fontSize: 15,
  },
  quaHan: {
    flex: 1,
    backgroundColor: '#c00000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sapDenHan: {
    flex: 1,
    backgroundColor: '#ffc000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moiGiao: {
    flex: 1,
    backgroundColor: '#fac090',
    justifyContent: 'center',
    alignItems: 'center',
  },
  henLai: {
    flex: 1,
    backgroundColor: '#95b3d7',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

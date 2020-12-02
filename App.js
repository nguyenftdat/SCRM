// In App.js in a new project

import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Grid, Col, Row } from 'react-native-easy-grid';

import { Root, Thumbnail, Label, Accordion, Icon } from 'native-base';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { UserContext } from './context/UserContext';
import DetailedScheduleScreen from './screens/DetailedScheduleScreen';
import MaintenanceScreen from './screens/MaintenanceScreen';
import NewAssemblyScreen from './screens/NewAssemblyScreen';
import FinishScheduleModal from './screens/FinishScheduleModal';
import ManageBranchCalendarScreens from './screens/ManageBranchCalendarScreens';
import PostponeScheduleModal from './screens/PostponeScheduleModal';
import CancelScheduleModal from './screens/CancelScheduleModal';

export default () => {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const [user, setUser] = React.useState(null);
  const store = {
    user: user,
    setUser: setUser,
  };
  const dataMenus = [
    {
      title: 'Lịch',
      content:
        'Lịch khách hàng:Home, Quản lí lịch chi nhánh:ManageBranchCalendarScreens, Tra cứu lịch:ManageBranchCalendarScreens',
    },
    { title: 'Khách hàng', content: 'Tra cứu khách hàng:Home' },
    {
      title: 'Thiết bị',
      content:
        'Tra cứu thiết bị:Home, Nhập kho chi nhánh:Home, Quản lí xuất kho:Home, Hủy xuất kho:Home',
    },
    {
      title: 'Thu tiền',
      content: 'Thu tiền bắn mã:Home, Báo cáo thu tiền:Home',
    },
  ];
  const CustomDrawerContent = (props) => {
    global.navigation = props.navigation;
    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.avtBlock}>
          <Thumbnail large source={require('./assets/img/Logo_SCTV.png')} />
          <Label style={styles.info}>
            {user.ND_TEN_NGUOI_DUNG} {user.DIEN_THOAI}
          </Label>
        </View>
        <Accordion
          dataArray={dataMenus}
          style={{ borderWidth: 0 }}
          animation={true}
          expanded={true}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
        />
      </DrawerContentScrollView>
    );
  };
  const _renderHeader = (item, expanded) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          margin: 5,
          borderBottomWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{ fontWeight: 'bold' }}> {item.title}</Text>
        {expanded ? (
          <Icon
            style={{ fontSize: 24 }}
            type="MaterialIcons"
            name="keyboard-arrow-up"
          />
        ) : (
          <Icon
            style={{ fontSize: 24 }}
            type="MaterialIcons"
            name="keyboard-arrow-down"
          />
        )}
      </View>
    );
  };
  const _renderContent = (item) => {
    let items = item.content.split(', ');
    return items.map((item, key) => (
      <TouchableOpacity
        key={key}
        style={{ marginLeft: 20 }}
        onPress={() => {
          global.navigation.navigate(item.split(':')[1]);
        }}>
        <Text style={{ margin: 10, paddingLeft: 10 }}>
          {item.split(':')[0]}
        </Text>
      </TouchableOpacity>
    ));
  };
  return (
    <Root>
      <UserContext.Provider value={store}>
        {user == null ? (
          <LoginScreen />
        ) : (
          <NavigationContainer>
            <Drawer.Navigator
              drawerContent={(props) => <CustomDrawerContent {...props} />}>
              <Drawer.Screen
                name="Home"
                component={HomeScreen}
              />
              <Drawer.Screen
                name="DetailedSchedule"
                component={DetailedScheduleScreen}
                options={{ title: 'Thông tin lịch' }}
              />
              <Drawer.Screen
                name="MaintenanceScreen"
                component={MaintenanceScreen}
                options={{ title: 'Bảo trì thiết bị' }}
              />
              <Drawer.Screen
                name="FinishScheduleModal"
                component={FinishScheduleModal}
                options={{ title: 'Hoàn tất lịch' }}
              />
              <Drawer.Screen
                name="NewAssemblyScreen"
                component={NewAssemblyScreen}
                options={{ title: 'Thiết bị lắp ráp mới' }}
              />
              <Drawer.Screen
                name="PostponeScheduleModal"
                component={PostponeScheduleModal}
              />
              <Drawer.Screen
                name="ManageBranchCalendarScreens"
                component={ManageBranchCalendarScreens}
                options={{ title: 'Quản lí lịch chi nhánh' }}
              />
              <Drawer.Screen
                name="CancelScheduleModal"
                component={CancelScheduleModal}
                options={{ title: 'Hủy lịch' }}
              />
            </Drawer.Navigator>
          </NavigationContainer>
        )}
      </UserContext.Provider>
    </Root>
  );
};
const styles = StyleSheet.create({
  avtBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  info: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});
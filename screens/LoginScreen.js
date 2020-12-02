import React from 'react';
import {
  Container,
  Content,
  View,
  Text,
  Button,
  Item,
  Input,
  Toast,
  CheckBox,
  ListItem,
  Form,
  Left,
  Body,
} from 'native-base';
import { Image, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import { UserModel } from '../models/UserModel';

import Logo from '../assets/img/Logo_SCTV.png';
import AsyncStorage from '@react-native-community/async-storage';

import { ApiMethods, callAPI } from '../utils/ApiUtils';
// import {LoginModel} from '../models/LoginModel';
// import {UserModel} from '../models/UserModel';
// import { UserContext } from "../context/UserContext";

// type State = {
//     username:string,
//     password:string,
//     checked:boolean
// }

// type Props = {
//     navigation:any
// }

const LoginScreen = () => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const { user, setUser } = React.useContext(UserContext);
  const toggleCheckbox = () => {
    setChecked((checked) => {
      return !checked;
    });
  };

  let txtUsername = null;
  let txtPassword = null;
  const login = () => {
    if (
      userName == null ||
      password == null ||
      userName.trim == '' ||
      password.trim == ''
    ) {
      alert('Vui lòng nhập tên và mật khẩu');
      return;
    }
    const loginPayload: LoginModel = {
      username: userName,
      password: password,
    };

    if (checked) {
      storeCredentials(
        JSON.stringify({
          userName: userName,
          password: password,
          checked: checked,
        })
      );
    }
    callAPI(ApiMethods.LOGIN, '', loginPayload, processLoginResult, null);
  };

  const processLoginResult = (result) => {
    setUser(result[0]);
  };

  const storeCredentials = async (data: string) => {
    try {
      await AsyncStorage.setItem('UserCredentials', data);
    } catch (error) {
      // Error saving data
    }
    const test = data;
  };

  const getCredentials = async (callback: (data: string) => void) => {
    var value;
    try {
      value = await AsyncStorage.getItem('UserCredentials');
    } catch (error) {
      // Error saving data
      value = null;
    }
    callback(value);
  };

  const getData = (json: string) => {
    if (json != null) {
      const loginData = JSON.parse(json);
      setUserName(loginData.userName);
      setPassword(loginData.password);
      setChecked(loginData.checked);
    }
  };

  React.useEffect(() => {
    getCredentials(getData);
  }, []); // Only re-run the effect if count changes

  return (
    <Container>
      <Content style={styles.padding15}>
        <View style={{ alignSelf: 'center', margin: 20 }}>
          <Image source={Logo} style={styles.logo} />
        </View>
        <Form>
          <Item>
            <Input
              ref={(el) => (txtUsername = el)}
              // selectionColor='white'
              onChangeText={(text) => setUserName(text)}
              returnKeyType="next"
              value={userName}
              placeholder="Tên đăng nhập"
              onSubmitEditing={() => txtPassword._root.focus()}
            />
          </Item>
          <Item>
            <Input
              secureTextEntry={true}
              ref={(el) => (txtPassword = el)}
              // selectionColor='white'
              onChangeText={(text) => setPassword(text)}
              returnKeyType="go"
              value={password}
              placeholder="Mật khẩu"
              onSubmitEditing={login}
            />
          </Item>
          <ListItem last onPress={toggleCheckbox}>
            <CheckBox
              checked={checked}
              onPress={toggleCheckbox}
            />
            <Body>
              <Text style={{ fontStyle: 'italic' }}>Ghi nhớ mật khẩu?</Text>
            </Body>
          </ListItem>
        </Form>
        <Button full rounded style={{ margin: 30 }} onPress={login}>
          <Text>Đăng Nhập</Text>
        </Button>
      </Content>
    </Container>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
    height: 200,
    width: 200,
  },
  // background: {
  //   backgroundColor: 'rgba(79, 129, 189, 1)'
  // },
  padding15: { padding: 15 },
});

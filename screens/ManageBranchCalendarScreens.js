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
    Body
} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import {
    ScrollView,
    StyleSheet,
    Dimensions
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

  const ManageBranchCalendarScreens = () => {
    const [state, setState] = useState({
        data: [
            {
                Id: '123',
                Text: 'Khách hàng hẹn lại',
            },
            {
                Id: '1234',
                Text: 'Khách hàng hẹn lại 2',
            }
        ],
        maLyDo: 'Khách hàng hẹn lại'
    });
    const onValueChange = (value: string) => {
        setState({
            ...state,
            maLyDo: value
        });
    }
    return (
        <Container >
            <Content padder>
                <Grid>
                    <Row style={styles.row}>
                        <Col style={styles.leftRow}><Text style={styles.title}>Ngày hẹn</Text></Col>
                        <Col style={{paddingLeft: 10}}><Text >25/02/2019 14:26</Text></Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col style={[styles.leftRow, { paddingTop: 10 }]}>
                            <Text style={styles.title}>Lý do hẹn</Text>
                        </Col>
                        <Col>
                            <Item Picker>
                                <Picker
                                    mode='dropdown'
                                    iosIcon={<Icon name='ios-arrow-down-outline' />}
                                    style={{ width: undefined }}
                                    selectedValue={state.maLyDo}
                                    onValueChange={onValueChange}
                                >
                                    {state.data.map((item, index) => {
                                        return <Picker.Item label={item.Text} value={item.Id} key={'Reason ' + index} />
                                    })}
                                </Picker>
                            </Item>
                        </Col>
                    </Row>
                    <Row style={styles.row}><Col><Text style={styles.title}>Ghi chú</Text></Col></Row>
                    <Row style={styles.row}><Col><Textarea bordered /></Col></Row>
                    <Row style={styles.row}><Col><Button full rounded><Text>Lưu</Text></Button></Col></Row>
                </Grid>
            </Content>
        </Container>
    );
}
export default ManageBranchCalendarScreens;
const styles = StyleSheet.create({
    leftRow: {
        width: deviceWidth * 0.3,
    },
    row: {
        padding: 10
    },
    title: {
        fontWeight: 'bold'
    }
});
//React import here
import * as React from 'react';
//External imports here
import { 
  Container, 
  Content, 
  Card,
  CardItem,
  Left,
  Right,
  Text, 
  View, 
  Button, 
  Body} from 'native-base';
import { ScrollView } from 'react-native';
import { GroupThietBi, ThietBiRow } from '../models/GroupThietBi';

type Props = {
    group:GroupThietBi,
    showModal:()=>void,
    removeGroup:()=>void,
    removeItem:(index:number)=>()=>void
}
const CardGroupThietBi = (props:Props) => {
  return (
    <Card>
      <CardItem header>
        <Left>
          <Text style={{fontWeight:"bold", color:"#27a8ec"}}>{props.group.MaThueBao == "" ? props.group.SO_HOPDONG : props.group.MaThueBao}</Text>
          <Button transparent />
        </Left>                
        <Right>
          <View style={{flexDirection:"row"}}>
            <Button info onPress={props.showModal} style={{marginRight:10}}>
              <Text>{"+"}</Text>
            </Button>
            <Button danger disabled={props.group.MaThueBao != ""} onPress={props.removeGroup}>
              <Text>-</Text>
            </Button>
          </View>                    
        </Right>
      </CardItem>
      {
        props.group.ListThietBi.map((item, index) => (
          <CardItemThietBi item={item} key={index} removeItem={props.removeItem(index)}/>
        ))
      }
    </Card>
  );
};
type ThietBiProps = {
    item:ThietBiRow,
    removeItem:()=>void
}
const CardItemThietBi = (props:ThietBiProps) => {
    return(
        <CardItem>
            <Body>
                <Text>{props.item.TenThietBi + " "}</Text>
                <Text>
                    <Text>{"    "+props.item.SO_LUONG + " " + props.item.Unit + "/"}</Text>
                    <Text>{props.item.TINHTRANG_VATTU == "C" ? "Cũ" + "/" : "Mới" + "/"}</Text>
                    <Text>{props.item.LOAI_THANH_TOAN == "CoPhi" ? "Có Phí" : "Miễn Phí"}</Text>
                </Text>                
            </Body>
            <Right>
                <Button danger onPress={props.removeItem}>
                    <Text>-</Text>
                </Button>
            </Right>
            
        </CardItem>
    )
}
export default CardGroupThietBi;

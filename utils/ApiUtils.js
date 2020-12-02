//@flow
import { Toast } from "native-base";
import CommonModel from "../models/CommonModel";
import {RequestModel, ResponseModel} from '../models/ApiTypes';

// const baseUrl = "https://bfcd2b83-19c9-45ba-abbc-ad935a72c029.mock.pstmn.io/api/Test/Process";
const baseUrl = "http://cskh.sctv.vn:8037/api/SCTV/Process"; // Con Test
//const baseUrl = "http://172.18.55.72:25457/api/Test/Process";

// const baseUrl = "https://cskh.sctv.vn:8026/api/SCTV/Process"; //con that

export const ApiMethods = {
    LOGIN : "LOGIN",
    GET_DASHBOARD_DATA : "GET_DASHBOARD_DATA",
    GET_LIST_SCHEDULE : "GET_LIST_SCHEDULE",
    GET_DETAILED_SCHEDULE: "GET_DETAILED_SCHEDULE",
    GET_SCHEDULE_HISTORY: "GET_SCHEDULE_HISTORY",
    FINISH_SCHEDULE : "FINISH_SCHEDULE",
    POSTPONE_SCHEDULE : "POSTPONE_SCHEDULE",
    CANCEL_SCHEDULE : "CANCEL_SCHEDULE",
    SEARCH_SCHEDULE : "SEARCH_SCHEDULE",
    GET_LIST_REASONS : "GET_LIST_REASONS",
    GET_LIST_POSTPONE_REASONS : "GET_LIST_POSTPONE_REASONS",
    GET_LIST_CANCEL_REASONS : "GET_LIST_CANCEL_REASONS",
    CHECK_IN: "CHECK_IN",
    CUSTOMER_SEARCH: "CUSTOMER_SEARCH",
    CUSTOMER_UPDATE_LOCATION: "CUSTOMER_UPDATE_LOCATION",
    CUSTOMER_UPDATE:"CUSTOMER_UPDATE",
    CUSTOMER_GET_LOCATION:"CUSTOMER_GET_LOCATION",
    GET_LIST_MATERIAL:"GET_LIST_MATERIAL",
    GET_DANH_MUC_XUAT_KHO:"GET_DANH_MUC_XUAT_KHO",
    NHAPKHO:'NHAPKHO',
    XUATKHO:'XUATKHO',
    TIMXUATKHO:'TIMXUATKHO',
    HUYXUATKHO:'HUYXUATKHO',
    TIMTHIETBI:'TIMTHIETBI',
    GET_LIST_MY_SCHEDULES:'GET_LIST_MY_SCHEDULES',
    GET_DANH_MUC_ALL:'GET_DANH_MUC_ALL',
    SAP_LICH:'SAP_LICH',
    GET_LIST_PGD_SCHEDULES:'GET_LIST_PGD_SCHEDULES',
    GET_THONGTIN_KH_ADDON:'GET_THONGTIN_KH_ADDON'
    
};

const ApiUtils = {  
    checkHttpStatus: function(response) {
      if (response.ok) {
        return response;
      } else {
        let error = new Error(response.statusText);
        throw error;
      }
    },
    checkResponse: function(input) {
        const response:ResponseModel = input;
        if (response.Result === 1) {
          return response.Data;
        } else {
          let error = new Error(response.Description);
          throw error;
        }
      }
  };

export async function callAPI (method:string, token:string, payload:any, 
    callback:(json:Array<any>)=>void, error?:(error:Error)=>void){
    try{
        const request:RequestModel = {
            Method: method,
            Token: token,
            Payload: payload
        }
        var response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                // 'x-api-key': '2b4194de3f8d4e04af527ad8db361759'
            },
            body: JSON.stringify(request),
        });
        response = ApiUtils.checkHttpStatus(response); 
        const json = await response.json();
        const data = ApiUtils.checkResponse(json);
        callback(data);
        // Toast.show({
        //     text: JSON.stringify(json),
        //     duration: 10000,
        //     position: "top",
        //     textStyle: { textAlign: "center" },
        // });
    }
    catch(e){
        if (error === undefined || error === null){
          alert(e.message);
        }
        else
            error(e);
    }
}
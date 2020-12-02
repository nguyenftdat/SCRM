//@flow
export type FinishSchedulePayload = {
    // ma_yeucau: string,
    // nd_id: number,
    // noi_dung: string,
    // ma_nguyennhan: string,
    // latitude:number,
    // longitude:number
    yc_id:number,
    ma_ketqua_xuly:string,
	ma_yeucau: string,
	nhom:string,
	nd_id: number,
	noi_dung: string,
	ma_nguyennhan: string,
	latitude:number,
    longitude:number,
    ThietBiSuDung:Array<GroupThietBi>
}
//@flow
export type UserModel = {
    ND_ID: number,
    ND_CAP_TREN: number,
    ND_TEN_NGUOI_DUNG: string,
    ND_TEN_DANG_NHAP: string,
    ND_MAT_KHAU: string,
    ND_MO_TA: string,
    ND_HO_NGUOI_DUNG: string,
    PB_ID: number,
    DMVT_ID: number,
    CN_ID: number,
    PGD_ID: number,
    TT_ID: string,
    PLND: string,
    DIEN_THOAI: string,
    Email: string,
    Token: string,
    QuyenThucThi: Array<string>,
    QuyenTruyCap: Array<CommonModel>
}
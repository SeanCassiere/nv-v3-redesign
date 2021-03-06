export interface AgreementInList {
	AgreementId: number;
	CreditCardNo: string;
	ReserveId: number | null;
	VehicleId: number;
	MakeId: number;
	VehicleNo: string;
	VehicleMakeName: string;
	ModelId: number;
	ModelName: string;
	Year: number;
	Trim: string | null;
	LicenseNo: string;
	CheckoutDate: string;
	CheckinDate: string;
	ReturnDate: string;
	CreatedDate: string;
	CreatedByName: string;
	CustomerId: number;
	FirstName: string;
	LastName: string;
	PONo: string | null;
	RONo: string | null;
	HPhone: string | null;
	CPhone: string | null;
	BPhone: string | null;
	AgreementStatusId: number;
	AgreementNumber: string;
	TotalAmount: number;
	Note: string | null;
	Color: string;
	AgreementStatusName: string;
	CheckoutLocationId: number;
	CheckinLocationId: number;
	CheckoutLocationName: string;
	CheckinLocationName: string;
	VehicleTypeId: number;
	VehicleType: string;
}

const totalAvailableWidth = window.innerWidth - 327;
const widthWithOutSN = totalAvailableWidth - 275;
console.log(totalAvailableWidth); // 1209

const DEVICE_COLUMNS = [
  { Header: "Name", accessor: "name", width: widthWithOutSN / 4 },
  { Header: "Brand", accessor: "brand", width: widthWithOutSN / 4 },
  { Header: "Serial Number", accessor: "serialNumber", width: 275, minWidth: 275 },
  { Header: "MAC Address", accessor: "macAddress", width: widthWithOutSN / 4 },
  { Header: "Status", accessor: "status", width: widthWithOutSN / 4 },
];

export default DEVICE_COLUMNS;

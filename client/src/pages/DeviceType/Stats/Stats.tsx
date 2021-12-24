/* eslint-disable jsx-a11y/no-redundant-roles */
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { APIError } from "../../../types/apiResponses";
import { Brand, Totals } from "../../../types/brand";
import StatsTable from "./StatsTable";

export default function Stats() {
  const {
    params: { deviceType },
  } = useRouteMatch<{ deviceType: string }>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totals, setTotals] = useState<Totals>();
  useEffect(() => {
    getDevicesByModel();

    async function getDevicesByModel() {
      try {
        const res = await axios.get(`/api/v1/${deviceType}/test/group`);
        setBrands(res.data.data.brands);
        setTotals(res.data.data.totals);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, [deviceType]);

  return (
    <>
      <div className="page-header">
        <h1
          style={{ textTransform: "capitalize", marginBottom: "10px" }}
        >{`${deviceType} Stats`}</h1>
      </div>
      {totals && <StatsTable brands={brands} totals={totals} />}
    </>
  );
}

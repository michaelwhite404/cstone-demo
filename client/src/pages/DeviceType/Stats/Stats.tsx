/* eslint-disable jsx-a11y/no-redundant-roles */
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { APIError } from "../../../types/apiResponses";
import "./StatsTable.sass";

export default function Stats() {
  const {
    params: { deviceType },
  } = useRouteMatch<{ deviceType: string }>();
  const [brands, setBrands] = useState<Brand[]>([]);
  useEffect(() => {
    getDevicesByModel();

    async function getDevicesByModel() {
      try {
        const res = await axios.get(`/api/v1/${deviceType}/test/group`);
        console.log(res.data.data.brands);
        setBrands(res.data.data.brands);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, [deviceType]);

  const getModelStatusCount = (array: any[], status: string) => {
    const statusIndex = array.findIndex((x) => x.status === status);
    const nOfStatus = statusIndex === -1 ? 0 : array[statusIndex].count;
    return nOfStatus;
  };

  const getBrandStatusCount = (array: any[], status: string) => {
    let nOfStatus = 0;
    for (let i = 0; i < array.length; i++) {
      nOfStatus += getModelStatusCount(array[i].statuses, status);
    }
    return nOfStatus;
  };

  const rows = brands.map((brand) => (
    <>
      <tr className="brand-row">
        <td>
          <div className="brand-title">
            <img
              src={`/device-logos/${brand.brand}-Logo.png`}
              alt={brand.brand + " Logo"}
              style={{ width: 30, marginRight: 15 }}
            />
            {brand.brand}
          </div>
        </td>
        <td>{brand.count}</td>
        <td>{getBrandStatusCount(brand.models, "Available")}</td>
        <td>{getBrandStatusCount(brand.models, "Checked Out")}</td>
        <td>{getBrandStatusCount(brand.models, "Broken")}</td>
        <td>{getBrandStatusCount(brand.models, "Not Available")}</td>
      </tr>
      {brand.models.map((model) => (
        <tr className="model-row">
          <td>{model.model}</td>
          <td>{model.count}</td>
          <td>{getModelStatusCount(model.statuses, "Available")}</td>
          <td>{getModelStatusCount(model.statuses, "Checked Out")}</td>
          <td>{getModelStatusCount(model.statuses, "Broken")}</td>
          <td>{getModelStatusCount(model.statuses, "Not Available")}</td>
        </tr>
      ))}
    </>
  ));

  return (
    <>
      <div className="page-header">
        <h1
          style={{ textTransform: "capitalize", marginBottom: "10px" }}
        >{`${deviceType} Stats`}</h1>
      </div>
      <table className="table-wrapper table-expanded device-stats-table">
        <colgroup>
          <col width="40%"></col>
        </colgroup>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Total</th>
            <th>Available</th>
            <th>Checked Out</th>
            <th>Broken</th>
            <th>Not Available</th>
          </tr>
        </thead>
        <tbody role="rowgroup">{rows}</tbody>
      </table>
    </>
  );
}

export interface Brand {
  models: Model[];
  count: number;
  brand: string;
}

export interface Model {
  model: string;
  count: number;
  statuses: StatusElement[];
}

export interface StatusElement {
  status: StatusEnum;
  count: number;
}

export enum StatusEnum {
  Available = "Available",
  Broken = "Broken",
  CheckedOut = "Checked Out",
  NotAvailable = "Not Available",
}

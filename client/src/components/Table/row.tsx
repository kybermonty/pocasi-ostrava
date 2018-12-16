import * as React from "react";

interface ITableRow {
  value: string;
  title: string;
  icon: string;
}

export const TableRow: React.SFC<ITableRow> = ({value, title, icon}) => (
  <tr>
    <td style={{ width: "40px" }}>
      <svg className="icon" viewBox="0 0 24 24">
        <path fill="#44739e" d={icon} />
      </svg>
    </td>
    <td style={{ width: "200px" }}>{title}</td>
    <td>{value || '-'}</td>
  </tr>
);

export default TableRow;

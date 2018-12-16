import * as React from "react";

interface ITableDoubleRow {
  value: string;
  title: string;
  icon: string;
}

export const TableDoubleRow: React.SFC<ITableDoubleRow> = ({value, title, icon}) => (
  <React.Fragment>
    <tr>
      <td>
        <svg className="icon" viewBox="0 0 24 24">
          <path fill="#44739e" d={icon} />
        </svg>
      </td>
      <td colSpan={2}>{title}</td>
    </tr>
    <tr>
      <td colSpan={3}>{value || '-'}</td>
    </tr>
  </React.Fragment>
);

export default TableDoubleRow;

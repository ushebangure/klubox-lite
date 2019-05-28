import React from "react";

export const Transaction = ({
  created,
  ref,
  collectionMethod,
  amtRecvd,
  xchangeRate,
  totalCharge,
  totalPaid,
  rcverName,
  rcverPhone,
  rcverId,
  senderName,
  senderPhone,
  status
}) => (
  <tr className="Transaction">
    <td>{created}</td>
    <td>{ref}</td>
    <td>{collectionMethod}</td>
    <td>{amtRecvd}</td>
    <td>{xchangeRate}</td>
    <td>{totalCharge}</td>
    <td>{totalPaid}</td>
    <td>{rcverName}</td>
    <td>{rcverPhone}</td>
    <td>{rcverId}</td>
    <td>{senderName}</td>
    <td>{senderPhone}</td>
    <td>{status}</td>
  </tr>
);

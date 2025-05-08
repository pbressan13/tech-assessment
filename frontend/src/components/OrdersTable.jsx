import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OrdersController from "../controllers/OrdersController";
import OrderDetailsModal from "./OrderDetailsModal";
import Notice from "./Notice";
import { useState } from "react";

const OrdersTable = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [notice, setNotice] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseNotice = () => {
    setNotice((prev) => ({ ...prev, open: false }));
  };

  const handleProcess = async (orderId) => {
    try {
      await OrdersController.processOrder(orderId);
    } catch {
      setNotice({
        open: true,
        message: "Failed to process order. Please try again.",
        severity: "error",
      });
    }
  };

  const handleComplete = async (orderId) => {
    try {
      await OrdersController.completeOrder(orderId);
    } catch {
      setNotice({
        open: true,
        message: "Failed to complete order. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await OrdersController.cancelOrder(orderId);
    } catch {
      setNotice({
        open: true,
        message: "Failed to cancel order. Please try again.",
        severity: "error",
      });
    }
  };

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customerEmail}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>{order.formattedTotal}</TableCell>
                <TableCell>{order.formattedCreatedAt}</TableCell>
                <TableCell>
                  {order.status === "pending" && (
                    <Tooltip title="Process Order">
                      <IconButton
                        onClick={() => handleProcess(order.id)}
                        size="small"
                        color="primary"
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {order.status === "processing" && (
                    <Tooltip title="Complete Order">
                      <IconButton
                        onClick={() => handleComplete(order.id)}
                        size="small"
                        color="success"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {(order.status === "pending" ||
                    order.status === "processing") && (
                    <Tooltip title="Cancel Order">
                      <IconButton
                        onClick={() => handleCancel(order.id)}
                        size="small"
                        color="error"
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="View Details">
                    <IconButton
                      onClick={() => handleViewDetails(order.id)}
                      size="small"
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <OrderDetailsModal
        open={!!selectedOrderId}
        onClose={handleCloseModal}
        orderId={selectedOrderId}
      />

      <Notice
        open={notice.open}
        message={notice.message}
        severity={notice.severity}
        onClose={handleCloseNotice}
      />
    </>
  );
};

export default OrdersTable;

// src/InvoiceAgGrid.tsx
import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Invoice } from "../types/InvoiceType";
import { App_Base_URL } from "../../../constant";
import "../styles/Invoice.css";
import { ColDef } from "ag-grid-community";
import { Tag } from "antd";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  DownloadIcon,
  ExternalLinkIcon,
  EmailIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  IconButton,
  Skeleton,
  Spinner,
  useDisclosure,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import "react-toastify/dist/ReactToastify.css";
import EmailPopup from "./EmailPopup";
import axios from "axios";
const InvoiceGrid = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEmailPopupOpen, setEmailPopupOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${App_Base_URL}/Invoice`);
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  console.log(invoices, "Invoices");
  const handleEdit = (invoice: Invoice) => {
    navigate(`/invoices/edit/${invoice.id}`);
  };

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedInvoice) return;

    try {
      const response = await fetch(
        `${App_Base_URL}/Invoice/${selectedInvoice.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setInvoices(invoices.filter((inv) => inv.id !== selectedInvoice.id));
      } else {
        toast({
          title: "Error",
          description: "Failed to delete invoice.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the invoice.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error deleting invoice:", error);
    } finally {
      onClose();
    }
  };

  const handlePreview = (invoice: Invoice) => {
    navigate(`/invoices/view/${invoice.id}`, { state: { invoice } });
  };

  const handleDownload = async (invoice: Invoice) => {
    setLoadingInvoice(true);

    try {
      const response = await axios.post(
        `${App_Base_URL}/invoice/generate-pdf/${invoice.id}`,
        null, // No request body needed for GET
        { responseType: "blob" } // Ensure response is a blob
      );

      // Check if the response contains data
      if (response.data) {
        // Create a URL for the PDF Blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "invoice.pdf"); //
        document.body.appendChild(link);
        link.click();
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("No data received");
        toast({
          title: "Error",
          description: "Failed to download invoice.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download invoice.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingInvoice(false);
    }
  };

  const handleShare = (invoice: Invoice) => {
    console.log("Share invoice", invoice);
  };

  const handleEmail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setEmailPopupOpen(true);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "Paid":
        return <Tag color="green">Paid</Tag>;
      case "Pending":
        return <Tag color="blue">Pending</Tag>;
      case "Overdue":
        return <Tag color="red">Overdue</Tag>;
      case "Partially Paid":
        return <Tag color="orange">Partially Paid</Tag>;
      case "Canceled":
        return <Tag color="gray">Canceled</Tag>;
      case "Draft":
        return <Tag color="purple">Draft</Tag>;
      case "Sent":
        return <Tag color="cyan">Sent</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };
  const columnDefs = [
    {
      headerName: "Customer Name",
      field: "customer.name" as keyof Invoice,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Invoice Number",
      field: "invoiceNumber" as keyof Invoice,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Invoice Date",
      field: "invoiceDue" as keyof Invoice,
      sortable: true,
      filter: "agDateColumnFilter",
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: "Total Due",
      field: "totalAmount" as keyof Invoice,
      minWidth: 160,
      sortable: true,
      filter: "agNumberColumnFilter",
      valueFormatter: (params: any) => {
        const currencySymbol = params.data.location?.currency?.symbol || "";
        const totalAmount = params.value ? params.value.toFixed(2) : "0.00";
        return `${currencySymbol} ${totalAmount}`;
      },
      cellStyle: (params: any) => {
        return {
          fontWeight: 'bold',
          color: '#3f51b5',
        };
      },
      
    },
    {
      headerName: "Status",
      field: "invoiceStatus" as keyof Invoice,
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => getStatusTag(params.value),
    },
    {
      headerName: "Created Date",
      field: "createdAt" as keyof Invoice,
      sortable: true,
      filter: "agDateColumnFilter",
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "8px" }}
          >
            <IconButton
              aria-label="Edit invoice"
              icon={<EditIcon color="blue.500" />}
              size="sm"
              style={{ background: "none", fontSize: "16px" }}
              onClick={() => handleEdit(params.data)}
            />
            <IconButton
              aria-label="Delete invoice"
              icon={<DeleteIcon color="red.500" />}
              size="sm"
              style={{ background: "none", fontSize: "16px" }}
              onClick={() => handleDelete(params.data)}
            />
            <IconButton
              aria-label="Preview invoice"
              icon={<ViewIcon color="purple.500" />}
              size="sm"
              style={{ background: "none", fontSize: "20px" }}
              onClick={() => handlePreview(params.data)}
            />
            <IconButton
              aria-label="Email invoice"
              icon={<EmailIcon color="teal.500" />}
              size="sm"
              style={{ background: "none", fontSize: "16px" }}
              onClick={() => handleEmail(params.data)}
            />
            <IconButton
              aria-label="Download invoice"
              icon={<DownloadIcon color="green.500" />}
              size="sm"
              style={{ background: "none", fontSize: "16px" }}
              onClick={() => handleDownload(params.data)}
            />
            <IconButton
              aria-label="Share invoice"
              icon={<ExternalLinkIcon color="yellow.600" />}
              size="sm"
              style={{ background: "none", fontSize: "16px" }}
              onClick={() => handleShare(params.data)}
            />
          </div>
        );
      },
    },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
    };
  }, []);

  const renderSkeletonRows = () => {
    const rows = Array.from({ length: 10 }, (_, index) => (
      <Flex key={index} mb="2">
        <Skeleton height="30px" width="100px" mr="2" />
        <Skeleton height="30px" width="150px" mr="2" />
        <Skeleton height="30px" width="150px" mr="2" />
        <Skeleton height="30px" width="150px" flex="1" />
      </Flex>
    ));
    return rows;
  };

  return (
    <Layout>
      <div className="grid-container">
        {loading ? (
          <Box width="80%">
            <Skeleton height="40px" mb="4" width="100%" />
            {renderSkeletonRows()}
          </Box>
        ) : (
          <>
            {loadingInvoice && (
              <Box
                position="fixed" // Use fixed positioning to cover the entire viewport
                top="0"
                left="0"
                width="100%"
                height="100%"
                bg="rgba(255, 255, 255, 0)" // Light semi-transparent white background
                display="flex"
                alignItems="center"
                justifyContent="center"
                backdropFilter="blur(1px)" // Apply light blur effect
                zIndex="1000"
              >
                <Flex gap="10px" alignItems="center">
                  <Spinner size="lg" />
                  <Text mt="4" fontSize="lg" fontWeight="semibold">
                    Downloading invoice, please wait...
                  </Text>
                </Flex>
              </Box>
            )}
            <Flex justifyContent="flex-end" mb="4" width="100%">
              <Button
                // colorScheme="blue"
                color="blue.600"
                onClick={() => {
                  navigate("/invoices/create");
                }}
                fontSize="13px"
              >
                Create Invoice
              </Button>
            </Flex>
            <div
              className="ag-theme-alpine"
              style={{ height: 400, width: "100%" }}
            >
              <AgGridReact
                rowData={invoices}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                domLayout="autoHeight"
                defaultColDef={defaultColDef}
              />
            </div>
          </>
        )}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isCentered={true}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Invoice
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this invoice? This action cannot
                be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <EmailPopup
          isOpen={isEmailPopupOpen}
          onClose={() => setEmailPopupOpen(false)}
          invoiceId={selectedInvoice?.id.toString() || ""}
          customerId={selectedInvoice?.customerId?.toString() || ""}
        />
      </div>
    </Layout>
  );
};

export default InvoiceGrid;
